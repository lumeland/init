/** Return the latest stable version from the deno.land/x repository */
export async function getLatestVersion(
  name: string,
  prefix?: string,
): Promise<string> {
  const response = await fetch(
    `https://cdn.deno.land/${name}/meta/versions.json`,
  );
  const versions = await response.json();

  if (prefix) {
    for (const version of versions.versions) {
      if (version.startsWith(prefix)) {
        return version;
      }
    }
  }
  return versions.latest;
}

/** Return the latest stable version from a Github repository in jsDelivr */
export async function getLatestJsDelivrVersion(
  name: string,
): Promise<string> {
  const response = await fetch(
    `https://data.jsdelivr.com/v1/package/gh/${name.toLowerCase()}`,
  );
  const versions = await response.json();
  return versions.versions[0];
}

export async function getLatestGitHubCommit(
  name: string,
  branch = "main",
): Promise<string> {
  const response = await fetch(
    `https://api.github.com/repos/${name}/commits/${branch}`,
  );
  const commits = await response.json();
  return commits.sha;
}

export async function resolveOrigin(url: string): Promise<string> {
  const denoland = url.match(/^https:\/\/deno.land\/x\/([^\/]+)$/);

  if (denoland) {
    const [, name] = denoland;
    const version = await getLatestVersion(name);

    return `https://deno.land/x/${name}@${version}`;
  }

  const jsdelivr = url.match(
    /^https:\/\/cdn\.jsdelivr\.net\/gh\/([^\/]+\/[^\/]+)$/,
  );
  if (jsdelivr) {
    const [, name] = jsdelivr;
    const version = await getLatestJsDelivrVersion(name);

    return `https://cdn.jsdelivr.net/gh/${name}@${version}`;
  }

  throw new Error(`Could not resolve origin for ${url}`);
}

export async function loadFile(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  return new Uint8Array(await response.arrayBuffer());
}
