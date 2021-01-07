---
title: Rust Idioms
date: 2021-01-07
tags:
  - rust
---

> Notes from https://rust-unofficial.github.io/patterns

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
