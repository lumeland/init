import { Select } from "../deps.ts";
import { getLatestGitHubTag } from "./utils.ts";
import type { DenoConfig, Init } from "../init.ts";

export default function () {
  return async ({ lume, deno, files }: Init) => {
    const hasCms = files.has("/_cms.ts") || files.has("/_cms.js");

    if (hasCms) {
      await configureCms(deno);
      return;
    }

    if (lume.theme) {
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
          name: "No",
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
      'import lumeCMS from "lume/cms/mod.ts";',
      "",
      "const cms = lumeCMS();",
      "",
      "export default cms;",
      "",
    ].join("\n");

    files.set(file, content);
    await configureCms(deno);
  };
}

async function configureCms(deno: DenoConfig) {
  deno.tasks ??= {};
  deno.tasks.cms = `deno task lume cms`;

  const version = await getLatestGitHubTag("lumeland/cms");
  deno.imports ??= {};
  deno.imports["lume/cms/"] =
    `https://cdn.jsdelivr.net/gh/lumeland/cms@${version}/`;
}
