# Guidepup Setup

<a href="https://www.npmjs.com/package/@guidepup/setup"><img alt="Guidepup Setup available on NPM" src="https://img.shields.io/npm/v/@guidepup/setup" /></a>
<a href="https://github.com/guidepup/setup/actions/workflows/test.yml"><img alt="Guidepup Setup test workflows" src="https://github.com/guidepup/setup/workflows/Test/badge.svg" /></a>
<a href="https://github.com/guidepup/setup/blob/main/LICENSE"><img alt="Guidepup Setup uses the MIT license" src="https://img.shields.io/github/license/guidepup/setup" /></a>

## [Documentation](https://www.guidepup.dev/docs/guides/automated-environment-setup)

[![macOS Sonoma Support](https://img.shields.io/badge/macos-Somona-blue.svg?logo=apple)](https://apps.apple.com/us/app/macos-sonoma/id6450717509)
[![macOS Sequoia Support](https://img.shields.io/badge/macos-Sequoia-blue.svg?logo=apple)](https://apps.apple.com/us/app/macos-sequoia/id6596773750)
[![macOS Tahoe Support](https://img.shields.io/badge/macos-Tahoe-blue.svg?logo=apple)](https://www.apple.com/uk/os/macos/)
[![Windows Server 2022 Support](https://img.shields.io/badge/windows_server-2022-blue.svg?logo=windows)](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2022)
[![Windows Server 2025 Support](https://img.shields.io/badge/windows_server-2025-blue.svg?logo=windows)](https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2025)

This package sets up your environment for screen reader automation.

It enables automation for <a href="https://www.guidepup.dev/docs/api/class-voiceover"><b>VoiceOver on macOS</b></a> and <a href="https://www.guidepup.dev/docs/api/class-nvda"><b>NVDA on Windows</b></a>.

## Getting Started

Run this command:

```console
npx @guidepup/setup
```

And get cracking with your screen reader automation code!

## Usage

### Setup

This subcommand allows you to setup an OS environment ready for screen reader automation.

```console
npx @guidepup/setup setup
```

#### CI

If you are running this command in CI/CD, it is recommended to add the `--ci` flag to prevent prompts for manual interaction:

```console
npx @guidepup/setup setup --ci
```

#### macOS

If you are running this command locally you may need to take some manual steps to complete setup by following the [manual VoiceOver setup documentation](https://www.guidepup.dev/docs/guides/manual-voiceover-setup).

##### Ignore TCC Database Updates

If updating the `TCC.db` is not possible (due to enabled SIP) or not required for your macOS setup, you can skip the database update step by using the `--macos-ignore-tcc-db` flag:

```console
npx @guidepup/setup setup --macos-ignore-tcc-db
```

> [!NOTE]
> If the necessary permissions have not been granted by other means, using this flag may result in your environment not being set up for reliable screen reader automation.

##### Recording

If you are encountering errors in CI for macOS you can pass a `--macos-record` flag to the command which will output a screen-recording of the setup to a `./recordings/` directory:

```console
npx @guidepup/setup --ci --macos-record
```

### Install

This subcommand allows you to install screen readers and their assets to use in screen reader automation with [Guidepup](https://www.guidepup.dev/).

```console
npx @guidepup/setup install
```

By default VoiceOver is installed on macOS, and NVDA is installed on Windows.

To install a specific screen reader you can pass it to the command as an argument:

```console
npx @guidepup/setup install voiceover
npx @guidepup/setup install nvda
```

Screen reader options include:

- `voiceover` on macOS (default)
- `nvda` on Windows (default)

#### Using HTTP / HTTPS Proxy for Installation

If you are using a proxy connection, you must define the proxy URL in an env variable. You can use any of the following variables:

- `HTTPS_PROXY`
- `https_proxy`
- `HTTP_PROXY`
- `http_proxy`
- `NO_PROXY`
- `no_proxy`

### Global Install

You can also install the CLI globally:

```console
npm install -g @guidepup/setup
```

After which you can access the CLI through the `guidepup` command:

```console
guidepup setup
guidepup install
```

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
