function renderNode(node) {
  switch (node.type) {
    case "document":
      return `<div class="document">${renderNodeList(node.children)}</div>`;
    case "section":
      return `<div class="section"><h1>${renderNodeList(
        node.title.children
      )}</h1>${renderNodeList(node.children)}</div>`;
    case "subsection":
      return `<div class="subsection"><h2>${renderNodeList(
        node.title.children
      )}</h2>${renderNodeList(node.children)}</div>`;
    case "paragraph":
      return `<p class="paragraph">${renderNodeList(node.children)}</p>`;
    case "bracedGroup":
      return renderNodeList(node.children);
    case "command":
      switch (node.id) {
        case "textbf":
          return `<b>${renderNode(node.arg)}</b>`;
        case "textit":
          return `<i>${renderNode(node.arg)}</i>`;
        default:
          throw new Error("Render error: Unknown command.");
      }
    case "text":
      return node.content;
    default:
      throw new Error("Render error: Unknown node type.");
  }
}

function renderNodeList(nodeList) {
  return nodeList.map(renderNode).join("");
}

module.exports = { renderNode };
