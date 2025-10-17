# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/) and this
project adheres to [Semantic Versioning](https://semver.org/).

## [0.5.3] - 2025-10-17
### Fixed
- Make import permissions explicit.
- Import permissions for `sheets` plugin.

## [0.5.2] - 2025-10-17
### Fixed
- Import Lume from JsDelivr.
- Added `registry.npmjs.org:443` to net permissions.

## [0.5.1] - 2025-10-17
### Fixed
- Added `data.jsdelivr.com:443` to net permissions.

## [0.5.0] - 2025-10-17
### Added
- `.env` path to `.gitignore`.
- Change `lume` task to use bare import and full descriptors (`command` and `description`).
- Added Deno permissions to `deno.json` file.

### Changed
- Upgraded minimum Deno version to `2.4.0`.
- Disable `deno.lock` file by default because it causes a lot of conflicts.

### Removed
- `cms` task since it's no longer needed.

## [0.4.3] - 2025-09-10
### Changed
- Disable `no-import-prefix` lint rule by default.

## [0.4.2] - 2025-08-11
### Changed
- Use Nudd to resolve dependencies.

### Fixed
- Don't use the beta version of LumeCMS.

## [0.4.1] - 2025-06-04
### Added
- `fmt-component` unstable flag, to format Vento files by default.

## [0.4.0] - 2025-05-07
### Changed
- Lume 3.

## [0.3.4] - 2025-05-02
### Added
- Lint plugin for Lume.

### Changed
- Append changes to deno.json if the file already exists [#4].

## [0.3.3] - 2025-04-17
### Fixed
- Install & upgrade Lume 2

## [0.3.2] - 2025-04-09
### Changed
- Install & upgrade Lume 3 on `--dev`

### Fixed
- Show a better message on upgrading lumecms.
- Replaced GitHub API with JsDelivr to avoid API rate limit exceeded errors.

## [0.3.1] - 2025-03-27
### Fixed
- Upgrade LumeCMS if the `cms` task doesn't exist but `imports["lume/cms/"]` does.
- Ensure Lume is upgraded to v2.

## [0.3.0] - 2025-01-06
### Added
- Support for `deno.jsonc`.
- Allows to install any dev branch combining `--dev` and `--version`.

### Changed
- Remove JavaScript/TypeScript prompt. TypeScript is the default format. Use `--javascript` flag to use JavaScript.

### Fixed
- Confirm to overwrite existing files.

## [0.2.7] - 2024-09-08
### Fixed
- Keep existing imports after upgrading Lume with an external import map file.
- Don't override lume tasks after upgrading.

## [0.2.6] - 2024-08-30
### Changed
- Upgrade Deno minimum version to `1.46`.

## [0.2.5] - 2024-07-18
### Added
- Support for themes from jsDelivr.

### Fixed
- Simplify the success screen.

## [0.2.4] - 2024-06-14
### Fixed
- Upgrade Lume in an external import map file.

## [0.2.3] - 2024-06-04
### Fixed
- Lume dev version specifier.

## [0.2.2] - 2024-06-04
### Added
- New `--version | -v` argument to `init` and `upgrade`.

## [0.2.1] - 2024-06-03
### Fixed
- Don't ask for mode if `--plugins` or `--theme` is passed.

## [0.2.0] - 2024-06-03
### Added
- Check Deno version
- `upgrade.ts` script to upgrade Lume to the latest version.
- `--dev | -d` argument to install a development version.
- `--cms | --no-cms` argument to install or not the CMS.

### Changed
- Reduce the number of questions.

## [0.1.12] - 2024-05-02
### Changed
- Use `jsxImportSourceTypes` introduced in Deno 1.43 instead of `types` array.

## [0.1.11] - 2024-04-29
### Changed
- Replaced "Maybe later" with "No" for clarity [#3].
- Moved URL hints to the step message [#3].

### Fixed
- Updated dependencies.

## [0.1.10] - 2024-04-19
### Fixed
- `.gitignore` generation [#1].

## [0.1.9] - 2024-04-19
### Added
- `.gitignore` file [#1].

### Fixed
- Added an empty line at the end of `deno.json` file.

## [0.1.8] - 2024-04-01
### Added
- Support for additional imports and compiler options of themes.

### Changed
- Sort themes alphabetically.

## [0.1.7] - 2024-04-01
### Added
- Support for unstable flags.

## [0.1.6] - 2024-03-29
### Changed
- Use import maps to import LumeCMS.

## [0.1.5] - 2024-03-28
### Changed
- The `_cms.ts` file is imported, instead of copied.

## [0.1.4] - 2024-03-28
### Added
- `run` function.

## [0.1.3] - 2024-03-26
### Fixed
- `src` configuration

## [0.1.2] - 2024-03-24
### Added
- `--plugins` argument.

## [0.1.1] - 2024-03-23
### Added
- `--theme` argument.

### Changed
- Welcome message

## [0.1.0] - 2024-03-22
First version

[#1]: https://github.com/lumeland/init/issues/1
[#3]: https://github.com/lumeland/init/issues/3
[#4]: https://github.com/lumeland/init/issues/4

[0.5.3]: https://github.com/lumeland/init/compare/v0.5.2...v0.5.3
[0.5.2]: https://github.com/lumeland/init/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/lumeland/init/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/lumeland/init/compare/v0.4.3...v0.5.0
[0.4.3]: https://github.com/lumeland/init/compare/v0.4.2...v0.4.3
[0.4.2]: https://github.com/lumeland/init/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/lumeland/init/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/lumeland/init/compare/v0.3.4...v0.4.0
[0.3.4]: https://github.com/lumeland/init/compare/v0.3.3...v0.3.4
[0.3.3]: https://github.com/lumeland/init/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/lumeland/init/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/lumeland/init/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/lumeland/init/compare/v0.2.7...v0.3.0
[0.2.7]: https://github.com/lumeland/init/compare/v0.2.6...v0.2.7
[0.2.6]: https://github.com/lumeland/init/compare/v0.2.5...v0.2.6
[0.2.5]: https://github.com/lumeland/init/compare/v0.2.4...v0.2.5
[0.2.4]: https://github.com/lumeland/init/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/lumeland/init/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/lumeland/init/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/lumeland/init/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/lumeland/init/compare/v0.1.12...v0.2.0
[0.1.12]: https://github.com/lumeland/init/compare/v0.1.11...v0.1.12
[0.1.11]: https://github.com/lumeland/init/compare/v0.1.10...v0.1.11
[0.1.10]: https://github.com/lumeland/init/compare/v0.1.9...v0.1.10
[0.1.9]: https://github.com/lumeland/init/compare/v0.1.8...v0.1.9
[0.1.8]: https://github.com/lumeland/init/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/lumeland/init/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/lumeland/init/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/lumeland/init/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/lumeland/init/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/lumeland/init/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/lumeland/init/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/lumeland/init/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/lumeland/init/releases/tag/v0.1.0
