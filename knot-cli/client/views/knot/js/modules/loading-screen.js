import { htmlToElement } from '../../../js/knot/util.js';

document.documentElement.onload = function()
{
    document.querySelector('body').classList.add('loading');

    document.body.appendChild(htmlToElement(
        `
        <div class='loading-screen'>loading..</div>
        `
    ));
}