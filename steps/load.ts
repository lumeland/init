import { join } from "../deps.ts";
import type { DenoConfig, Init } from "../init.ts";

export default function () {
  return async ({ path, deno }: Init) => {
    const denoFile = join(path, "deno.json");

    try {
      const content = await Deno.readTextFile(denoFile);
      const config = JSON.parse(content) as DenoConfig;
      Object.assign(deno, config);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        console.error(`Deno configuration file not found: ${denoFile}`);
        return false;
      }

      throw error;
    }
  };
}
