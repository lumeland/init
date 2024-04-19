import type { Init } from "../init.ts";

export default function() {
  return ({ files }: Init) => {
    const paths = [
      "# Ignore IDEA settings \n .vscode \n .idea \n",
      "# Ignore the output directory \n _site \n",
      "# Ignore the cache directory \n _cache \n",
    ];

    if (Deno.build.os === "darwin") {
      paths.push(".DS_Store");
    }

    files.set(
      ".gitignore",
      paths.join("\n") + "\n",
    );
  };
}
