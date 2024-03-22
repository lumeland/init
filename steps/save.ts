import { colors, dirname, ensureDir, join } from "../deps.ts";
import type { Init, LumeConfig } from "../init.ts";

export default function () {
  return async ({ path, lume, deno, files }: Init) => {
    await ensureDir(path);

    // Save Deno configuration file
    const content = JSON.stringify(deno, null, 2);
    const denoFile = join(path, "deno.json");

    await Deno.writeTextFile(denoFile, content);
    console.log("File saved:", colors.gray(denoFile));

    // Save Lume configuration file
    const code = renderLumeConfig(lume);
    const lumeFile = join(path, lume.file);

    await Deno.writeTextFile(lumeFile, code);
    console.log("File saved:", colors.gray(lumeFile));

    // Save additional files
    for (const [file, content] of files) {
      const filePath = join(path, file);
      await ensureDir(dirname(filePath));

      if (typeof content === "string") {
        await Deno.writeTextFile(filePath, content);
      } else {
        await Deno.writeFile(filePath, content);
      }

      console.log("File saved:", colors.gray(filePath));
    }
  };
}

function renderLumeConfig({ src, plugins }: LumeConfig): string {
  const code = [`import lume from "lume/mod.ts";`];

  for (const { name, url } of plugins) {
    if (!url) {
      code.push(`import ${name} from "lume/plugins/${name}.ts";`);
    } else {
      code.push(`import ${name} from "${url}";`);
    }
  }

  code.push("");
  if (src) {
    code.push(`const site = lume({ src: "${src}" });`);
  } else {
    code.push("const site = lume();");
  }

  if (plugins.length) {
    code.push("");

    for (const { name } of plugins) {
      code.push(`site.use(${name}());`);
    }
  }

  code.push("");
  code.push("export default site;");
  code.push("");

  return code.join("\n");
}
