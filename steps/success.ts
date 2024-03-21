import { colors } from "../deps.ts";
import type { Init } from "../init.ts";

const { brightGreen, gray, bold } = colors;

export default function () {
  return ({ path, deno, lume }: Init) => {
    const message = [
      "",
      "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥",
      "",
      bold("  BENVIDO - WELCOME! 🎉🎉🎉"),
      "",
      "  Lume has configured successfully!",
      "",
      "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥",
      "",
    ];

    message.push(bold("Quick start:"));

    if (path !== ".") {
      message.push(
        `  - Enter in the project directory: ${brightGreen(`cd ${path}`)}`,
      );
    }

    message.push(
      `  - Run ${brightGreen("deno task serve")} to start a local server`,
    );

    if (deno.tasks?.cms) {
      message.push(
        `  - Or run ${
          brightGreen("deno task cms")
        } to start the server with the CMS`,
      );
    }

    message.push("");
    message.push(`  See ${gray("https://lume.land")} for online documentation`);
    message.push(
      `  See ${
        gray("https://discord.gg/YbTmpACHWB")
      } to propose new ideas and get help at Discord`,
    );
    message.push(
      `  See ${
        gray("https://github.com/lumeland/lume")
      } to view the source code and report issues`,
    );
    message.push(
      `  See ${
        gray("https://opencollective.com/lume")
      } to support Lume development`,
    );

    if (lume.theme) {
      message.push("");
      message.push(bold("Theme configured:"));
      message.push(`  ${brightGreen(lume.theme.name)}`);
      message.push(`  ${lume.theme.description}`);
      message.push(
        `  See ${
          gray(lume.theme.repo)
        } to view the source code and report issues`,
      );
    }

    console.log(message.join("\n"));
  };
}
