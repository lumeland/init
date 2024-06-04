# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/) and this
project adheres to [Semantic Versioning](https://semver.org/).

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
