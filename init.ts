/** Content of deno.json file */
export interface DenoConfig {
  importMap?: string;
  imports?: Record<string, string>;
  tasks?: Record<string, string>;
  compilerOptions?: CompilerOptions;
  unstable?: string[];
  [key: string]: unknown;
}

export interface CompilerOptions {
  jsx?: "jsx" | "react-jsx" | "precompile";
  jsxImportSource?: string;
  jsxImportSourceTypes?: string;
  jsxFactory?: string;
  jsxFragmentFactory?: string;
  types?: string[];
}

/** Lume plugin options */
export interface LumePlugin {
  name: string;
  url?: string;
}

/** Lume configuration */
export interface LumeConfig {
  version: string;
  file: string;
  plugins: LumePlugin[];
  src: string;
  theme?: Theme;
}

/** Theme manifest */
export interface Theme {
  id: string;
  name: string;
  description: string;
  tags: string[];
  author: {
    name: string;
    url: string;
  };
  repo: string;
  demo: string;
  screens: {
    desktop: string[];
    mobile: string[];
  };
  module: {
    name: string;
    origin: string;
    main: string;
    cms?: string;
    src?: string[];
    srcdir?: string;
    unstable?: string[];
    imports?: Record<string, string>;
    compilerOptions?: CompilerOptions;
  };
}

/** Step of the initialization */
type Step = (init: Init) => false | void | Promise<void | false>;

export interface InitConfig {
  dev?: boolean;
  path: string;
  src?: string;
  theme?: string;
  plugins?: string[];
  mode?: string;
  cms?: boolean;
  version?: string;
}

/** Class to manage the initialization */
export class Init {
  config: InitConfig;
  path: string;
  dev: boolean;
  steps = new Map<number, Step[]>();
  deno: DenoConfig = {};
  lume: LumeConfig = {
    version: "",
    file: "",
    src: "",
    plugins: [],
  };
  files = new Map<string, string | Uint8Array>();

  constructor(config: InitConfig) {
    this.config = config;
    this.path = config.path;
    this.dev = config.dev || false;
    const src = config.src || "";
    this.lume.src = src !== "" && !src.startsWith("/") ? `/${src}` : src;
  }

  use(step: Step, order = 0) {
    const steps = this.steps.get(order) || [];
    steps.push(step);
    this.steps.set(order, steps);
  }

  async run() {
    const orders = Array.from(this.steps.keys()).sort();
    for (const order of orders) {
      const steps = this.steps.get(order)!;
      for (const step of steps) {
        const next = await step(this);

        if (next === false) {
          return;
        }
      }
    }
  }
}
