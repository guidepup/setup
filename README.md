<h1 align="center">Guidepup Setup</h1>
<p align="center">
  <i>Setup your environment for screen reader test automation.</i>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@guidepup/setup"><img alt="Guidepup Setup available on NPM" src="https://img.shields.io/npm/v/@guidepup/setup" /></a>
  <a href="https://github.com/guidepup/setup/actions/workflows/test.yml"><img alt="Guidepup Setup test workflows" src="https://github.com/guidepup/setup/workflows/Test/badge.svg" /></a>
  <a href="https://github.com/guidepup/setup/blob/main/LICENSE"><img alt="Guidepup Setup uses the MIT license" src="https://img.shields.io/github/license/guidepup/setup" /></a>
</p>

## Getting Started

Run this command:

```console
npx @guidepup/setup
```

And get cracking with your screen reader test automation code!

## Usage

If you are running this command in CI/CD, it is recommended to add the `--ci` flag to prevent interactive prompts:

```console
npx @guidepup/setup --ci
```

If you are using GitHub Actions, check out the dedicated [`guidepup/setup-action`](https://github.com/marketplace/actions/guidepup-setup):

```yaml
- name: Setup Environment
  uses: guidepup/setup-action@0.8.1
```

If you are encountering errors in CI for MacOS you can pass a `--record` flag to the command which will output a screen-recording of the setup to a `./recordings/` directory:

```console
npx @guidepup/setup --ci --record
```

Check out the [Documentation Website](https://www.guidepup.dev/docs/guides/environment) for more information.

## NVDA Installation

When running on windows a portable NVDA instance compatible with Guidepup will be installed to a temporary directory. The location of this installation directory is stored in the Windows registry under the key `HKCU\Software\Guidepup\Nvda`.

## See Also

Check out some of the other Guidepup modules:

- [`@guidepup/guidepup`](https://github.com/guidepup/guidepup/)
- [`@guidepup/playwright`](https://github.com/guidepup/guidepup-playwright/)

## Support

- VoiceOver on MacOS
- NVDA on Windows

## License

[MIT](https://github.com/guidepup/setup/blob/main/LICENSE)
