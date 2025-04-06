import { Checkbox } from "../deps.ts";
import type { DenoConfig, Init } from "../init.ts";

export default function () {
  return async ({ deno, lume, config }: Init) => {
    if (config.plugins) {
      const available = await getAvailablePlugins(deno);
      const invalid = config.plugins.filter((name) =>
        !available.includes(name)
      );

      if (invalid.length) {
        throw new Error(
          `The following plugins are not available: ${invalid.join(", ")}`,
        );
      }
      initPlugins(config.plugins);
      config.plugins.forEach((name) => {
        lume.plugins.push({ name });
      });
      return;
    }

    if (config.mode !== "plugins") {
      return;
    }

    const plugins = await Checkbox.prompt({
      message:
        "Select the plugins to install (More info at https://lume.land/plugins/)",
      options: await getAvailablePlugins(deno),
      hint: "Use Arrow keys and Space to select. Enter to submit",
    });

    initPlugins(plugins);

    plugins.forEach((name) => {
      lume.plugins.push({ name });
    });
  };
}

async function getAvailablePlugins(deno: DenoConfig) {
  const base = deno.imports?.["lume/"];

  if (!base) {
    return [];
  }

  const url = `${base}core/utils/lume_config.ts`;
  const { pluginNames } = await import(url);

  return pluginNames;
}

function initPlugins(plugins: string[]) {
  // Ensure that picture is loaded before transform_images
  fixPluginOrder(plugins, "picture", "transform_images");
}

function fixPluginOrder(plugins: string[], plugin1: string, plugin2: string) {
  if (plugins.includes(plugin1)) {
    const pos1 = plugins.indexOf(plugin1);
    const pos2 = plugins.indexOf(plugin2);

    if (pos2 === -1) {
      plugins.splice(pos1 + 1, 0, plugin2);
      return;
    }

    if (pos1 > pos2) {
      plugins[pos2] = plugin1;
      plugins[pos1] = plugin2;
    }
  }
}
