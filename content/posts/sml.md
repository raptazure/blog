---
title: Standard ML
date: 2020-09-16
tags:
  - PL
---

### ML Variable Bindings and Expressions

```sml
val z = 3;
(* static environment: z : int *)
(* dynamic environment: z --> 3 *)

val w = z + 1;
(* static environment: z : int, w : int *)
(* dynamic environment: z --> 3, w --> 4 *)
```

1. The semantics
- Syntax is just how you write something
- Semantics is what something means
  - Type-checking (before program runs)
  - Evaluation (as program runs)
- For variable bindings:
  - Type-check expression and extend static environment 
  - Evaluate expression and extend dynamic environment

2. Rules for expressions:
- Every kind of expression has:
  - Syntax 
  - Type-checking rules. Produce a type or fails.
  - Evaluation rules (used only on things that type-check).  
    Produce a value (or exception or infinite-loop).

3. Reasons for shadowing:
```sml
val a = 1
val b = a (* b is bound to 1 *)
val a = 2
```
- Expressions in variable bindings are evaluated **eagerly**
  - Before the variable binding finishes
  - Afterwards, the expression producing the value is irrelevant
- There is no way to assign to a variable in ML
  - Can only shadow in a later environment  

### ML Functions

1. Functions informally
```sml
fun pow (x : int, y : int) = 
  if y = 0 
  then 1
  else x * pow (x, y - 1)
```
- Cannot refer to later function bindings
  - Simply ML`s rule
  - Helper functions must come before their uses
  - Need special construct for mutual recursion 

2. Function bindings formally
- Syntax: `fun x0 (x1 : t1, ..., xn : tn) = e`
- Type-checking: 
  - Add binding `x0 : (t1 * ... * tn) -> t` if:
  - Can type-check body `e` to have type `t` in the static environment containing:
    - Enclosing static environment (earlier bindings)
    - `x1 : t1, ..., xn : tn` (arguments with their types)
    - `x0 : (t1 * ... * tn) -> t` (for recursion) 
- Evaluation: 
  - A function is a value — we simply add x0 to the environment as a function that can be called later. 
  - As expected for recursion, x0 is in the dynamic environment in the function body and for subsequent bindings.

  
3. Function calls formally
- Syntax: `e0 (e1,...,en)` with the parentheses optional if there is exactly one argument.
- Type-checking: require that `e0` has a type that looks like `t1 * ... * tn -> t` and for 1 ≤ i ≤ n, `ei` has type `ti`. Then the whole call has type `t`.
- Evaluation:
  - Evaluate `e0` to `fun x0 (x1 : t1, ..., xn : tn) = e`. Since call type-checked, result will be a function. Evaluate arguments to values `v1, ..., vn` (Under current dynamic environment).
  - Result is evaluation of `e` in an environment extended to map `x1` to `v1, ..., xn` to `vn` (An environment is actually the environment where the function was defined, and includes `x0` for recursion).

### Pairs and Other Tuples

1. Build
- Syntax: `(e1, e2)`
- Type-checking: if `e1` has type `ta` and `e2` has type `tb`, then the pair expression has type `ta * tb` - a new kind of type.
- Evaluation: evaluate `e1` to `v1` and `e2` to `v2`, result is `(v1, v2)` - a pair of values is a value.

2. Access
- Syntax: `#1 e` and `#2 e`
- Type-checking: if `e` has type `ta * tb`, then `#1 e` has type `ta` and `#2 e` has type `tb`.
- Evaluation: evaluate `e` to a pair of values and return first or second piece.

```sml
fun swap (pr : int * bool) = 
  (#2 pr, #1 pr)

fun sum_two_pairs (pr1 : int * int, pr2 : int * int) =
  (#1 pr1) + (#2 pr1) + (#1 pr2) + (#2 pr2)

fun div_mod (x: int, y: int) =
  (x div y, x mod y)

fun sort_pair (pr : int * int) =
  if (#1 pr) < (#2 pr)
  then pr
  else (#2 pr, #1 pr)
```

3. Tuple is a generalization of pairs. 
- Pairs and tuples can be nested (implied by the syntax and semantics)

```sml
val x1 = (7, (true, 9))
val x2 = #1 (#2 x1)
```

### Lists

1. Build: `[v1, v2, ... ,vn]`, `::` pronounced **cons**
2. Access: `null`, `hd`, `tl` 
3. Functions over lists are usually recursive, only way to get to all the elements.

```sml
fun sum_list (xs : int list) =
  if null xs
  then 0
  else hd(xs) + sum_list(tl xs)
  
fun countdown (x : int) =
  if x = 0
  then []
  else x :: countdown(x - 1)

fun append (xs : int list, ys : int list) =
  if null xs
  then ys
  else (hd xs) :: append(tl xs, ys)
```

### Let Expressions

```sml
fun countup_from (x : int) =
  let 
    fun count (from : int) =
      if from = x
      then x :: []
      else from :: count (from + 1)
  in
    count (1)
  end

fun max (xs : int list) =
  if null xs
  then 0
  else if null (tl xs)
  then hd xs
  else 
    (* for style, could also use a let-binding for (hd xs) *)
    let val tl_ans = max (tl xs)
    in 
      if hd xs > tl_ans
      then hd xs
      else tl_ans
    end
```
1. Syntax: `let b1 b2 ... bn in e end`. Each `bi` is any binding and `e` is any expression.
2. Type-checking: Type-check each `bi` and `e` in a static environment that includes the previous bindings. Type of whole let-expression is the type of `e`.
3. Evaluation: Evaluate each `bi` and `e` in a dynamic environment that includes the previous bindings. Result of whole let-expression is result of evaluating `e`.
4. Scope: where a binding is in the environment. Only in later bindings and body of the let-expression.
5. The key to improve efficiency of recursion is not to do repeated work that might do repeated work. Saving recursive results in local bindings is essential.

### Options

```sml
fun max1 (xs : int list) =
  if null xs
  then NONE
  else 
    let val tl_ans = max1 (tl xs)
    in if isSome tl_ans andalso valOf tl_ans > hd xs
      then tl_ans
      else SOME (hd xs)
    end
```
1. Building: `NONE` has type `'a option`, `SOME e` has type `t option` if `e` has type `t`.
2. Accessing: `isSome` has type `'a option -> bool`, `valOf` has type `'a option -> 'a`  (exception if given `NONE`).

### Booleans and Comparison Operations

1. Syntax: `e1 andalso e2`, `e1 orelse e2`, `not e1`.
2. Short-circuiting evaluation means `andalso` and `orelse` are not functions, but `not` is just a pre-defined function.
3. `=` `<>` can be used with any equality type but not with `real`.

### No Mutation: ML vs. Imperative Languages

1. In ML, we create aliases all the time without thinking about it because it is impossible to tell where there is aliasing.
   - Example: `tl` is constant time; does not copy rest of the list.
   - So do not worry and focus on the algorithm.
2. In language with mutable data (e.g. Java), programmers are obsessed with aliasing and object identity.
   - They have to be (!) so that subsequent assignments affect the right parts of the program.
   - Often crucial to make copies in just the right places.
3. Reference (alias) vs. copy does not matter if code is immutable.

### Pieces of a Language

1. Syntax
2. Semantics (evaluation rules)
3. Idioms (typical patterns for using language features to express the computation)
4. Libraries
5. Tools