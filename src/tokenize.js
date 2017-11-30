let augmentToken = (result, offset, token) => ({
  start: offset + result.index,
  end: offset + result.index + result[0].length,
  ...token
});

let tokenize = (regexes, str) => {
  let tokens = [];
  let offset = 0;
  while (true) {
    let slice = str.slice(offset);
    if (slice.length === 0) {
      break;
    }
    for (let { re, action } of regexes) {
      let result = re.exec(slice);
      if (result !== null) {
        let token = augmentToken(result, offset, action(result));
        tokens.push(token);
        offset = token.end;
        break;
      }
    }
  }
  return tokens;
};

module.exports = { tokenize };
