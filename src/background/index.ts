import { defaultEvmStores } from "ethers-svelte";
import { createMetaMaskProvider } from "metamask-extension-provider";
import { signer } from "ethers-svelte";
import { Client } from "@xmtp/xmtp-js";
import { xmtpClient } from "./stores";

// Execute the API request when the extension is installed or reloaded.
chrome.runtime.onInstalled.addListener(() => {
  login();
});

function login(): void {
  console.log("logging in");
  const provider = createMetaMaskProvider();
  console.log("provider created");
  defaultEvmStores.setProvider(provider);
  console.log("provider set");

  signer.subscribe(async ($signer) => {
    console.log("signer subcribed");
    if (!$signer) return;
    // Create the client with your wallet. This will connect to the XMTP development network by default
    const xmtp = await Client.create($signer, { env: "production" });
    console.log("client created");
    xmtpClient.set(xmtp);
    console.log("client set");
  });
}
