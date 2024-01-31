# Guidepup Setup

<a href="https://www.npmjs.com/package/@guidepup/setup"><img alt="Guidepup Setup available on NPM" src="https://img.shields.io/npm/v/@guidepup/setup" /></a>
<a href="https://github.com/guidepup/setup/actions/workflows/test.yml"><img alt="Guidepup Setup test workflows" src="https://github.com/guidepup/setup/workflows/Test/badge.svg" /></a>
<a href="https://github.com/guidepup/setup/blob/main/LICENSE"><img alt="Guidepup Setup uses the MIT license" src="https://img.shields.io/github/license/guidepup/setup" /></a>

## [Documentation](https://www.guidepup.dev/docs/guides/automated-environment-setup)

[![MacOS Big Sur Support](https://img.shields.io/badge/macos-Big_Sur-blue.svg?logo=apple)](https://apps.apple.com/id/app/macos-big-sur/id1526878132)
[![MacOS Monetary Support](https://img.shields.io/badge/macos-Monetary-blue.svg?logo=apple)](https://apps.apple.com/us/app/macos-monterey/id1576738294)
[![MacOS Ventura Support](https://img.shields.io/badge/macos-Ventura-blue.svg?logo=apple)](https://apps.apple.com/us/app/macos-ventura/id1638787999)
[![MacOS Sonoma Support](https://img.shields.io/badge/macos-Somona-blue.svg?logo=apple)](https://apps.apple.com/us/app/macos-sonoma/id6450717509)
[![Windows 10 Support](https://img.shields.io/badge/windows-10-blue.svg?logo=windows10)](https://www.microsoft.com/en-gb/software-download/windows10ISO)
[![Windows Server 2019 Support](https://img.shields.io/badge/windows_server-2019-blue.svg?logo=windows)](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2019)
[![Windows Server 2022 Support](https://img.shields.io/badge/windows_server-2022-blue.svg?logo=windows)](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2022)

This package sets up your environment for screen reader automation.

It enables automation for <a href="https://www.guidepup.dev/docs/api/class-voiceover"><b>VoiceOver on MacOS</b></a> and <a href="https://www.guidepup.dev/docs/api/class-nvda"><b>NVDA on Windows</b></a>.

## Getting Started

Run this command:

```console
npx @guidepup/setup
```

And get cracking with your screen reader automation code!

## Usage

### GitHub Actions

If you are using GitHub Actions, check out the dedicated [`guidepup/setup-action`](https://github.com/marketplace/actions/guidepup-setup):

```yaml
- name: Setup Environment
  uses: guidepup/setup-action
```

### MacOS

If you are running this command locally, you might find it prompts you to pass in credentials so that it can using UI automation to change a checkbox value which enables the automation of VoiceOver. If you are uncomfortable with providing your credentials you can manually achieve these steps by following the [manual VoiceOver setup documentation](https://www.guidepup.dev/docs/guides/manual-voiceover-setup).

#### CI

If you are running this command in CI/CD, it is recommended to add the `--ci` flag to prevent interactive prompts:

```console
npx @guidepup/setup --ci
```

#### Ignore TCC.db Updates

If updating the TCC.db is not possible (due to SIP) or required you can skip the database update step by using the `--ignore-tcc-db` flag:

```console
npx @guidepup/setup --ignore-tcc-db
```

> Note: If the necessary permissions have not been granted by other means, using this flag may result in your environment not being setup for reliable screen reader automation.

#### Recording

If you are encountering errors in CI for MacOS you can pass a `--record` flag to the command which will output a screen-recording of the setup to a `./recordings/` directory:

```console
npx @guidepup/setup --ci --record
```

### Windows

#### NVDA Installation

When running on windows a portable NVDA instance compatible with Guidepup will be installed to a temporary directory by default. The location of this installation directory is stored in the Windows registry under the key `HKCU\Software\Guidepup\Nvda`.

If you want to specify the directory that NVDA is installed to you can pass a `--nvda-install-dir` flag to the command:

```console
npx @guidepup/setup --nvda-install-dir <NVDA_INSTALLATION_DIRECTORY>
```

#### Foreground Timeout Lock

Modern versions of Windows have a setting which prevents new application instances launching in front of other applications in quick succession, requiring over 3 minutes between activations before it will actually show the window - in the interim it launches the window minimized.

Many test automation frameworks will completely close down a browser after a test has finished and then launch a new instance for the next test - on Windows this suffers from the timeout lock on foreground windows. This impacts on screen reader automation which need the window to activate and focus to be able to drive the screen reader on the application.

To mitigate this the setup script updates two keys in the Windows registry under `HKCU\Control Panel\Desktop`:

- `ForegroundLockTimeout` - Specifies the time in milliseconds, following user input, during which the system will not allow applications to force themselves into the foreground. Defaults to `200000`.
- `ForegroundFlashCount` - Determines the number of times the taskbar button will flash to notify the user that a background window has been activated by the system. If the time elapsed since the last user input exceeds the value of ForegroundLockTimeout, the window will automatically be brought to the foreground. Defaults to `3`.

Both of these are set to `0` by the setup script.

## Powerful Tooling

Check out some of the other Guidepup modules:

- [`@guidepup/guidepup`](https://github.com/guidepup/guidepup/) - Reliable automation for your screen reader a11y workflows through JavaScript supporting VoiceOver and NVDA.
- [`@guidepup/playwright`](https://github.com/guidepup/guidepup-playwright/) - Seamless integration of Guidepup with Playwright.
- [`@guidepup/virtual-screen-reader`](https://github.com/guidepup/virtual-screen-reader/) - Reliable unit testing for your screen reader a11y workflows.
- [`@guidepup/jest`](https://github.com/guidepup/jest/) - Jest matchers for reliable unit testing of your screen reader a11y workflows.

## Resources

- [Documentation](https://www.guidepup.dev/docs/guides/automated-environment-setup)
- [Contributing](.github/CONTRIBUTING.md)
- [Changelog](https://github.com/guidepup/setup/releases)
- [MIT License](https://github.com/guidepup/setup/blob/main/LICENSE)
