import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ERR_INSTALL_FAILED_TO_REGISTER_INSTALLATION } from "../../errors";

export async function registerInstallation(
  cachePath: string,
  manifestPath: string,
): Promise<void> {
  const linksPath = join(cachePath, ".links");

  try {
    await mkdir(linksPath, { recursive: true });

    const id = createHash("sha256").update(manifestPath).digest("hex");
    const linkPath = join(linksPath, id);

    await writeFile(linkPath, manifestPath, "utf8");
  } catch (cause) {
    throw new Error(ERR_INSTALL_FAILED_TO_REGISTER_INSTALLATION, {
      cause,
    });
  }
}
