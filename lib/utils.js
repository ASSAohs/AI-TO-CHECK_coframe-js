export function replaceHTMLContent(original, replacement) {
  const tempOriginal = document.createElement('div');
  tempOriginal.innerHTML = original;

  const tempReplacement = document.createElement('div');
  tempReplacement.innerHTML = replacement;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, null, false);
  let node;

  while (node = walker.nextNode()) {
      if (node.innerHTML === original) {
          replaceNodeContent(node, tempReplacement);
          return;
      }
  }
}

function replaceNodeContent(targetNode, sourceNode) {
  while (targetNode.firstChild) {
      targetNode.removeChild(targetNode.firstChild);
  }

  const clone = sourceNode.cloneNode(true);
  while (clone.firstChild) {
      targetNode.appendChild(clone.firstChild);
  }
}
