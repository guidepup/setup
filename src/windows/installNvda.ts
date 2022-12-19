import decompress from "decompress";
import { get } from "https";
import { createWriteStream, mkdtempSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { ERR_WINDOWS_FAILED_TO_INSTALL_NVDA } from "../errors";

const appName = "guidepup_nvda";
const sourceUrl = `https://raw.githubusercontent.com/guidepup/setup/main/downloads/${appName}.zip`;

export async function installNvda(): Promise<string> {
  const destinationBaseDirectory = mkdtempSync(join(tmpdir(), `${appName}_`));
  const destinationDirectory = join(destinationBaseDirectory, appName);
  const destinationZip = join(destinationBaseDirectory, `${appName}.zip`);
  const fileZip = createWriteStream(destinationZip);

  function removeAll() {
    try {
      rmSync(destinationBaseDirectory, { recursive: true });
    } catch {
      // swallow
    }
  }

  function removeZip() {
    try {
      rmSync(destinationZip, { recursive: true });
    } catch {
      // swallow
    }
  }

  try {
    await new Promise<void>((resolve, reject) => {
      function onSuccess() {
        fileZip.close((error) => {
          if (error) {
            return reject(error);
          }

          resolve();
        });
      }

      const request = get(sourceUrl, (response) => response.pipe(fileZip));
      request.on("error", reject);
      fileZip.on("finish", onSuccess);
      fileZip.on("error", reject);
    });

    await decompress(destinationZip, destinationBaseDirectory);

    removeZip();
  } catch {
    removeAll();

    throw new Error(ERR_WINDOWS_FAILED_TO_INSTALL_NVDA);
  }

  return destinationDirectory;
}
