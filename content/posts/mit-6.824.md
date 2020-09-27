---
title: 6.824 Distributed Systems
date: 2020-08-22
tags:
  - computer science
---

# 1. Introduction

### Why distributed systems?

Parallelism, fault tolerance, physical reasons, security / isolated

### Basic challenges

Concurrency, partial failure, performance

### Fault tolerance tools

Non-volatile storage (expensive)  
Replication (make replicas have independent failure probability)

### Consistency

Strong consistency is expensive to implement.  
To avoid communication as much as possible particularly if replicas are far away, pepole build weak systems that might allow the stale read of an old value.

### MapReduce

The MapReduce algorithm contains two important tasks, namely Map and Reduce. Map takes a set of data and converts it into another set of data, where individual elements are broken down into tuples (key/value pairs). Secondly, reduce task, which takes the output from a map as an input and combines those data tuples into a smaller set of tuples. As the sequence of the name MapReduce implies, the reduce task is always performed after the map job. The entire job is made up of a bunch of map tasks and a bunch of reduce tasks. Example: word count.

# 2. RPC and Threads

### Threads

Threads allow one program to do many things at once. each thread executes serially, just like an ordinary non-threaded program. the threads share memory. each thread includes some per-thread state: program counter, registers, stack.

Why threads?

- They express concurrency, which you need in distributed systems
- I/O concurrency
- Client sends requests to many servers in parallel and waits for replies.
- Server processes multiple client requests; each request may block.
- While waiting for the disk to read data for client X, process a request from client Y.
- Multicore performance
- Execute code in parallel on several cores.
- In background, once per second, check whether each worker is still alive.

Is there an alternative to threads?

- Write code that explicitly interleaves activities, in a single thread.
  Usually called "event-driven."
- Keep a table of state about each activity, e.g. each client request.
- One "event" loop that: checks for new input for each activity (e.g. arrival of reply from server), does the next step for each activity, updates state.
- Event-driven gets you I/O concurrency, and eliminates thread costs (which can be substantial), but doesn't get multi-core speedup.

Threading challenges:

- Shared data. e.g. what if two threads do n = n + 1 at the same time? or one thread reads while another increments? this is a "race" - and is usually a bug. -> use locks or avoid sharing mutable data.
- Coordination between threads.
  e.g. one thread is producing data, another thread is consuming it.
  how can the consumer wait (and release the CPU)?
  how can the producer wake up the consumer?
- Deadlock: cycles via locks and/or communication (e.g. RPC or channels)

### Remote Procedure Call
