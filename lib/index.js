// handles different types of whitespace
const unified = require("unified");
const html = require("rehype-parse");
const visit = require("unist-util-visit");

module.exports = attacher;

const NEWLINE = "\n";

// natively supported types
const types = {
  // aliases for infima color names
  secondary: "note",
  info: "important",
  success: "tip",
  danger: "warning",
  // base types
  note: {
    ifmClass: "secondary",
    keyword: "note",
    emoji: "ℹ️", // '&#x2139;'
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16"><path fill-rule="evenodd" d="M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"/></svg>'
  },
  tip: {
    ifmClass: "success",
    keyword: "tip",
    emoji: "💡", //'&#x1F4A1;'
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16"><path fill-rule="evenodd" d="M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"/></svg>'
  },
  warning: {
    ifmClass: "danger",
    keyword: "warning",
    emoji: "🔥", //'&#x1F525;'
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16"><path fill-rule="evenodd" d="M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"/></svg>'
  },
  important: {
    ifmClass: "info",
    keyword: "important",
    emoji: "❗️", //'&#x2757;'
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16"><path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"/></svg>'
  },
  caution: {
    ifmClass: "warning",
    keyword: "caution",
    emoji: "⚠️", // '&#x26A0;&#xFE0F;'
    svg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"/></svg>'
  }
};

// default options for plugin
const defaultOptions = {
  customTypes: [],
  useDefaultTypes: true,
  infima: true,
  tag: ":::",
  icons: "svg"
};

// override default options
const configure = options => {
  const { customTypes, ...baseOptions } = {
    ...defaultOptions,
    ...options
  };

  return {
    ...baseOptions,
    types: { ...types, ...customTypes }
  };
};

// escape regex special characters
function escapeRegExp(s) {
  return s.replace(new RegExp(`[-[\\]{}()*+?.\\\\^$|/]`, "g"), "\\$&");
}

// helper: recursively replace nodes
const _nodes = ({
  tagName: hName,
  properties: hProperties,
  position,
  children
}) => {
  return {
    type: "admonitionHTML",
    data: {
      hName,
      hProperties
    },
    position,
    children: children.map(_nodes)
  };
};

// convert HTML to MDAST (must be a single root element)
const nodes = markup => {
  return _nodes(
    unified()
      .use(html)
      .parse(markup).children[0].children[1].children[0]
  );
};

// create a simple text node
const text = value => {
  return {
    type: "text",
    value
  };
};

// create a node that will compile to HTML
const element = (tagName, classes = [], children = []) => {
  return {
    type: classes[0] || "admonitionHTML",
    data: {
      hName: tagName,
      hProperties: classes.length
        ? {
            className: classes
          }
        : {}
    },
    children
  };
};

// changes the first character of a keyword to uppercase so that custom title
// styles may omit `text-transform: uppercase`.
const formatKeyword = keyword =>
  keyword.charAt(0).toUpperCase() + keyword.slice(1);

// passed to unified.use()
// you have to use a named function for access to `this` :(
function attacher(options) {
  const pipeline = this;
  const config = configure(options);
  // match to determine if the line is an opening tag
  const keywords = Object.keys(config.types)
    .map(escapeRegExp)
    .join("|");
  const regex = new RegExp(
    `${escapeRegExp(config.tag)} ?(${keywords})(?: *(.*))?\n`,
    "i"
  );
  const escapeTag = new RegExp(escapeRegExp(`\\${config.tag}`), "g");

  attachParser(pipeline.Parser);
  attachCompiler(pipeline.Compiler);

  return hastFriendlyTransformer;

  function attachParser(parser) {
    if (
      !parser ||
      !parser.prototype ||
      !parser.prototype.blockTokenizers ||
      !parser.prototype.blockMethods
    )
      return;

    // add tokenizer to parser after fenced code blocks
    parser = parser.prototype;
    parser.blockTokenizers.admonition = blockTokenizer;
    parser.blockMethods.splice(
      parser.blockMethods.indexOf("fencedCode") + 1,
      0,
      "admonition"
    );
    parser.interruptParagraph.splice(
      parser.interruptParagraph.indexOf("fencedCode") + 1,
      0,
      ["admonition"]
    );
    parser.interruptList.splice(
      parser.interruptList.indexOf("fencedCode") + 1,
      0,
      ["admonition"]
    );
    parser.interruptBlockquote.splice(
      parser.interruptBlockquote.indexOf("fencedCode") + 1,
      0,
      ["admonition"]
    );
  }

  // the tokenizer is called on blocks to determine if there is an admonition present and create tags for it
  function blockTokenizer(eat, value, silent) {
    const ctx = this;
    checkParserEscapes(ctx);

    // stop if no match or match does not start at beginning of line
    const match = regex.exec(value);
    if (!match || match.index !== 0) return false;
    // if silent return the match
    if (silent) return true;

    const now = eat.now();
    let [opening, keyword, title] = match;
    const food = [];
    let content = [];
    const indentSize = match.index + value.indexOf(keyword);
    let quoted = false;

    if (title) {
      title = title.trim();
      if (title.startsWith('"') || title.startsWith("'")) {
        title = title.slice(1, title.indexOf(title[0], 1));
        quoted = true;
      }
    }

    // consume lines until a closing tag
    let idx = 0,
      empties = 0,
      indented,
      endIndent = false;
    while ((idx = value.indexOf(NEWLINE)) !== -1) {
      // grab this line and eat it
      const next = value.indexOf(NEWLINE, idx + 1);
      const line =
        next !== -1 ? value.slice(idx + 1, next) : value.slice(idx + 1);

      let indent = 0,
        empty = false;
      if (indented !== false) {
        let pos = 0;
        for (let c of line) {
          if (c === " ") indent += 1;
          else if (c === "\t") indent += 4 - (indent % 4);
          else break;
          ++pos;
        }
        empty = pos >= line.length;

        if (!indented && !empty) indented = indent >= indentSize;

        empties = empty ? empties + 1 : 0;
      }

      if (indented && indent < indentSize && !empty) {
        while (empties--) {
          value = food.pop() + NEWLINE + value;
          content.pop();
        }
        endIndent = true;
      }

      // the closing tag is NOT part of the content, but avoid matching a following admonition
      const endTag = line.startsWith(config.tag),
        startsNew = regex.test(line + NEWLINE);

      if (endTag && startsNew) break;

      if (endIndent && !endTag) break;

      food.push(line);
      value = value.slice(idx + 1);

      // disambiguate an indented code block in a fenced admonition
      if (endTag) {
        indented = false;
        break;
      }

      content.push(line);
    }

    if (indented) {
      for (let i = 0; i < content.length; ++i) {
        ctx.offset[i + 1] = (ctx.offset[i + 1] || 0) + indentSize;
        content[i] = content[i].slice(indentSize);
      }
    }

    // consume the processed tag and replace escape sequences
    const contentString = content.join(NEWLINE).replace(escapeTag, config.tag);
    const add = eat(opening + food.join(NEWLINE));

    let titleOffset = opening.indexOf(title);
    if (titleOffset < 0)
      titleOffset = indentSize + (quoted ? keyword.length + 1 : 0);
    const titleNow = Object.assign({}, now, {
      column: now.column + titleOffset,
      offset: now.offset + titleOffset
    });

    // parse the title in inline mode
    const titleNodes = {
      type: "admonition-heading",
      children: ctx.tokenizeInline(
        title === "" ? "" : title || formatKeyword(keyword),
        titleNow
      )
    };

    ++now.line;
    now.column = 1;
    now.offset += opening.length;

    // parse the content in block mode
    const exit = ctx.enterBlock();
    const contentNodes = {
      type: "admonition-content",
      children: ctx.tokenizeBlock(contentString, now)
    };
    exit();

    return add({
      type: "admonition",
      keyword,
      quoted,
      indentSize: indented ? indentSize : 0,
      children: [titleNodes, contentNodes]
    });
  }

  function checkParserEscapes(context) {
    if (!context.escape.includes(config.tag[0]))
      context.escape.push(config.tag[0]);
  }

  function checkCompilerEscapes(compiler) {
    // these are the elements that admonition parsing is
    // most likely to interfere with; ensure that they're written out
    // with the necessary escapes.
    const intercept = [
      "blockquote",
      "heading",
      "list",
      "html",
      "definition",
      "table",
      "paragraph"
    ];

    let originals = {},
      intercepted = false;

    const tagRegex = new RegExp("^" + escapeRegExp(config.tag), "gm");
    if (!intercepted) {
      for (let handlerName of intercept) {
        originals[handlerName] = compiler.prototype.visitors[handlerName];
        compiler.prototype.visitors[handlerName] = escape;
      }
      intercepted = true;
    }

    function escape(node) {
      let ret = originals[node.type].apply(this, arguments);
      ret = ret.replace(tagRegex, "\\$&");
      return ret;
    }
  }

  // allow round-tripping back to Markdown
  function attachCompiler(compiler) {
    if (!compiler || !compiler.prototype || !compiler.prototype.visitors)
      return;

    checkCompilerEscapes(compiler);

    compiler.prototype.visitors["admonition"] = function(node) {
      const ctx = this;

      if (!node.children || !node.children.length) return;

      let heading = node.children.find(n => n.type === "admonition-heading");
      let content = node.children.find(n => n.type === "admonition-content");

      if (!heading || !node.keyword) {
        console.error("Invalid admonition node", node);
        return;
      }

      // if this has already been transformed, un-transform for stringify
      if (
        heading.children.length &&
        heading.children[0].data &&
        heading.children[0].children &&
        heading.children[0].data.hName === "h5"
      ) {
        heading.children = heading.children[0].children.filter(
          n => n.type !== "admonition-icon"
        );
      }

      heading = ctx.all(heading).join("");
      content = content ? ctx.block(content) : "";

      if (content && node.indentSize)
        content = content
          .split(NEWLINE)
          .map(l => (l ? " ".repeat(node.indentSize) + l : l))
          .join(NEWLINE);

      if (heading || node.quoted) {
        const quote = node.quoted ? (heading.includes('"') ? "'" : '"') : "";
        if (heading.trim().toLowerCase() === node.keyword.toLowerCase())
          heading = "";
        else heading = " " + quote + heading + quote;
      }

      let keywordSpace = "";
      if (node.indentSize > config.tag.length)
        keywordSpace = " ".repeat(node.indentSize - config.tag.length);
      else if (!content) keywordSpace = " ";

      return (
        config.tag +
        keywordSpace +
        node.keyword +
        heading +
        NEWLINE +
        (content ? content : "") +
        (!node.indentSize && content ? NEWLINE + config.tag : "")
      );
    };
  }

  function hastFriendlyTransformer(tree) {
    visit(tree, "admonition", node => {
      if (!node.children || !node.children.length) return;

      let heading = node.children.find(n => n.type === "admonition-heading");
      let content = node.children.find(n => n.type === "admonition-content");
      const keyword = node.keyword.toLowerCase();

      // nothing to process (incomplete)
      if (!heading) {
        console.error("admonition missing heading", node);
        return;
      }

      // already processed
      if (
        heading.children.length &&
        heading.children[0].data &&
        heading.children[0].children &&
        heading.children[0].data.hName === "h5"
      ) {
        return;
      }

      // create the nodes for the icon
      const entry = config.types[keyword];
      const settings = typeof entry === "string" ? config.types[entry] : entry;
      const iconNodes =
        config.icons === "svg" ? nodes(settings.svg) : text(settings.emoji);
      const iconContainerNodes =
        config.icons === "none"
          ? heading.children
          : [
              element("span", ["admonition-icon"], [iconNodes]),
              ...heading.children
            ];

      // rebuild heading with HAST-friendly attributes
      heading = element(
        "div",
        ["admonition-heading"],
        [element("h5", "", iconContainerNodes)]
      );

      // rebuild content with HAST-friendly attributes
      content = element(
        "div",
        ["admonition-content"],
        (content && content.children) || []
      );

      // rebuild the admonition node
      Object.assign(
        node,
        element(
          "div",
          ["admonition", `admonition-${keyword}`].concat(
            settings.ifmClass ? ["alert", `alert--${settings.ifmClass}`] : []
          ),
          [heading, content]
        )
      );
    });
  }
}
