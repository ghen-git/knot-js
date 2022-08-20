import { knots, globalKnot, getScope } from './knots.js';

let events = {};

document.addEventListener('loadEvents', init);

function init()
{
    for(const element of document.body.querySelectorAll('*'))
        for(const attr of element.getAttributeNames())
        {
            switch(attr)
            {
                case 'k-class':
                case 'k-text':
                case 'k-html':
                break;
                case 'k-init':
                {
                    document.addEventListener('postinit', (e) => callback(element.getAttribute(attr), e, element));
                }
                break;
                default:
                {
                    if(attr.match(/k-.*/g) != null)
                        element.addEventListener(attr.replace('k-', ''), (e) => callback(element.getAttribute(attr), e, element));
                }
                break;
            }
        }
}

function callback(str, e, element)
{
    let fn;

    const scope = getScope(element);

    if(str.match(/^(function\(.*\) ?{.*})|(\(.*\) ?=> ?.*)$/g) != null)
    {
        Function(str).call(scope, e);
    }
    else if(str in events)
    {
        events[str].call(scope, e);
    }
    else
    {
       const f = Function(`return (e) => {${str}}`);
       f.call(scope, e).call(scope, e);
    }
    
    for(const knotVar in scope)
        if(Object.getOwnPropertyNames(globalKnot).includes(knotVar))
            globalKnot[knotVar] = scope[knotVar];

    for(const knot of knots)
        if(!knot.global && (knot.element.contains(element) || knot.element.parentElement.contains(element) || element.contains(knot.element)))
            for(const knotVar in knot.data)
            {
                if(!Array.isArray(scope[knotVar]))
                    knot.data[knotVar] = scope[knotVar];
                else
                    for(const obj of scope[knotVar])
                        if(knot.element == obj.element)
                            knot.data[knotVar] = obj.value;
            }
}

export default events;