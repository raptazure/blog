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