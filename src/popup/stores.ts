import { derived, writable } from 'svelte/store';
import { signer } from 'ethers-svelte'
import { Client } from "@xmtp/xmtp-js";
import { State } from "./index";

export const xmtpClient = derived(signer, ($signer, set) => {
  if ($signer) {
    Promise.resolve(Client.create($signer, { env: "production"})).then(client => set(client))
  }
});

export const conversations = writable([]);
export const messages = writable({});
export const router = writable(State.Inbox);
export const selectedConversation = writable(null);
