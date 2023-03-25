<script lang="ts">
	import { signerAddress } from "ethers-svelte";
  import type { Message } from "@xmtp/xmtp-js";
  import { xmtpClient, selectedConversation } from "../popup/stores";
  import { onMount } from "svelte";
  import { timeFromNow } from "../popup/utils";

  let newMessage: string;
  let messages: Message[] = [];

  onMount(async () => {
    console.log("chat mounted", $selectedConversation);
    messages = await $selectedConversation.messages();
    console.log("messages found", messages);
  });

  async function sendMessage(): Promise<void> {
    console.log("sending message")
    if (!$xmtpClient) return;
    // TODO figure out why adding a conversationId crashes this
    let message = await $selectedConversation.send(newMessage);
    newMessage = "";
    messages = [...messages, message];
  }
</script>

<body
  class="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800 p-10"
>
  <!-- Component Start -->
  <div
    class="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden"
  >
    <div class="flex flex-col flex-grow h-0 p-4 overflow-auto">
      {#each messages as {content, senderAddress, sent}}
        {#if senderAddress == $signerAddress}
        <div class="flex w-full mt-2 space-x-3 max-w-xs">
          <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
            <p class="text-center mt-2">Me</p>
          </div>
          <div>
            <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
              <p class="text-sm">
                {content}
              </p>
            </div>
            <span class="text-xs text-gray-500 leading-none">{timeFromNow(sent)}</span>
          </div>
        </div>
        {:else}
        <div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
          <div>
            <div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
              <p class="text-sm">
              {content}
              </p>
            </div>
            <span class="text-xs text-gray-500 leading-none">{timeFromNow(sent)}</span>
          </div>
          <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300" />
        </div>
        {/if}
      {/each}
    </div>

    <div class="bg-gray-300 p-4">
      <form on:submit|preventDefault={sendMessage}>
        <input
          class="flex items-center h-10 w-full rounded px-3 text-sm"
          type="text"
          placeholder="Type your message…"
          bind:value={newMessage}
        />
      </form>
    </div>
  </div>
  <!-- Component End  -->
</body>
