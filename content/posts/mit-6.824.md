---
title: MIT 6.824 - Distributed Systems
date: 2020-08-22
tags:
  - computer science
---

# Introduction

### 1. Why distributed systems?

Parallelism, fault tolerance, physical reasons, security / isolated

### 2. Basic challenges

Concurrency, partial failure, performance

### 3. Fault tolerance tools

non-volatile storage (expensive)  
replication (make replicas have independent failure probability)

### 4. Consistency

Strong consistency is expensive to implement.  
To avoid communication as much as possible particularly if replicas are far away, pepole build weak systems that might allow the stale read of an old value.

### 5. MapReduce

The MapReduce algorithm contains two important tasks, namely Map and Reduce. Map takes a set of data and converts it into another set of data, where individual elements are broken down into tuples (key/value pairs). Secondly, reduce task, which takes the output from a map as an input and combines those data tuples into a smaller set of tuples. As the sequence of the name MapReduce implies, the reduce task is always performed after the map job. The entire job is made up of a bunch of map tasks and a bunch of reduce tasks. Example: word count.

# RPC and Threads

### 1. Damage that comes with thread

Race: solutions - figure out some locking strategy for making access to the data one thread at a time or not share data.  
Coordination: solutions - channels, conditional variables, wait groups  
Deadlock: a state in which each member of a group is waiting for another member, including itself, to take action, such as sending a message or more commonly releasing a lock.
