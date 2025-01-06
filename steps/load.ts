import { join, parseJsonc } from "../deps.ts";
import type { DenoConfig, Init } from "../init.ts";

export default function () {
  return async (init: Init) => {
    const { path, deno } = init;
    try {
      const denoFile = join(path, "deno.json");
      const content = await Deno.readTextFile(denoFile);
      const config = JSON.parse(content) as DenoConfig;
      Object.assign(deno, config);
      init.denoFile = denoFile;
      return;
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        try {
          const denoFile = join(path, "deno.jsonc");
          const content = await Deno.readTextFile(denoFile);
          const config = parseJsonc(content) as DenoConfig;
          Object.assign(deno, config);
          init.denoFile = denoFile;
          return;
        } catch (error) {
          if (error instanceof Deno.errors.NotFound) {
            console.error(
              `Deno configuration file not found: deno.json or deno.jsonc`,
            );
            return false;
          }

          throw error;
        }
      }

      throw error;
    }
  };
}
