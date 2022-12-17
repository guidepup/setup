import { execSync } from "child_process";

if (process.platform === "darwin") {
  try {
    execSync(
      `"/Library/Application Support/VMware Tools/vmware-resolutionSet" 1920 1080`
    );
  } catch (_) {
    // swallow
  }
}
