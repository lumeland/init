/** Return the latest stable version from the deno.land/x repository */
export async function getLatestVersion(name: string): Promise<string> {
  const response = await fetch(
    `https://cdn.deno.land/${name}/meta/versions.json`,
  );
  const versions = await response.json();
  return versions.latest;
}

export async function getLatestGitHubTag(name: string): Promise<string> {
  const response = await fetch(
    `https://api.github.com/repos/${name}/tags`,
  );
  const tags = await response.json();
  return tags[0].name;
}

export async function resolveOrigin(url: string): Promise<string> {
  const results = url.match(/^https:\/\/deno.land\/x\/([^\/]+)$/);

  if (!results) {
    throw new Error(`Invalid URL: ${url}`);
  }

  const [, name] = results;
  const version = await getLatestVersion(name);

  return `https://deno.land/x/${name}@${version}`;
}

export async function loadFile(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  return new Uint8Array(await response.arrayBuffer());
}
