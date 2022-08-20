import './elements.js';
import './grid.js';
import './blueprint.js';
import './menu.js';
import '../../../js/knot/knots.js';
import '../../../js/knot/events.js';

const loadKnots = new Event('loadKnots');
const loadEvents = new Event('loadEvents');
const preinit = new Event('preinit');
const init = new Event('init');
const postinit = new Event('postinit');

document.addEventListener('readystatechange', () =>
{
    window.dispatchEvent(loadKnots);
    document.dispatchEvent(loadKnots);
    window.dispatchEvent(loadEvents);
    document.dispatchEvent(loadEvents);
    window.dispatchEvent(preinit);
    document.dispatchEvent(preinit);
    window.dispatchEvent(init);
    document.dispatchEvent(init);
    window.dispatchEvent(postinit);
    document.dispatchEvent(postinit);
});