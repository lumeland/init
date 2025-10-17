import { colors, JsDelivr, lessThan, parse, Select } from "../deps.ts";
import { getLatestGitHubCommit, loadJSON } from "./utils.ts";
import type { Package } from "../deps.ts";
import type { DenoConfig, Init, Task } from "../init.ts";

const minimum = "2.4.0";
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
    const lumePkg = await getLumePackage(dev, config.version);

    console.log();
    console.log(`Welcome to Lume ${colors.brightGreen(lumePkg.version)}!`);
    console.log();

    lume.version = lumePkg.version;
    configureLume(deno, lumePkg, await JsDelivr.create("oscarotero/ssx"));

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

    const lumePkg = await getLumePackage(dev, config.version);
    lume.version = lumePkg.version;
    configureLume(deno, lumePkg, await JsDelivr.create("oscarotero/ssx"));
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

function configureLume(deno: DenoConfig, lume: Package, ssx: Package) {
  deno.imports ??= {};

  deno.imports["lume/"] = lume.at(undefined, "/");
  deno.imports["lume/jsx-runtime"] = ssx.at(undefined, "/jsx-runtime.ts");

  // Configure permissions
  const supportedPermissions = !lessThan(parse(current), parse("2.5.0"));

  if (supportedPermissions) {
    deno.permissions ??= {};
    deno.permissions.lume ??= {
      read: true,
      write: ["./"],
      "import": [
        "cdn.jsdelivr.net:443",
        "jsr.io:443",
        "deno.land:443",
      ],
      net: [
        "0.0.0.0",
        "jsr.io:443",
        "cdn.jsdelivr.net:443",
        "data.jsdelivr.com:443",
        "registry.npmjs.org:443",
      ],
      env: true,
      run: true,
      ffi: true,
      sys: true,
    };
  }
  const lumeTask = supportedPermissions
    ? "deno run -P=lume lume/cli.ts"
    : "deno run -A lume/cli.ts";

  // Configure lume tasks
  deno.tasks ??= {};
  deno.tasks.lume ??= lumeTask;
  deno.tasks.lume = toTask(deno.tasks.lume, "Run Lume command");

  // Update old task -> echo "import 'lume/cli.ts'" | deno run -A lume/cli.ts
  if (deno.tasks.lume.command.startsWith("echo ")) {
    deno.tasks.lume.command = lumeTask;
  }
  deno.tasks.build ??= "deno task lume";
  deno.tasks.serve ??= "deno task lume -s";

  deno.tasks.build = toTask(deno.tasks.build, "Build the site for production");
  deno.tasks.serve = toTask(
    deno.tasks.serve,
    "Run and serve the site for development",
  );

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
  if (!deno.unstable.includes("fmt-component")) {
    deno.unstable.push("fmt-component");
  }

  // Configure lint plugins
  deno.lint ??= {};
  deno.lint.plugins ??= [];
  const lintUrl = lume.at(undefined, "/lint.ts");
  const index = deno.lint.plugins.findIndex((url) =>
    url === "lume/lint.ts" || url.includes("/lume@")
  );

  if (index !== -1) {
    deno.lint.plugins[index] = lintUrl;
  } else {
    deno.lint.plugins.push(lintUrl);
  }

  // Configure lint rules
  deno.lint.rules ??= {};
  deno.lint.rules.exclude ??= [];
  if (!deno.lint.rules.exclude.includes("no-import-prefix")) {
    deno.lint.rules.exclude.push("no-import-prefix");
  }

  // Disable lock file by default to avoid issues with different versions
  deno.lock ??= false;
}

function toTask(task: string | Task, description?: string): Task {
  if (typeof task === "string") {
    return { description, command: task };
  }
  if (description && !task.description) {
    task.description = description;
  }
  return task;
}

async function getLumePackage(
  dev: boolean,
  version?: string,
): Promise<Package> {
  const lumePkg = await JsDelivr.create("lumeland/lume");

  if (dev) {
    lumePkg.version = await getLatestGitHubCommit(
      "lumeland/lume",
      version || "main",
    );
    return lumePkg;
  }

  if (version) {
    lumePkg.version = version;
  }
  return lumePkg;
}
