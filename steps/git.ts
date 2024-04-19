import type { Init } from "../init.ts";

export default function () {
  return ({ files }: Init) => {
    const paths = [
      ".git",
      ".gitignore",
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
