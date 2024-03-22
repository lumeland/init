import { parseArgs } from "./deps.ts";
import { Init } from "./init.ts";
import config from "./steps/config.ts";
import cms from "./steps/cms.ts";
import version from "./steps/version.ts";
import themes from "./steps/themes.ts";
import save from "./steps/save.ts";
import plugins from "./steps/plugins.ts";
import success from "./steps/success.ts";

export default function init(path: string, src: string) {
  const init = new Init(path, src);

  init.use(version());
  init.use(config());
  init.use(themes());
  init.use(plugins());
  init.use(cms());
  init.use(save(), 10);
  init.use(success(), 100);

  return init;
}

if (import.meta.main) {
  const args = parseArgs(Deno.args, {
    string: ["src"],
  });
  const path = args._[0] || ".";
  const src = args.src || "";
  const process = init(String(path), src);
  process.run();
}
