import chalk from "chalk";

export const logInfo = console.info.bind(console);
export const logWarn = console.warn.bind(console);
export const logError = console.error.bind(console);

export function handleInstallComplete(): never {
  logInfo("");
  logInfo(chalk.green("Installation complete 🎉"));
  logInfo("");

  process.exit(0);
}

export function handleSetupComplete(): never {
  logInfo("");
  logInfo(chalk.green("Environment setup complete 🎉"));
  logInfo("");

  process.exit(0);
}

export function handleSetupManualRequired(): void {
  logInfo(
    "Please complete remaining setup by following this guide:\n\n--> " +
      chalk.underline(
        chalk.bold(
          "https://www.guidepup.dev/docs/guides/manual-voiceover-setup",
        ),
      ),
  );
}

export function handleWarning(title: string, subtitle: string): void {
  logWarn("");
  logWarn(chalk.bold(chalk.yellow(`[!] Warning: ${chalk.bold(title)}`)));
  logWarn("");
  logWarn(subtitle);
  logError("");
}

export function handleInstallError(err: Error): never {
  let message = err.message;

  if (err.name) {
    message = `${err.name}: ${message}`;
  }

  logError("");
  logError(chalk.bold(chalk.red(`[!] ${chalk.bold(message.toString())}`)));
  logError("");
  logError("Unable to complete screen reader installation");
  logError("");
  logError(
    chalk.dim(
      "Please raise new issues at: " +
        chalk.underline("https://github.com/guidepup/setup/issues"),
    ),
  );
  logError("");

  process.exit(1);
}

export function handleSetupError(err: Error): never {
  let message = err.message;

  if (err.name) {
    message = `${err.name}: ${message}`;
  }

  logError("");
  logError(chalk.bold(chalk.red(`[!] ${chalk.bold(message.toString())}`)));
  logError("");
  logError("Unable to complete environment setup");
  logError("");
  logError(
    chalk.dim(
      "Please raise new issues at: " +
        chalk.underline("https://github.com/guidepup/setup/issues"),
    ),
  );
  logError("");

  process.exit(1);
}
