# ai-security-skills

Skills that stop your LLM from shipping vulnerabilities you'd
catch yourself if you were the one typing.

None of this is secret. Every experienced dev knows most of it. They just
don't have muscle memory for checking it every single time, and an LLM
generating code at 10x your typing speed doesn't check it at all unless
told to. That's the gap these close.

## Why this happens

An LLM introduces security vulnerabilities primarily for one of four reasons:

| Cause | What it is | What it produces |
| --- | --- | --- |
| **Frozen knowledge** | Training cutoff — versions and deprecations after it are structurally unknowable, not a reasoning failure | Stale, known-vulnerable versions |
| **Popularity-weighted training data** | Trained on tutorials and demos optimized for shortest-path-to-working, not correctness. The modal answer is the tutorial answer | `origin: '*'`, tokens in `localStorage`, disabled CSRF, the rest of the insecure-but-common idiom set |
| **No referent** | Generates plausible tokens, not verified facts. Package names and config keys come from likelihood, not lookup | Hallucinated and typosquatted ("slopsquatted") packages, invented config options |
| **Unstated requirements stay unstated** | Asked for a feature, it builds exactly that and nothing more. Security controls are the canonical thing nobody asks for by name | Hardcoded secrets, untouched unsafe defaults, missing authz |

Each skill below targets one of these directly.

## Skills

| Skill | Cause | Use when |
| --- | --- | --- |
| [`check-current-versions`](skills/check-current-versions/SKILL.md) | Frozen knowledge | Starting a project or adding a dependency |
| [`secure-over-common`](skills/secure-over-common/SKILL.md) | Popularity-weighted training | Implementing auth, CORS, storage, or input rendering |
| [`verify-dependencies-exist`](skills/verify-dependencies-exist/SKILL.md) | No referent | Any new import or package shows up in generated code |
| [`name-the-unstated-controls`](skills/name-the-unstated-controls/SKILL.md) | Unstated requirements | Before marking any feature complete |

## Install

Drop a skill folder into your Claude Code skills path:

```
# Personal, all projects
cp -r skills/check-current-versions ~/.claude/skills/

# This project only
cp -r skills/check-current-versions .claude/skills/
```

Claude Code picks it up automatically — no restart, no config.

## License

MIT
