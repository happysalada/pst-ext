// src/options/index.ts
import '../app.css';
import OptionRouter from '../components/OptionRouter.svelte';

const target = document.getElementById('options');

async function renderOptions() {
  const {peerAddress} = await chrome.storage.local.get("peerAddress");
  new OptionRouter({target, props: {peerAddress}});
}

document.addEventListener('DOMContentLoaded', renderOptions);
