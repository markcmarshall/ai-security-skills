---
name: assume-tainted
description: >
  Track untrusted data to sinks in this diff. Models do not reliably do
  taint analysis. Use when you render, log, redirect, webhook, template,
  innerHTML, request body, header, filename, or user input reaches a
  query or file.
---

# Assume tainted

An LLM matches local patterns. It does not track a value from source to
sink across functions, files, or transformations. If it cannot name the
source, it treats the value as already safe. Unknown source is tainted.
Trust is not inherited from a helper, a type name, or "we already
validated that."

This is not a program-wide taint engine. It applies to sinks this change
touches.

## Instruction

Before treating the work as done, emit for every value that reaches a
sink in this diff:

value → source → sink policy

- Source unknown or user-controlled (request body, header, filename,
  query, webhook payload, URL, uploaded content) → tainted.
- Sink policy is contextual. HTML-encode for that HTML context. Put
  log data in structured fields, not interpolated messages. Parse and
  allowlist URLs before redirect or fetch. Bound queries. Do not
  concatenate into a shell. Confine paths to an intended root.
- Passing a value across a function does not clear taint. The sink
  still needs a policy.

If you cannot fill the triple, stop. Do not ship the sink.
