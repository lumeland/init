import { Select } from "../deps.ts";
import { loadFile, resolveOrigin } from "./utils.ts";
import type { DenoConfig, Init, LumeConfig, Theme } from "../init.ts";

const themes: Theme[] =
  await (await fetch("https://lumeland.github.io/themes/themes.json")).json();

export default function () {
  return async ({ lume, deno, files, config }: Init) => {
    if (config.theme) {
      const theme = themes.find((theme: Theme) => theme.id === config.theme);

      if (theme) {
        await setupTheme(theme, lume, deno, files);
        return;
      }

      console.error(`Theme "${config.theme}" not found`);
      return false;
    }

    const useTheme = await Select.prompt({
      message: "Do you want to setup a theme?",
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
      hint: "More info at https://lume.land/themes/",
    });

    if (useTheme !== "yes") {
      return;
    }

    const options = themes.map((theme: Theme, key: number) => ({
      name: theme.name,
      value: String(key),
    }));

    const themeKey = await Select.prompt({
      message: "Select a theme",
      options,
    });

    const theme = themes[Number(themeKey)];
    await setupTheme(theme, lume, deno, files);
  };
}

async function setupTheme(
  theme: Theme,
  lume: LumeConfig,
  deno: DenoConfig,
  files: Map<string, string | Uint8Array>,
) {
  const origin = await resolveOrigin(theme.module.origin);
  const name = theme.module.name;

  // Configure Lume
  lume.theme = theme;
  lume.plugins ??= [];
  lume.plugins.push({
    name,
    url: `${name}${theme.module.main}`,
  });

  // Configure the import map
  deno.imports ??= {};
  deno.imports[`${name}/`] = `${origin}/`;

  // Configure the CMS
  if (theme.module.cms) {
    const name = theme.module.cms.endsWith(".ts") ? "/_cms.ts" : "/_cms.js";
    files.set(name, await loadFile(origin + theme.module.cms));
  }

  // Configure extra files
  const srcdir = theme.module.srcdir ?? "/src";
  for (const file of theme.module.src ?? []) {
    files.set(lume.src + file, await loadFile(origin + srcdir + file));
  }
}
