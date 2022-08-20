import properties from '../../knot/js/modules/properties.js';

let data = 
{
    onSave: onSave
};

window.addEventListener('beforeunload', function (e) 
{
    save(saveData());
});

window.addEventListener('preinit', load);

function load()
{
    const strData = window.localStorage.getItem(properties.name + '-data');

    if(strData != "undefined")
        Object.assign(data, JSON.parse(strData));

    return data;
}

function save(d)
{
    data = d;
    window.localStorage.setItem(properties.name + '-data', JSON.stringify(data));
}

let saveData = () => ({});
function onSave(callback)
{
    saveData = callback;
}

export default data;