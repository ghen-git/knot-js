import { isFunction } from './util.js';
import * as dragActions from './dragdrop.js';

const arrayVars = {};

const config = { attributes: false, childList: true, subtree: false };

// Callback function to execute when mutations are observed
const callback = function(mutationList, observer) 
{
    const element = mutationList[0].target;
    const name = element.getAttribute('k-var');

    let index = null;
    for(let i = 0; i < arrayVars[name].keys.length && index == null; i++)
        if(arrayVars[name].keys[i] == element)
            index = i;

    console.log(arrayVars[name].values[index], index);

};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

init();

function init()
{
    for(const element of document.body.querySelectorAll('*'))
        for(const attr of element.getAttributeNames())
        {
            switch(attr)
            {
                case 'k-var':
                    const name = element.getAttribute(attr);

                    if(element.tagName.toLowerCase() == 'input')
                    {
                        Object.defineProperty(window, name, 
                        {
                            get: () => element.value,
                            set: (value) => element.value = value
                        });
                    }
                    else if(!(name in window))
                    {
                        Object.defineProperty(window, name, 
                        {
                            get: () => element.innerText,
                            set: (value) => element.innerText = value,
                            configurable: true
                        });
                        
                        arrayVars[name] = {values: [element.innerText], keys: [element]};
                        observer.observe(element, config);
                    }
                    else if(!Array.isArray(window[name]))
                    {
                        Object.defineProperty(window, name, 
                        {
                            get: () => 
                            {
                                setTimeout(() => 
                                {
                                    for(let i = 0; i < arrayVars[name].keys.length; i++)
                                        arrayVars[name].keys[i].innerText = arrayVars[name].values[i]
                                }, 1);

                                return arrayVars[name].values;
                            },
                            set: (value) => arrayVars[name].values = value,
                            configurable: true
                        });
                        
                        arrayVars[name].keys.push(element);
                        arrayVars[name].values.push(element.innerText);
                        observer.observe(element, config);
                    }
                    else
                    {
                        arrayVars[name].keys.push(element);
                        arrayVars[name].values.push(element.innerText);
                        observer.observe(element, config);
                    }
                break;
                case 'dragto':
                    dragActions.addDraggable(element, element.getAttribute(attr).split(' '));
                break;
                case 'drop-container':
                    dragActions.addDropzone(element);
                break;
                default:
                    if(attr.match(/k-.*/g) != null)
                        element.addEventListener(attr.replace('k-', ''), getFunction(element.getAttribute(attr)));
                break;
            }
        }
}

function getFunction(str)
{
    let fn;
    if(isFunction(str))
        fn = eval.call(window, str);
    else
        fn = (e) => eval.call(window, str);

    return fn;
}