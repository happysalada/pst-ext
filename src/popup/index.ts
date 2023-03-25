import '../app.css';
import Inbox from '../components/Inbox.svelte';

const target = document.getElementById('app');

async function render() {
  // TODO find a way to use chrome storage to sync conversations
  // const {count} = await chrome.storage.sync.get({count: 0});

  new Inbox({target, props: {}});
}

document.addEventListener('DOMContentLoaded', render);
