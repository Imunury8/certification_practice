/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS loads the test after registering TypeScript support. */
// Uses the project's installed TypeScript compiler; no extra test dependency is needed.
const fs = require("node:fs");
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    fileName: filename,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  });
  module._compile(output.outputText, filename);
};

require("./studyPlanner.test.ts");
require("./plannerCloud.test.ts");
require("./plannerStorage.test.ts");
