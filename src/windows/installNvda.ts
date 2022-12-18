import type { IncomingMessage } from "http";
import { get } from "https";
import { createWriteStream, mkdtempSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { ERR_WINDOWS_FAILED_TO_INSTALL_NVDA } from "../errors";
import decompress from "decompress";

const sourceUrl =
  "https://raw.githubusercontent.com/guidepup/setup/feat/add-nvda-setup/downloads/guidepup_nvda.zip";

export async function installNvda(): Promise<string> {
  const destinationBaseDirectory = mkdtempSync(join(tmpdir(), "guidepup_nvda"));
  const destinationDirectory = join(destinationBaseDirectory, "guidepup_nvda");
  const destinationZip = join(destinationBaseDirectory, "guidepup_nvda.zip");
  const fileZip = createWriteStream(destinationZip);

  function removeAll() {
    rmSync(destinationBaseDirectory, { recursive: true });
  }

  function removeZip() {
    rmSync(destinationZip, { recursive: true });
  }

  await new Promise<void>((resolve, reject) => {
    function onResponse(response: IncomingMessage) {
      response.pipe(fileZip);
    }

    function onError() {
      removeAll();
      reject(new Error(ERR_WINDOWS_FAILED_TO_INSTALL_NVDA));
    }

    function onSuccess() {
      fileZip.close((error) => {
        if (error) {
          return onError();
        }

        resolve();
      });
    }

    const request = get(sourceUrl, onResponse);
    fileZip.on("finish", onSuccess);
    request.on("error", onError);
    fileZip.on("error", onError);
  });

  try {
    await decompress(destinationZip, destinationBaseDirectory);

    removeZip();
  } catch {
    removeAll();

    throw new Error(ERR_WINDOWS_FAILED_TO_INSTALL_NVDA);
  }

  return destinationDirectory;
}
