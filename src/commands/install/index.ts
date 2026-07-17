import { Command } from "commander";
import {
  handleInstallComplete,
  handleInstallError,
  logInfo,
} from "../../logging";
import { selectTargets } from "./select-targets";
import { resolveManifest } from "./resolve-manifest";
import type { ScreenReader } from "./types";
import { resolveCachePath } from "./resolve-cache-path";
import { downloadAssets } from "./download-assets";

async function install(requestedScreenReaderIds?: string[]): Promise<void> {
  let targets: ScreenReader[];

  try {
    const manifest = resolveManifest();
    const cachePath = resolveCachePath();

    targets = selectTargets(manifest, requestedScreenReaderIds);

    await downloadAssets(cachePath, targets);
  } catch (error) {
    handleInstallError(error);
  }

  if (targets.length === 0) {
    logInfo("No installable screen readers were found for this environment");
  } else {
    logInfo(
      `Resolved ${targets.length} install target(s): ${targets.map((target) => target.name).join(", ")}`,
    );
  }

  handleInstallComplete();
}

export function installCommand() {
  return new Command("install")
    .description("Install screen readers.")
    .argument("[screenReaders...]", "Screen readers to install")
    .action(install);
}
