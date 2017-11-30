let shiftSpace = ts => {
  while (ts[0] && ts[0].type === "SPACE") {
    ts.shift();
  }
};

let shiftSpaceAndPar = ts => {
  while (ts[0] && (ts[0].type === "SPACE" || ts[0].type === "PAR")) {
    ts.shift();
  }
};

let matchText = ts => {
  let content = "";
  while (ts[0] && (ts[0].type === "CHAR" || ts[0].type === "SPACE")) {
    content += ts[0].type === "CHAR" ? ts[0].value : " ";
    ts.shift();
  }
  return { type: "text", content };
};

function matchCommand(ts) {
  console.assert(
    ts[0].type === "COMMAND",
    "matchBracedGroup expected first token to be COMMAND."
  );
  let { id } = ts.shift(); // Consume COMMAND.
  shiftSpaceAndPar(ts); // Kill whitespace at beginning of braced group. .

  let arg = matchBracedGroup(ts);
  return { type: "command", id, arg };
}

function matchOneWordBracedGroup(ts) {
  console.assert(
    ts[0].type === "LBRACE",
    "matchEnvironment expected an LBRACE."
  );
  ts.shift();

  let word = "";
  while (ts[0].type === "CHAR") {
    word += ts[0].value;
    ts.shift();
  }

  console.assert(
    ts[0].type === "RBRACE",
    "matchEnvironment expected an RBRACE."
  );
  ts.shift();

  return word;
}

function matchListEnv(ts) {
  console.assert(
    ts[0].type === "BEGIN",
    "matchEnvironment expected first token to be BEGIN."
  );
  ts.shift();
  shiftSpace(ts);

  let env = matchOneWordBracedGroup(ts);

  let children = [];

  shiftSpaceAndPar();

  while (ts[0]) {
    switch (ts[0].type) {
      case "END":
        ts.shift();
        let shouldBeEnv = matchOneWordBracedGroup(ts);
        if (shouldBeEnv === env) {
          return { type: env, children };
        } else {
          throw new Error(
            `Parse error: Mismatch --- ${shouldBeEnv} tag closing a ${
              env
            } environment.`
          );
        }
        break;
      case "PAR":
        ts.shift();
        break;
      case "COMMAND":
      case "LBRACE":
      case "CHAR":
      case "SPACE":
        children.push(matchParagraph(ts));
        break;
      default:
        throw new Error(
          `Unexpected token type in matchEnvironment: ${ts[0].type}`
        );
    }
  }
}

let matchBracedGroup = ts => {
  console.assert(
    ts[0].type === "LBRACE",
    "matchBracedGroup expected first token to be LBRACE."
  );
  ts.shift(); // Consume LBRACE.
  shiftSpaceAndPar(ts); // Kill whitespace at beginning of braced group.

  if (ts[0] === undefined) {
    throw new Error("Parse error: Unmatched LBRACE.");
  }

  let children = [];

  while (ts[0]) {
    console.assert("type" in ts[0], "Parse error: Token has no type property.");
    switch (ts[0].type) {
      case "RBRACE":
        ts.shift(); // Consume RBRACE.
        return { type: "bracedGroup", children };
      case "CHAR":
      case "SPACE":
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

  return { type: "bracedGroup", children };
};

let matchParagraph = ts => {
  console.assert(
    ts[0].type === "CHAR" ||
      ts[0].type === "COMMAND" ||
      ts[0].type === "LBRACE",
    `matchParagraph expected first token -- ${
      ts[0].type
    } -- to be CHAR, COMMAND, or LBRACE.\n${JSON.stringify(ts)}`
  );

  let children = [];

  while (ts[0]) {
    switch (ts[0].type) {
      case "PAR":
      case "SECTION":
      case "SUBSECTION":
        return { type: "paragraph", children };
      case "COMMAND":
        children.push(matchCommand(ts));
        break;
      case "LBRACE":
        children.push(matchBracedGroup(ts));
        break;
      case "CHAR":
      case "SPACE":
        children.push(matchText(ts));
        break;
      default:
        throw new Error(`Parse error: Unexpected token type ${ts[0].type}`);
    }
  }
  return { type: "paragraph", children };
};

let matchSubsection = ts => {
  console.assert(
    ts[0].type === "SUBSECTION",
    "matchSubsection expected first token to be SUBSECTION."
  );
  ts.shift(); // Consume subsection COMMAND

  let title = matchBracedGroup(ts);
  shiftSpaceAndPar(ts); // Consume SPACEs and PARs following title.

  let children = [];

  while (ts[0]) {
    switch (ts[0].type) {
      case "SECTION":
      case "SUBSECTION":
        return {
          type: "subsection",
          title,
          children
        };
      case "PAR":
        ts.shift();
        break;
      case "COMMAND":
      case "LBRACE":
      case "CHAR":
      case "SPACE":
        children.push(matchParagraph(ts));
        break;
      default:
        throw new Error(
          `Unexpected token type in matchSubsection: ${ts[0].type}`
        );
    }
  }

  return { type: "subsection", title, children };
};

let matchSection = ts => {
  console.assert(
    ts[0].type === "SECTION",
    "matchSection expected first token to be SECTION."
  );
  ts.shift(); // Consume section COMMAND token.

  let title = matchBracedGroup(ts);

  shiftSpaceAndPar(ts); // Consume SPACEs and PARs following title.

  let children = [];

  while (ts[0]) {
    switch (ts[0].type) {
      case "SECTION":
        return { type: "section", title, children };
      case "SUBSECTION":
        children.push(matchSubsection(ts));
        break;
      case "PAR":
        ts.shift();
        break;
      case "COMMAND":
      case "LBRACE":
      case "CHAR":
      case "SPACE":
        children.push(matchParagraph(ts));
        break;
      default:
        throw new Error(`Unexpected token type in matchSection: ${ts[0].type}`);
    }
  }

  return { type: "section", title, children };
};

let parse = ts => {
  shiftSpaceAndPar(ts);

  let children = [];

  while (ts[0]) {
    switch (ts[0].type) {
      case "SECTION":
        children.push(matchSection(ts));
        break;
      case "SUBSECTION":
        children.push(matchSection(ts));
        break;
      case "PAR":
        ts.shift();
        break;
      case "COMMAND":
      case "LBRACE":
      case "CHAR":
      case "SPACE":
        children.push(matchParagraph(ts));
        break;
      default:
        throw new Error("Parse error: Unknown token type.");
    }
  }
  return { type: "document", children };
};

module.exports = { parse };
