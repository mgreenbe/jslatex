let regexes = [
  {
    re: /^\s+/,
    action: result =>
      result[0].split("\n").length >= 3 ? { type: "PAR" } : { type: "SPACE" }
  },
  {
    re: /^\\section/,
    action: result => ({
      type: "SECTION"
    })
  },
  {
    re: /^\\subsection/,
    action: result => ({
      type: "SUBSECTION"
    })
  },
  {
    re: /^\\begin/,
    action: result => ({ type: "BEGIN" })
  },
  {
    re: /^\\end/,
    action: result => ({ type: "END" })
  },
  {
    re: /^\\item/,
    action: result => ({ type: "ITEM" })
  },
  {
    re: /^{/,
    action: () => ({ type: "LBRACE" })
  },
  {
    re: /^\\([a-zA-Z]+)/,
    action: result => ({
      type: "COMMAND",
      id: result[1]
    })
  },
  {
    re: /^}/,
    action: () => ({ type: "RBRACE" })
  },
  {
    re: /./,
    action: result => ({
      type: "CHAR",
      value: result[0]
    })
  }
  /*  {
    re: /^\[/,
    action: () => ({ type: 'LBRACKET' })
  },
  {
    re: /^]/,
    action: () => ({ type: 'RBRACKET' })
  }*/
];

module.exports = { regexes };
