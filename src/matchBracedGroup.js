let { shiftSpaceAndPar } = require("./shift.js");

let matchBracedGroup = ts => {
  console.assert(
    ts[0].type === "LBRACE",
    "matchGroup expected first token to be LBRACE."
  );
  ts.shift(); // Consume LBRACE.
  shiftSpaceAndPar(ts); // Kill whitespace at beginning of braced group.

  if (ts[0] === undefined) {
    throw new Error("Parse error: Unmatched LBRACE.");
  }

  let children = [];

  while (ts[0]) {
    console.assert(type in ts[0], "Parse error: Token has no type property.");
    switch (ts[0].type) {
      case "RBRACE":
        ts.shift(); // Consume RBRACE.
        return children;
      case "CHAR":
        children.push(matchText(ts));
        break;
      case "LBRACE":
        children.push(matchBracedGroup(ts));
        break;
      case "COMMAND":
        children.push(matchCommand(ts));
        break;
      default:
        throw new Error(`Parse error: Unexpected token type ${ts[0].type}`);
    }
  }

  console.assert(
    ts[0].type === "CHAR" || ts[0].type === "RBRACE",
    "matchGroup expected group to be empty or to begin with CHAR."
  );
  let node = ts[0].type === "CHAR" ? matchText(ts) : { type: "empty" };
  ts.shift();
  return node;
};

function matchBracedGroup(ts) {
  console.assert(
    ts[0].type === "LBRACE",
    "matchGroup expected first token to be LBRACE."
  );
  ts.shift(); // Consume LBRACE.
  shiftSpaceAndPar(ts); // Kill whitespace at beginning of braced group.

  if (ts[0] === undefined) {
    throw new Error("Parse error: Unmatched LBRACE.");
  }

  let children = [];

  while (ts[0]) {
    console.assert(type in ts[0], "Parse error: Token has no type property.");
    switch (ts[0].type) {
      case "RBRACE":
        ts.shift(); // Consume RBRACE.
        return children;
      case "CHAR":
        children.push(matchText(ts));
        break;
      case "LBRACE":
        children.push(matchBracedGroup(ts));
        break;
      case "COMMAND":
        children.push(matchCommand(ts));
        break;
      default:
        throw new Error(`Parse error: Unexpected token type ${ts[0].type}`);
    }
  }

  console.assert(
    ts[0].type === "CHAR" || ts[0].type === "RBRACE",
    "matchGroup expected group to be empty or to begin with CHAR."
  );
  let node = ts[0].type === "CHAR" ? matchText(ts) : { type: "empty" };
  ts.shift();
  return node;
}
