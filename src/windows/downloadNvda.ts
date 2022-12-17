import { get } from "https";
import { createWriteStream, mkdtempSync, rm } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { ERR_WINDOWS_FAILED_TO_INSTALL_NVDA } from "../errors";

export async function downloadNvda(): Promise<string> {
  const destinationDirectory = mkdtempSync(join(tmpdir(), "guidepup_nvda"));
  const destination = join(destinationDirectory, "guidepup_nvda.zip");
  const url =
    "https://github.com/guidepup/setup/raw/feat/add-nvda-setup/downloads/guidepup_nvda.zip";
  const file = createWriteStream(destination);

  return new Promise((resolve, reject) => {
    function onResponse(response) {
      response.pipe(file);
    }

    function onSuccess() {
      file.close(() => resolve(destination));
    }

    function onError() {
      rm(destinationDirectory, { recursive: true }, () =>
        reject(new Error(ERR_WINDOWS_FAILED_TO_INSTALL_NVDA))
      );
    }

    const request = get(url, onResponse);
    file.on("finish", onSuccess);
    request.on("error", onError);
    file.on("error", onError);
  });
}
