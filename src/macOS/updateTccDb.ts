import { release } from "os";
import { execSync } from "child_process";
import { ERR_MACOS_UNABLE_TO_WRITE_USER_TCC_DB } from "../errors";

const epoch = +Date.now();

const sshdPath = "/usr/sbin/sshd";
const bashPath = "/bin/bash";
const zshPath = "/bin/zsh";
const oascriptPath = "/usr/bin/osascript";
const githubRunProvisionerScriptPath =
  "/usr/local/opt/runner/runprovisioner.sh";
const githubProvisionerPath = "/usr/local/opt/runner/provisioner/provisioner";
const githubStartHCAScriptPath = "/opt/hca/start_hca.sh";
const githubHostedComputeAgentPath = "/opt/hca/hosted-compute-agent";
const circleciRunnerPath = "/private/tmp/.machine-agent";

const terminalApp = "com.apple.Terminal";
const voiceOverUtilityApp = "com.apple.VoiceOverUtility";
const voiceOverApp = "com.apple.VoiceOver";
const systemEventsApp = "com.apple.systemevents";
const finderApp = "com.apple.finder";
const safariApp = "com.apple.Safari";
const firefoxApp = "org.mozilla.firefox";
const firefoxNightlyApp = "org.mozilla.nightly";
const operaApp = "com.operasoftware.Opera";
const chromeApp = "com.google.Chrome";
const chromeBetaApp = "com.google.Chrome.beta";
const chromeForTestingApp = "com.google.chrome.for.testing";
const chromiumApp = "org.chromium.Chromium";
const edgeApp = "com.microsoft.edgemac";
const edgeBetaApp = "com.microsoft.edgemac.Beta";
const edgeDevApp = "com.microsoft.edgemac.Dev";
const playwrightWebkitApp = "org.webkit.Playwright";
const webkitApp = "com.apple.WebKit";

const getEntries = (): string[] => {
  let gitlabRunnerPath: string;

  try {
    gitlabRunnerPath = execSync("which gitlab-runner", {
      encoding: "utf8",
    }).trim();
  } catch {
    gitlabRunnerPath = "/usr/local/bin/gitlab-runner";
  }

  const standardClients = [
    sshdPath,
    bashPath,
    zshPath,
    oascriptPath,
    terminalApp,
    githubRunProvisionerScriptPath,
    githubProvisionerPath,
    githubStartHCAScriptPath,
    githubHostedComputeAgentPath,
    gitlabRunnerPath,
    circleciRunnerPath,
  ];

  /**
   * See https://www.rainforestqa.com/blog/macos-tcc-db-deep-dive for details on TCC.db entries.
   */
  return [
    // Permit Sending Keystrokes
    ...standardClients.map(
      (client) =>
        `'kTCCServicePostEvent','${client}',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    ),
    // Permit Control Of Device
    ...standardClients.map(
      (client) =>
        `'kTCCServiceAccessibility','${client}',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    ),
    // Permit Full Disk Access
    ...standardClients.map(
      (client) =>
        `'kTCCServiceSystemPolicyAllFiles','${client}',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    ),
    // Permit Access To Microphone
    ...standardClients.map(
      (client) =>
        `'kTCCServiceMicrophone','${client}',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,NULL,${epoch}`,
    ),
    // Permit Capture Of System Display
    ...standardClients.map(
      (client) =>
        `'kTCCServiceScreenCapture','${client}',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    ),
    // Permit VoiceOver Access To Location
    `'kTCCServiceLiverpool','${voiceOverUtilityApp}',0,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServiceLiverpool','${voiceOverApp}',0,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    // Permit VoiceOver Access To Bluetooth
    `'kTCCServiceBluetoothAlways','${voiceOverApp}',0,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    // Permit Control Of System Events
    ...standardClients.map(
      (client) =>
        `'kTCCServiceAppleEvents','${client}',1,2,3,1,NULL,NULL,0,'${systemEventsApp}',NULL,NULL,${epoch}`,
    ),
    // Permit Control Of VoiceOver
    ...standardClients.map(
      (client) =>
        `'kTCCServiceAppleEvents','${client}',1,2,3,1,NULL,NULL,0,'${voiceOverApp}',NULL,NULL,${epoch}`,
    ),
    // Permit Control Of VoiceOver Utility
    ...standardClients.map(
      (client) =>
        `'kTCCServiceAppleEvents','${client}',1,2,3,1,NULL,NULL,0,'${voiceOverUtilityApp}',NULL,NULL,${epoch}`,
    ),
    // Permit Control Of Finder
    ...standardClients.map(
      (client) =>
        `'kTCCServiceAppleEvents','${client}',1,2,3,1,NULL,NULL,0,'${finderApp}',NULL,NULL,${epoch}`,
    ),
    // Permit Control Of Safari
    ...standardClients.map(
      (client) =>
        `'kTCCServiceAppleEvents','${client}',1,2,3,1,NULL,NULL,0,'${safariApp}',NULL,NULL,${epoch}`,
    ),
    // Permit Control Of Firefox
    ...standardClients.map(
      (client) =>
        `'kTCCServiceAppleEvents','${client}',1,2,3,1,NULL,NULL,0,'${firefoxApp}',NULL,NULL,${epoch}`,
    ),
    // Permit Control Of Firefox Nightly And Playwright Firefox Nightly
    ...standardClients.map(
      (client) =>
        `'kTCCServiceAppleEvents','${client}',1,2,3,1,NULL,NULL,0,'${firefoxNightlyApp}',NULL,NULL,${epoch}`,
    ),
    // Permit Control Of Opera
    ...standardClients.map(
      (client) =>
        `'kTCCServiceAppleEvents','${client}',1,2,3,1,NULL,NULL,0,'${operaApp}',NULL,NULL,${epoch}`,
    ),
    // Permit Control Of Google Chrome
    ...standardClients.map(
      (client) =>
        `'kTCCServiceAppleEvents','${client}',1,2,3,1,NULL,NULL,0,'${chromeApp}',NULL,NULL,${epoch}`,
    ),
    // Permit Control Of Google Chrome Beta
    ...standardClients.map(
      (client) =>
        `'kTCCServiceAppleEvents','${client}',1,2,3,1,NULL,NULL,0,'${chromeBetaApp}',NULL,NULL,${epoch}`,
    ),
    // Permit Control Of Google Chrome For Testing
    ...standardClients.map(
      (client) =>
        `'kTCCServiceAppleEvents','${client}',1,2,3,1,NULL,NULL,0,'${chromeForTestingApp}',NULL,NULL,${epoch}`,
    ),
    // Permit Control Of Chromium
    ...standardClients.map(
      (client) =>
        `'kTCCServiceAppleEvents','${client}',1,2,3,1,NULL,NULL,0,'${chromiumApp}',NULL,NULL,${epoch}`,
    ),
    // Permit Control Of Microsoft Edge
    ...standardClients.map(
      (client) =>
        `'kTCCServiceAppleEvents','${client}',1,2,3,1,NULL,NULL,0,'${edgeApp}',NULL,NULL,${epoch}`,
    ),
    // Permit Control Of Microsoft Edge Beta
    ...standardClients.map(
      (client) =>
        `'kTCCServiceAppleEvents','${client}',1,2,3,1,NULL,NULL,0,'${edgeBetaApp}',NULL,NULL,${epoch}`,
    ),
    // Permit Control Of Microsoft Edge Dev
    ...standardClients.map(
      (client) =>
        `'kTCCServiceAppleEvents','${client}',1,2,3,1,NULL,NULL,0,'${edgeDevApp}',NULL,NULL,${epoch}`,
    ),
    // Permit Control Of Playwright WebKit
    ...standardClients.map(
      (client) =>
        `'kTCCServiceAppleEvents','${client}',1,2,3,1,NULL,NULL,0,'${playwrightWebkitApp}',NULL,NULL,${epoch}`,
    ),
    // Permit Control Of WebKit
    ...standardClients.map(
      (client) =>
        `'kTCCServiceAppleEvents','${client}',1,2,3,1,NULL,NULL,0,'${webkitApp}',NULL,NULL,${epoch}`,
    ),
  ];
};

export const USER_PATH =
  "$HOME/Library/Application Support/com.apple.TCC/TCC.db";
export const SYSTEM_PATH = "/Library/Application Support/com.apple.TCC/TCC.db";

export function updateTccDb(path: string): void {
  for (const values of getEntries()) {
    const osRelease = release();
    const isSonomaOrNewer = parseInt(osRelease.split(".").at(0)) >= 23;
    const query = `INSERT OR IGNORE INTO access VALUES(${values}${
      isSonomaOrNewer ? `,NULL,NULL,'UNUSED',${epoch}` : ""
    });`;

    try {
      execSync(`sqlite3 "${path}" "${query}" >/dev/null 2>&1`);
    } catch (e) {
      throw new Error(
        `${ERR_MACOS_UNABLE_TO_WRITE_USER_TCC_DB}\n\n${e.message}`,
      );
    }
  }
}
