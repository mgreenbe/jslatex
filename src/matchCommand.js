let { shiftSpaceAndPar } = require("./shift.js");
let { matchBracedGroup } = require("./matchBracedGroup.js");

let matchCommand = ts => {
  console.assert(
    ts[0].type === "COMMAND",
    "matchGroup expected first token to be COMMAND."
  );
  let { id } = ts.shift(); // Consume COMMAND.
  shiftSpaceAndPar(ts); // Kill whitespace at beginning of braced group. .

  let arg = matchBracedGroup(ts);
  return { type: command, id, arg };
};
