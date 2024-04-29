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

    if (config.plugins) {
      return;
    }

    const useTheme = await Select.prompt({
      message:
        "Do you want to setup a theme? (More info at https://lume.land/themes/)",
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

    if (useTheme !== "yes") {
      return;
    }

    const options = themes.map((theme: Theme, key: number) => ({
      name: theme.name,
      value: String(key),
    }));

    // Sort themes by name
    options.sort((a, b) => a.name.localeCompare(b.name));

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

  // Configure the unstable APIs
  if (theme.module.unstable?.length) {
    deno.unstable ??= [];
    deno.unstable = [...new Set([...deno.unstable, ...theme.module.unstable])];
  }

  // Configure the compiler options
  if (theme.module.compilerOptions) {
    deno.compilerOptions ??= {};
    deno.compilerOptions = {
      ...deno.compilerOptions,
      ...theme.module.compilerOptions,
    };
  }

  // Configure extra imports
  if (theme.module.imports) {
    for (const [key, value] of Object.entries(theme.module.imports)) {
      if (value.startsWith(".")) {
        deno.imports[key] = `${origin}${value.substring(1)}`;
        continue;
      }
      deno.imports[key] = value;
    }
  }

  // Configure the CMS
  if (theme.module.cms) {
    const name = lume.file.endsWith(".js") ? "/_cms.js" : "/_cms.ts";
    const url = theme.module.name + theme.module.cms;

    files.set(
      name,
      [
        `import cms from "${url}";`,
        "",
        "export default cms;",
        "",
      ].join("\n"),
    );
  }

  // Configure extra files
  const srcdir = theme.module.srcdir ?? "/src";
  for (const file of theme.module.src ?? []) {
    files.set(lume.src + file, await loadFile(origin + srcdir + file));
  }
}
