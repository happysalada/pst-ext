import '../app.css';
import Router from '../components/Router.svelte';

const target = document.getElementById('app');

async function render() {
  // TODO find a way to use chrome storage to sync conversations
  // const {count} = await chrome.storage.sync.get({count: 0});

  new Router({target, props: {}});
}

document.addEventListener('DOMContentLoaded', render);

export enum State {
  Inbox,
  NewChat,
  Chat,
} 
