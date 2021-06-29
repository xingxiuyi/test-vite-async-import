# test-vite-async-import

vite build error: Identifier '__vitePreload' has already been declared

## Describe the bug

>A clear and concise description of what the bug is. If you intend to submit a PR for this issue, tell us in the description. Thanks!

Vite library mode (format:es) generates `__vitePreload` function for async import.

When the package is used as a dependency, an error will eventually occur when packaging.

**project: `async-lib`**

If `const value = await import ("some_package")` is used in the library package,  vite will generate `async import` code similar to the following:

```js
// file: packages/async-lib/dist/async-lib.es.js
let scriptRel;
const seen = {};
const __vitePreload = function preload(baseModule, deps) {
  if (!deps) {
    return baseModule();
  }
  ......
};
const asyncFunc = async () => {
  const sf = (await __vitePreload(() => import("./simpleFunc.js"), true ? void 0 : void 0)).simpleFunc;
  return sf();
};
```

**project: `async-package`**

Then reference ES file (generated above) in another project,

```js
// file: packages/async-package/src/main.ts
export async function simpleTest() {
  return (await import("@testproject/async-lib")).asyncFunc();
}
```

An error will be triggered (vite build process).

### question

I looked at the following files in vite project:

`packages/vite/src/node/plugins/importAnalysisBuild.ts`

```js
export function buildImportAnalysisPlugin(config: ResolvedConfig): Plugin {
    ....
    if (needPreloadHelper && !ssr) {
      str().prepend(`import { ${preloadMethod} } from "${preloadHelperId}";`)
    }    
    ....
}
```

Vite build process generates the following code:

```js
import { __vitePreload } from "vite/preload-helper";let scriptRel;
const seen = {};
const __vitePreload = function preload(baseModule, deps) {
  if (!deps) {
    return baseModule();
  }
  if (scriptRel === void 0) {
    const relList = document.createElement("link").relList;
    scriptRel = relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
  }
  ......
}
```

**Error: Identifier '__vitePreload' has already been declared**



## Reproduction

>Please provide a link to a repo that can reproduce the problem you ran into. A reproduction is required unless you are absolutely sure that the issue is obvious and the provided information is enough to understand the problem. If a report is vague (e.g. just a generic error message) and has no reproduction, it will receive a "need reproduction" label. If no reproduction is provided after 3 days, it will be auto-closed.


Example project url: https://github.com/xingxiuyi/test-vite-async-import

```sh
git clone https://github.com/xingxiuyi/test-vite-async-import && cd test-vite-async-import
yarn install && yarn run build 
```

Vite executes the build process, `async lib`  generates JS file in ES format, `async package` references this ES file of `async lib` package, but there are errors in the build process:

```
vite v2.3.8 building for production...
✓ 6 modules transformed.
Identifier '__vitePreload' has already been declared
file: /....../test-vite-async-import/packages/async-lib/dist/async-lib.es.js:3:6
1: let scriptRel;
2: const seen = {};
3: const __vitePreload = function preload(baseModule, deps) {
         ^
4:   if (!deps) {
5:     return baseModule();
error during build:
Error: Identifier '__vitePreload' has already been declared
```

## System Info

>Output of npx envinfo --system --npmPackages vite,@vitejs/plugin-vue --binaries --browsers

```
  System:
    OS: macOS 11.4
    CPU: (8) arm64 Apple M1
    Memory: 943.06 MB / 16.00 GB
    Shell: 5.8 - /bin/zsh
  Binaries:
    Node: 16.4.0 - /opt/homebrew/bin/node
    Yarn: 1.22.10 - /opt/homebrew/bin/yarn
    npm: 7.18.1 - /opt/homebrew/bin/npm
  npmPackages:
    vite: ^2.3.8 => 2.3.8
    @vitejs/plugin-vue: ^1.2.4 => 1.2.4
```

## Used Package Manager

yarn

## Logs

>Optional if provided reproduction. Please try not to insert an image but copy paste the log text.
>Run vite or vite build with the --debug flag. 2. Provide the error log here.

```
yarn run v1.22.10
$ vite build --debug --mode production
  vite:config bundled config file loaded in 48ms +0ms
  vite:config using resolved config: {
  vite:config   build: {
  vite:config     target: [ 'es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1' ],
  vite:config     polyfillDynamicImport: false,
  vite:config     outDir: 'dist',
  vite:config     assetsDir: 'assets',
  vite:config     assetsInlineLimit: 4096,
  vite:config     cssCodeSplit: true,
  vite:config     sourcemap: false,
  vite:config     rollupOptions: {},
  vite:config     commonjsOptions: { include: [Array], extensions: [Array] },
  vite:config     minify: false,
  vite:config     terserOptions: {},
  vite:config     cleanCssOptions: {},
  vite:config     write: true,
  vite:config     emptyOutDir: null,
  vite:config     manifest: false,
  vite:config     lib: false,
  vite:config     ssr: false,
  vite:config     ssrManifest: false,
  vite:config     brotliSize: false,
  vite:config     chunkSizeWarningLimit: 500,
  vite:config     watch: null
  vite:config   },
  vite:config   plugins: [
  vite:config     'alias',
  vite:config     'vite:dynamic-import-polyfill',
  vite:config     'vite:resolve',
  vite:config     'vite:html',
  vite:config     'vite:css',
  vite:config     'vite:esbuild',
  vite:config     'vite:json',
  vite:config     'vite:wasm',
  vite:config     'vite:worker',
  vite:config     'vite:asset',
  vite:config     'vite:vue',
  vite:config     'vite:define',
  vite:config     'vite:css-post',
  vite:config     'vite:build-html',
  vite:config     'commonjs',
  vite:config     'vite:data-uri',
  vite:config     'rollup-plugin-dynamic-import-variables',
  vite:config     'vite:import-analysis',
  vite:config     'vite:esbuild-transpile',
  vite:config     'vite:reporter'
  vite:config   ],
  vite:config   mode: 'production',
  vite:config   define: { __VUE_OPTIONS_API__: true, __VUE_PROD_DEVTOOLS__: false },
  vite:config   ssr: { external: [ 'vue', '@vue/server-renderer' ] },
  vite:config   configFile: '....../test-vite-async-import/packages/async-package/vite.config.ts',
  vite:config   configFileDependencies: [ 'vite.config.ts' ],
  vite:config   inlineConfig: {
  vite:config     root: undefined,
  vite:config     base: undefined,
  vite:config     mode: 'production',
  vite:config     configFile: undefined,
  vite:config     logLevel: undefined,
  vite:config     clearScreen: undefined,
  vite:config     build: {}
  vite:config   },
  vite:config   root: '....../test-vite-async-import/packages/async-package',
  vite:config   base: '/',
  vite:config   resolve: { dedupe: undefined, alias: [ [Object] ] },
  vite:config   publicDir: '....../test-vite-async-import/packages/async-package/public',
  vite:config   cacheDir: '....../test-vite-async-import/packages/async-package/node_modules/.vite',
  vite:config   command: 'build',
  vite:config   isProduction: true,
  vite:config   server: {
  vite:config     fsServe: {
  vite:config       root: '....../test-vite-async-import',
  vite:config       strict: false
  vite:config     }
  vite:config   },
  vite:config   env: { BASE_URL: '/', MODE: 'production', DEV: false, PROD: true },
  vite:config   assetsInclude: [Function: assetsInclude],
  vite:config   logger: {
  vite:config     hasWarned: false,
  vite:config     info: [Function: info],
  vite:config     warn: [Function: warn],
  vite:config     warnOnce: [Function: warnOnce],
  vite:config     error: [Function: error],
  vite:config     clearScreen: [Function: clearScreen]
  vite:config   },
  vite:config   createResolver: [Function: createResolver],
  vite:config   optimizeDeps: { esbuildOptions: { keepNames: undefined } }
  vite:config } +3ms
vite v2.3.8 building for production...
✓ 6 modules transformed.
Identifier '__vitePreload' has already been declared
file: /....../test-vite-async-import/packages/async-lib/dist/async-lib.es.js:3:6
1: let scriptRel;
2: const seen = {};
3: const __vitePreload = function preload(baseModule, deps) {
         ^
4:   if (!deps) {
5:     return baseModule();
error during build:
Error: Identifier '__vitePreload' has already been declared
    at error (....../test-vite-async-import/node_modules/rollup/dist/shared/rollup.js:164:30)
    at Module.error (....../test-vite-async-import/node_modules/rollup/dist/shared/rollup.js:9888:16)
    at Module.tryParse (....../test-vite-async-import/node_modules/rollup/dist/shared/rollup.js:10287:25)
    at Module.setSource (....../test-vite-async-import/node_modules/rollup/dist/shared/rollup.js:10190:24)
    at ModuleLoader.addModuleSource (....../test-vite-async-import/node_modules/rollup/dist/shared/rollup.js:19504:20)
    at async ModuleLoader.fetchModule (....../test-vite-async-import/node_modules/rollup/dist/shared/rollup.js:19560:9)
    at async ....../test-vite-async-import/node_modules/rollup/dist/shared/rollup.js:19535:48
    at async Promise.all (index 0)
    at async ModuleLoader.fetchDynamicDependencies (....../test-vite-async-import/node_modules/rollup/dist/shared/rollup.js:19525:30)
    at async Promise.all (index 1)
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.

```
