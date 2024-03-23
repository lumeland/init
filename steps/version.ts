import { colors } from "../deps.ts";
import { getLatestVersion } from "./utils.ts";
import type { Init } from "../init.ts";

export default function () {
  return async ({ deno }: Init) => {
    // Configure the import map
    const version = await getLatestVersion("lume");
    console.log();
    console.log(`Welcome to Lume ${colors.brightGreen(version)}!`);
    console.log();

    deno.imports ??= {};
    deno.imports["lume/"] = `https://deno.land/x/lume@${version}/`;

    // Configure lume tasks
    deno.tasks ??= {};
    deno.tasks.lume = `echo "import 'lume/cli.ts'" | deno run -A -`;
    deno.tasks.build = "deno task lume";
    deno.tasks.serve = "deno task lume -s";

    // Configure the compiler options
    deno.compilerOptions ??= {};
    deno.compilerOptions.types ??= [];
    deno.compilerOptions.types.push("lume/types.ts");
  };
}
