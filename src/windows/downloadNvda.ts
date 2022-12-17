import { get } from "https";
import { createWriteStream, mkdtempSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { ERR_WINDOWS_FAILED_TO_INSTALL_NVDA } from "../errors";
import extract from "extract-zip";

const sourceUrl =
  "https://github.com/guidepup/setup/raw/feat/add-nvda-setup/downloads/guidepup_nvda.zip";

export async function downloadNvda(): Promise<string> {
  const destinationBaseDirectory = mkdtempSync(join(tmpdir(), "guidepup_nvda"));
  const destinationZip = join(destinationBaseDirectory, "guidepup_nvda.zip");
  const destinationDirectory = join(destinationBaseDirectory, "guidepup_nvda");
  const fileZip = createWriteStream(destinationZip);

  await new Promise((resolve, reject) => {
    function onResponse(response) {
      response.pipe(fileZip);
    }

    function onSuccess() {
      fileZip.close(resolve);
    }

    function onError() {
      rmSync(destinationBaseDirectory, { recursive: true });
      reject(new Error(ERR_WINDOWS_FAILED_TO_INSTALL_NVDA));
    }

    const request = get(sourceUrl, onResponse);
    fileZip.on("finish", onSuccess);
    request.on("error", onError);
    fileZip.on("error", onError);
  });

  try {
    await extract(destinationZip, { dir: destinationDirectory });
  } catch {
    rmSync(destinationBaseDirectory, { recursive: true });
    throw new Error(ERR_WINDOWS_FAILED_TO_INSTALL_NVDA);
  }

  return destinationDirectory;
}
