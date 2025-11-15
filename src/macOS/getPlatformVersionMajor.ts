import { version } from "os";

export const getPlatformVersionMajor = () =>
  Number(version().split("Version ")[1].split(".")[0]);
