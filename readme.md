## BitBucket Package Updater

This Node.js script automates the process of updating the version of a specific npm package in a BitBucket repository's package.json file. It creates a new branch, commits the updated file, and opens a pull request for the changes.

### Installation
1. Clone this repository:

```bash
git clone https://github.com/Maxomys/update-package-json
```
2. Navigate to the project directory:

```bash
cd bitbucket-package-updater
```
3. Install dependencies:

```bash
npm install
```
4. Create a .env file in the root of the project and populate it with the following variables:

```env
BITBUCKET_USERNAME=your_bitbucket_username
BITBUCKET_PASSWORD=your_bitbucket_app_password
REPO_SLUG=your_repo_slug
BRANCH=main
PACKAGE_NAME=your_package_name
PACKAGE_VERSION=your_package_version
```

### Usage

1. Run the script using the following command:

```bash
npm start
```

2. The script will:

- Clone the repository.
- Create a new branch named update-[PACKAGE_NAME]-version-[PACKAGE_VERSION].
- Update the specified package in the package.json file.
- Commit and push the changes.
- Open a pull request in BitBucket.

3. Check your BitBucket repository to review the pull request.


