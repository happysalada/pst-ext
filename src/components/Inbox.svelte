<script lang="ts">
  import type { Conversation, Message } from "@xmtp/xmtp-js";
  import { defaultEvmStores } from "ethers-svelte";
  import { createExternalExtensionProvider } from '@metamask/providers';
  import { signerAddress } from 'ethers-svelte'
  import { onMount } from "svelte";
  import { xmtpClient } from "../popup/stores";
  import { formatEthAddress, timeFromNow } from "../popup/utils";

  // TODO find a way to cache conversations from different wallets
  // TODO find a way to use chrome async storage
  // import { conversations } from "$lib/stores"
  // chrome.storage.sync.set({count}).then(() => {
  //   message = 'Updated!';

  //   setTimeout(() => {
  //     message = null;
  //   }, 2000);
  // });
  let conversations: Conversation[] = [];
  let messages: Record<string, Message> = {};
  let modalOpen = false;
  let newConversationPeerAddress: string;
  let newConversationFirstMessage: string;
  let inviteLink: string;

  onMount(async () => {
    if (!$xmtpClient) {
      const provider = createExternalExtensionProvider();
      defaultEvmStores.setProvider(provider);
    }
    xmtpClient.subscribe(async client => {
      if(!client) return;
      console.log(client);
      conversations = await client.conversations.list();
      conversations.forEach(async conversation => {
        const [message] = await conversation.messages({ limit: 1});
        if (message) {
          messages[conversation.topic] = message;
        }
      })
    });
  })

  async function createConversation(): Promise<void> {
    if (!$xmtpClient) return;
    // TODO figure out why adding a conversationId crashes this
    const newConversation = await $xmtpClient.conversations.newConversation(newConversationPeerAddress);
    conversations = [newConversation, ...conversations];
    await newConversation.send(newConversationFirstMessage);
    let timestamp = newConversation.createdAt.getTime();
    inviteLink = `https://pst.sassy.technology/invite/${timestamp}`;
  }
</script>

{#if modalOpen}

  <!--
    Background backdrop, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100"
      To: "opacity-0"
  -->
    <div
      class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
    >
      <!--
        Modal panel, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      -->
      <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6" >
        {#if inviteLink}
        <div>
          <div
            class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
          >
            <svg
              class="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-5">
            <h3
              class="text-base font-semibold leading-6 text-gray-900"
              id="modal-title"
            >
              Your invite link is {inviteLink}
            </h3>
          </div>
        </div>
        {:else}
        <div>
          <div
            class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
          >
            <svg
              class="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-5">
            <h3
              class="text-base font-semibold leading-6 text-gray-900"
              id="modal-title"
            >
              Create a new conversation
            </h3>

            <!--
              This example requires some changes to your config:
  
              ```
              // tailwind.config.js
              module.exports = {
                // ...
                plugins: [
                  // ...
                  require('@tailwindcss/forms'),
                ],
              }
              ```
            -->
            <form class="space-y-8 divide-y divide-gray-200">
              <div class="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                <div class="space-y-6 sm:space-y-5">
                  <div class="space-y-6 sm:space-y-5">
                    <div
                      class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5"
                    >
                      <label
                        for="username"
                        class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                        >Peer Address</label
                      >
                      <div class="mt-2 sm:col-span-2 sm:mt-0">
                        <div class="flex max-w-lg rounded-md shadow-sm">
                          <input
                            type="text"
                            name="peerAddress"
                            id="peerAddress"
                            autocomplete="peerAddress"
                            class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            bind:value={newConversationPeerAddress}
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5"
                    >
                      <label
                        for="about"
                        class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                        >Message</label
                      >
                      <div class="mt-2 sm:col-span-2 sm:mt-0">
                        <textarea
                          id="about"
                          name="about"
                          rows="3"
                          class="block w-full max-w-lg rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                          bind:value={newConversationFirstMessage}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div class="mt-5 sm:mt-6">
          <button
            type="button"
            class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            on:click={createConversation}
            >Send</button
          >
        </div>
        {/if}
      </div>
    </div>

{:else}
  <section
    class="flex flex-col justify-center antialiased bg-gray-50 text-gray-600 min-h-screen p-4"
  >
    <div class="h-full">
      <!-- Card -->
      <div class="relative max-w-[340px] mx-auto bg-white shadow-lg rounded-lg">
        <!-- Card header -->
        <header class="pt-6 pb-4 px-5 border-b border-gray-200">
          <div class="flex justify-between items-center mb-3">
            <!-- Image + name -->
            <div class="flex items-center">
              <!-- TODO at some point generate a random image ?
              <a class="inline-flex items-start mr-3" href="#0">
                <img
                  class="rounded-full"
                  src=""
                  width="48"
                  height="48"
                  alt={$signerAddress}
                />
              </a>
              -->
              <div class="pr-1">
                <a
                  class="inline-flex text-gray-800 hover:text-gray-900"
                  href="#"
                >
                  <h2 class="text-xl leading-snug font-bold">
                    {formatEthAddress($signerAddress)}
                  </h2>
                </a>
              </div>
            </div>
            <!-- Settings button -->
            <div class="relative inline-flex flex-shrink-0">
              <button
                class="text-gray-400 hover:text-gray-500 rounded-full focus:ring-0 outline-none focus:outline-none"
              >
                <span class="sr-only">Settings</span>
                <svg class="w-4 h-4 fill-current" viewBox="0 0 16 16">
                  <path
                    d="m15.621 7.015-1.8-.451A5.992 5.992 0 0 0 13.13 4.9l.956-1.593a.5.5 0 0 0-.075-.611l-.711-.707a.5.5 0 0 0-.611-.075L11.1 2.87a5.99 5.99 0 0 0-1.664-.69L8.985.379A.5.5 0 0 0 8.5 0h-1a.5.5 0 0 0-.485.379l-.451 1.8A5.992 5.992 0 0 0 4.9 2.87l-1.593-.956a.5.5 0 0 0-.611.075l-.707.711a.5.5 0 0 0-.075.611L2.87 4.9a5.99 5.99 0 0 0-.69 1.664l-1.8.451A.5.5 0 0 0 0 7.5v1a.5.5 0 0 0 .379.485l1.8.451c.145.586.378 1.147.691 1.664l-.956 1.593a.5.5 0 0 0 .075.611l.707.707a.5.5 0 0 0 .611.075L4.9 13.13a5.99 5.99 0 0 0 1.664.69l.451 1.8A.5.5 0 0 0 7.5 16h1a.5.5 0 0 0 .485-.379l.451-1.8a5.99 5.99 0 0 0 1.664-.69l1.593.956a.5.5 0 0 0 .611-.075l.707-.707a.5.5 0 0 0 .075-.611L13.13 11.1a5.99 5.99 0 0 0 .69-1.664l1.8-.451A.5.5 0 0 0 16 8.5v-1a.5.5 0 0 0-.379-.485ZM8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <!-- Meta -->
        </header>
        <!-- Card body -->
        <div class="py-3 px-5">
          <h3 class="text-xs font-semibold uppercase text-gray-400 mb-1">
            Chats
          </h3>
          <!-- Chat list -->
          <div class="divide-y divide-gray-200">
            <!-- User -->
            {#each conversations as { peerAddress, createdAt, topic }}
              <a
                class="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50"
                href={`/conversation/${createdAt.getTime()}`}
              >
                <div class="flex items-center">
                  <!-- TODO make the profile more colourful
                  <img
                    class="rounded-full items-start flex-shrink-0 mr-3"
                    src=""
                    width="32"
                    height="32"
                    alt="Marie Zulfikar"
                  />
                  -->
                  <div>
                    <h4 class="text-sm text-gray-500">
                      {formatEthAddress(peerAddress)}
                    </h4>
                    <h4 class="text-md font-semibold text-gray-900">
                      {messages[topic] && messages[topic].content || "Loading..."}
                    </h4>
                    <div class="text-[13px]">{timeFromNow(createdAt)}</div>
                  </div>
                </div>
              </a>
            {/each}
          </div>
        </div>
        <!-- Bottom right button -->
        <button
          class="absolute bottom-5 right-5 inline-flex items-center text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-full text-center px-3 py-2 shadow-lg focus:outline-none focus-visible:ring-2"
          on:click={() => (modalOpen = true)}
        >
          <svg
            class="w-3 h-3 fill-current text-indigo-300 flex-shrink-0 mr-2"
            viewBox="0 0 12 12"
          >
            <path
              d="M11.866.146a.5.5 0 0 0-.437-.139c-.26.044-6.393 1.1-8.2 2.913a4.145 4.145 0 0 0-.617 5.062L.305 10.293a1 1 0 1 0 1.414 1.414L7.426 6l-2 3.923c.242.048.487.074.733.077a4.122 4.122 0 0 0 2.933-1.215c1.81-1.809 2.87-7.94 2.913-8.2a.5.5 0 0 0-.139-.439Z"
            />
          </svg>
          <span>New Chat</span>
        </button>
      </div>
    </div>
  </section>
{/if}
