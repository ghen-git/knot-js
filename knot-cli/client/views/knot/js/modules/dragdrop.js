let currDragged;
let shiftX;
let shiftY;
let dropzones = [];

document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', reactivatePointerEvents);

function addDraggable(element, dropzones)
{
    element.addEventListener('mousedown', (event) => dragStart(event, dropzones));
    element.addEventListener('mousemove', drag);
}

function addDropzone(element)
{
    element.addEventListener('mouseenter', enterDropzone);
    element.addEventListener('mouseleave', exitDropzone);
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

    element.style.position = 'fixed';
    element.style.transition = 'none';
    element.style.transform = 'rotate(8deg)';
    element.style.zIndex = 1000;
    element.style.pointerEvents = 'none';
    element.ondragstart = function () {
        return false;
      };

    shiftX = event.clientX - element.getBoundingClientRect().left;
    shiftY = event.clientY - element.getBoundingClientRect().top;
    moveAt(element, event.pageX, event.pageY);
    document.body.appendChild(element);
}

function getDistance(x1, y1, x2, y2)
{
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function getClosest(element, checklist, parent)
{
    let minDist = null;
    let closest = {};

    const elRect = element.getBoundingClientRect();

    for(let i = 0; i < checklist.length; i++)
    {
        const check = checklist[i];

        const checkRect = check.getBoundingClientRect();

        const tlDist = getDistance(elRect.left, elRect.top, checkRect.left, checkRect.top);
        const brDist = getDistance(elRect.left, elRect.top, checkRect.right, checkRect.bottom);
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

function dragEnd()
{
    const element = currDragged.element; 

    if(dropzones.length > 0 && currDragged.dropzones.includes(dropzones[0].getAttribute('drop-container')))
    {
        if(dropzones[0].children.length > 0)
        {
            const closest = getClosest(element, dropzones[0].children, dropzones[0]);
            if(closest.order == 'before')
                dropzones[0].insertBefore(element, dropzones[0].children[closest.index])
            else
                insertAfter(element, dropzones[0].children[closest.index]);
        }
        else
            dropzones[0].appendChild(element);
    }

    element.style.position = currDragged.position;
    element.style.zIndex = currDragged.zIndex;
    element.style.left = currDragged.startX;
    element.style.top = currDragged.startY;
    element.style.transition = currDragged.transition;
    element.style.transform = currDragged.transform;

    currDragged = null;
}

function moveAt(element, pageX, pageY)
{
    element.style.left = pageX - shiftX + 'px';
    element.style.top = pageY - shiftY + 'px';
}

function drag(event) 
{
    if(currDragged != null)
        moveAt(currDragged.element, event.pageX, event.pageY);
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