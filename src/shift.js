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

module.exports = { shiftSpace, shiftSpaceAndPar };
