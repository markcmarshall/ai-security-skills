# ai-security-skills

[![npm version](https://img.shields.io/npm/v/ai-security-skills.svg)](https://www.npmjs.com/package/ai-security-skills)

Coding agents introduce vulnerabilities into your code even when you
prompt them correctly. Specific blind spots exist that a model can't
reason its way out of, no matter how careful the prompt — they're
structural, not a lapse in attention. This repo is four skills, each
targeting the root cause of one of those blind spots.

## Why this happens

An LLM introduces security vulnerabilities primarily for one of four reasons:

| Cause | What it is | What it produces |
| --- | --- | --- |
| **Frozen knowledge** | Training cutoff — versions and deprecations after it are structurally unknowable, not a reasoning failure | Stale, known-vulnerable versions |
| **Popularity-weighted training data** | Trained on tutorials and demos optimized for shortest-path-to-working, not correctness. The modal answer is the tutorial answer | `origin: '*'`, tokens in `localStorage`, disabled CSRF, the rest of the insecure-but-common idiom set |
| **No referent** | Generates plausible tokens, not verified facts. Package names and config keys come from likelihood, not lookup | Hallucinated and typosquatted ("slopsquatted") packages, invented config options |
| **Unstated requirements stay unstated** | Asked for a feature, it builds exactly that and nothing more. Security controls are the canonical thing nobody asks for by name | Hardcoded secrets, untouched unsafe defaults, missing authz |

## Skills

| Skill | Cause | Use when |
| --- | --- | --- |
| [`check-current-versions`](skills/check-current-versions/SKILL.md) | Frozen knowledge | Starting a project or adding a dependency |
| [`secure-over-common`](skills/secure-over-common/SKILL.md) | Popularity-weighted training | Implementing auth, CORS, storage, or input rendering |
| [`verify-dependencies-exist`](skills/verify-dependencies-exist/SKILL.md) | No referent | Any new import or package shows up in generated code |
| [`name-the-unstated-controls`](skills/name-the-unstated-controls/SKILL.md) | Unstated requirements | Before marking any feature complete |

## Install

Same `SKILL.md` format works unmodified across Claude Code, Codex, and Grok
Build — once a skill is in the right folder it's picked up automatically,
no restart, no config. Two ways to get it there, pick based on how much
you trust running someone else's installer.

### npx — fastest

Run this in your terminal, not in your agent's chat:

```
npx ai-security-skills
```

It asks which harness(es) you have and which skills you want, then copies
the files in. Zero dependencies — read [`bin/install.js`](bin/install.js)
first if you want to know exactly what it does before running it.

### Manual install

Copy and paste each skill in by hand — no terminal, no npm. Do this if
you want to see and control exactly what lands where; it's mostly here
for full transparency. For each skill you want:

1. Open its `SKILL.md` above and read it
2. Create its folder for your harness:

   | Harness | This project only | Every project |
   | --- | --- | --- |
   | Claude Code | `.claude/skills/<skill-name>/` | `~/.claude/skills/<skill-name>/` |
   | Codex | `.agents/skills/<skill-name>/` | `~/.agents/skills/<skill-name>/` |
   | Grok Build | `.grok/skills/<skill-name>/` | `~/.grok/skills/<skill-name>/` |

3. Create `SKILL.md` inside it and paste in what you just read

That's it — nothing executes, nothing downloads except the page you
already opened.

## Usage

Call a skill by name directly:

| Skill | Claude Code | Codex | Grok Build |
| --- | --- | --- | --- |
| `check-current-versions` | `/check-current-versions` | `$check-current-versions` | `/check-current-versions` |
| `secure-over-common` | `/secure-over-common` | `$secure-over-common` | `/secure-over-common` |
| `verify-dependencies-exist` | `/verify-dependencies-exist` | `$verify-dependencies-exist` | `/verify-dependencies-exist` |
| `name-the-unstated-controls` | `/name-the-unstated-controls` | `$name-the-unstated-controls` | `/name-the-unstated-controls` |

You don't have to — your agent also reads each skill's `description` on
its own and decides when it applies, without being asked. The table
above is for when you want to force one directly.

## Disclaimer

These are prompts, not proof. A skill raises the odds your agent catches
a class of mistake — it doesn't guarantee it, doesn't replace a real
security review, and doesn't make a codebase audited. Treat a catch as a
starting point for your own judgment, not a pass/fail gate.

## License

MIT
