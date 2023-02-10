class JS {
  private static keywords = [
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "export",
    "extends",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "new",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield",
    "enum",
    "await",
    "implements",
    "package",
    "protected",
    "static",
    "interface",
    "private",
    "public",
  ];

  highlight(text: string) {
    const words = text.split(" ");
    console.log(words);
    for (let i = 0; i < words.length; i++) {
      if (JS.isKeyword(words[i])) {
        words[i] = `<span class="keyword">${words[i]}</span>`;
      }
    }
    console.log(words.join(" "));
    return words.join(" ");
  }

  private static isKeyword(word: string) {
    return JS.keywords.includes(word);
  }
}

export default new JS();

// Path: static/js/src/themes/TS.ts
