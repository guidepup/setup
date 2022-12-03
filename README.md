<h1 align="center">Guidepup Setup</h1>
<p align="center">
  <i>Setup your environment for screen-reader automation.</i>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@guidepup/setup"><img alt="Guidepup Setup available on NPM" src="https://img.shields.io/npm/v/@guidepup/setup" /></a>
  <a href="https://github.com/guidepup/setup/actions/workflows/test.yml"><img alt="Guidepup Setup test workflows" src="https://github.com/guidepup/setup/workflows/Test/badge.svg" /></a>
  <a href="https://github.com/guidepup/setup/blob/main/LICENSE"><img alt="Guidepup Setup uses the MIT license" src="https://img.shields.io/github/license/guidepup/setup" /></a>
</p>

## Getting Started 🦮

Run this command:

```bash
npx @guidepup/setup
```

And get cracking with your screen-reader automation code! 🚀

## Usage 🐕‍🦺

For some operating systems, enabling control of screen-readers is tightly controlled.

Depending on the security controls in place, setup might require either UI automation, or manual interaction to complete. Checkout [these guides](https://github.com/guidepup/guidepup/tree/main/guides) if your system requires manual configuration.

If you are running this command in CI/CD, it is recommended to add the `--ci` flag to prevent interactive prompts:

```bash
npx @guidepup/setup --ci
```

If you are using GitHub Actions, check out the dedicated [`guidepup/setup-action`](https://github.com/marketplace/actions/guidepup-setup):

```yaml
- name: Setup Environment
  uses: guidepup/setup-action@0.4.0
```

## Debugging

If you are encountering errors in CI for MacOS you can pass a `--record` flag to the command which will output a screen-recording of the setup to a `./recordings/` directory.

## See Also 🐶

Check out some of the other Guidepup modules:

- [`@guidepup/guidepup`](https://github.com/guidepup/guidepup/)
- [`@guidepup/playwright`](https://github.com/guidepup/guidepup-playwright/)

## Roadmap 🐾

Support:

- [x] VoiceOver on MacOS
- [ ] NVDA on Windows
- [ ] VoiceOver on iOS
- [ ] Talkback on Android

## License 🐩

[MIT](https://github.com/guidepup/setup/blob/main/LICENSE)
