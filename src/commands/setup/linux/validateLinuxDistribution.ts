import { ERR_SETUP_LINUX_UNSUPPORTED_DISTRIBUTION } from "../../../errors";
import type { LinuxDistribution } from "./getLinuxDistribution";

export function validateLinuxDistribution({
  id,
  versionId,
}: LinuxDistribution): void {
  const version = parseInt(versionId.split(".")[0]);

  const supported =
    (id === "ubuntu" && version >= 26) || (id === "debian" && version >= 13);

  if (!supported) {
    throw new Error(
      `${ERR_SETUP_LINUX_UNSUPPORTED_DISTRIBUTION}\n\n\tID: ${id}\n\tVERSION: ${version}`,
    );
  }
}
