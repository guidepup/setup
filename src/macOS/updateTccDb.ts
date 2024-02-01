import { release } from "os";
import { execSync } from "child_process";
import { ERR_MACOS_UNABLE_TO_WRITE_USER_TCC_DB } from "../errors";

const epoch = +Date.now();

const getEntries = (): string[] => {
  let gitlabRunnerPath: string;

  try {
    gitlabRunnerPath = execSync("which gitlab-runner", {
      encoding: "utf8",
    }).trim();
  } catch {
    gitlabRunnerPath = "/usr/local/bin/gitlab-runner";
  }

  /**
   * See https://www.rainforestqa.com/blog/macos-tcc-db-deep-dive for details on TCC.db entries.
   */
  return [
    // Permit Sending Keystrokes
    `'kTCCServicePostEvent','/usr/sbin/sshd',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServicePostEvent','/bin/bash',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServicePostEvent','/bin/zsh',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServicePostEvent','/usr/bin/osascript',1,2,3,1,NULL,NULL,0,'UNUSED',NULL,NULL,${epoch}`,
    `'kTCCServicePostEvent','com.apple.Terminal',0,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServicePostEvent','/usr/local/opt/runner/runprovisioner.sh',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServicePostEvent','/usr/local/opt/runner/provisioner/provisioner',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServicePostEvent','${gitlabRunnerPath}',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    // Permit Control Of Device
    `'kTCCServiceAccessibility','/usr/sbin/sshd',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServiceAccessibility','/bin/bash',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServiceAccessibility','/bin/zsh',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServiceAccessibility','/usr/bin/osascript',1,2,3,1,NULL,NULL,0,'UNUSED',NULL,NULL,${epoch}`,
    `'kTCCServiceAccessibility','com.apple.Terminal',0,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServiceAccessibility','/usr/local/opt/runner/runprovisioner.sh',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServiceAccessibility','/usr/local/opt/runner/provisioner/provisioner',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServiceAccessibility','${gitlabRunnerPath}',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    // Permit Full Disk Access
    `'kTCCServiceSystemPolicyAllFiles','/usr/sbin/sshd',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServiceSystemPolicyAllFiles','/bin/bash',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServiceSystemPolicyAllFiles','/bin/zsh',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServiceSystemPolicyAllFiles','/usr/bin/osascript',1,2,3,1,NULL,NULL,0,'UNUSED',NULL,NULL,${epoch}`,
    `'kTCCServiceSystemPolicyAllFiles','com.apple.Terminal',0,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServiceSystemPolicyAllFiles','/usr/local/opt/runner/runprovisioner.sh',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServiceSystemPolicyAllFiles','/usr/local/opt/runner/provisioner/provisioner',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServiceSystemPolicyAllFiles','${gitlabRunnerPath}',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    // Permit Access To Microphone
    `'kTCCServiceMicrophone','/usr/sbin/sshd',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,NULL,${epoch}`,
    `'kTCCServiceMicrophone','/bin/bash',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,NULL,${epoch}`,
    `'kTCCServiceMicrophone','/bin/zsh',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,NULL,${epoch}`,
    `'kTCCServiceMicrophone','/usr/bin/osascript',1,2,3,1,NULL,NULL,0,'UNUSED',NULL,NULL,${epoch}`,
    `'kTCCServiceMicrophone','com.apple.Terminal',0,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,NULL,${epoch}`,
    `'kTCCServiceMicrophone','/usr/local/opt/runner/runprovisioner.sh',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,NULL,${epoch}`,
    `'kTCCServiceMicrophone','/usr/local/opt/runner/provisioner/provisioner',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,NULL,${epoch}`,
    `'kTCCServiceMicrophone','${gitlabRunnerPath}',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    // Permit Capture Of System Display
    `'kTCCServiceScreenCapture','/usr/sbin/sshd',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServiceScreenCapture','/bin/bash',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServiceScreenCapture','/bin/zsh',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServiceScreenCapture','/usr/bin/osascript',1,2,3,1,NULL,NULL,0,'UNUSED',NULL,NULL,${epoch}`,
    `'kTCCServiceScreenCapture','com.apple.Terminal',0,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServiceScreenCapture','/usr/local/opt/runner/runprovisioner.sh',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServiceScreenCapture','/usr/local/opt/runner/provisioner/provisioner',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServiceScreenCapture','${gitlabRunnerPath}',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    // Permit VoiceOver Access To Location
    `'kTCCServiceLiverpool','com.apple.VoiceOverUtility',0,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    `'kTCCServiceLiverpool','com.apple.VoiceOver',0,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    // Permit VoiceOver Access To Bluetooth
    `'kTCCServiceBluetoothAlways','com.apple.VoiceOver',0,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
    // Permit Control Of System Events
    `'kTCCServiceAppleEvents','/usr/sbin/sshd',1,2,3,1,NULL,NULL,0,'com.apple.systemevents',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/bash',1,2,3,1,NULL,NULL,0,'com.apple.systemevents',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/zsh',1,2,3,1,NULL,NULL,0,'com.apple.systemevents',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/bin/osascript',1,2,3,1,NULL,NULL,0,'com.apple.systemevents',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','com.apple.Terminal',0,2,3,1,NULL,NULL,0,'com.apple.systemevents',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/runprovisioner.sh',1,2,3,1,NULL,NULL,0,'com.apple.systemevents',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/provisioner/provisioner',1,2,3,1,NULL,NULL,0,'com.apple.systemevents',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','${gitlabRunnerPath}',1,2,3,1,NULL,NULL,0,'com.apple.systemevents',NULL,NULL,${epoch}`,
    // Permit Control Of VoiceOver
    `'kTCCServiceAppleEvents','/usr/sbin/sshd',1,2,3,1,NULL,NULL,0,'com.apple.VoiceOver',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/bash',1,2,3,1,NULL,NULL,0,'com.apple.VoiceOver',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/zsh',1,2,3,1,NULL,NULL,0,'com.apple.VoiceOver',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/bin/osascript',1,2,3,1,NULL,NULL,0,'com.apple.VoiceOver',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','com.apple.Terminal',0,2,3,1,NULL,NULL,0,'com.apple.VoiceOver',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/runprovisioner.sh',1,2,3,1,NULL,NULL,0,'com.apple.VoiceOver',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/provisioner/provisioner',1,2,3,1,NULL,NULL,0,'com.apple.VoiceOver',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','${gitlabRunnerPath}',1,2,3,1,NULL,NULL,0,'com.apple.VoiceOver',NULL,NULL,${epoch}`,
    // Permit Control Of VoiceOver Utility
    `'kTCCServiceAppleEvents','/usr/sbin/sshd',1,2,3,1,NULL,NULL,0,'com.apple.VoiceOverUtility',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/bash',1,2,3,1,NULL,NULL,0,'com.apple.VoiceOverUtility',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/zsh',1,2,3,1,NULL,NULL,0,'com.apple.VoiceOverUtility',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/bin/osascript',1,2,3,1,NULL,NULL,0,'com.apple.VoiceOverUtility',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','com.apple.Terminal',0,2,3,1,NULL,NULL,0,'com.apple.VoiceOverUtility',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/runprovisioner.sh',1,2,3,1,NULL,NULL,0,'com.apple.VoiceOverUtility',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/provisioner/provisioner',1,2,3,1,NULL,NULL,0,'com.apple.VoiceOverUtility',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','${gitlabRunnerPath}',1,2,3,1,NULL,NULL,0,'com.apple.VoiceOverUtility',NULL,NULL,${epoch}`,
    // Permit Control Of Finder
    `'kTCCServiceAppleEvents','/usr/sbin/sshd',1,2,3,1,NULL,NULL,0,'com.apple.finder',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/bash',1,2,3,1,NULL,NULL,0,'com.apple.finder',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/zsh',1,2,3,1,NULL,NULL,0,'com.apple.finder',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/bin/osascript',1,2,3,1,NULL,NULL,0,'com.apple.finder',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','com.apple.Terminal',0,2,3,1,NULL,NULL,0,'com.apple.finder',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/runprovisioner.sh',1,2,3,1,NULL,NULL,0,'com.apple.finder',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/provisioner/provisioner',1,2,3,1,NULL,NULL,0,'com.apple.finder',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','${gitlabRunnerPath}',1,2,3,1,NULL,NULL,0,'com.apple.finder',NULL,NULL,${epoch}`,
    // Permit Control Of Safari
    `'kTCCServiceAppleEvents','/usr/sbin/sshd',1,2,3,1,NULL,NULL,0,'com.apple.Safari',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/bash',1,2,3,1,NULL,NULL,0,'com.apple.Safari',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/zsh',1,2,3,1,NULL,NULL,0,'com.apple.Safari',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/bin/osascript',1,2,3,1,NULL,NULL,0,'com.apple.Safari',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','com.apple.Terminal',0,2,3,1,NULL,NULL,0,'com.apple.Safari',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/runprovisioner.sh',1,2,3,1,NULL,NULL,0,'com.apple.Safari',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/provisioner/provisioner',1,2,3,1,NULL,NULL,0,'com.apple.Safari',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','${gitlabRunnerPath}',1,2,3,1,NULL,NULL,0,'com.apple.Safari',NULL,NULL,${epoch}`,
    // Permit Control Of Firefox
    `'kTCCServiceAppleEvents','/usr/sbin/sshd',1,2,3,1,NULL,NULL,0,'org.mozilla.firefox',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/bash',1,2,3,1,NULL,NULL,0,'org.mozilla.firefox',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/zsh',1,2,3,1,NULL,NULL,0,'org.mozilla.firefox',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/bin/osascript',1,2,3,1,NULL,NULL,0,'com.mozilla.firefox',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','com.apple.Terminal',0,2,3,1,NULL,NULL,0,'org.mozilla.firefox',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/runprovisioner.sh',1,2,3,1,NULL,NULL,0,'org.mozilla.firefox',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/provisioner/provisioner',1,2,3,1,NULL,NULL,0,'org.mozilla.firefox',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','${gitlabRunnerPath}',1,2,3,1,NULL,NULL,0,'org.mozilla.firefox',NULL,NULL,${epoch}`,
    // Permit Control Of Firefox Nightly And Playwright Firefox Nightly
    `'kTCCServiceAppleEvents','/usr/sbin/sshd',1,2,3,1,NULL,NULL,0,'org.mozilla.nightly',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/bash',1,2,3,1,NULL,NULL,0,'org.mozilla.nightly',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/zsh',1,2,3,1,NULL,NULL,0,'org.mozilla.nightly',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/bin/osascript',1,2,3,1,NULL,NULL,0,'org.mozilla.nightly',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','com.apple.Terminal',0,2,3,1,NULL,NULL,0,'org.mozilla.nightly',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/runprovisioner.sh',1,2,3,1,NULL,NULL,0,'org.mozilla.nightly',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/provisioner/provisioner',1,2,3,1,NULL,NULL,0,'org.mozilla.nightly',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','${gitlabRunnerPath}',1,2,3,1,NULL,NULL,0,'org.mozilla.nightly',NULL,NULL,${epoch}`,
    // Permit Control Of Opera
    `'kTCCServiceAppleEvents','/usr/sbin/sshd',1,2,3,1,NULL,NULL,0,'com.operasoftware.Opera',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/bash',1,2,3,1,NULL,NULL,0,'com.operasoftware.Opera',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/zsh',1,2,3,1,NULL,NULL,0,'com.operasoftware.Opera',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/bin/osascript',1,2,3,1,NULL,NULL,0,'com.operasoftware.Opera',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','com.apple.Terminal',0,2,3,1,NULL,NULL,0,'com.operasoftware.Opera',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/runprovisioner.sh',1,2,3,1,NULL,NULL,0,'com.operasoftware.Opera',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/provisioner/provisioner',1,2,3,1,NULL,NULL,0,'com.operasoftware.Opera',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','${gitlabRunnerPath}',1,2,3,1,NULL,NULL,0,'com.operasoftware.Opera',NULL,NULL,${epoch}`,
    // Permit Control Of Google Chrome
    `'kTCCServiceAppleEvents','/usr/sbin/sshd',1,2,3,1,NULL,NULL,0,'com.google.Chrome',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/bash',1,2,3,1,NULL,NULL,0,'com.google.Chrome',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/zsh',1,2,3,1,NULL,NULL,0,'com.google.Chrome',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/bin/osascript',1,2,3,1,NULL,NULL,0,'com.google.Chrome',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','com.apple.Terminal',0,2,3,1,NULL,NULL,0,'com.google.Chrome',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/runprovisioner.sh',1,2,3,1,NULL,NULL,0,'com.google.Chrome',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/provisioner/provisioner',1,2,3,1,NULL,NULL,0,'com.google.Chrome',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','${gitlabRunnerPath}',1,2,3,1,NULL,NULL,0,'com.google.Chrome',NULL,NULL,${epoch}`,
    // Permit Control Of Google Chrome Beta
    `'kTCCServiceAppleEvents','/usr/sbin/sshd',1,2,3,1,NULL,NULL,0,'com.google.Chrome.beta',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/bash',1,2,3,1,NULL,NULL,0,'com.google.Chrome.beta',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/zsh',1,2,3,1,NULL,NULL,0,'com.google.Chrome.beta',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/bin/osascript',1,2,3,1,NULL,NULL,0,'com.google.Chrome.beta',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','com.apple.Terminal',0,2,3,1,NULL,NULL,0,'com.google.Chrome.beta',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/runprovisioner.sh',1,2,3,1,NULL,NULL,0,'com.google.Chrome.beta',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/provisioner/provisioner',1,2,3,1,NULL,NULL,0,'com.google.Chrome.beta',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','${gitlabRunnerPath}',1,2,3,1,NULL,NULL,0,'com.google.Chrome.beta',NULL,NULL,${epoch}`,
    // Permit Control Of Chromium
    `'kTCCServiceAppleEvents','/usr/sbin/sshd',1,2,3,1,NULL,NULL,0,'org.chromium.Chromium',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/bash',1,2,3,1,NULL,NULL,0,'org.chromium.Chromium',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/zsh',1,2,3,1,NULL,NULL,0,'org.chromium.Chromium',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/bin/osascript',1,2,3,1,NULL,NULL,0,'org.chromium.Chromium',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','com.apple.Terminal',0,2,3,1,NULL,NULL,0,'org.chromium.Chromium',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/runprovisioner.sh',1,2,3,1,NULL,NULL,0,'org.chromium.Chromium',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/provisioner/provisioner',1,2,3,1,NULL,NULL,0,'org.chromium.Chromium',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','${gitlabRunnerPath}',1,2,3,1,NULL,NULL,0,'org.chromium.Chromium',NULL,NULL,${epoch}`,
    // Permit Control Of Microsoft Edge
    `'kTCCServiceAppleEvents','/usr/sbin/sshd',1,2,3,1,NULL,NULL,0,'com.microsoft.edgemac',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/bash',1,2,3,1,NULL,NULL,0,'com.microsoft.edgemac',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/zsh',1,2,3,1,NULL,NULL,0,'com.microsoft.edgemac',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/bin/osascript',1,2,3,1,NULL,NULL,0,'com.microsoft.edgemac',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','com.apple.Terminal',0,2,3,1,NULL,NULL,0,'com.microsoft.edgemac',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/runprovisioner.sh',1,2,3,1,NULL,NULL,0,'com.microsoft.edgemac',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/provisioner/provisioner',1,2,3,1,NULL,NULL,0,'com.microsoft.edgemac',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','${gitlabRunnerPath}',1,2,3,1,NULL,NULL,0,'com.microsoft.edgemac',NULL,NULL,${epoch}`,
    // Permit Control Of Microsoft Edge Beta
    `'kTCCServiceAppleEvents','/usr/sbin/sshd',1,2,3,1,NULL,NULL,0,'com.microsoft.edgemac.Beta',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/bash',1,2,3,1,NULL,NULL,0,'com.microsoft.edgemac.Beta',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/zsh',1,2,3,1,NULL,NULL,0,'com.microsoft.edgemac.Beta',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/bin/osascript',1,2,3,1,NULL,NULL,0,'com.microsoft.edgemac.Beta',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','com.apple.Terminal',0,2,3,1,NULL,NULL,0,'com.microsoft.edgemac.Beta',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/runprovisioner.sh',1,2,3,1,NULL,NULL,0,'com.microsoft.edgemac.Beta',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/provisioner/provisioner',1,2,3,1,NULL,NULL,0,'com.microsoft.edgemac.Beta',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','${gitlabRunnerPath}',1,2,3,1,NULL,NULL,0,'com.microsoft.edgemac.Beta',NULL,NULL,${epoch}`,
    // Permit Control Of Microsoft Edge Dev
    `'kTCCServiceAppleEvents','/usr/sbin/sshd',1,2,3,1,NULL,NULL,0,'com.microsoft.edgemac.Dev',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/bash',1,2,3,1,NULL,NULL,0,'com.microsoft.edgemac.Dev',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/zsh',1,2,3,1,NULL,NULL,0,'com.microsoft.edgemac.Dev',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/bin/osascript',1,2,3,1,NULL,NULL,0,'com.microsoft.edgemac.Dev',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','com.apple.Terminal',0,2,3,1,NULL,NULL,0,'com.microsoft.edgemac.Dev',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/runprovisioner.sh',1,2,3,1,NULL,NULL,0,'com.microsoft.edgemac.Dev',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/provisioner/provisioner',1,2,3,1,NULL,NULL,0,'com.microsoft.edgemac.Dev',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','${gitlabRunnerPath}',1,2,3,1,NULL,NULL,0,'com.microsoft.edgemac.Dev',NULL,NULL,${epoch}`,
    // Permit Control Of Playwright WebKit
    `'kTCCServiceAppleEvents','/usr/sbin/sshd',1,2,3,1,NULL,NULL,0,'org.webkit.Playwright',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/bash',1,2,3,1,NULL,NULL,0,'org.webkit.Playwright',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/bin/zsh',1,2,3,1,NULL,NULL,0,'org.webkit.Playwright',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/bin/osascript',1,2,3,1,NULL,NULL,0,'org.webkit.Playwright',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','com.apple.Terminal',0,2,3,1,NULL,NULL,0,'org.webkit.Playwright',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/runprovisioner.sh',1,2,3,1,NULL,NULL,0,'org.webkit.Playwright',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','/usr/local/opt/runner/provisioner/provisioner',1,2,3,1,NULL,NULL,0,'org.webkit.Playwright',NULL,NULL,${epoch}`,
    `'kTCCServiceAppleEvents','${gitlabRunnerPath}',1,2,3,1,NULL,NULL,0,'org.webkit.Playwright',NULL,NULL,${epoch}`,
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
        `${ERR_MACOS_UNABLE_TO_WRITE_USER_TCC_DB}\n\n${e.message}`
      );
    }
  }
}
