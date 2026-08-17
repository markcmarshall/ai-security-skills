---
name: name-the-unstated-controls
description: >
  Force security controls that were never explicitly requested to get named
  and checked before an implementation is considered done. Use before
  marking any feature complete.
---

# Name the unstated controls

Asked for an endpoint that returns a user's orders, an LLM writes exactly
that — correctly and idiomatically — and adds nothing that wasn't asked
for. Security controls are the canonical unstated requirement: their
absence is never a compile error, so they never block "done." This is how
hardcoded secrets, authorization checks, and unsafe platform defaults get
silently skipped — not because the model doesn't know they exist, but
because nobody asked for them by name.

## Instruction

Before treating an implementation as complete, name the security controls
implied by what was built — not what was asked for, what's implied by it —
and confirm each is actually present:

- Secrets externalized, never hardcoded or committed
- Platform-level defaults left in their secure state, or explicitly
  reasoned about if changed
- Authorization enforced server-side, not assumed from client state
- Trust boundaries respected — client input is untrusted input, full stop

Silence in the spec is not permission to skip a control. If a control
applies and wasn't mentioned, say so before calling the work done — don't
wait to be asked.
