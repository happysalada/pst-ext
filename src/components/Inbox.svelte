<script lang="ts">
  import { signerAddress } from 'ethers-svelte'
  import { formatEthAddress, timeFromNow } from "../popup/utils";
  import { conversations, router, messages, selectedConversation } from "../popup/stores";
  import { State } from "../popup/index";

  function setConversation(conversation): void {
     router.set(State.Chat);
     selectedConversation.set(conversation);
  }
</script>

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
              <a class="inline-flex text-gray-800 hover:text-gray-900" href="#">
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
          {#each $conversations as conversation}
            <button
              class="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50"
              on:click={() => setConversation(conversation)}
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
                    {formatEthAddress(conversation.peerAddress)}
                  </h4>
                  <h4 class="text-md font-semibold text-gray-900">
                    {($messages[conversation.topic] && $messages[conversation.topic].content) ||
                      "Loading..."}
                  </h4>
                  <div class="text-[13px]">{timeFromNow(conversation.createdAt)}</div>
                </div>
              </div>
            </button>
          {/each}
        </div>
      </div>
      <!-- Bottom right button -->
      <button
        class="absolute bottom-5 right-5 inline-flex items-center text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-full text-center px-3 py-2 shadow-lg focus:outline-none focus-visible:ring-2"
        on:click={() => router.set(State.NewChat)}
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
