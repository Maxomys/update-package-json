import axios from 'axios';

const BITBUCKET_API_BASE = 'https://api.bitbucket.org/2.0';

export async function createPullRequest(
  username: string,
  password: string,
  repoSlug: string,
  sourceBranch: string,
  targetBranch: string,
  title: string
) {
  const url = `${BITBUCKET_API_BASE}/repositories/${username}/${repoSlug}/pullrequests`;

  const auth = {
    username,
    password,
  };

  const prData = {
    title: title,
    source: {
      branch: {
        name: sourceBranch,
      },
    },
    destination: {
      branch: {
        name: targetBranch,
      },
    },
  };

  try {
    await axios.post(url, prData, {
      auth: auth,
    });
    // todo: type
  } catch (error: any) {
    console.error(
      'Error creating pull request:',
      error.response?.data || error.message
    );
  }
}
