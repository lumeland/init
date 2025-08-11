import { DenoLand, join, JsDelivr, Package, Select } from "../deps.ts";
import { loadFile } from "./utils.ts";
import type { DenoConfig, Init, LumeConfig, Theme } from "../init.ts";

const themes: Theme[] =
  (await (await fetch("https://lumeland.github.io/themes/themes.json")).json())
    .filter(
      (theme: Theme) => theme.lume_version === 3,
    );

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

    if (config.mode !== "theme") {
      return;
    }

    const options = themes.map((theme: Theme, key: number) => ({
      name: theme.name,
      value: String(key),
    }));

    // Sort themes by name
    options.sort((a, b) => a.name.localeCompare(b.name));

    const themeKey = await Select.prompt({
      message: "Select a theme (More info at https://lume.land/themes/)",
      options,
    });

    const theme = themes[Number(themeKey)];
    await setupTheme(theme, lume, deno, files);
  };
}

export function updateTheme() {
  return async ({ lume, deno, files }: Init) => {
    const theme = detectTheme(deno);

    if (theme) {
      await setupTheme(theme, lume, deno, files);
    }
  };
}

function detectTheme(deno: DenoConfig): Theme | undefined {
  const { imports } = deno;

  if (!imports) {
    return;
  }

  for (const theme of themes) {
    const origin = theme.module.origin;

    for (const key in imports) {
      if (imports[key].startsWith(origin)) {
        return theme;
      }
    }
  }
}

async function setupTheme(
  theme: Theme,
  lume: LumeConfig,
  deno: DenoConfig,
  files: Map<string, string | Uint8Array>,
) {
  const themePkg = await resolveOrigin(theme.module.origin);
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
  deno.imports[`${name}/`] = themePkg.at(undefined, "/");

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
        deno.imports[key] = themePkg.at(undefined, value.substring(1));
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
  const srcdir = theme.module.srcdir ?? "";
  for (const file of theme.module.src ?? []) {
    files.set(
      lume.src + file,
      await loadFile(themePkg.at(undefined, join("/", srcdir, file))),
    );
  }
}

async function resolveOrigin(url: string): Promise<Package> {
  const denoland = url.match(/^https:\/\/deno.land\/x\/([^\/]+)$/);

  if (denoland) {
    const [, name] = denoland;
    return await DenoLand.create(name);
  }

  const jsdelivr = url.match(
    /^https:\/\/cdn\.jsdelivr\.net\/gh\/([^\/]+\/[^\/]+)$/,
  );
  if (jsdelivr) {
    const [, name] = jsdelivr;
    return await JsDelivr.create(name);
  }

  throw new Error(`Could not resolve origin for ${url}`);
}
