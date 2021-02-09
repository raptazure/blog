---
title: SPLV Idris
date: 2021-01-22
tags:
  - type theory
---

## The implementation of Idris 2

1. Understand how a dependently typed language works, primarily type checking and elaboration.

- Type checking is where you have the `Core` representation. It is completely explicit and we will check that the `Core` representation is well typed by the type that you claimed it has. 
- Elaboration is a higher-level step. It is where you take something that is more like the user level code and elaborate it to put all of the concrete precise type information that is needed for the mechine to type check. What Idris 2 does is it will take a few steps of elabration and it will eventually end up at the `Core` representation and at that point, we have a very small core language. It is then possible to feed that again to a type checker which is just not very clever and just knows about the core typing rules to ensure what is produced as a process of elaboration is valid.