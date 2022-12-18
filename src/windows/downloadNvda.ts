import { get } from "https";
import { createWriteStream, mkdtempSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { ERR_WINDOWS_FAILED_TO_INSTALL_NVDA } from "../errors";
import decompress from "decompress";

const sourceUrl =
  "https://github.com/guidepup/setup/raw/feat/add-nvda-setup/downloads/guidepup_nvda.zip";

const tenMinutesInMs = 10 * 60 * 1000;

export async function downloadNvda(): Promise<string> {
  const destinationBaseDirectory = mkdtempSync(join(tmpdir(), "guidepup_nvda"));
  const destinationZip = join(destinationBaseDirectory, "guidepup_nvda.zip");
  const destinationDirectory = join(destinationBaseDirectory, "guidepup_nvda");
  const fileZip = createWriteStream(destinationZip);

  await new Promise<void>((resolve, reject) => {
    function onResponse(response) {
      response.setTimeout(tenMinutesInMs);
      response.pipe(fileZip);
    }

    function onError(error) {
      rmSync(destinationBaseDirectory, { recursive: true });
      console.error(error);
      reject(new Error(ERR_WINDOWS_FAILED_TO_INSTALL_NVDA));
    }

    function onSuccess() {
      fileZip.close((err) => {
        if (err) {
          return onError(err);
        }

        resolve();
      });
    }

    const request = get(sourceUrl, onResponse);
    fileZip.on("finish", onSuccess);
    request.on("error", onError);
    fileZip.on("error", onError);
  });

  console.log({
    destinationBaseDirectory,
    destinationZip,
    destinationDirectory,
  });

  try {
    await decompress(destinationZip, destinationDirectory);
  } catch (error) {
    console.error(error);
    rmSync(destinationBaseDirectory, { recursive: true });
    throw new Error(ERR_WINDOWS_FAILED_TO_INSTALL_NVDA);
  }

  return destinationDirectory;
}
