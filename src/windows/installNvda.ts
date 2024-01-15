import decompress from "decompress";
import { get } from "https";
import { createWriteStream, mkdirSync, mkdtempSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { ERR_WINDOWS_FAILED_TO_INSTALL_NVDA } from "../errors";
import { GUIDEPUP_NVDA_VERSION } from "./constants";

const appName = "guidepup_nvda";
const sourceUrl = `https://codeload.github.com/guidepup/nvda/zip/refs/tags/${GUIDEPUP_NVDA_VERSION}`;

export async function installNvda({
  userProvidedInstallDirectory,
}: {
  userProvidedInstallDirectory: string;
}): Promise<string> {
  if (userProvidedInstallDirectory) {
    mkdirSync(userProvidedInstallDirectory, { recursive: true });
  }

  const destinationBaseDirectory =
    userProvidedInstallDirectory ?? mkdtempSync(join(tmpdir(), `${appName}_`));
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
  } catch (e) {
    removeAll();

    throw new Error(`${ERR_WINDOWS_FAILED_TO_INSTALL_NVDA}\n\n${e.message}`);
  }

  return join(
    destinationBaseDirectory,
    `nvda-${GUIDEPUP_NVDA_VERSION}`,
    "nvda"
  );
}
