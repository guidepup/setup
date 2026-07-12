CLI Specification

Summary

This document defines the public behaviour of the @guidepup/setup CLI.

The CLI has two primary responsibilities:

- Configure the local environment required by Guidepup.
- Install screen reader assets required by an installed version of @guidepup/guidepup.

The CLI intentionally mirrors the Playwright CLI where appropriate, providing a familiar developer experience while remaining independent from the implementation details of individual screen readers.

⸻

Goals

- Simple, predictable command structure.
- Separate environment configuration from screen reader installation.
- Reproducible installations.
- Deterministic asset selection.
- Shared per-user cache.
- Offline operation when all required assets already exist.
- Future extensibility without breaking existing users.

⸻

Non-goals

The following are explicitly out of scope for this specification:

- Updating installed screen readers.
- Listing installed screen readers.
- Uninstalling screen readers.
- Pruning unused assets.
- Defining the manifest schema (covered separately).

⸻

CLI

Commands

Setup

Configures the local environment required by Guidepup.

guidepup setup

This command performs environment configuration only.

It MUST NOT:

- download screen readers
- install screen readers
- invoke the install command implicitly

⸻

Install

Installs screen reader assets.

guidepup install
guidepup install <screen-reader>

Examples:

guidepup install
guidepup install nvda
guidepup install voiceover

When no screen reader is specified, the CLI installs all screen readers that:

- are compatible with the current operating system
- have defaultDownload: true in the manifest

When a screen reader is specified, only that screen reader is processed.

If the requested screen reader is incompatible with the current operating system, the CLI MUST:

- print a clear error explaining the incompatibility
- exit with status code 1

⸻

Help

guidepup --help
guidepup install --help

⸻

Version

guidepup --version

⸻

Manifest

Source of truth

@guidepup/guidepup owns compatibility between Guidepup and screen reader assets.

@guidepup/setup MUST NOT contain hardcoded knowledge of compatible screen reader versions.

Instead it reads a manifest supplied by the installed @guidepup/guidepup package.

The manifest is the public contract between the runtime package and the CLI.

⸻

Location

The manifest MUST exist at:

@guidepup/guidepup/
manifest.json

⸻

Discovery

The CLI discovers the installed Guidepup package using normal Node.js module resolution.

The nearest installed @guidepup/guidepup package is used.

No CLI flags are required to locate the manifest.

⸻

Missing package

If no local installation of @guidepup/guidepup can be found, the CLI MUST fail with a clear error.

Example:

No local installation of @guidepup/guidepup was found.
Install @guidepup/guidepup before running:
guidepup install

Exact wording is implementation defined.

Exit status:

1

⸻

Manifest validation

The CLI MUST validate that:

- the manifest exists
- the manifest is valid JSON
- required fields exist
- the schema version is supported

If validation fails, the CLI MUST fail with a clear error explaining that the installation appears invalid or corrupted.

The CLI MUST NOT attempt to recover from an invalid manifest.

Exit status:

1

⸻

Manifest schema version

The manifest contains a schema version.

The CLI supports one or more schema versions.

If the CLI encounters an unsupported schema version it MUST fail with an error instructing the user to upgrade @guidepup/setup.

Compatibility is determined by the manifest schema version—not by the versions of either npm package.

⸻

Asset Resolution

The manifest defines:

- supported screen readers
- compatible operating systems
- downloadable asset information
- checksum
- default download behaviour

The CLI consumes this information without embedding compatibility logic.

⸻

Cache

Default location

Downloaded assets are stored in a per-user cache.

Platform defaults:

macOS

~/Library/Caches/guidepup

Linux

~/.cache/guidepup

Windows

%LOCALAPPDATA%\guidepup

⸻

Override

The cache location may be overridden using:

GUIDEPUP_SCREEN_READERS_PATH

This path may point anywhere accessible to the current user.

The CLI does not distinguish between user and machine-wide installations.

⸻

Installation Behaviour

For every required asset:

1. Resolve the asset from the manifest.
2. Check whether the required version already exists.
3. Validate the local asset against the checksum in the manifest.
4. If valid:
   - perform no download
   - report success (wording implementation defined)
5. If missing or invalid:
   - obtain the asset
   - verify download integrity
   - install the asset
   - validate the installed result

The CLI should be self-healing.

Corrupt or incomplete installations are automatically replaced.

⸻

Integrity

The manifest is the trusted description of every asset.

It contains sufficient information to validate both downloaded and installed assets.

The download mechanism is intentionally abstract.

Initially the CLI may construct GitHub Release download URLs.

Future implementations may instead use:

- GitHub APIs
- mirrors
- CDNs
- dedicated artifact services
- CLI tooling

without requiring manifest changes.

⸻

Offline Behaviour

If every required asset already exists locally and passes checksum validation:

- no network requests are required
- the install command succeeds
- the command behaves as a no-op

Internet access is only required when an asset must be downloaded or replaced.

⸻

Multiple Assets

Each asset installation is independent.

If one asset fails to install, remaining assets should still be attempted.

At completion:

If every asset succeeds:

Exit status:

0

If one or more assets fail:

- report failures
- exit with status code

1

⸻

Asset Lifetime

Installing assets never removes existing assets.

The install command only:

- installs missing assets
- repairs corrupted assets

Automatic pruning is out of scope.

Future CLI commands may introduce explicit cache management.

⸻

Design Principles

The CLI follows these principles:

- Guidepup owns compatibility.
- The manifest is the contract.
- The CLI executes the manifest.
- Assets are shared across projects.
- Existing installations are reused whenever possible.
- Installs are reproducible.
- Offline operation is supported.
- Commands perform one responsibility only.
- Destructive operations are always explicit.
