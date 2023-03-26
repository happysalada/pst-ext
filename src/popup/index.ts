import '../app.css';
import Router from '../components/Router.svelte';

const target = document.getElementById('popup');

async function renderPopup() {
  // TODO find a way to use chrome storage to sync conversations
  // const {count} = await chrome.storage.sync.get({count: 0});
  console.log("rendering popup")
  new Router({target, props: {}});
}

document.addEventListener('DOMContentLoaded', renderPopup);

