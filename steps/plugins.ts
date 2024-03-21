import { Checkbox, Select } from "../deps.ts";
import type { DenoConfig, Init } from "../init.ts";

export default function () {
  return async ({ deno, lume }: Init) => {
    if (lume.theme) {
      return;
    }

    const usePlugins = await Select.prompt({
      message: "Do you want to install some plugins now?",
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
      hint: "See all available plugins at https://lume.land/plugins/",
    });

    if (usePlugins === "no") {
      return;
    }

    const base = deno.imports?.["lume/"];

    if (!base) {
      return;
    }

    const url = `${base}core/utils/lume_config.ts`;
    const { pluginNames } = await import(url);

    const plugins = await Checkbox.prompt({
      message: "Select the plugins to install",
      options: pluginNames,
      hint: "Use Arrow keys and Space to select. Enter to submit",
    });

    initPlugins(plugins, deno);

    plugins.forEach((name) => {
      lume.plugins.push({ name });
    });
  };
}

function initPlugins(plugins: string[], deno: DenoConfig) {
  // Ensure that jsx and jsx_preact are not used at the same time and are loaded before mdx
  if (plugins.includes("mdx")) {
    const jsx = plugins.indexOf("jsx");
    const jsx_preact = plugins.indexOf("jsx_preact");

    if (jsx !== -1 && jsx_preact !== -1) {
      throw new Error(
        "You can't use both the jsx and jsx_preact plugins at the same time.",
      );
    }

    if (jsx !== -1) {
      // Ensure jsx is loaded before mdx
      plugins.splice(jsx, 1);
      plugins.unshift("jsx");
    } else if (jsx_preact !== -1) {
      // Ensure jsx_preact is loaded before mdx
      plugins.splice(jsx_preact, 1);
      plugins.unshift("jsx_preact");
    } else {
      // Use jsx by default
      plugins.unshift("jsx");
    }
  }

  if (plugins.includes("jsx")) {
    deno.compilerOptions ||= {};
    deno.compilerOptions.jsx = "react-jsx";
    deno.compilerOptions.jsxImportSource = "npm:react";

    // Add React types:
    deno.compilerOptions.types ||= [];
    deno.compilerOptions.types.push(
      "https://unpkg.com/@types/react@18.2.67/index.d.ts",
    );
  }

  if (plugins.includes("jsx_preact")) {
    deno.compilerOptions ||= {};
    deno.compilerOptions.jsx = "precompile";
    deno.compilerOptions.jsxImportSource = "npm:preact";
  }

  // Ensure that tailwindcss is loaded before postcss
  fixPluginOrder(plugins, "tailwindcss", "postcss");

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
