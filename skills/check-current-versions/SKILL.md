---
name: check-current-versions
description: >
  Verify current stable/LTS versions of runtimes, frameworks, and libraries
  before writing code. Use when starting a project, adding a dependency, or
  when a suggested pattern might be based on a stale training cutoff.
---

# Check current versions

An LLM's sense of "current" is frozen at its training cutoff. That's not a
reasoning failure, it's a property of the artifact — versions released and
patterns deprecated after cutoff are structurally unknowable from memory
alone. Left unchecked, this produces stale dependency suggestions and
deprecated API patterns presented with full confidence.

## Instruction

For every runtime, framework, and major library this project depends on:
determine the current official stable/LTS release by checking the
authoritative source (release page, registry, or LTS schedule) — never rely
on training data for "current," it's stale by construction.

Compare against what's pinned. Report each mismatch as `pin → available`,
tagged patch/minor (low-risk) or major (enumerate breaking changes before
recommending).

Never recommend moving onto a beta/RC/preview channel to chase "latest."
Where a runtime has a formal LTS track, prefer LTS over Current even when
Current is newer.
