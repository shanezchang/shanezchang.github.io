import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';

const workflow = parse(await readFile(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8'));
const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const lock = JSON.parse(await readFile(new URL('../package-lock.json', import.meta.url), 'utf8'));
const build = workflow.jobs.build;
const deploy = workflow.jobs.deploy;
const mainOnly = "github.ref == 'refs/heads/main' && github.event_name != 'pull_request'";

test('build is a stable PR gate with frozen installs, type and artifact/browser checks', () => {
  assert.ok(Object.hasOwn(workflow.on, 'pull_request'));
  assert.equal(build.name ?? 'build', 'build');
  assert.equal(build.if, undefined, 'build must not skip pull requests');
  const commands = build.steps.filter((s) => s.run).map((s) => s.run).join('\n');
  assert.match(commands, /\bnpm ci\b/);
  assert.doesNotMatch(commands, /\bnpm install\b/);
  for (const command of ['npm run typecheck', 'npm test', 'npm run test:browser']) assert.ok(commands.includes(command), command);
  const pdfTools = build.steps.findIndex((step) => step.run?.includes('apt-get install --no-install-recommends -y poppler-utils'));
  assert.ok(pdfTools >= 0 && pdfTools < build.steps.findIndex((step) => step.run === 'npm run test:browser'), 'PDF tools must be installed before the browser gate');
  assert.match(pkg.scripts.test, /npm run build/);
  assert.match(pkg.scripts.test, /test:artifact/);
  assert.equal(pkg.scripts['test:artifact'], 'node --test tests/*.test.mjs');
  assert.ok(lock.lockfileVersion >= 2);
  assert.deepEqual(lock.packages[''].dependencies, pkg.dependencies);
  assert.deepEqual(lock.packages[''].devDependencies, pkg.devDependencies);
});

test('only deployment has Pages/OIDC writes, and only main can upload/deploy', () => {
  assert.deepEqual(workflow.permissions, { contents: 'read' });
  assert.deepEqual(build.permissions ?? workflow.permissions, { contents: 'read' });
  assert.deepEqual(deploy.permissions, { pages: 'write', 'id-token': 'write' });
  assert.equal(deploy.needs, 'build');
  assert.equal(deploy.if, mainOnly);
  assert.equal(deploy.environment.name, 'github-pages');
  const upload = build.steps.find((s) => s.uses?.startsWith('actions/upload-pages-artifact@'));
  assert.equal(upload?.if, mainOnly);
  assert.equal(upload?.with.path, 'dist');
  assert.equal(upload?.with['include-hidden-files'], true, '.nojekyll is part of the artifact');
  const checkout = build.steps.find((s) => s.uses?.startsWith('actions/checkout@'));
  assert.equal(checkout?.with['persist-credentials'], false);
  assert.equal(workflow.on.pull_request_target, undefined);
});

test('every Action uses the reviewed immutable official commit', () => {
  const pins = {
    'actions/checkout': 'd23441a48e516b6c34aea4fa41551a30e30af803',
    'actions/setup-node': '249970729cb0ef3589644e2896645e5dc5ba9c38',
    'actions/upload-pages-artifact': 'fc324d3547104276b827a68afc52ff2a11cc49c9',
    'actions/deploy-pages': '368f82528645a54fb793d4d04e342629a3f51346',
  };
  for (const job of Object.values(workflow.jobs)) for (const step of job.steps) {
    if (!step.uses) continue;
    const [action, sha] = step.uses.split('@');
    assert.match(sha, /^[a-f0-9]{40}$/);
    assert.equal(sha, pins[action], `review the upstream commit before changing ${action}`);
  }
});
