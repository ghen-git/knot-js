function htmlToElement(html) 
{
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

function isFunction(string)
{
    const check = string.replace(' ', '');

    return typeof window[string] === 'function' ||
        check.substr(0, 8) == 'function' || check.match(/\(.*\)=>{?.*}?/g) != null;
}

export
{
    htmlToElement as htmlToElement,
    isFunction as isFunction
};