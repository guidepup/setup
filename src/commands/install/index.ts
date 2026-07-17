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
import { registerInstallation } from "./register-installation";
import { pruneCache } from "./prune-cache";

async function install(requestedScreenReaderIds?: string[]): Promise<void> {
  let targets: ScreenReader[];

  try {
    const { manifestPath, manifest } = resolveManifest();

    const cachePath = resolveCachePath();
    await registerInstallation(cachePath, manifestPath);

    targets = selectTargets(manifest, requestedScreenReaderIds);

    if (targets.length === 0) {
      handleNoInstallation();
    }

    await downloadAssets(cachePath, targets);

    await pruneCache(cachePath);
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
