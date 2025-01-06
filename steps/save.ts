import { colors, dirname, ensureDir, join } from "../deps.ts";
import type { Init, LumeConfig } from "../init.ts";

export default function () {
  return async ({ path, lume, deno, files }: Init) => {
    // Save Deno configuration file
    const content = JSON.stringify(deno, null, 2) + "\n";
    await writeFile(join(path, "deno.json"), content);

    // Save Lume configuration file
    const code = renderLumeConfig(lume);
    await writeFile(join(path, lume.file), code);

    // Save additional files
    for (const [file, content] of files) {
      await writeFile(join(path, file), content);
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
  if (join("/", src) !== "/") {
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

async function writeFile(path: string, content: string | Uint8Array): Promise<void> {
  try {
    await Deno.stat(path);
    const override = confirm(`File ${colors.gray(path)} already exists. Overwrite it?`);
    if (!override) {
      return;
    }
  } catch {
    // File does not exist
  }

  await ensureDir(dirname(path));

  if (typeof content === "string") {
    return await Deno.writeTextFile(path, content);
  }
  
  await Deno.writeFile(path, content);
  console.log("File saved:", colors.gray(path));
}