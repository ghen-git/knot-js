let currDragged;
let shiftX;
let shiftY;
let dragPlaceholder = null;
window.preventScroll = false;
let lastClosest;
let lastTopDropzone;
let lastTouched;
let dropzones = [];
let dropzonesRef = [];

document.addEventListener('preinit', init);

function init()
{
    if(window.innerWidth < 768) // is on mobile
    {
        document.addEventListener('touchmove', drag);
        window.addEventListener('touchmove', (e) => { if(preventScroll){ e.preventDefault();}}, {passive: false});
        document.addEventListener('touchend', reactivatePointerEvents);

        document.addEventListener('touchmove', function(event)
        {
            const touch = event.touches[0];
            const touching = document.elementFromPoint(touch.pageX, touch.pageY);

            if (lastTouched != touching)
                if(dropzonesRef.includes(touching))
                    dropzones[0] = touching;

            lastTouched = touching;
        });
    }
    else
    {
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', reactivatePointerEvents);
    }
}

function addDraggable(element, dropzones)
{
    if(window.innerWidth < 768) // is on mobile
        element.addEventListener('contextmenu', (event) => dragStart(event, dropzones));
    else
        element.addEventListener('mousedown', (event) => dragStart(event, dropzones));
}

function addDropzone(element)
{
    if(window.innerWidth < 768) // is on mobile
        dropzonesRef.push(element);
    else
    {
        element.addEventListener('mouseenter', enterDropzone);
        element.addEventListener('mouseleave', exitDropzone);
    }
}

function reactivatePointerEvents()
{
    if(currDragged != null)
    {
        currDragged.element.style.pointerEvents = 'initial';
        dragEnd();
    }
}

function dragStart(event, dropzones)
{
    const element = event.target; 

    currDragged = 
    {
        element: element,
        startX: element.style.left, 
        startY: element.style.top, 
        position: element.style.position,
        zIndex: element.style.zIndex,
        transition: element.style.transition,
        transform: element.style.transform,
        dropzones: dropzones
    };

    shiftX = event.clientX - element.getBoundingClientRect().left;
    shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'fixed';
    element.style.transition = 'none';
    element.style.transform = 'rotate(8deg)';
    element.style.zIndex = 1000;
    element.style.pointerEvents = 'none';
    element.ondragstart = function () {
        return false;
      };

    moveAt(element, event);
    document.body.appendChild(element);

    window.preventScroll = true;
}

function getDistance(x1, y1, x2, y2)
{
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function getClosest(element, checklist)
{
    let minDist = null;
    let closest = {};

    const elRect = element.getBoundingClientRect();

    for(let i = 0; i < checklist.length; i++)
    {
        const check = checklist[i];

        const checkRect = check.getBoundingClientRect();

        const tlDist = getDistance(elRect.left + elRect.width / 2, elRect.top + elRect.height / 2, checkRect.left, checkRect.top);
        const brDist = getDistance(elRect.left + elRect.width / 2, elRect.top + elRect.height / 2, checkRect.right, checkRect.bottom);
        let dist, order;
        if(tlDist < brDist)
        {
            dist = tlDist;
            order = 'before';
        }
        else
        {
            dist = brDist;
            order = 'after';
        }

        if(minDist == null || dist < minDist && element != check)
        {
            closest = {index: i, order: order};
            minDist = dist;
        }
    }

    return closest;
}

function insertAfter(newNode, existingNode) 
{
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function appendDrag(element)
{    
    if(dropzones[0].children.length > 0)
    {
        const closest = getClosest(currDragged.element, dropzones[0].children);
        if(closest.order == 'before')
            dropzones[0].insertBefore(element, dropzones[0].children[closest.index])
        else
            insertAfter(element, dropzones[0].children[closest.index]);
    }
    else
        dropzones[0].appendChild(element);
}

function dragEnd()
{
    const element = currDragged.element; 

    if(dropzones.length > 0 && currDragged.dropzones.includes(dropzones[0].getAttribute('drop-container')))
        appendDrag(element);

    element.style.position = currDragged.position;
    element.style.zIndex = currDragged.zIndex;
    element.style.left = currDragged.startX;
    element.style.top = currDragged.startY;
    element.style.transition = currDragged.transition;
    element.style.transform = currDragged.transform;

    currDragged = null;
    if(dragPlaceholder != null)
    {
        dragPlaceholder.remove();
        dragPlaceholder = null;
    }

    window.preventScroll = false;
}

function moveAt(element, event)
{
    let x = 0, y = 0;

    if (event.touches && event.touches[0]) 
    {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
    } 
    else if (event.originalEvent && event.originalEvent.changedTouches[0]) 
    {
        x = event.originalEvent.changedTouches[0].clientX;
        y = event.originalEvent.changedTouches[0].clientY;
    }
    else if (event.clientX && event.clientY) 
    {
        x = event.clientX;
        y = event.clientY;
    }

    element.style.left = x - shiftX + 'px';
    element.style.top = y - shiftY + 'px';
}

function spawnDragPlaceholder()
{
    if(dragPlaceholder != null)
        dragPlaceholder.remove();

    const rect = currDragged.element.getBoundingClientRect();
    dragPlaceholder = document.createElement('div');

    dragPlaceholder.style.width = rect.width + 'px';
    dragPlaceholder.style.height = rect.height + 'px';
    dragPlaceholder.style.backgroundColor = 'rgba(128, 128, 128, 0.125)';
    dragPlaceholder.style.borderRadius = '5px';
}

function drag(event) 
{
    if(currDragged != null)
    {
        moveAt(currDragged.element, event);

        if(dropzones.length > 0 && currDragged.dropzones.includes(dropzones[0].getAttribute('drop-container')))
        {
            if(dragPlaceholder && dropzones[0].children.length > 0)
            {
                const closest = getClosest(currDragged.element, dropzones[0].children);

                if(!lastClosest || (closest.index != lastClosest.index || closest.order != lastClosest.order))
                    appendDrag(dragPlaceholder);

                lastClosest = closest;
            }
            else if(dragPlaceholder == null)
            {
                spawnDragPlaceholder();
                appendDrag(dragPlaceholder);
            }
            else if(lastTopDropzone != dropzones[0])
                appendDrag(dragPlaceholder);

            lastTopDropzone = dropzones[0];
        }
    }
}

function enterDropzone(event)
{
    dropzones.unshift(event.target);
}

function exitDropzone(event)
{
    dropzones.splice(dropzones.indexOf(event.target), 1);
}

export
{
    addDraggable as addDraggable,
    addDropzone as addDropzone
}