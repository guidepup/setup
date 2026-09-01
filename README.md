# `@guidepup/setup`

<a href="https://www.npmjs.com/package/@guidepup/setup"><img alt="Guidepup Setup available on NPM" src="https://img.shields.io/npm/v/@guidepup/setup" /></a>
<a href="https://github.com/guidepup/setup/actions/workflows/test.yml"><img alt="Guidepup Setup test workflows" src="https://github.com/guidepup/setup/workflows/Test/badge.svg" /></a>
<a href="https://github.com/guidepup/setup/blob/main/LICENSE"><img alt="Guidepup Setup uses the MIT license" src="https://img.shields.io/github/license/guidepup/setup" /></a>

## [Documentation](https://www.guidepup.dev/docs/guides/automated-environment-setup)

[![macOS Sonoma Support](https://img.shields.io/badge/macos-Somona-blue.svg?logo=apple)](https://apps.apple.com/us/app/macos-sonoma/id6450717509)
[![macOS Sequoia Support](https://img.shields.io/badge/macos-Sequoia-blue.svg?logo=apple)](https://apps.apple.com/us/app/macos-sequoia/id6596773750)
[![macOS Tahoe Support](https://img.shields.io/badge/macos-Tahoe-blue.svg?logo=apple)](https://www.apple.com/uk/os/macos/)
[![Windows Server 2022 Support](https://img.shields.io/badge/windows_server-2022-blue.svg?logo=windows)](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2022)
[![Windows Server 2025 Support](https://img.shields.io/badge/windows_server-2025-blue.svg?logo=windows)](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2025)
[![Ubuntu Resolute Support](https://img.shields.io/badge/ubuntu-26.04%2B-blue.svg?logo=ubuntu)](https://releases.ubuntu.com/resolute/)
[![Debian Trixie Support](https://img.shields.io/badge/debian-13%2B-blue.svg?logo=debian)](https://www.debian.org/releases/trixie/)

The `@guidepup/setup` CLI enables automation for <b>Orca on Linux</b>, <a href="https://www.guidepup.dev/docs/api/class-voiceover"><b>VoiceOver on macOS</b></a>, and <a href="https://www.guidepup.dev/docs/api/class-nvda"><b>NVDA on Windows</b></a>.

## Quick start

```sh
# Set up machine once for screen reader automation
npx @guidepup/setup setup

# In project directory install Guidepup
npm install @guidepup/guidepup

# In project directory install required screen reader assets
npx @guidepup/setup install
```

## Environment setup

The `setup` CLI command configures your operating system for screen reader automation and only needs to be run once per machine:

```sh
npx @guidepup/setup setup
```

### CI

If you are running the `setup` CLI command in CI/CD, it is recommended to add the `--ci` flag to prevent prompts for manual interaction:

```sh
npx @guidepup/setup setup --ci
```

### macOS

If you are running this command locally you may need to take some manual steps to complete setup by following the [manual VoiceOver setup documentation](https://www.guidepup.dev/docs/guides/manual-voiceover-setup).

#### Ignoring TCC database updates

If updating the `TCC.db` is not possible (due to enabled System Integrity Protection) or not required for your macOS setup, you can skip database updates by using the `--macos-ignore-tcc-db` flag:

```sh
npx @guidepup/setup setup --macos-ignore-tcc-db
```

> [!NOTE]
> If the necessary permissions have not been granted by other means, using this flag may result in your environment not being set up for reliable screen reader automation.

> [!WARNING]
> For system TCC.db updates you must first disable [System Integrity Protection (SIP)](https://support.apple.com/en-gb/102149). This comes with **serious security implications**, so please first refer to the [Apple documentation](https://developer.apple.com/documentation/security/disabling-and-enabling-system-integrity-protection) for more details before taking any action. Consider whether you are able to use alternative manual setup steps for configuration before exploring this option further.
>
> SIP only needs to be disabled while the required changes are being made. Re-enable SIP once the `setup` CLI command has completed.

#### Recording

If you are encountering errors in CI for macOS you can pass a `--macos-record` flag to the command which will output a screen-recording of the setup to a `./recordings/` directory:

```sh
npx @guidepup/setup setup --ci --macos-record
```

## Installing screen reader assets

Each version of Guidepup requires specific screen reader assets to execute correctly.

Install the default supported screen reader assets with one command from your project directory:

```sh
npx @guidepup/setup install
```

The `install` CLI command uses your project's installed `@guidepup/guidepup` version to determine which screen reader assets to install.

New Guidepup releases may update the required screen reader assets. If you update Guidepup, rerun the `install` CLI command to install the latest supported screen reader assets.

You can install a specific screen reader by providing additional arguments to the `install` CLI command:

```sh
# Install VoiceOver
npx @guidepup/setup install voiceover

# Install NVDA
npx @guidepup/setup install nvda

# Install Orca
npx @guidepup/setup install orca
```

Screen reader options include:

- `orca` on Linux (default)
- `voiceover` on macOS (default)
- `nvda` on Windows (default)

### Managing screen reader assets

By default Guidepup downloads screen reader assets into the operating system's standard cache directory:

- `~/.cache/guidepup/` on Linux
- `~/Library/Caches/guidepup/` on macOS
- `%USERPROFILE%\AppData\Local\guidepup\` on Windows

You can override the default cache directory using an environment variable:

```sh
GUIDEPUP_SCREEN_READERS_PATH=$HOME/guidepup npx @guidepup/setup install
```

### Unused screen reader cleanup

Guidepup tracks which projects use each installed screen reader asset. When an asset is no longer referenced by any project, it is automatically removed the next time the `install` CLI command runs.

### Installing behind a proxy

Guidepup screen readers are installed directly from GitHub release URLs. If you are using a proxy you can use an environment variable to define the proxy URL:

```sh
HTTPS_PROXY=https://192.0.2.1 npx @guidepup/setup install
```

## Global install

You can install the CLI globally:

```sh
npm install -g @guidepup/setup
```

After which you can access the CLI directly through the `guidepup` command:

```sh
guidepup setup
guidepup install
```

## Powerful tooling

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
