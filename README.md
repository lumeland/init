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

Init Lume in the directory `my-site`

```sh
deno run -A mod.ts my-site
```

Init Lume in the directory `my-site` and configure the `src` folder to `/src`:

```sh
deno run -A mod.ts my-site --src=/src
```
