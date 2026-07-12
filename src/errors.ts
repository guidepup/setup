export const ERR_SETUP_UNSUPPORTED_OS =
  "Unsupported OS - consider contributing to Guidepup?";

export const ERR_SETUP_MACOS_UNABLE_TO_VERIFY_VERSION =
  "Unable to verify macOS version";
export const ERR_SETUP_MACOS_UNSUPPORTED_VERSION =
  "Require macOS version 11 or later";
export const ERR_SETUP_MACOS_UNABLE_UPDATE_SYSTEM_DEFAULTS =
  "Unable to update system defaults";
export const ERR_SETUP_MACOS_UNABLE_TO_VERIFY_SIP =
  "Unable to verify macOS SIP status";
export const ERR_SETUP_MACOS_UNABLE_TO_WRITE_DATABASE_FILE =
  "Unable to write to the VoiceOver database file\n\nEnsure that SIP is disabled or pass '--macos-ignore-tcc-db' to ignore TCC database updates";
export const ERR_SETUP_MACOS_UNABLE_TO_WRITE_USER_TCC_DB =
  "Unable to write to the user TCC database\n\nEnsure that SIP is disabled or pass '--macos-ignore-tcc-db' to ignore TCC database updates";
export const ERR_SETUP_MACOS_REQUIRES_MANUAL_USER_INTERACTION =
  "Unable to setup environment without manual user interaction\n\nEnsure that SIP is disabled or preconfigure your environment with 'Allow VoiceOver to be controlled with AppleScript' enabled";
export const ERR_SETUP_MACOS_FAILED_TO_ENABLE_DO_NOT_DISTURB =
  'Failed to enable "Do not disturb" mode';

export const ERR_INSTALL_GUIDEPUP_PACKAGE_NOT_FOUND =
  "No local installation of '@guidepup/guidepup' was found\n\nPlease install '@guidepup/guidepup' first before running the CLI install";
export const ERR_INSTALL_GUIDEPUP_MANIFEST_INVALID =
  "The installed '@guidepup/guidepup' manifest appears to be invalid or corrupted\n\nPlease re-install '@guidepup/guidepup'";
export const ERR_INSTALL_GUIDEPUP_MANIFEST_UNSUPPORTED_SCHEMA =
  "Unsupported manifest schema version\n\nPlease upgrade '@guidepup/setup'";
export const ERR_INSTALL_GUIDEPUP_SCREEN_READER_UNAVAILABLE =
  "The requested screen reader is not available for this platform";
