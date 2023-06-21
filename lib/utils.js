export function replaceHTMLContent(original, replacement) {
  if (containsHTML(original) || containsHTML(replacement)) {
    setTimeout(() => {
      const tempOriginal = document.createElement('div');
      tempOriginal.innerHTML = original;
    
      const tempReplacement = document.createElement('div');
      tempReplacement.innerHTML = replacement;
    
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, null, false);
      let node;
    
      while (node = walker.nextNode()) {
        if (node.innerHTML.includes(original)) {
          replaceNodeContent(node, tempOriginal, tempReplacement);
        }
      }
    }, 0);
  }
  else {
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    const regex = new RegExp(original, 'g');
    let node;
    while (node = walk.nextNode()) {
      if (!node.parentElement || node.parentElement.tagName.toLowerCase() === 'script') {
        continue;
      }
      node.textContent = node.textContent.replace(regex, replacement);
    }
  }
}

function containsHTML(str) {
  return /<[a-z][\s\S]*>/i.test(str);
}

function replaceNodeContent(targetNode, tempOriginal, tempReplacement) {
  const replacementFragment = document.createDocumentFragment();

  for (const child of Array.from(targetNode.childNodes)) {
    if (child.nodeType === Node.ELEMENT_NODE && child.outerHTML.includes(tempOriginal.innerHTML)) {
      const replaced = child.outerHTML.replace(tempOriginal.innerHTML, tempReplacement.innerHTML);
      const temp = document.createElement('div');
      temp.innerHTML = replaced;
      replacementFragment.appendChild(temp.firstChild);
    } else {
      replacementFragment.appendChild(child);
    }
  }

  // Grouped together - Write to DOM
  targetNode.textContent = '';
  targetNode.appendChild(replacementFragment);
}