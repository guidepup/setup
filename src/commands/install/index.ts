import { Command } from "commander";

export function installCommand() {
  return new Command("install")
    .description("Install screen readers.")
    .argument("[screenreader]", "screen readers to install")
    .action((screenreader?: string) => {
      console.log("TODO", { screenreader });
    });
}
