import {
  DenoLand,
  Https,
  join,
  JsDelivr,
  Package,
  Select,
  toFileUrl,
} from "../deps.ts";
import { loadFile } from "./utils.ts";
import type { DenoConfig, DenoPermissions, Init, LumeConfig } from "../init.ts";
import type { Theme } from "../deps.ts";

const themesUrl = (await JsDelivr.create("lumeland/themes"))
  .at(undefined, "/themes.json");
const themes: Theme[] = await (await fetch(themesUrl)).json();

export default function () {
  return async ({ lume, deno, files, config }: Init) => {
    if (config.theme) {
      const theme = await getTheme(config.theme);

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
  return async ({ deno }: Init) => {
    if (!deno.imports?.["theme/"]) {
      return;
    }

    const themePkg = parsePackage(deno.imports["theme/"]);
    await themePkg.toLatestVersion();
    deno.imports["theme/"] = themePkg.url;
  };
}

async function getTheme(name: string): Promise<Theme | undefined> {
  if (name.startsWith("https://") || name.startsWith(".")) {
    const url = getThemeUrl(name);
    const theme = await (await fetch(url)).json();
    return theme;
  }

  return themes.find((theme: Theme) => theme.id === name);
}

function getThemeUrl(name: string): URL {
  if (name.startsWith("https://")) {
    return new URL(name);
  }

  const url = toFileUrl(Deno.cwd());
  url.pathname = join(url.pathname, name);
  return url;
}

async function setupTheme(
  theme: Theme,
  lume: LumeConfig,
  deno: DenoConfig,
  files: Map<string, string | Uint8Array>,
) {
  const themePkg = await getPackage(theme.module.origin);
  const name = "theme";

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

  // Configure extra permissions
  for (const [key, values] of Object.entries(theme.module.permissions ?? {})) {
    const name = key as keyof DenoPermissions;
    let permissions = deno.permissions?.lume?.[name];

    for (const value of values) {
      if (Array.isArray(permissions)) {
        if (!permissions.includes(value)) {
          permissions.push(value);
        }
        continue;
      }

      if (!permissions) {
        permissions = { allow: [value] };
        continue;
      }

      if (permissions === true) {
        continue;
      }

      if (!permissions.allow) {
        permissions.allow = [value];
        continue;
      }

      if (permissions.allow === true) {
        continue;
      }

      if (!permissions.allow.includes(value)) {
        permissions.allow.push(value);
      }
    }

    deno.permissions ??= {};
    deno.permissions.lume ??= {};
    // @ts-ignore: ts is not clever enough
    deno.permissions.lume[name] = permissions;
  }

  // Configure the CMS
  if (theme.module.cms) {
    const name = lume.file.endsWith(".js") ? "/_cms.js" : "/_cms.ts";
    const url = `theme${theme.module.cms}`;

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

async function getPackage(url: string): Promise<Package> {
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

  return Https.create(url);
}

function parsePackage(url: string): Package {
  if (DenoLand.regexp.some((r) => r.test(url))) {
    return DenoLand.parse(url);
  }
  if (JsDelivr.regexp.some((r) => r.test(url))) {
    return JsDelivr.parse(url);
  }

  return Https.parse(url);
}
