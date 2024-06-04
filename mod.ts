import { parseArgs } from "./deps.ts";
import { Init, type InitConfig } from "./init.ts";
import config from "./steps/config.ts";
import cms from "./steps/cms.ts";
import start from "./steps/start.ts";
import themes from "./steps/themes.ts";
import save from "./steps/save.ts";
import plugins from "./steps/plugins.ts";
import success from "./steps/success.ts";
import git from "./steps/git.ts";

export default function init(initConfig: InitConfig) {
  const init = new Init(initConfig);

  init.use(start());
  init.use(config());
  init.use(themes());
  init.use(plugins());
  init.use(git());
  init.use(cms());
  init.use(save(), 10);
  init.use(success(), 100);

  return init;
}

export function run(args: string[] = Deno.args) {
  const parsed = parseArgs(args, {
    string: ["src", "theme", "plugins", "version"],
    boolean: ["dev", "help", "no-cms", "cms"],
    alias: { dev: "d", help: "h", version: "v" },
  });

  if (parsed.help) {
    console.log(`
  Usage:
    init.ts [path] [options]

  Options:
    -h, --help        Show this help
    -d, --dev         Use the development version
    -v, --version     The version of Lume to install
    --src             The source directory
    --theme           The theme to install
    --plugins         The plugins to install
    --cms             To install the CMS (use --no-cms to disable)
`);
    Deno.exit();
  }

  const path = parsed._[0] || ".";
  const process = init({
    path: String(path),
    src: parsed.src,
    version: parsed.version,
    theme: parsed.theme,
    dev: parsed.dev,
    cms: parsed.cms || (parsed["no-cms"] ? false : undefined),
    plugins: parsed.plugins ? parsed.plugins.split(",") : undefined,
  });
  process.run();
}

if (import.meta.main) {
  run();
}
