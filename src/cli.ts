"use strict";
import * as fs from "fs";
import * as path from "path";
import * as commandpost from "commandpost";
import * as escodegen from "escodegen";
import {parse} from "./parser/parser";
import {analyze} from "./parser/analyzer";

const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf8"));

interface RootOpts {
  base: string[];
}

const root = commandpost
  .create<RootOpts, {}>("cowlick")
  .version(packageJson.version, "-v, --version")
  .action(() => {
    process.stdout.write(root.helpText() + "\n");
  });

interface CompileOpts {
  output: string[];
}

interface CompileArgs {
  scenario: string;
}

root
  .subCommand<CompileOpts, CompileArgs>("compile [scenario]")
  .description("compile cowlick scenario")
  .option("-o, --output <output>", "output format of scenario")
  .action((opts, args) => {
    const output: string = opts.output[0] || "script";
    const outputPath = path.resolve(process.cwd(), output);
    const targetPath = path.resolve(process.cwd(), args.scenario);
    const basePath = path.dirname(targetPath);
    const result = analyze(parse(targetPath, basePath));
    if (! fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }
    fs.writeFileSync(path.join(outputPath, "scenario.js"), escodegen.generate(result.scenario));
    for(const s of result.scripts) {
      s.write(outputPath);
    }
  });

commandpost
  .exec(root, process.argv)
  .then(() => {
    process.stdout.write("");
    process.exit(0);
  }, err => {
    console.error("uncaught error", err);
    if (err.stack) {
      console.error(err.stack);
    }
    process.stdout.write("");
    process.exit(1);
  });
