const unified = require("unified");
const plugin = require("../lib");
const remark2rehype = require("remark-rehype");
const doc = require("rehype-document");
const format = require("rehype-format");
const html = require("rehype-stringify");
const vfile = require("to-vfile");
const report = require("vfile-reporter");
const diff = require("diff");
const colors = require("colors/safe");

const remarkVersions = {
  "12": {
    toMarkdown: require("remark-stringify"),
    markdown: require("remark-parse"),
  },/*
  "13": {
    toMarkdown: require("remark13-remark-stringify"),
    markdown: require("remark13-remark-parse"),
  },*/
};

// naive diff, works fine for short files
const diffVfile = (a, b) => {
  if (a.toString() !== b.toString()) {
    const changes = diff.diffLines(a.toString(), b.toString());
    const pretty = changes
      .map(group => {
        let text = group.value;
        if (group.added) {
          return text
            .trimEnd()
            .split("\n")
            .map(line => `+ |${colors.green(line)}`)
            .join("\n");
        } else if (group.removed) {
          return text
            .trimEnd()
            .split("\n")
            .map(line => `- |${colors.red(line)}`)
            .join("\n");
        } else {
          return text
            .trimEnd()
            .split("\n")
            .map( (line, index, array) => index === 2 && index <= array.length-3
              ? `...${array.length-4} more unchanged lines...`
              : `  |${line}`)
            .filter( (line, index, array) => index < 3 || index > array.length-3 )
            .join("\n");
        }
      })
      .join("\n");
    return { same: true, pretty };
  } else {
    return { same: false, pretty: "" };
  }
};

const testHtml = (processor, filename) => {
    let success = true;
    processor.process(vfile.readSync("./test/sample.md"), (error, result) => {
      console.error(report(error || result));
      if (error) {
        throw error;
      }
      if (result) {
        result.basename = `${filename}.html`;
        vfile.writeSync(result);
        const ref = vfile.readSync(`./test/${filename}.ref.html`);
        const { same, pretty } = diffVfile(result, ref);
        if (same) {
          console.log(
            `${colors.red("Files do not match")} for ${filename} test.`
          );
          console.log(pretty);
          success = false;
        } else {
          console.log(`${colors.green("Files match")} for ${filename} test.`);
        }
      }
    });
    return success;
};

const testAst = (processor, filename) => {
  let success = true;
  const ast = processor.parse(vfile.readSync("./test/sample.md"));

  const result = JSON.stringify(ast, null, 2);
  vfile.writeSync({ path: `./test/${filename}.json`, contents: result });
  const ref = vfile.readSync(`./test/${filename}.ref.json`);
  const { same, pretty } = diffVfile(result, ref);
  if (same) {
    console.log(
      `${colors.red("Files do not match")} for ${filename} AST test.`
    );
    console.log(pretty);
    success = false;
  } else {
    console.log(`${colors.green("Files match")} for ${filename} AST test.`);
  }
  return success;
};

const testMd = (processor, filename) => {
  let success = true;
  processor.process(vfile.readSync("./test/sample.md"), (error, result) => {
      console.error(report(error || result));
      if (error) {
        throw error;
      }
      if (result) {
        result.basename = `${filename}.md`;
        vfile.writeSync(result);
        const ref = vfile.readSync(`./test/${filename}.ref.md`);
        const { same, pretty } = diffVfile(result, ref);
        if (same) {
          console.log(
            `${colors.red("Files do not match")} for ${filename} MD test.`
          );
          console.log(pretty);
          success = false;
        } else {
          console.log(
            `${colors.green("Files match")} for ${filename} MD test.`
          );
        }
      }
    });
    return success;
};


const getProcessor = (options, remarkVersion, toHtml) =>
{
  if (toHtml)
    return unified()
      .use(remarkVersion.markdown)
      .use(plugin, options)
      .use(remark2rehype)
      .use(doc)
      .use(format)
      .use(html);

  return unified()
    .use(remarkVersion.markdown)
    .use(remarkVersion.toMarkdown)
    .use(plugin, options);
};

const pluginOptions = {
  customTypes: {
    custom: {
      emoji: "💻",
      svg:
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15 2H1c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h5.34c-.25.61-.86 1.39-2.34 2h8c-1.48-.61-2.09-1.39-2.34-2H15c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm0 9H1V3h14v8z"></path></svg>'
    }
  }
};

const iconModes = ["svg", "emoji", "none"];

let issues = [];
for (let version of Object.getOwnPropertyNames(remarkVersions))
{
  const remark = remarkVersions[version];
  for (let icons of iconModes)
  {
    if (!testHtml(getProcessor({ ...pluginOptions, icons}, remark, true), icons))
      issues.push(`HTML generation test failed for remark ${version} with ${icons} icons`)
    if (!testAst(getProcessor({ ...pluginOptions, icons}, remark, false), icons))
      issues.push(`AST generation test failed for remark ${version} with ${icons} icons`)
    if (!testMd(getProcessor({ ...pluginOptions, icons}, remark, false), icons))
      issues.push(`Markdown generation test failed for remark ${version} with ${icons} icons`)
  }
}

console.log(issues.join("\n"));

process.exit(issues.length ? 2 : 0);
