import { Init } from "./init.ts";
import config from "./steps/config.ts";
import cms from "./steps/cms.ts";
import version from "./steps/version.ts";
import themes from "./steps/themes.ts";
import save from "./steps/save.ts";
import plugins from "./steps/plugins.ts";
import success from "./steps/success.ts";

export default function init(path = ".") {
  const init = new Init(path);

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
  const path = Deno.args[0] || ".";
  const process = init(path);
  process.run();
}
