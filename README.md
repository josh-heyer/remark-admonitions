This is a fork, because I needed slightly different functionality. If you're reading this, you should consider that maybe this isn't fully "baked" and have a look at [the original project](https://github.com/elviswolcott/remark-admonitions/).

 ## How this differs from Elvis Wolcott's original 
 
 My primary goal is reasonable compatibility with content written against Python-Markdown's Admonitions plugin: https://squidfunk.github.io/mkdocs-material/reference/admonitions/
 
 That means:
 
 - Allows indented, rather than fenced, admonitions (both are supported, and can both be used in the same document if desired). Indented admonitions can be nested (but whyyyy)
 - An optional space between the tag and the keyword
 - Case-insensitive keyword matching
 - Quoted titles (if title begins with ' or ", then only content between that and matching quote will be used; mostly useful for empty titles right now)
 - Empty titles ("" results in no title at all, vs. a default title)
 - Simpler AST allows programmatic creation without worrying about the details of the HTML representation (those details will be added in the transformation step). 
 - Compiler allows transformation and round-tripping with remark-stringify: load Markdown containing admonitions, modify the AST as desired, write it back to Markdown. Preserves original case of keyword, fenced vs. indented layout.

 See [the original README for history & usage details](https://github.com/elviswolcott/remark-admonitions/blob/master/README.md)
 
