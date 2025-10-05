import { parseArgs } from "./deps.ts";
import { Init, type InitConfig } from "./init.ts";
import load from "./steps/load.ts";
import { updateLume } from "./steps/lume.ts";
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
    boolean: ["dev", "help"],
    string: ["version"],
    alias: { dev: "d", version: "v", help: "h" },
  });

  if (parsed.help) {
    console.log(`
  Usage:
    upgrade.ts [options]
  
  Options:
    -h, --help        Show this help
    -d, --dev         Use the development version
    -v, --version     The version of Lume to install
`);
    Deno.exit();
  }

  const path = parsed._[0] || ".";
  const process = init({
    path: String(path),
    dev: parsed.dev,
    version: parsed.version,
  });
  process.run();
}

if (import.meta.main) {
  run();
}
