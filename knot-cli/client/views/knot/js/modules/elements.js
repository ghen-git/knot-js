import * as dragActions from './dragdrop.js';

document.addEventListener('preinit', init);

function init()
{
    for(const element of document.body.querySelectorAll('*'))
        for(const attr of element.getAttributeNames())
        {
            switch(attr)
            {
                case 'dragto':
                    dragActions.addDraggable(element, element.getAttribute(attr).split(' '));
                break;
                case 'drop-container':
                    dragActions.addDropzone(element);
                break;
            }
        }
}