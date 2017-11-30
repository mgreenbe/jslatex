let shiftSpace = ts => {
  while (ts[0] && ts[0].type === 'SPACE') {
    ts.shift();
  }
};

let shiftSpaceAndPar = ts => {
  while (ts[0] && (ts[0].type === 'SPACE' || ts[0].type === 'PAR')) {
    ts.shift();
  }
};

let matchText = ts => {
  let content = '';
  while (ts[0] && (ts[0].type === 'CHAR' || ts[0].type === 'SPACE')) {
    content += ts[0].type === 'CHAR' ? ts[0].value : ' ';
    ts.shift();
  }
  return { type: 'text', content };
};

let matchGroup = ts => {
  console.assert(
    ts[0].type === 'LBRACE',
    'matchGroup expected first token to be LBRACE.'
  );
  ts.shift();
  shiftSpace(ts);
  console.assert(
    ts[0].type === 'CHAR' || ts[0].type === 'RBRACE',
    'matchGroup expected group to be empty or to begin with CHAR.'
  );
  let node = ts[0].type === 'CHAR' ? matchText(ts) : { type: 'empty' };
  ts.shift();
  return node;
};

let matchSubsection = ts => {
  console.assert(
    ts[0].type === 'SUBSECTION',
    'matchSubsection expected first token to be SUBSECTION.'
  );
  ts.shift();
  shiftSpaceAndPar(ts);

  let { content: title } = matchGroup(ts);

  let children = [];

  while (ts[0]) {
    let node;
    switch (ts[0].type) {
      case 'SECTION':
      case 'SUBSECTION':
        return {
          type: 'subsection',
          title,
          children
        };
      case 'CHAR':
        node = matchText(ts);
        children.push(node);
        break;
      case 'SPACE':
      case 'PAR':
        ts.shift();
        break;
      default:
        throw new Error(
          `Unexpected token type in matchSubsection: ${ts[0].type}`
        );
    }
  }

  return { type: 'subsection', title, children };
};

let matchSection = ts => {
  console.assert(
    ts[0].type === 'SECTION',
    'matchSection expected first token to be SECTION.'
  );
  ts.shift();
  shiftSpaceAndPar(ts);

  let { content: title } = matchGroup(ts);

  let children = [];

  while (ts[0]) {
    let node;
    switch (ts[0].type) {
      case 'SECTION':
        return { type: 'section', title, children };
      case 'SUBSECTION':
        node = matchSubsection(ts);
        children.push(node);
        break;
      case 'CHAR':
        node = matchText(ts);
        children.push(node);
        break;
      case 'SPACE':
      case 'PAR':
        ts.shift();
        break;
      default:
        throw new Error(`Unexpected token type in matchSection: ${ts[0].type}`);
    }
  }

  return { type: 'section', title, children };
};

let parse = ts => {
  shiftSpaceAndPar(ts);

  let children = [];

  while (ts[0]) {
    let node;
    switch (ts[0].type) {
      case 'SECTION':
        node = matchSection(ts);
        children.push(node);
        break;
      case 'SUBSECTION':
        node = matchSection(ts);
        children.push(node);
        break;
      case 'CHAR':
        node = matchText(ts);
        children.push(node);
        break;
      case 'SPACE':
      case 'PAR':
        shiftSpaceAndPar(ts);
        break;
      default:
        throw new Error('Parse error: Unknown token type.');
    }
  }
  return { type: 'document', children };
};

module.exports = { parse };
