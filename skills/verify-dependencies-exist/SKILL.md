---
name: verify-dependencies-exist
description: >
  Verify that any package, import, or config key an LLM introduces actually
  exists before it's installed or used. Use whenever new dependencies or
  unfamiliar config options show up in generated code.
---

# Verify dependencies exist

An LLM generates plausible tokens, not verified facts. Package names, config
keys, and API signatures come out of likelihood, not lookup — which means a
name can be perfectly plausible and not real. This is the mechanism behind
"slopsquatting": an LLM hallucinates a plausible package name, an attacker
pre-registers it, and the next LLM (or the next run of the same one) that
hallucinates that name pulls in the squat. Nobody typed the malicious name —
the model invented it and nobody checked.

## Instruction

Before adding any dependency — especially one the LLM itself introduced
during code generation rather than one you explicitly named — verify it
exists on the actual package registry. Never assume a plausible or
conventionally-named package is real.

Check registry metadata: publish date, download/install count, maintainer
and version history. A package matching an expected name but with a recent
creation date, low installs, or a thin commit history is a squatting signal.

Flag near-misses — transposition, hyphen/underscore swap, singular/plural,
common misspelling — of a much more popular package serving the same
purpose.

Treat every new import as unverified until checked. Do not let it silently
resolve into an install.
