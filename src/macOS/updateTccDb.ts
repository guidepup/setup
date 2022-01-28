import { execSync } from "child_process";

const epoch = +Date.now();

const entries: string[] = [
  // Permit Sending Keystrokes
  `'kTCCServicePostEvent','/usr/sbin/sshd',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
  `'kTCCServicePostEvent','/bin/bash',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
  `'kTCCServicePostEvent','com.apple.Terminal',0,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
  `'kTCCServicePostEvent','/usr/local/opt/runner/runprovisioner.sh',0,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
  // Permit Control Of Device
  `'kTCCServiceAccessibility','/usr/sbin/sshd',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
  `'kTCCServiceAccessibility','/bin/bash',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
  `'kTCCServiceAccessibility','com.apple.Terminal',0,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
  `'kTCCServiceAccessibility','/usr/local/opt/runner/runprovisioner.sh',0,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
  // Permit Control Of System Events
  `'kTCCServiceAppleEvents','/usr/sbin/sshd',1,2,3,1,NULL,NULL,0,'com.apple.systemevents',NULL,NULL,${epoch}`,
  `'kTCCServiceAppleEvents','/bin/bash',1,2,3,1,NULL,NULL,0,'com.apple.systemevents',NULL,NULL,${epoch}`,
  `'kTCCServiceAppleEvents','com.apple.Terminal',0,2,3,1,NULL,NULL,0,'com.apple.systemevents',NULL,NULL,${epoch}`,
  `'kTCCServiceAppleEvents','/usr/local/opt/runner/runprovisioner.sh',0,2,3,1,NULL,NULL,0,'com.apple.systemevents',NULL,NULL,${epoch}`,
  // Permit Control Of VoiceOver
  `'kTCCServiceAppleEvents','/usr/sbin/sshd',1,2,3,1,NULL,NULL,0,'com.apple.VoiceOver',NULL,NULL,${epoch}`,
  `'kTCCServiceAppleEvents','/bin/bash',1,2,3,1,NULL,NULL,0,'com.apple.VoiceOver',NULL,NULL,${epoch}`,
  `'kTCCServiceAppleEvents','com.apple.Terminal',0,2,3,1,NULL,NULL,0,'com.apple.VoiceOver',NULL,NULL,${epoch}`,
  `'kTCCServiceAppleEvents','/usr/local/opt/runner/runprovisioner.sh',0,2,3,1,NULL,NULL,0,'com.apple.VoiceOver',NULL,NULL,${epoch}`,
  // Permit Control Of VoiceOver Utility
  `'kTCCServiceAppleEvents','/usr/sbin/sshd',1,2,3,1,NULL,NULL,0,'com.apple.VoiceOverUtility',NULL,NULL,${epoch}`,
  `'kTCCServiceAppleEvents','/bin/bash',1,2,3,1,NULL,NULL,0,'com.apple.VoiceOverUtility',NULL,NULL,${epoch}`,
  `'kTCCServiceAppleEvents','com.apple.Terminal',0,2,3,1,NULL,NULL,0,'com.apple.VoiceOverUtility',NULL,NULL,${epoch}`,
  `'kTCCServiceAppleEvents','/usr/local/opt/runner/runprovisioner.sh',0,2,3,1,NULL,NULL,0,'com.apple.VoiceOverUtility',NULL,NULL,${epoch}`,
  // Permit Control Of Finder
  `'kTCCServiceAppleEvents','/usr/sbin/sshd',1,2,3,1,NULL,NULL,0,'com.apple.finder',NULL,NULL,${epoch}`,
  `'kTCCServiceAppleEvents','/bin/bash',1,2,3,1,NULL,NULL,0,'com.apple.finder',NULL,NULL,${epoch}`,
  `'kTCCServiceAppleEvents','com.apple.Terminal',0,2,3,1,NULL,NULL,0,'com.apple.finder',NULL,NULL,${epoch}`,
  `'kTCCServiceAppleEvents','/usr/local/opt/runner/runprovisioner.sh',0,2,3,1,NULL,NULL,0,'com.apple.finder',NULL,NULL,${epoch}`,
  // Permit Control Of Safari
  `'kTCCServiceAppleEvents','/usr/sbin/sshd',1,2,3,1,NULL,NULL,0,'com.apple.Safari',NULL,NULL,${epoch}`,
  `'kTCCServiceAppleEvents','/bin/bash',1,2,3,1,NULL,NULL,0,'com.apple.Safari',NULL,NULL,${epoch}`,
  `'kTCCServiceAppleEvents','com.apple.Terminal',0,2,3,1,NULL,NULL,0,'com.apple.Safari',NULL,NULL,${epoch}`,
  `'kTCCServiceAppleEvents','/usr/local/opt/runner/runprovisioner.sh',0,2,3,1,NULL,NULL,0,'com.apple.Safari',NULL,NULL,${epoch}`,
  // Permit Control Of Playwright
  `'kTCCServiceAppleEvents','/usr/sbin/sshd',1,2,3,1,NULL,NULL,0,'org.webkit.Playwright',NULL,NULL,${epoch}`,
  `'kTCCServiceAppleEvents','/bin/bash',1,2,3,1,NULL,NULL,0,'org.webkit.Playwright',NULL,NULL,${epoch}`,
  `'kTCCServiceAppleEvents','com.apple.Terminal',0,2,3,1,NULL,NULL,0,'org.webkit.Playwright',NULL,NULL,${epoch}`,
  `'kTCCServiceAppleEvents','/usr/local/opt/runner/runprovisioner.sh',0,2,3,1,NULL,NULL,0,'org.webkit.Playwright',NULL,NULL,${epoch}`,
  // Permit Access To Microphone
  `'kTCCServiceMicrophone','/usr/sbin/sshd',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,NULL,${epoch}`,
  `'kTCCServiceMicrophone','/bin/bash',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,NULL,${epoch}`,
  `'kTCCServiceMicrophone','com.apple.Terminal',0,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,NULL,${epoch}`,
  `'kTCCServiceMicrophone','/usr/local/opt/runner/runprovisioner.sh',0,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,NULL,${epoch}`,
  // Permit Capture Of System Display
  `'kTCCServiceScreenCapture','/usr/sbin/sshd',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
  `'kTCCServiceScreenCapture','/bin/bash',1,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
  `'kTCCServiceScreenCapture','com.apple.Terminal',0,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
  `'kTCCServiceScreenCapture','/usr/local/opt/runner/runprovisioner.sh',0,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
  // Permit VoiceOver Access To Location
  `'kTCCServiceLiverpool','com.apple.VoiceOverUtility',0,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
  `'kTCCServiceLiverpool','com.apple.VoiceOver',0,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
  // Permit VoiceOver Access To Bluetooth
  `'kTCCServiceBluetoothAlways','com.apple.VoiceOver',0,2,3,1,NULL,NULL,NULL,'UNUSED',NULL,0,${epoch}`,
];

export function updateTccDb(path: string): void {
  for (const values of entries) {
    const query = `INSERT OR IGNORE INTO access VALUES(${values});`;
    execSync(`sudo sqlite3 "${path}" "${query}"`);
  }
}
