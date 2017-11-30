function renderNode(node) {
  switch (node.type) {
    case 'document':
      return `<div class="document">\n${renderNodeList(node.children)}\n</div>`;
    case 'section':
      return `<div class="section">\n<h1>${node.title}</h1>\n${renderNodeList(
        node.children
      )}\n</div>`;
    case 'subsection':
      return `<div class="subsection">\n<h2>${
        node.title
      }</h2>\n${renderNodeList(node.children)}\n</div>`;
    case 'text':
      return `<p>${node.content}</p>`;
    default:
      throw new Error('Render error: Unknown node type.');
  }
}

function renderNodeList(nodeList) {
  return nodeList.map(renderNode).join('\n');
}

module.exports = { renderNode };
