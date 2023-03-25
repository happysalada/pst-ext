import { derived } from 'svelte/store';
import { signer } from 'ethers-svelte'
import { Client } from "@xmtp/xmtp-js";

export const xmtpClient = derived(signer, ($signer, set) => {
  if ($signer) {
    Promise.resolve(Client.create($signer, { env: "production"})).then(client => set(client))
  }
});
