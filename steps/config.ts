import { Select } from "../deps.ts";
import type { Init } from "../init.ts";

export default function () {
  return async ({ lume }: Init) => {
    const file = await Select.prompt({
      message: "Choose the configuration file format",
      options: [
        {
          name: "_config.ts (TypeScript)",
          value: "_config.ts",
        },
        {
          name: "_config.js (JavaScript)",
          value: "_config.js",
        },
      ],
    });

    lume.file = file;
  };
}
