<script lang="ts">
  import { defaultEvmStores } from "ethers-svelte";
  import { createExternalExtensionProvider } from '@metamask/providers';
  import { onMount } from "svelte";
  import { xmtpClient, router, selectedConversation } from "../popup/stores";
  import { State } from "../utils";
  import type { Conversation } from "@xmtp/xmtp-js";

  import NewChat from "./NewChat.svelte";
  import Chat from "./Chat.svelte";
  import Inbox from "./Inbox.svelte";

  export let peerAddress: string;
  console.log("received peer address", peerAddress);

  let conversation: Conversation;

  // TODO find a way to cache conversations from different wallets
  // TODO find a way to use chrome async storage
  // import { conversations } from "$lib/stores"
  // chrome.storage.sync.set({count}).then(() => {
  //   message = 'Updated!';

  //   setTimeout(() => {
  //     message = null;
  //   }, 2000);
  // });

  onMount(async () => {
    if (!$xmtpClient) {
      const provider = createExternalExtensionProvider();
      defaultEvmStores.setProvider(provider);
    }
    xmtpClient.subscribe(async client => {
      if(!client) return;
      let asyncConversations = await client.conversations.list();
      conversation = asyncConversations.find(conversation => conversation.peerAddress == peerAddress);
      if(!conversation) {
        router.set(State.NewChat);
      } else {
        selectedConversation.set(conversation);
        router.set(State.Chat);
      };
    });
  })

</script>

<div class="w-96">
{#if $router == State.Inbox}
  <Inbox />
{:else if $router == State.NewChat}
  <NewChat newConversationPeerAddress={peerAddress}/>
{:else if $router == State.Chat}
  <Chat />
{/if}
</div>
