# Lume init

Script to initialize a Lume project.

- You can install themes
  [from this registry](https://github.com/lumeland/themes).
- Install [Lume plugins](https://lume.land/plugins/).
- And configure [the CMS](https://lume.land/cms/).

## Usage

Init Lume in the current directory:

```sh
deno run -Ar https://deno.land/x/lume_init/mod.ts
```

Use the first argument to change the destination folder. For example, to init
Lume in the directory `my-site`:

```sh
deno run -Ar https://deno.land/x/lume_init/mod.ts my-site
```

Use `--src` option to configure the src folder of Lume. For example, to
configure the `src` folder to `/src`:

```sh
deno run -Ar https://deno.land/x/lume_init/mod.ts --src=/src
```

Use the `--theme` option to install directly a theme without asking. For
example, to install `simple-blog` theme:

```sh
deno run -Ar https://deno.land/x/lume_init/mod.ts --theme=simple-blog
```

Use the `--plugins` option to install directly some plugins without asking. For
example, to install `postcss` and `nunjucks` plugins:

```sh
deno run -Ar https://deno.land/x/lume_init/mod.ts --plugins=postcss,nunjucks
```

## Run from lume.land

The website https://lume.land redirects automatically to the latest version of
`lume_init`. For example:

```sh
deno run -Ar https://lume.land

# is equivalent to:
deno run -Ar https://deno.land/x/lume_init/mod.ts
```
