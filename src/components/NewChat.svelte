<script lang="ts">
  import { xmtpClient, conversations, router } from "../popup/stores";
  import { State } from "../popup/index";

  let newConversationPeerAddress: string;
  let newConversationFirstMessage: string;
  let inviteLink: string;

  async function createConversation(): Promise<void> {
    if (!$xmtpClient) return;
    // TODO figure out why adding a conversationId crashes this
    const newConversation = await $xmtpClient.conversations.newConversation(newConversationPeerAddress);
    conversations.set([newConversation, ...$conversations]);
    await newConversation.send(newConversationFirstMessage);
    let timestamp = newConversation.createdAt.getTime();
    inviteLink = `https://pst.sassy.technology/invite/${timestamp}`;
  }
</script>

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
  <div
    class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
  >
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
          <div class="mt-5 sm:mt-6">
            <button
              type="button"
              class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:outline hover:outline-2 hover:outline-offset-2 hover:outline-indigo-600"
              on:click={() => router.set(State.Inbox)}>Close</button
            >
          </div>
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
      <div class="mt-5 sm:mt-6 flex">
        <button
          type="button"
          class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          on:click={createConversation}>Send</button
        >
        <button
          type="button"
          class="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          on:click={() => router.set(State.Inbox)}>Cancel</button
        >
      </div>
    {/if}
  </div>
</div>
