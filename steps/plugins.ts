import { Checkbox } from "../deps.ts";
import type { DenoConfig, Init } from "../init.ts";

export default function () {
  return async ({ deno, lume, config }: Init) => {
    const available = await getAvailablePlugins(deno);

    if (config.plugins) {
      const invalid = config.plugins.filter((name) =>
        !available.includes(name)
      );

      if (invalid.length) {
        throw new Error(
          `The following plugins are not available: ${invalid.join(", ")}`,
        );
      }

      initPlugins(config.plugins, available, deno);
      config.plugins.forEach((name) => lume.plugins.push({ name }));
      return;
    }

    if (config.mode !== "plugins") {
      return;
    }

    const options = [...available];
    options.sort((a, b) => a.localeCompare(b));

    const plugins = await Checkbox.prompt({
      message:
        "Select the plugins to install (More info at https://lume.land/plugins/)",
      options,
      hint: "Use Arrow keys and Space to select. Enter to submit",
    });

    initPlugins(plugins, available, deno);

    plugins.forEach((name) => {
      lume.plugins.push({ name });
    });
  };
}

async function getAvailablePlugins(deno: DenoConfig): Promise<string[]> {
  const base = deno.imports?.["lume/"];

  if (!base) {
    return [];
  }

  const url = `${base}core/utils/lume_config.ts`;
  const { pluginNames } = await import(url);

  return pluginNames;
}

function initPlugins(plugins: string[], available: string[], deno: DenoConfig) {
  // Add transform_images if picture is selected
  if (plugins.includes("picture") && !plugins.includes("transform_images")) {
    plugins.push("transform_images");
  }

  // Sort plugins by their order in available
  // This is important for plugins that depend on others
  // like transform_images and picture
  plugins.sort((a, b) => available.indexOf(a) - available.indexOf(b));

  // Google fonts plugin needs net access to fetch the CSS
  if (plugins.includes("google_fonts")) {
    if (Array.isArray(deno.permissions?.net)) {
      deno.permissions.net.push(["fonts.googleapis.com", "fonts.gstatic.com"]);
    }
  }
}
