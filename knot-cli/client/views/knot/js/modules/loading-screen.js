import { htmlToElement } from './util.js';

document.documentElement.onload = function()
{
    console.log('ey');
    document.querySelector('body').classList.add('loading');

    document.body.appendChild(htmlToElement(
        `
        <div class='loading-screen'>loading..</div>
        `
    ));
}