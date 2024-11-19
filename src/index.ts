import simpleGit, { CleanOptions } from 'simple-git';
import { createPullRequest } from './bitbucketClient';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import isValidVersion from './isValidVersion';

const username = process.env.BITBUCKET_USERNAME!;
const password = process.env.BITBUCKET_PASSWORD!;
const repoSlug = process.env.REPO_SLUG!;
const branch = process.env.BRANCH!;

const packageName = process.env.PACKAGE_NAME!;
const packageVersion = process.env.PACKAGE_VERSION!;

if (!isValidVersion(packageVersion)) {
  console.error('Invalid version format');
}

// prepare an empty repo directory
if (existsSync('./repo')) {
  rmSync('./repo', { recursive: true, force: true });
}
mkdirSync('./repo');

const git = simpleGit('./repo');
simpleGit().clean(CleanOptions.FORCE);

await git.clone(
  `https://bitbucket.org/${username}/${repoSlug}/src/${branch}/`,
  '.'
);

const newBranch = `update-${packageName}-version-${packageVersion}`;

await git.checkoutLocalBranch(newBranch);

const packageJson = JSON.parse(readFileSync('./repo/package.json', 'utf8'));

const { dependencies, devDependencies } = packageJson;

// check for the package in dependencies or devDependencies 
if (dependencies && dependencies[packageName]) {
  const currentVersion = dependencies[packageName];
  const prefix = currentVersion.match(/^[^0-9]*/)![0]; // match semantic lock prefix

  dependencies[packageName] = `${prefix}${packageVersion}`;
} else if (devDependencies && devDependencies[packageName]) {
  const currentVersion = devDependencies[packageName];
  const prefix = currentVersion.match(/^[^0-9]*/)![0];

  devDependencies[packageName] = `${prefix}${packageVersion}`;
} else {
  console.error('Package.lock file does not contain specified dependency.');
}

writeFileSync('./repo/package.json', JSON.stringify(packageJson));

const commitMessage = `chore: update ${packageName} to version ${packageVersion}`;

await git.commit(commitMessage, 'package.json');

await git.push(['-u', 'origin', newBranch]);

createPullRequest(
  username,
  password,
  repoSlug,
  branch,
  newBranch,
  commitMessage
);
