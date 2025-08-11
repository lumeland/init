import { join, parseJsonc } from "../deps.ts";

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

export async function loadFile(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  return new Uint8Array(await response.arrayBuffer());
}

export async function loadJSON<T>(
  base: string,
  ...files: string[]
): Promise<[string, T] | false> {
  while (files.length) {
    const file = files.shift();
    if (!file) {
      break;
    }
    try {
      const content = await Deno.readTextFile(join(base, file));
      const config = parseJsonc(content) as T;
      return [file, config];
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        if (files.length) {
          continue;
        }
        return false;
      }
      throw error;
    }
  }

  return false;
}
