<script lang="ts">
  import { defaultEvmStores } from "ethers-svelte";
  import { createExternalExtensionProvider } from '@metamask/providers';
  import { onMount } from "svelte";
  import { xmtpClient, conversations, messages, router } from "../popup/stores";
  import { State } from "../popup/index";
  import type { Conversation } from "@xmtp/xmtp-js";

  import NewChat from "./NewChat.svelte";
  import Chat from "./Chat.svelte";
  import Inbox from "./Inbox.svelte";

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
      console.log(client);
      let asyncConversations = await client.conversations.list();
      console.log(asyncConversations)
      conversations.set(asyncConversations);
      conversations.subscribe(conversations => {
        console.log("subscribed conversations", conversations);
        conversations.forEach(async conversation => {
          const [message] = await conversation.messages({ limit: 1});
          if (message) {
            let copy = { ...messages};
            copy[conversation.topic] = message;
            console.log(copy)
            messages.set(copy)
          }
        })
      })
    });
  })

</script>

<div class="w-96">
{#if $router == State.Inbox}
  <Inbox />
{:else if $router == State.NewChat}
  <NewChat />
{:else if $router == State.Chat}
  <Chat />
{/if}
</div>
