import { Select } from "../deps.ts";
import type { DenoConfig, Init } from "../init.ts";

export default function () {
  return async ({ lume, deno, files }: Init) => {
    const hasCms = files.has("/_cms.ts") || files.has("/_cms.js");

    if (hasCms) {
      createCmsTask(deno);
      return;
    }

    const useCms = await Select.prompt({
      message: "Do you want to setup a CMS?",
      options: [
        {
          name: "Yes",
          value: "yes",
        },
        {
          name: "Maybe later",
          value: "no",
        },
      ],
      hint: "More info at https://lume.land/cms/",
    });

    if (useCms !== "yes") {
      return;
    }

    const file = lume.file.endsWith(".ts") ? "_cms.ts" : "_cms.js";
    const content = [
      'import lumeCMS from "lume/cms.ts";',
      "",
      "const cms = lumeCMS();",
      "",
      "export default cms;",
      "",
    ].join("\n");

    files.set(file, content);
    createCmsTask(deno);
  };
}

function createCmsTask(config: DenoConfig) {
  config.tasks ??= {};
  config.tasks.cms = `deno task lume cms`;
}
