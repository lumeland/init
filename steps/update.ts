import { colors, join } from "../deps.ts";
import type { DenoConfig, Init } from "../init.ts";

export default function () {
  return async ({ path, deno, lume, denoFile }: Init) => {
    // Save Deno configuration file
    const changed = await saveDenoConfig(deno, join(path, denoFile));

    if (changed) {
      console.log("Update successful!");
      console.log(
        "Your Lume version is:",
        colors.green(lume.version),
      );
    } else {
      console.log("No need to update the Deno configuration file.");
    }
  };
}

async function saveDenoConfig(
  deno: DenoConfig,
  file: string,
): Promise<boolean> {
  let changed = false;

  if (deno.importMap) {
    const mapText = await Deno.readTextFile(deno.importMap);
    const map = JSON.parse(mapText);
    Object.assign(map.imports, deno.imports);
    if (deno.scopes) {
      Object.assign(map.scopes, deno.scopes);
    }
    const newContent = JSON.stringify(map, null, 2) + "\n";

    if (mapText.trim() !== newContent.trim()) {
      changed = true;
    }

    await Deno.writeTextFile(deno.importMap, newContent);
    delete deno.imports;
    delete deno.scopes;
  }

  const newContent = JSON.stringify(deno, null, 2) + "\n";
  const existingContent = await Deno.readTextFile(file);

  if (existingContent.trim() !== newContent.trim()) {
    changed = true;
  }

  await Deno.writeTextFile(file, newContent);

  return changed;
}
