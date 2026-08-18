#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');

const PACKAGE_ROOT = path.join(__dirname, '..');
const SKILLS_DIR = path.join(PACKAGE_ROOT, 'skills');

const HARNESSES = [
  { key: 'claude', label: 'Claude Code', dirName: '.claude' },
  { key: 'codex', label: 'Codex', dirName: '.agents' },
  { key: 'grok', label: 'Grok Build', dirName: '.grok' },
];

function listSkills() {
  return fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function detect(harness) {
  const projectDir = path.join(process.cwd(), harness.dirName);
  const globalDir = path.join(os.homedir(), harness.dirName);
  return {
    project: fs.existsSync(projectDir),
    global: fs.existsSync(globalDir),
  };
}

// Parses input like "1,3" or "all" against a 1-indexed list. Returns 0-based indices.
function parseSelection(input, count) {
  const trimmed = input.trim().toLowerCase();
  if (trimmed === 'all' || trimmed === '') {
    return Array.from({ length: count }, (_, i) => i);
  }
  const picked = new Set();
  for (const part of trimmed.split(',')) {
    const n = Number.parseInt(part.trim(), 10);
    if (Number.isInteger(n) && n >= 1 && n <= count) picked.add(n - 1);
  }
  return [...picked].sort((a, b) => a - b);
}

async function main() {
  const skills = listSkills();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
  const lines = rl[Symbol.asyncIterator]();
  async function ask(prompt) {
    process.stdout.write(prompt);
    const { value, done } = await lines.next();
    return done ? '' : value;
  }

  console.log('ai-security-skills installer\n');

  const detected = HARNESSES.map((h) => ({ ...h, ...detect(h) }));
  const anyDetected = detected.some((h) => h.project || h.global);
  if (anyDetected) {
    console.log('Detected on this machine:');
    for (const h of detected) {
      const scopes = [h.project && 'this project', h.global && 'global'].filter(Boolean);
      if (scopes.length) console.log(`  ${h.label} — ${scopes.join(', ')}`);
    }
    console.log('');
  } else {
    console.log('No existing harness directories detected — you can still install into any of them.\n');
  }

  console.log('Which harness(es)?');
  HARNESSES.forEach((h, i) => console.log(`  ${i + 1}. ${h.label}`));
  const harnessInput = await ask('Enter numbers (comma-separated) or "all" [all]: ');
  const harnessChoices = parseSelection(harnessInput, HARNESSES.length).map((i) => HARNESSES[i]);

  const scopeInput = await ask(
    '\nScope — 1. This project only  2. Every project (global)  3. Both [1]: '
  );
  const scopeChoice = scopeInput.trim() || '1';
  const scopes = scopeChoice === '2' ? ['global'] : scopeChoice === '3' ? ['project', 'global'] : ['project'];

  console.log('\nWhich skills?');
  skills.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
  const skillInput = await ask('Enter numbers (comma-separated) or "all" [all]: ');
  const skillChoices = parseSelection(skillInput, skills.length).map((i) => skills[i]);

  if (harnessChoices.length === 0 || skillChoices.length === 0) {
    console.log('\nNothing selected — exiting.');
    rl.close();
    return;
  }

  const jobs = [];
  for (const harness of harnessChoices) {
    for (const scope of scopes) {
      const base =
        scope === 'global'
          ? path.join(os.homedir(), harness.dirName, 'skills')
          : path.join(process.cwd(), harness.dirName, 'skills');
      for (const skill of skillChoices) {
        jobs.push({
          harness: harness.label,
          scope,
          src: path.join(SKILLS_DIR, skill),
          dest: path.join(base, skill),
        });
      }
    }
  }

  const conflicts = jobs.filter((j) => fs.existsSync(j.dest));
  let overwrite = true;
  if (conflicts.length > 0) {
    console.log(`\n${conflicts.length} destination(s) already exist:`);
    for (const c of conflicts) console.log(`  ${c.dest}`);
    const answer = await ask('Overwrite all of them? [y/N]: ');
    overwrite = /^y(es)?$/i.test(answer.trim());
    if (!overwrite) {
      console.log('Skipping existing destinations — everything else will still install.');
    }
  }

  rl.close();

  console.log('');
  for (const job of jobs) {
    const exists = fs.existsSync(job.dest);
    if (exists && !overwrite) {
      console.log(`skip   ${job.harness} (${job.scope}) — ${job.dest} already exists`);
      continue;
    }
    fs.mkdirSync(path.dirname(job.dest), { recursive: true });
    fs.cpSync(job.src, job.dest, { recursive: true });
    console.log(`${exists ? 'update' : 'install'} ${job.harness} (${job.scope}) — ${job.dest}`);
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
