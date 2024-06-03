import { parseArgs } from "./deps.ts";
import { Init, type InitConfig } from "./init.ts";
import load from "./steps/load.ts";
import { updateLume } from "./steps/start.ts";
import { updateCms } from "./steps/cms.ts";
import { updateTheme } from "./steps/themes.ts";
import update from "./steps/update.ts";

export default function init(initConfig: InitConfig) {
  const init = new Init(initConfig);

  init.use(load());
  init.use(updateLume());
  init.use(updateCms());
  init.use(updateTheme());
  init.use(update());

  return init;
}

export function run(args: string[] = Deno.args) {
  const parsed = parseArgs(args, {
    boolean: ["dev"],
    alias: { dev: "d" },
  });

  const path = parsed._[0] || ".";
  const process = init({
    path: String(path),
    dev: parsed.dev,
  });
  process.run();
}

if (import.meta.main) {
  run();
}
