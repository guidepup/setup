import { Command } from "commander";
import {
  handleInstallComplete,
  handleInstallError,
  handleNoInstallation,
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

    targets = selectTargets(manifest, requestedScreenReaderIds);

    if (targets.length === 0) {
      handleNoInstallation();
    }

    const cachePath = resolveCachePath();
    await downloadAssets(cachePath, targets);
  } catch (error) {
    handleInstallError(error);
  }

  handleInstallComplete();
}

export function installCommand() {
  return new Command("install")
    .description("Install screen readers.")
    .argument("[screenReaders...]", "Screen readers to install")
    .action(install);
}
