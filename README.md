# ai-security-skills

[![npm version](https://img.shields.io/npm/v/ai-security-skills.svg)](https://www.npmjs.com/package/ai-security-skills)

Skills that stop your AI coding agent from shipping vulnerabilities you'd
catch yourself if you were the one typing.

This isn't rocket science and every experienced dev knows these things. They just
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

### Fast — npx

```
npx ai-security-skills
```

Detects which harness(es) you have, asks which skills you want, copies
them in. Zero dependencies — read [`bin/install.js`](bin/install.js)
before you run it if you want to know exactly what it does.

### Zero tooling — copy-paste

For full transparency you can manually copy the skill text and create the skills yourself (some people don't trust NPX installs - fair enough). 

Same `SKILL.md` format works unmodified across Claude Code, Codex, and Grok
Build. Drop the skill folder into the right path and it's picked up
automatically — no restart, no config.


1. Open its `SKILL.md` above and read it
2. Create the folder for your harness:

   | Harness | This project only | Every project |
   | --- | --- | --- |
   | Claude Code | `.claude/skills/<skill-name>/` | `~/.claude/skills/<skill-name>/` |
   | Codex | `.agents/skills/<skill-name>/` | `~/.agents/skills/<skill-name>/` |
   | Grok Build | `.grok/skills/<skill-name>/` | `~/.grok/skills/<skill-name>/` |

3. Create `SKILL.md` inside it and paste in what you just read

Nothing executes and nothing downloads except the page you're already
looking at.

## Usage

Nothing to invoke by default. Once a skill is in the right folder, your
agent reads its `description` frontmatter and decides on its own when it
applies — you don't call it, you just work and it surfaces when relevant.
Implementing auth and `secure-over-common` should weigh in without being
asked. Adding an import and `verify-dependencies-exist` should engage
before it lands.

You can also force one explicitly:

| Harness | Explicit invocation |
| --- | --- |
| Claude Code | `/secure-over-common` |
| Codex | `$secure-over-common` |
| Grok Build | `/secure-over-common` |

## License

MIT
