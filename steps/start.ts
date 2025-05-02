import { colors, lessThan, parse, Select } from "../deps.ts";
import { getLatestGitHubCommit, getLatestVersion, loadJSON } from "./utils.ts";
import type { DenoConfig, Init } from "../init.ts";

const minimum = "2.1.0";
const current = Deno.version.deno;

export default function () {
  return async (init: Init) => {
    const { path, deno, dev, lume, config } = init;

    if (!checkDenoVersion()) {
      return false;
    }

    // Configure the _config file format
    lume.file = config.javascript ? "_config.js" : "_config.ts";

    // Check if the deno config file already exists and load it
    try {
      const config = await loadJSON<DenoConfig>(
        path,
        "deno.json",
        "deno.jsonc",
      );
      if (config) {
        Object.assign(deno, config[1]);
        init.denoFile = config[0];
      }
    } catch {
      // Ignore the error
    }

    // Configure the import map
    const version = config.version
      ? config.version
      : dev
      ? await getLatestGitHubCommit("lumeland/lume")
      : await getLatestVersion("lume", "v3.");

    const ssxVersion = await getLatestVersion("ssx");

    console.log();
    console.log(`Welcome to Lume ${colors.brightGreen(version)}!`);
    console.log();

    lume.version = version;
    configureLume(deno, version, ssxVersion);

    if (config.theme || config.plugins) {
      return;
    }

    config.mode = await Select.prompt({
      message: "What kind of setup do you want?",
      options: [
        {
          name: "Basic",
          value: "basic",
        },
        {
          name: "Basic + plugins",
          value: "plugins",
        },
        {
          name: "Install a theme",
          value: "theme",
        },
      ],
    });
  };
}

export function updateLume() {
  return async ({ deno, dev, lume, config }: Init) => {
    if (!checkDenoVersion()) {
      return;
    }

    const ssxVersion = await getLatestVersion("ssx");
    const version = config.version && !dev
      ? config.version
      : dev
      ? await getLatestGitHubCommit("lumeland/lume", config.version || "main")
      : await getLatestVersion("lume", "v3.");

    lume.version = version;
    configureLume(deno, version, ssxVersion);
  };
}

function checkDenoVersion(): boolean {
  if (lessThan(parse(current), parse(minimum))) {
    console.log();
    console.log(`Lume needs Deno ${colors.green("v" + minimum)} or greater`);
    console.log(`Your current Deno version is ${colors.red(current)}`);
    console.log(`Run ${colors.cyan("deno upgrade")} and try again`);
    console.log();
    return false;
  }
  return true;
}

function configureLume(deno: DenoConfig, version: string, ssxVersion: string) {
  deno.imports ??= {};

  deno.imports["lume/"] = version.length === 40 // GitHub commit hash
    ? `https://cdn.jsdelivr.net/gh/lumeland/lume@${version}/`
    : `https://deno.land/x/lume@${version}/`;

  deno.imports["lume/jsx-runtime"] =
    `https://deno.land/x/ssx@${ssxVersion}/jsx-runtime.ts`;

  // Configure lume tasks
  deno.tasks ??= {};
  deno.tasks.lume ??= `echo "import 'lume/cli.ts'" | deno run -A -`;
  deno.tasks.lume.replace(" --unstable ", " "); // Remove --unstable flag
  deno.tasks.build ??= "deno task lume";
  deno.tasks.serve ??= "deno task lume -s";

  // Configure the compiler options
  deno.compilerOptions ??= {};
  deno.compilerOptions.types ??= [];
  if (!deno.compilerOptions.types.includes("lume/types.ts")) {
    deno.compilerOptions.types.push("lume/types.ts");
  }
  deno.compilerOptions.jsx ??= "react-jsx";
  deno.compilerOptions.jsxImportSource ??= "lume";

  // Configure the unstable flag
  deno.unstable ??= [];
  if (!deno.unstable.includes("temporal")) {
    deno.unstable.push("temporal");
  }

  // Configure lint
  deno.lint ??= {};
  deno.lint.plugins ??= [];
  const lintUrl = deno.imports["lume/"] + "lint.ts";
  const index = deno.lint.plugins.findIndex((url) =>
    url === "lume/lint.ts" || url.includes("/lume@")
  );

  if (index !== -1) {
    deno.lint.plugins[index] = lintUrl;
  } else {
    deno.lint.plugins.push(lintUrl);
  }
}
