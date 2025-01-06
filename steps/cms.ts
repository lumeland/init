import { Select } from "../deps.ts";
import { getLatestGitHubCommit, getLatestGitHubTag } from "./utils.ts";
import type { DenoConfig, Init } from "../init.ts";

export default function () {
  return async ({ lume, deno, files, dev, config }: Init) => {
    const hasCms = files.has("/_cms.ts") || files.has("/_cms.js");

    if (hasCms) {
      await configureCms(deno, dev);
      return;
    }

    if (lume.theme || config.cms === false) {
      return;
    }

    if (config.cms === undefined) {
      const useCms = await Select.prompt({
        message:
          "Do you want to setup a CMS? (More info at https://lume.land/cms/)",
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
      });

      if (useCms !== "yes") {
        return;
      }
    }

    const file = config.javascript ? "_cms.js" : "_cms.ts";
    const content = [
      'import lumeCMS from "lume/cms/mod.ts";',
      "",
      "const cms = lumeCMS();",
      "",
      "export default cms;",
      "",
    ].join("\n");

    files.set(file, content);
    await configureCms(deno, dev);
  };
}

export function updateCms() {
  return async ({ deno, dev }: Init) => {
    if (!deno.tasks?.cms) {
      return;
    }

    await configureCms(deno, dev);
  };
}

async function configureCms(deno: DenoConfig, dev: boolean) {
  deno.tasks ??= {};
  deno.tasks.cms = `deno task lume cms`;

  const version = dev
    ? await getLatestGitHubCommit("lumeland/cms")
    : await getLatestGitHubTag("lumeland/cms");
  deno.imports ??= {};
  deno.imports["lume/cms/"] =
    `https://cdn.jsdelivr.net/gh/lumeland/cms@${version}/`;
}
