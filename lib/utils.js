export function replaceText(original, copy) {
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    const regex = new RegExp(original, 'g');
    let node;
    while (node = walk.nextNode()) {
      if (!node.parentElement || node.parentElement.tagName.toLowerCase() === 'script') {
        continue;
      }
      node.textContent = node.textContent.replace(regex, copy);
    }
  }