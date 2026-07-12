import { Command } from "commander";
import {
  handleInstallComplete,
  handleInstallError,
  logInfo,
} from "../../logging";
import {
  type InstallTarget,
  resolveGuidepupManifest,
  selectInstallTargets,
} from "./manifest";

async function install(screenreader?: string): Promise<void> {
  let targets: InstallTarget[];

  console.log({ screenreader });

  try {
    const manifest = resolveGuidepupManifest();

    console.log({ manifest });

    targets = selectInstallTargets(manifest, screenreader);
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
    .argument("[screenreader]", "screen readers to install")
    .action(install);
}
