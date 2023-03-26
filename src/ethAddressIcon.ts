const ethAddressRegex = /0x[a-fA-F0-9]{40}/g;
const ethDomainRegex = /^[\w-]+(\.[\w-]+)*\.eth$/g;

function findETHAddresses(text: string): RegExpMatchArray | null {
  return text.match(ethAddressRegex) || text.match(ethAddressRegex);
}

function processNode(node: Node): void {
  if (node.nodeType === Node.TEXT_NODE) {
    const textContent = node.textContent;

    if (textContent) {
      const addresses = findETHAddresses(textContent);

      if (addresses) {
        const parent = node.parentNode;
        const newNode = document.createElement('span');

        let lastIndex = 0;
        let newTextContent = '';

        for (const address of addresses) {
          const addressIndex = textContent.indexOf(address, lastIndex);

          let svg = chrome.runtime.getURL('chat.svg')
          newTextContent += textContent.substring(lastIndex, addressIndex);
          newTextContent += `<img src="${svg}" class="chat-icon" style="width: 1.5rem; height 1.5rem; cursor: pointer;" data-ethAddress=${address}>${address}`;

          lastIndex = addressIndex + address.length;
        }

        newTextContent += textContent.substring(lastIndex);

        newNode.innerHTML = newTextContent;
        parent?.replaceChild(newNode, node);
      }
    }
  } else {
    for (const child of node.childNodes) {
      processNode(child);
    }
  }
}

function init(): void {
  const body = document.body;
  processNode(body);

  // You can add a listener here for the click event on the icon
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('chat-icon')) {
      chrome.storage.local.set({ "peerAddress": target.dataset.ethaddress }, () => {
        console.log(`${target.dataset.ethaddress} is stored in localstorage`);
      });
      // Perform your desired action when the icon is clicked
      chrome.runtime.sendMessage({message: "sendMessageRequest"});
    }
  });
}

init();
