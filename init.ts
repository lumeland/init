/** Content of deno.json file */
export interface DenoConfig {
  imports?: Record<string, string>;
  tasks?: Record<string, string>;
  compilerOptions?: {
    jsx?: "jsx" | "react-jsx" | "precompile";
    jsxImportSource?: string;
    types?: string[];
  };
  [key: string]: unknown;
}

/** Lume plugin options */
export interface LumePlugin {
  name: string;
  url?: string;
}

/** Lume configuration */
export interface LumeConfig {
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
  };
}

/** Step of the initialization */
type Step = (init: Init) => false | void | Promise<void | false>;

export interface InitConfig {
  path: string;
  src?: string;
  theme?: string;
  plugins?: string[];
}

/** Class to manage the initialization */
export class Init {
  config: InitConfig;
  path: string;
  steps = new Map<number, Step[]>();
  deno: DenoConfig = {};
  lume: LumeConfig = {
    file: "",
    src: "",
    plugins: [],
  };
  files = new Map<string, string | Uint8Array>();

  constructor(config: InitConfig) {
    this.config = config;
    this.path = config.path;
    const src = config.src || "";
    this.lume.src = config.src !== "" && !src.startsWith("/") ? `/${src}` : src;
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
