---
name: secure-over-common
description: >
  Catch the case where an LLM defaults to the most common tutorial pattern
  instead of the secure one. Use when implementing auth, CORS, storage, or
  input rendering.
---

# Secure over common

LLMs are trained on tutorials, Stack Overflow, blog posts, and demo repos —
a corpus that systematically optimizes for shortest-path-to-working, not
correctness. The model's most likely answer is the tutorial answer.
Confident and wrong. This is a different failure than not knowing the
secure pattern — the model usually does know it, it just isn't the
statistically modal one.

Classic output of this failure: `Access-Control-Allow-Origin: *`, auth
tokens in `localStorage`, disabled CSRF protection for convenience,
unsanitized HTML rendering. Every one of these is copied from a working
example, not reasoned from a threat model.

## Instruction

When implementing anything security-relevant — auth, CORS, storage, input
rendering, session handling — do not default to whatever pattern is most
common in tutorials and sample code.

Explicitly name both: the popular pattern and the correct pattern. If they
diverge, use the correct one and say why the popular one is wrong, not just
that an alternative exists.

Do not treat "this is how most examples do it" as evidence it's safe.
Popularity in training data is a measure of tutorial frequency, not
security review.
