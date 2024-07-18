import { colors } from "../deps.ts";
import type { Init } from "../init.ts";

const { brightGreen, gray, bold } = colors;

export default function () {
  return ({ path, deno, lume }: Init) => {
    const message = [
      "",
      "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥",
      "",
      bold("  BENVIDO - WELCOME! 🎉🎉🎉"),
      "",
      "  Lume has been configured successfully!",
      lume.theme ? `  Theme installed: ${lume.theme.name}\n` : "",
      "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥",
      "",
    ];

    message.push(bold("Quick start:"));
    message.push("");

    if (path !== ".") {
      message.push(
        `  ${brightGreen(`cd ${path}`)} to enter in the project directory`,
      );
    }

    message.push(
      `  ${brightGreen("deno task serve")} to start a local server`,
    );

    if (deno.tasks?.cms) {
      message.push(
        `  ${brightGreen("deno task cms")} to start the CMS`,
      );
    }

    message.push("");
    message.push(`See ${gray("https://lume.land")} for online documentation`);
    message.push(
      `See ${
        gray("https://discord.gg/YbTmpACHWB")
      } to propose new ideas and get help at Discord`,
    );
    message.push(
      `See ${
        gray("https://github.com/lumeland/lume")
      } to view the source code and report issues`,
    );
    if (lume.theme) {
      message.push(
        `See ${
          gray(lume.theme.repo)
        } to view the theme source code and report issues`,
      );
    }
    message.push(
      `See ${
        gray("https://opencollective.com/lume")
      } to support Lume development`,
    );

    console.log(message.join("\n"));
  };
}
