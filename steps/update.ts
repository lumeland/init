import { colors, join } from "../deps.ts";
import type { Init } from "../init.ts";

export default function () {
  return async ({ path, deno, lume }: Init) => {
    // Save Deno configuration file
    const content = JSON.stringify(deno, null, 2) + "\n";
    const denoFile = join(path, "deno.json");
    const existingContent = await Deno.readTextFile(denoFile);

    if (existingContent !== content) {
      await Deno.writeTextFile(denoFile, content);
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
