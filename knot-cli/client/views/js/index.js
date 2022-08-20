import data from "./knot/local-serializer.js";
import { globalKnot } from "./knot/knots.js";
import events from './knot/events.js';

data.onSave(() => 
({
    name: globalKnot.name,
    surname: globalKnot.surname,
    sent: false
}));

document.addEventListener('init', () =>
{
    globalKnot.add('name', data.name);
    globalKnot.add('surname', data.surname);
    globalKnot.add('sent', data.sent);
});

events.cock = () =>
{
    console.log('sup');
}