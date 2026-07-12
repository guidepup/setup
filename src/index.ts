import { Command } from "commander";
import { setupCommand } from "./commands/setup";
import { installCommand } from "./commands/install";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { version } = require("../package.json");

function createProgram(): Command {
  const program = new Command();

  program
    .name("guidepup")
    .description(
      "Configure the local environment and manage screen readers for Guidepup.",
    )
    .version(version, "-v, --version", "Display the CLI version.");

  program.addCommand(setupCommand());

  program.addCommand(installCommand());

  return program;
}

createProgram().parseAsync(process.argv);
