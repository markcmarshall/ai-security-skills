---
name: verify-dependencies-exist
description: >
  Verify that any package, import, API symbol, or config key an LLM
  introduces actually exists before it is installed or used. Use whenever
  new dependencies, unfamiliar methods, or unfamiliar config options show
  up in generated code.
---

# Verify dependencies exist

An LLM generates plausible tokens, not verified facts. Package names,
imports, API symbols, and config keys come out of likelihood, not lookup
— which means a name can be perfectly plausible and not real. This is
the mechanism behind slopsquatting: the model invents a package, an
attacker pre-registers it, and the next run that emits that name pulls
in the squat. The same failure on a real package is a hallucinated
method or config key that compiles in the model's head and nowhere else.

## Instruction

Before shipping any new referent the model introduced — package, import,
API symbol, or config key — look it up on the actual registry or the
current docs for that package. Cite what you opened. If you cannot cite
it, it does not ship.

Never assume a plausible or conventionally-named token is real. A real
package does not make `pkg.somethingThatLooksRight()` real.

Age and near-misses are signals, not verdicts. A brand-new name that
is a transposition, hyphen/underscore swap, singular/plural, or common
misspelling of a much more popular package serving the same purpose is
a squat signal — stop and say so. Low download count alone is not.

Treat every new import and every new symbol on an existing import as
unverified until checked. Do not let it silently resolve into an
install or a call.
