import { loadJSON } from "./utils.ts";
import type { DenoConfig, Init } from "../init.ts";

export default function () {
  return async (init: Init) => {
    const { path, deno } = init;
    const config = await loadJSON<DenoConfig>(path, "deno.json", "deno.jsonc");

    if (!config) {
      console.error(
        `Deno configuration file not found: deno.json or deno.jsonc`,
      );
      return false;
    }

    Object.assign(deno, config[1]);
    init.denoFile = config[0];
  };
}
