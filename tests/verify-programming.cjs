/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node verification tool. */
// Executes the checked-in exercise sources with real language runtimes.
// No downloaded dependencies or runtime installation are performed by this tool.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    fileName: filename,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  });
  module._compile(output.outputText, filename);
};

const { PROGRAMMING_EXERCISES } = require("../lib/programmingQuestions.ts");
const python = process.env.QUIZ_PYTHON_BIN || "python";
const javac = process.env.QUIZ_JAVAC_BIN || "javac";
const java = process.env.QUIZ_JAVA_BIN || "java";
const compiler = process.env.QUIZ_C_COMPILER || "gcc";
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "quiz-programming-"));
const passed = { C: 0, Java: 0, Python: 0 };
const failures = [];

function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8", timeout: 20000, windowsHide: true, cwd: temp });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${path.basename(command)} exited ${result.status}: ${result.stderr || result.stdout}`);
  return result.stdout.replace(/\r\n/g, "\n").trimEnd();
}

try {
  run(python, ["--version"]);
  run(javac, ["-version"]);
  run(java, ["-version"]);
  run(compiler, ["-v"]);

  // Unique packages allow all Main classes to compile in a single javac call.
  const javaCases = PROGRAMMING_EXERCISES.filter((exercise) => exercise.language === "Java");
  const javaFiles = javaCases.map((exercise, index) => {
    const dir = path.join(temp, `exercise${index}`);
    fs.mkdirSync(dir);
    const file = path.join(dir, "Main.java");
    fs.writeFileSync(file, `package exercise${index};\n${exercise.source}\n`);
    return file;
  });
  run(javac, ["-encoding", "UTF-8", "-source", "8", "-target", "8", "-d", temp, ...javaFiles]);

  for (const exercise of PROGRAMMING_EXERCISES) {
    try {
      let actual;
      if (exercise.language === "Python") {
        const file = path.join(temp, `${exercise.id}.py`);
        fs.writeFileSync(file, exercise.source);
        actual = run(python, ["-I", file]);
      } else if (exercise.language === "C") {
        const file = path.join(temp, `${exercise.id}.c`);
        const executable = path.join(temp, `${exercise.id}${process.platform === "win32" ? ".exe" : ""}`);
        fs.writeFileSync(file, exercise.source);
        run(compiler, ["-std=c99", "-Wall", file, "-o", executable]);
        actual = run(executable, []);
      } else {
        actual = run(java, ["-cp", temp, `exercise${javaCases.indexOf(exercise)}.Main`]);
      }
      assert.equal(actual, exercise.answer, exercise.id);
      passed[exercise.language]++;
    } catch (error) {
      failures.push(`${exercise.id}: ${error.message}`);
    }
  }
  if (failures.length) throw new Error(failures.join("\n"));
  process.stdout.write(`Verified actual output: C ${passed.C}, Java ${passed.Java}, Python ${passed.Python} (${PROGRAMMING_EXERCISES.length} total).\n`);
} catch (error) {
  process.stderr.write(`${error.message}\nSet QUIZ_PYTHON_BIN, QUIZ_JAVAC_BIN, QUIZ_JAVA_BIN and QUIZ_C_COMPILER to installed runtimes if needed.\n`);
  process.exitCode = 1;
} finally {
  // Only remove the exact temporary directory allocated above.
  fs.rmSync(temp, { recursive: true, force: true });
}
