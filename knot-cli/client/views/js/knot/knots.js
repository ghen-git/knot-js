import events from './events.js';

const knots = [];
const dynamicKnots = [];
const globalKnot = {add: (name, value) =>
    {
        globalKnot[name + '$$$'] = value;
        Object.defineProperty(globalKnot, name, 
            {
                get: () => globalKnot[name + '$$$'],
                set: (value) => globalKnot[name + '$$$'] = value
            })
    }};

document.addEventListener('loadKnots', init);

function init()
{
    const gk = {global: true};

    Object.defineProperty(gk, 'data', 
    {
        get: () => globalKnot
    });

    knots.push(gk);

    for(const element of document.body.querySelectorAll('*'))
        for(const attr of element.getAttributeNames())
        {
            switch(attr)
            {
                case 'knot':
                {
                    let str = element.getAttribute(attr);

                    if(str[0] != '{' && str[0] != '[')
                        str = '{' + str + '}';
                
                    str = str.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ');
                    str = str.replaceAll('\'', '"');

                    knots.push({element: element, data: JSON.parse(str)});
                }
                break;
                case 'name':
                {
                    let name = element.getAttribute(attr);
                    let obj = {};

                    Object.defineProperty(obj, name, 
                    {
                        get: () => element.value,
                        set: (value) => element.value = value
                    });

                    knots.push({element: element, data: obj, input: true});
                }
                break;
                case 'k-class':
                {
                    addDynamicKnot(element, attr, 'class');
                }   
                break;
                case 'k-text':
                {
                    addDynamicKnot(element, attr, 'text');
                }   
                break;
                case 'k-html':
                {
                    addDynamicKnot(element, attr, 'html');
                }   
                break;
            }
        }
    window.requestAnimationFrame(loadKnots);
}

function getScope(element)
{
    let scope = {};
    
    for(const knot of knots)
        if(knot.global || knot.element.contains(element) || knot.element.parentElement.contains(element) || element.contains(knot.element))
        {
            if(knot.global)
            {
                for(const knotEnd of Object.getOwnPropertyNames(knot.data))
                    if(knotEnd != 'add' && !knotEnd.includes('$$$'))
                        scope[knotEnd] = {element: '', value: knot.data[knotEnd]};
            }
            else if(!knot.input)
            {
                for(const knotEnd in knot.data)
                {
                    if(!scope[knotEnd])
                    {
                        scope[knotEnd] = {element: knot.element, value: knot.data[knotEnd]};
                    }
                    else if(!Array.isArray(scope[knotEnd]))
                    {
                        scope[knotEnd] = [scope[knotEnd], {element: knot.element, value: knot.data[knotEnd]}];
                    }
                    else
                    {
                        scope[knotEnd].push({element: knot.element, value: knot.data[knotEnd]});
                    }
                }
            }
            else
            {
                const getter = Object.getOwnPropertyDescriptors(knot.data);
                Object.defineProperties(scope, getter);
            }
        }

    for(const key in scope)
        if(!Array.isArray(scope[key]))
            scope[key] = scope[key].value;

    Object.getOwnPropertyDescriptor(element, 'value');

    scope.el = element;
    if(element.value)
        scope.value = element.value;

    return scope;
}


function addDynamicKnot(element, attr, type)
{
    setTimeout(() =>
    {
        let str = element.getAttribute(attr);
        let fn;

        if(str.match(/^(function\(.*\) ?{.*})|(\(.*\) ?=> ?.*)$/g) != null)
            fn = Function('return ' + str)
        else if(str in events)
            fn = events[str]
        else
            fn = Function(`return (removeKnot) => { return ${str}}`);
        
        let scope = getScope(element);
        let scopeIDs = [];

        for(const scopeKey in scope)
            if(!str.includes(scopeKey))
                delete scope[scopeKey];

        for(const [i, knot] of knots.entries())
            if(knot.global || knot.element.contains(element) || knot.element.parentElement.contains(element) || element.contains(knot.element))
                if(!knot.input)
                    for(const key of Object.getOwnPropertyNames(knot.data))
                        if(key in scope)
                            scopeIDs.push(`${i}:${key}`);
    
        dynamicKnots.push({element: element, function: fn, scope: scope, scopeIDs: scopeIDs, prevOutput: null, type: type});
    }, 0);
}

function removeKnot(element)
{
    for(const knot of dynamicKnots)
        if(knot.element == element)
            setTimeout(() => {
                dynamicKnots.splice(dynamicKnots.indexOf(knot), 1);
            }, 0);
}

function loadKnots()
{
    for(const knot of dynamicKnots)
    {
        for(const pos of knot.scopeIDs)
        {
            const id = pos.split(':')[0];
            const name = pos.split(':')[1];
            knot.scope[name] = knots[id].data[name];
        }

        let value = knot.function.call(knot.scope).call(knot.scope, () => { setTimeout(() => removeKnot(knot.element), 0) });
        value = value.replaceAll(/\w*(?<!\/)undefined/g, '');
        value = value.replaceAll(/\/undefined/g, 'undefined');
        
        if(knot.prevOutput != value)
        {
            switch(knot.type)
            {
                case 'class':
                    knot.element.className = value;
                    break;
                case 'text':
                    knot.element.innerText = value;
                    break;
                case 'html':
                    knot.element.innerHTML = value;
                    break;
            }
        }
        knot.prevOutput = value;
    }

    window.requestAnimationFrame(loadKnots);
}

export
{
    knots as knots,
    globalKnot as globalKnot,
    getScope as getScope
}