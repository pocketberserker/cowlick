"use strict";
import * as assert from "assert";
import * as fs from "fs";
import * as glob from "glob";
import * as kag from "../resources/kag";

function appendSyntaxErrorinfo(e: any) {
  "use strict";

  if (e instanceof kag.SyntaxError) {
    const se: kag.SyntaxError = e;
    const l = se.location.start;
    const info = "raised: offset = " + l.offset + ", line = " + l.line + ", column = " + l.column;
    se.message = info + ". " + se.message;
  }
}

describe("KAGParser", () => {

  describe("正しい構文が処理できる", () => {
    const path = "test/fixture/kag/valid/";
    let files = glob.sync(`${path}**/*.ks`);

    files
      .forEach((filePath: string) => {
        const baseName = filePath
          .substr(0, filePath.length - "/content.ks".length)
          .substr(path.length);
        const astFilePath = `${path}${baseName}/content.ast`;
        it(`${filePath}`, () => {
          const text = fs.readFileSync(filePath, "utf8");
          try {
            const actual = kag.parse(text);
            const expectedAST = fs.readFileSync(astFilePath, "utf8");
            assert.deepEqual(actual.frames, JSON.parse(expectedAST));
          } catch(e) {
            appendSyntaxErrorinfo(e);
            throw e;
          }
        });
      });
  });

  describe("正しくない構文のファイルが処理できる", () => {
    let path = "test/fixture/kag/invalid/";
    let files = glob.sync(`${path}**/*.ks`);
    files
      .forEach((filePath: string) => {
        let baseName = filePath
          .substr(0, filePath.length - "/content.ks".length)
          .substr(path.length);

        it(`${filePath}`, () => {
          let data = fs.readFileSync(filePath, "utf8");
          try {
            kag.parse(data);
            throw new Error("正しく処理できてしまった");
          } catch (e) {
            if (e instanceof kag.SyntaxError) {
              // ok
            } else {
              throw e;
            }
          }
        });
    });
});
});
