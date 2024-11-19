export default function isValidVersion(version: string): boolean {
  const versionRegex = /^(\d+)\.(\d+)\.(\d+)$/;

  return versionRegex.test(version);
}
