# Lume init

Script to initialize a Lume project.

- You can install themes
  [from this registry](https://github.com/lumeland/themes).
- Install [Lume plugins](https://lume.land/plugins/).
- And configure [the CMS](https://lume.land/cms/).

## Usage

Init Lume in the current directory:

```sh
deno run -A mod.ts
```

Use the first argument to change the destination folder. For example, to init
Lume in the directory `my-site`:

```sh
deno run -A mod.ts my-site
```

### Options

`--src`: Configure the src folder of Lume. For example, to configure the `src`
folder to `/src`:

```sh
deno run -A mod.ts --src=/src
```

`--theme`: Install directly a theme without asking. For example, to install
`simple-blog` theme:

```sh
deno run -A mod.ts --theme=simple-blog
```

`--plugins`: Install directly some plugins without asking. For example, to
install `postcss` and `nunjucks` plugins:

```sh
deno run -A mod.ts --plugins=postcss,nunjucks
```

`--javascript`: Create `_config.js` instead of `_config.ts` file. For example:

```sh
deno run -A mod.ts --javascript
```

`--cms`: Creates the `_cms.ts` file directly without asking. Use `--no-cms` to
don't create it.

## Run from lume.land

The website https://lume.land/init.ts redirects automatically to the latest
version of `lume_init`. For example:

```sh
deno run -A https://lume.land/init.ts

# is equivalent to:
deno run -Ar https://deno.land/x/lume_init/mod.ts
```

## Upgrade

The `upgrade.ts` script upgrades an existing Lume site to the latest version.

### Options

`--version`: To upgrade to a specific Lume version, instead of the latest:

```sh
deno run -A upgrade.ts --version=2.1.0
```

`--dev`: To upgrade to the latest development version (the most recent commit of
the Git repo):

```sh
deno run -A upgrade.ts --dev
```
