import { colors, join } from "../deps.ts";
import type { DenoConfig, Init } from "../init.ts";

export default function () {
  return async ({ path, deno, lume }: Init) => {
    // Save Deno configuration file
    const denoFile = join(path, "deno.json");
    const changed = await saveDenoConfig(deno, denoFile);

    if (changed) {
      console.log("Update successful!");
      console.log(
        "Your Lume version is:",
        colors.green(lume.version),
      );
    } else {
      console.log("You're using the latest version of Lume");
    }
  };
}

async function saveDenoConfig(
  deno: DenoConfig,
  file: string,
): Promise<boolean> {
  let changed = false;

  if (deno.importMap) {
    const importMap = { imports: deno.imports, scopes: deno.scopes };
    const existingContent = await Deno.readTextFile(deno.importMap);
    const newContent = JSON.stringify(importMap, null, 2) + "\n";

    if (existingContent.trim() !== newContent.trim()) {
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
