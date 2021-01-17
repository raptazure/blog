---
title: Rust Idioms
date: 2021-01-07
tags:
  - rust
---

## 1. Use borrowed types for arguments

Using a target of a deref coercion can increase the flexibility of your code when you are deciding which argument type to use for a function argument. In this way, the function will accept more input types. Always prefer using the borrowed type over borrowing the owned type. For example, use `&str` over `&String`, `&[T]` over `&Vec<T>`, `&T` over `&Box<T>`. 

## 2. Concatenating strings with `format!`

It is usually the most succinct and readable way to combine strings, although a series of push operations on a mutable string is usually the most efficient.

```rust
fn say_hello(name : &str) -> String {
  fomat!("Hello {}!", name)
}
```

## 3. Constructors

Use a static `new` method to create an object.

```rust
pub struct Vec<T> {
    buf: RawVec<T>,
    len: usize,
}

impl<T> Vec<T> {
    // Constructs a new, empty `Vec<T>`.
    // Note this is a static method - no self.
    // This constructor doesn't take any arguments, but some 
    // might in order to properly initialise an object
    pub fn new() -> Vec<T> {
        // Create a new Vec with fields properly initialised.
        Vec {
            // Note that here we are calling RawVec's constructor.
            buf: RawVec::new(),
            len: 0,
        }
    }
}
```

## 4. The Default Trait

Many types in Rust have a constructor. However, this is specific to the type; Rust cannot abstract over everything that has a new() method. To allow this, the Default trait was conceived, which can be used with containers and other generic types.

```rust
#[derive(Default, Debug)]
struct MyConfiguration {
  // Option defaults to None
  output: Option<PathBuf>,
  // Vecs default to empty vector
  search_path: Vec<PathBuf>,
  // Duration defaults to zero time
  timeout: Duration,
  // bool defaults to false
  check: bool,
}

impl MyConfiguration {
    // add setters here
}

fn main() {
    // construct a new instance with default values
    let mut conf = MyConfiguration::default();
    // do something with conf here
    conf.check = true;
    println!("conf = {:#?}", conf);
}
```

## 5. Collections are smart pointers

Use the Deref trait to treat collections like smart pointers, offering owning and borrowed views of data. Ownership and borrowing are key aspects of the Rust language. Data structures must account for these semantics properly in order to give a good user experience. When implementing a data structure which owns its data, offering a borrowed view of that data allows for more flexible APIs.

```rust
use std::ops::Deref;

// A Vec<T> is an owning collection of Ts
struct Vec<T> {
  data: T,
  // ..
}

impl<T> Deref for Vec<T> {
  // A slice (&[T]) is a borrowed collection of Ts
  type Target = [T];

  // Implementing Deref for Vec allows implicit dereferencing from 
  // &Vec<T> to &[T] and includes the relationship in auto-derefencing 
  // searches.
  fn deref(&self) -> &[T] {
    // ..
  }
}
```

## 6. Finalisation in destructors

In Rust, destructors are run when an object goes out of scope. This happens whether we reach the end of block, there is an early return, or the program panics. When panicking, Rust unwinds the stack running destructors for each object in each stack frame. So, destructors get called even if the panic happens in a function being called.

```rust
fn bar() -> Result<(), ()> {
    // These don't need to be defined inside the function.
    struct Foo;

    // Implement a destructor for Foo.
    impl Drop for Foo {
        fn drop(&mut self) {
            println!("exit");
        }
    }

    // The dtor of _exit will run however 
    // the function `bar` is exited.
    let _exit = Foo;
    // Implicit return with `?` operator.
    baz()?;
    // Normal return.
    Ok(())
}
```

## 7. `mem::replace` to keep owned values in changed enums

Say we have a &mut MyEnum which has (at least) two variants, A { name: String, x: u8 } and B { name: String }. Now we want to change MyEnum::A to a B if x is zero, while keeping MyEnum::B intact. We can do this without cloning the name. If we are using an Option and want to replace its value with a None, Option’s take() method provides a shorter and more idiomatic alternative. This gets rid of the [Clone to satisfy the borrow checker] antipattern in a specific case and there is no allocation.

```rust
use std::mem;

enum MyEnum {
    A { name: String, x: u8 },
    B { name: String }
}

fn a_to_b(e: &mut MyEnum) {

    // we mutably borrow `e` here. This precludes us from changing it directly
    // as in `*e = ...`, because the borrow checker won't allow it. Therefore
    // the assignment to `e` must be outside the `if let` clause.
    *e = if let MyEnum::A { ref mut name, x: 0 } = *e {

        // this takes out our `name` and put in an empty String instead
        // (note that empty strings don't allocate).
        // Then, construct the new enum variant (which will
        // be assigned to `*e`, because it is the result of the `if let` expression).
        MyEnum::B { name: mem::replace(name, String::new()) }

    // In all other cases, we return immediately, thus skipping the assignment
    } else { return }
}
```

## 8. On-Stack Dynamic Dispatch

We can dynamically dispatch over multiple values, however, to do so, we need to declare multiple variables to bind differently-typed objects. To extend the lifetime as necessary, we can use deferred conditional initialization. 

Rust monomorphises code by default. This means a copy of the code will be generated for each type it is used with and optimized independently. While this allows for very fast code on the hot path, it also bloats the code in places where performance is not of the essence, thus costing compile time and cache usage.

Luckily, Rust allows us to use dynamic dispatch, but we have to explicitly ask for it.

```rust
use std::io;
use std::fs;

// These must live longer than `readable`, and thus are declared first:
let (mut stdin_read, mut file_read);

// We need to ascribe the type to get dynamic dispatch.
let readable: &mut dyn io::Read = if arg == "-" {
    stdin_read = io::stdin();
    &mut stdin_read
} else {
    file_read = fs::File::open(arg)?;
    &mut file_read
};

// Read from `readable` here.
```

## 9. FFI Idioms

#### Error Handling in FFI

- Flat Enums should be converted to integers and returned as codes.

```rust
enum DatabaseError {
    IsReadOnly = 1, // user attempted a write operation
    IOError = 2, // user should read the C errno() for what it was
    FileCorrupted = 3, // user should run a repair tool to recover it
}

impl From<DatabaseError> for libc::c_int {
    fn from(e: DatabaseError) -> libc::c_int {
        (e as i8).into()
    }
}
```

- Structured Enums should be converted to an integer code with a string error message for detail.

```rust
pub mod errors {
    enum DatabaseError {
        IsReadOnly,
        IOError(std::io::Error),
        FileCorrupted(String), // message describing the issue
    }

    impl From<DatabaseError> for libc::c_int {
        fn from(e: DatabaseError) -> libc::c_int {
            match e {
                DatabaseError::IsReadOnly => 1,
                DatabaseError::IOError(_) => 2,
                DatabaseError::FileCorrupted(_) => 3,
            }
        }
    }
}

pub mod c_api {
    use super::errors::DatabaseError;

    #[no_mangle]
    pub extern "C" fn db_error_description(
        e: *const DatabaseError
        ) -> *mut libc::c_char {

        let error: &DatabaseError = unsafe {
            /* SAFETY: pointer lifetime is greater than the current stack frame */
            &*e
        };

        let error_str: String = match error {
            DatabaseError::IsReadOnly => {
                format!("cannot write to read-only database");
            }
            DatabaseError::IOError(e) => {
                format!("I/O Error: {}", e);
            }
            DatabaseError::FileCorrupted(s) => {
                format!("File corrupted, run repair: {}", &s);
            }
        };

        let c_error = unsafe {
            // SAFETY: copying error_str to an allocated buffer with a NUL
            // character at the end
            let mut malloc: *mut u8 = libc::malloc(error_str.len() + 1) as *mut _;

            if malloc.is_null() {
                return std::ptr::null_mut();
            }

            let src = error_str.as_bytes().as_ptr();

            std::ptr::copy_nonoverlapping(src, malloc, error_str.len());

            std::ptr::write(malloc.add(error_str.len()), 0);

            malloc as *mut libc::c_char
        };

        c_error
    }
}
```

- Custom Error Types should become transparent, with a C representation.

```rust
struct ParseError {
    expected: char,
    line: u32,
    ch: u16
}

impl ParseError { /* ... */ }

/* Create a second version which is exposed as a C structure */
#[repr(C)]
pub struct parse_error {
    pub expected: libc::c_char,
    pub line: u32,
    pub ch: u16
}

impl From<ParseError> for parse_error {
    fn from(e: ParseError) -> parse_error {
        let ParseError { expected, line, ch } = e;
        parse_error { expected, line, ch }
    }
}
```

#### Accepting Strings

When accepting strings via FFI through pointers, there are two principles that should be followed:

- Keep foreign strings borrowed, rather than copying them directly.
- Minimize `unsafe` code during the conversion.

The best practice is simple: use CStr in such a way as to minimize unsafe code, and create a borrowed slice. If an owned String is needed, call to_string() on the string slice.

```rust
pub mod unsafe_module {
    
    // other module content

    #[no_mangle]
    pub extern "C" fn mylib_log(msg: *const libc::c_char, level: libc::c_int) {
        let level: crate::LogLevel = match level { /* ... */ };

        let msg_str: &str = unsafe {
            // SAFETY: accessing raw pointers expected to live for the call,
            // and creating a shared reference that does not outlive the current
            // stack frame.
            match std::ffi::CStr::from_ptr(msg).to_str() {
                Ok(s) => s,
                Err(e) => {
                    crate::log_error("FFI string conversion failed");
                    return;
                }
            }
        };

        crate::log(msg_str, level);
    }
}
```

#### Passing Strings

When passing strings to FFI functions, there are four principles that should be followed:

- Make the lifetime of owned strings as long as possible.
- Minimize unsafe code during the conversion.
- If the C code can modify the string data, use Vec instead of CString.
- Unless the Foreign Function API requires it, the ownership of the string should not transfer to the callee.

```rust
pub mod unsafe_module {

    // other module content

    extern "C" {
        fn seterr(message: *const libc::c_char);
        fn geterr(buffer: *mut libc::c_char, size: libc::c_int) -> libc::c_int;
    }

    fn report_error_to_ffi<S: Into<String>>(
        err: S
    ) -> Result<(), std::ffi::NulError>{
        let c_err = std::ffi::CString::new(err.into())?;

        unsafe {
            // SAFETY: calling an FFI whose documentation says the pointer is
            // const, so no modificationshould occur
            seterr(c_err.as_ptr());
        }

        Ok(())
        // The lifetime of c_err continues until here
    }

    fn get_error_from_ffi() -> Result<String, std::ffi::IntoStringError> {
        let mut buffer = vec![0u8; 1024];
        unsafe {
            // SAFETY: calling an FFI whose documentation implies
            // that the input need only live as long as the call
            let written: usize = geterr(buffer.as_mut_ptr(), 1023).into();

            buffer.truncate(written + 1);
        }

        std::ffi::CString::new(buffer).unwrap().into_string()
    }
}
```

## 10. Iterating over an Option

Option can be viewed as a container that contains either zero or one elements. In particular, it implements the IntoIterator trait, and as such can be used with generic code that needs such a type.

- Since Option implements IntoIterator, it can be used as an argument to `.extend()`:

```rust
let turing = Some("Turing");
let mut logicians = vec!["Curry", "Kleene", "Markov"];

logicians.extend(turing);

// equivalent to
if let Some(turing_inner) = turing {
    logicians.push(turing_inner);
}
```

- If you need to tack an Option to the end of an existing iterator, you can pass it to `.chain()`:

```rust
let turing = Some("Turing");
let logicians = vec!["Curry", "Kleene", "Markov"];

for logician in logicians.iter().chain(turing.iter()) {
    println!("{} is a logician", logician);
}
```

- Also, since Option implements IntoIterator, it's possible to iterate over it using a for loop. This is equivalent to matching it with if let Some(..), and in most cases you should prefer the latter.

## 11. Pass variables to closure

By default, closures capture their environment by borrowing. Or you can use move-closure to move whole environment. However, often you want to move just some variables to closure, give it copy of some data, pass it by reference, or perform some other transformation. Use variable rebinding in separate scope for that.

```rust
use std::rc::Rc;

let num1 = Rc::new(1);
let num2 = Rc::new(2);
let num3 = Rc::new(3);
let closure = {
    // `num1` is moved
    let num2 = num2.clone(); // `num2` is cloned
    let num3 = num3.as_ref(); // `num3` is borrowed
    move || {
        *num1 + *num2 + *num3;
    }
};
```

Copied data are grouped together with closure definition, so their purpose is more clear and they will be dropped immediately even if they are not consumed by closure. 

Closure uses same variable names as surrounding code whether data are copied or moved.

## 12. Privacy for extensibility

Use a private field to ensure that a struct is extensible without breaking stability guarantees.

```rust
mod a {
    // Public struct.
    pub struct S {
        pub foo: i32;
        // Private field
        bar: i32,
    }
}

fn main(s: a::S) {
    // Because S::bar is private, it cannot be named here and 
    // we must use `..` in the pattern.
    let a::S { foo: _, ..} = s;
}
```

## 13. Easy doc initialization

If a struct takes significant effort to initialize, when writing docs, it can be quicker to wrap your example with a helper function which takes the struct as an argument.

```rust
struct Connection {
    name: String,
    stream: TcpStream,
}

impl Connection {
    /// Sends a request over the connection.
    ///
    /// # Example
    /// ```no_run
    /// # // Boilerplate are required to get an example working.
    /// # let stream = TcpStream::connect("127.0.0.1:34254");
    /// # let connection = Connection { name: "foo".to_owned(), stream };
    /// # let request = Request::new("RequestId", RequestType::Get, "payload");
    /// let response = connection.send_request(request);
    /// assert!(response.is_ok());
    /// ```
    fn send_request(&self, request: Request) -> Result<Status, SendErr> {
        // ...
    }

    /// Oh no, all that boilerplate needs to be repeated here!
    fn check_status(&self) -> Status {
        // ...
    }
}
```

Instead of typing all of this boiler plate to create an Connection and Request it is easier to just create a wrapping helper function which takes them as arguments:

```rust
struct Connection {
    name: String,
    stream: TcpStream,
}

impl Connection {
    /// Sends a request over the connection.
    ///
    /// # Example
    /// ```
    /// # fn call_send(connection: Connection, request: Request) {
    /// let response = connection.send_request(request);
    /// assert!(response.is_ok());
    /// # }
    /// ```
    fn send_request(&self, request: Request) {
        // ...
    }
}
```

## 14. Temporary mutability

Often it is necessary to prepare and process some data, but after that data are only inspected and never modified. The intention can be made explicit by redefining the mutable variable as immutable. It can be done either by processing data within nested block or by redefining variable.

```rust
// Using nested block
let data = {
    let mut data = get_vec();
    data.sort();
    data
};

// Using variable rebinding
let mut data = get_vec();
data.sort();
let data = data

// `data` is immutable
```

## 15.Builder Pattern

Construct an object with calls to a builder helper.

```rust
#[derive(Debug, PartialEq)]
pub struct Foo {
    // Lots of complicated fields.
    bar: String,
}

pub struct FooBuilder {
    // Probably lots of optional fields.
    bar: String,
}

impl FooBuilder {
    pub fn new(/* ... */) -> FooBuilder {
        // Set the minimally required fields of Foo.
        FooBuilder {
            bar: String::from("X"),
        }
    }

    pub fn name(mut self, bar: String) -> FooBuilder {
        // Set the name on the builder itself, and return the builder by value.
        self.bar = bar;
        self
    }

    // If we can get away with not consuming the Builder here, that is an
    // advantage. It means we can use the FooBuilder as a template for constructing many Foos.
    pub fn build(self) -> Foo {
        // Create a Foo from the FooBuilder, applying all settings in FooBuilder to Foo.
        Foo { bar: self.bar }
    }
}

#[test]
fn builder_test() {
    let foo = Foo {
        bar: String::from("Y"),
    };
    let foo_from_builder: Foo = FooBuilder::new().name(String::from("Y")).build();
    assert_eq!(foo, foo_from_builder);
}
```

Useful when you would otherwise require many different constructors or where construction has side effects.

This pattern is seen more frequently in Rust (and for simpler objects) than in many other languages because Rust lacks overloading. Since you can only have a single method with a given name, having multiple constructors is less nice in Rust than in C++, Java, or others.

## 16. Compose Structs

Sometimes a large struct will cause issues with the borrow checker - although fields can be borrowed independently, sometimes the whole struct ends up being used at once, preventing other uses. A solution might be to decompose the struct into several smaller structs. Then compose these together into the original struct. Then each struct can be borrowed separately and have more flexible behaviour.

```rust
struct A {
    f1: u32,
    f2: u32,
    f3: u32,
}

fn foo(a: &mut A) -> &u32 { &a.f2 }
fn bar(a: &mut A) -> u32 { a.f1 + a.f3 }

fn baz(a: &mut A) {
    // The later usage of x causes a to be borrowed for the rest of the function.
    let x = foo(a);
    // Borrow checker error:
    // let y = bar(a); // ~ ERROR: cannot borrow `*a` as mutable more than once at a time
    println!("{}", x);
}
```

We can apply this design pattern and refactor A into two smaller structs, thus solving the borrow checking issue:

```rust
// A is now composed of two structs - B and C.
struct A {
    b: B,
    c: C,
}
struct B {
    f2: u32,
}
struct C {
    f1: u32,
    f3: u32,
}

// These functions take a B or C, rather than A.
fn foo(b: &mut B) -> &u32 { &b.f2 }
fn bar(c: &mut C) -> u32 { c.f1 + c.f3 }

fn baz(a: &mut A) {
    let x = foo(&mut a.b);
    // Now it's OK!
    let y = bar(&mut a.c);
    println!("{}", x);
}
```

## 17. Fold Pattern

The terms 'fold' and 'folder' are used in the Rust compiler, although it appears to me to be more like a map than a fold in the usual sense. 

```rust
// The data we will fold, a simple AST.
mod ast {
    pub enum Stmt {
        Expr(Box<Expr>),
        Let(Box<Name>, Box<Expr>),
    }

    pub struct Name {
        value: String,
    }

    pub enum Expr {
        IntLit(i64),
        Add(Box<Expr>, Box<Expr>),
        Sub(Box<Expr>, Box<Expr>),
    }
}

// The abstract folder
mod fold {
    use ast::*;

    pub trait Folder {
        // A leaf node just returns the node itself. In some cases, we can do this
        // to inner nodes too.
        fn fold_name(&mut self, n: Box<Name>) -> Box<Name> { n }
        // Create a new inner node by folding its children.
        fn fold_stmt(&mut self, s: Box<Stmt>) -> Box<Stmt> {
            match *s {
                Stmt::Expr(e) => Box::new(Stmt::Expr(self.fold_expr(e))),
                Stmt::Let(n, e) => Box::new(Stmt::Let(self.fold_name(n), self.fold_expr(e))),
            }
        }
        fn fold_expr(&mut self, e: Box<Expr>) -> Box<Expr> { ... }
    }
}

use fold::*;
use ast::*;

// An example concrete implementation - renames every name to 'foo'.
struct Renamer;
impl Folder for Renamer {
    fn fold_name(&mut self, n: Box<Name>) -> Box<Name> {
        Box::new(Name { value: "foo".to_owned() })
    }
    // Use the default methods for the other nodes.
}
```

It is common to want to map a data structure by performing some operation on each node in the structure. For simple operations on simple data structures, this can be done using Iterator::map. For more complex operations, perhaps where earlier nodes can affect the operation on later nodes, or where iteration over the data structure is non-trivial, using the fold pattern is more appropriate.

Like the visitor pattern, the fold pattern allows us to separate traversal of a data structure from the operations performed to each node.

Mapping data structures in this fashion is common in functional languages. In OO languages, it would be more common to mutate the data structure in place. The 'functional' approach is common in Rust, mostly due to the preference for immutability. Using fresh data structures, rather than mutating old ones, makes reasoning about the code easier in most circumstances.

## 18. Newtype

Use a tuple struct with a single field to make an opaque wrapper for a type. This creates a new type, rather than an alias to a type (type items).

```rust
// Some type, not necessarily in the same module or even crate.
struct Foo {
    //..
}

impl Foo {
    // These functions are not present on Bar.
    //..
}

// The newtype.
pub struct Bar(Foo);

impl Bar {
    // Constructor.
    pub fn new(
        //..
    ) -> Bar {

        //..

    }

    //..
}

fn main() {
    let b = Bar::new(...);

    // Foo and Bar are type incompatible, 
    // the following do not type check.
    // let f: Foo = b;
    // let b: Bar = Foo { ... };
}
```

## 19. RAII with guards

RAII stands for "Resource Acquisition is Initialisation" which is a terrible name. The essence of the pattern is that resource initialisation is done in the constructor of an object and finalisation in the destructor. This pattern is extended in Rust by using an RAII object as a guard of some resource and relying on the type system to ensure that access is always mediated by the guard object.

Mutex guards are the classic example of this pattern from the std library (this is a simplified version of the real implementation):

```rust
use std::ops::Deref;

struct Foo {}

struct Mutex<T> {
    // We keep a reference to our data: T here.
    //..
}

struct MutexGuard<'a, T: 'a> {
    data: &'a T,
    //..
}

// Locking the mutex is explicit.
impl<T> Mutex<T> {
    fn lock(&self) -> MutexGuard<T> {
        // Lock the underlying OS mutex.
        //..

        // MutexGuard keeps a reference to self
        MutexGuard {
            data: self,
            //..
        }
    }
}

// Destructor for unlocking the mutex.
impl<'a, T> Drop for MutexGuard<'a, T> {
    fn drop(&mut self) {
        // Unlock the underlying OS mutex.
        //..
    }
}

// Implementing Deref means we can treat MutexGuard like a pointer to T.
impl<'a, T> Deref for MutexGuard<'a, T> {
    type Target = T;

    fn deref(&self) -> &T {
        self.data
    }
}

fn baz(x: Mutex<Foo>) {
    let xx = x.lock();
    xx.foo(); // foo is a method on Foo.
    // The borrow checker ensures we can't store a reference to the 
    // underlying Foo which will outlive the guard xx.

    // x is unlocked when we exit this function 
    // and xx's destructor is executed.
}
```

Where a resource must be finalised after use, RAII can be used to do this finalisation. If it is an error to access that resource after finalisation, then this pattern can be used to prevent such errors.

## 20. Strategy Pattern

The Strategy design pattern is a technique that enables separation of concerns. It also allows to decouple software modules through Dependency Inversion.

The basic idea behind the Strategy pattern is that, given an algorithm solving a particular problem, we define only the skeleton of the algorithm at an abstract level and we separate the specific algorithm’s implementation into different parts.

In this way, a client using the algorithm may choose a specific implementation, while the general algorithm workflow remains the same. In other words, the abstract specification of the class does not depend on the specific implementation of the derived class, but specific implementation must adhere to the abstract specification. This is why we call it "Dependency Inversion".

In this example our invariants (or abstractions) are Context, Formatter, and Report, while Text and Json are our strategy structs. These strategies have to implement the Formatter trait.

```rust
use std::collections::HashMap;
type Data = HashMap<String, u32>;

trait Formatter {
    fn format(&self, data: &Data, s: &mut String);
}

struct Report;

impl Report {
    fn generate<T: Formatter>(g: T, s: &mut String) {
        // backend operations...
        let mut data = HashMap::new();
        data.insert("one".to_string(), 1);
        data.insert("two".to_string(), 2);
        // generate report
        g.format(&data, s);
    }
}

struct Text;
impl Formatter for Text {
    fn format(&self, data: &Data, s: &mut String) {
        *s = data
            .iter()
            .map(|(key, val)| format!("{} {}\n", key, val))
            .collect();
    }
}

struct Json;
impl Formatter for Json {
    fn format(&self, data: &Data, s: &mut String) {
        *s = String::from("[");
        let mut iter = data.into_iter();
        if let Some((key, val)) = iter.next() {
            let entry = format!(r#"{{"{}":"{}"}}"#, key, val);
            s.push_str(&entry);
            while let Some((key, val)) = iter.next() {
                s.push(',');
                let entry = format!(r#"{{"{}":"{}"}}"#, key, val);
                s.push_str(&entry);
            }
        }
        s.push(']');
    }
}

fn main() {
    let mut s = String::from("");
    Report::generate(Text, &mut s);
    assert!(s.contains("one 1"));
    assert!(s.contains("two 2"));

    Report::generate(Json, &mut s);
    assert!(s.contains(r#"{"one":"1"}"#));
    assert!(s.contains(r#"{"two":"2"}"#));
}
```

The main advantage is separation of concerns. For example, in this case Report does not know anything about specific implementations of Json and Text, whereas the output implementations does not care about how data is preprocessed, stored, and fetched. The only thing they have to know is context and a specific trait and method to implement, i.e,Formatter and run.

However, we don't need to use traits in order to design this pattern in Rust. The following toy example demonstrates the idea of the Strategy pattern using Rust closures:

```rust
struct Adder;
impl Adder {
    pub fn add<F>(x: u8, y: u8, f: F) -> u8
    where
        F: Fn(u8, u8) -> u8,
    {
        f(x, y)
    }
}

fn main() {
    let arith_adder = |x, y| x + y;
    let bool_adder = |x, y| {
        if x == 1 || y == 1 {
            1
        } else {
            0
        }
    };
    let custom_adder = |x, y| 2 * x + y;

    assert_eq!(9, Adder::add(4, 5, arith_adder));
    assert_eq!(0, Adder::add(0, 0, bool_adder));
    assert_eq!(5, Adder::add(1, 3, custom_adder));
}
```

## 21. Visitor Pattern

A visitor encapsulates an algorithm that operates over a heterogeneous collection of objects. It allows multiple different algorithms to be written over the same data without having to modify the data (or their primary behaviour).

Furthermore, the visitor pattern allows separating the traversal of a collection of objects from the operations performed on each object.

```rust
// The data we will visit
mod ast {
    pub enum Stmt {
        Expr(Expr),
        Let(Name, Expr),
    }

    pub struct Name {
        value: String,
    }

    pub enum Expr {
        IntLit(i64),
        Add(Box<Expr>, Box<Expr>),
        Sub(Box<Expr>, Box<Expr>),
    }
}

// The abstract visitor
mod visit {
    use ast::*;

    pub trait Visitor<T> {
        fn visit_name(&mut self, n: &Name) -> T;
        fn visit_stmt(&mut self, s: &Stmt) -> T;
        fn visit_expr(&mut self, e: &Expr) -> T;
    }
}

use visit::*;
use ast::*;

// An example concrete implementation - walks the AST interpreting it as code.
struct Interpreter;
impl Visitor<i64> for Interpreter {
    fn visit_name(&mut self, n: &Name) -> i64 { panic!() }
    fn visit_stmt(&mut self, s: &Stmt) -> i64 {
        match *s {
            Stmt::Expr(ref e) => self.visit_expr(e),
            Stmt::Let(..) => unimplemented!(),
        }
    }

    fn visit_expr(&mut self, e: &Expr) -> i64 {
        match *e {
            Expr::IntLit(n) => n,
            Expr::Add(ref lhs, ref rhs) => self.visit_expr(lhs) + self.visit_expr(rhs),
            Expr::Sub(ref lhs, ref rhs) => self.visit_expr(lhs) - self.visit_expr(rhs),
        }
    }
}
```

One could implement further visitors, for example a type checker, without having to modify the AST data.

The visitor pattern is useful anywhere that you want to apply an algorithm to heterogeneous data. If data is homogeneous, you can use an iterator-like pattern. Using a visitor object (rather than a functional approach) allows the visitor to be stateful and thus communicate information between nodes.

The visitor pattern is a common pattern in most OO languages. The fold pattern is similar to visitor but produces a new version of the visited data structure.

> Notes from https://rust-unofficial.github.io/patterns
