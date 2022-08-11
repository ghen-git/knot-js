import properties from './properties.js';

let savedData = {};

load();

window.addEventListener('beforeunload', function (e) 
{
    save(saveData());
});

function load()
{
    const strData = window.localStorage.getItem(properties.name + '-data');

    if(strData != "undefined")
        savedData = JSON.parse(strData);

    return savedData;
}

function save(data)
{
    savedData = data;
    window.localStorage.setItem(properties.name + '-data', JSON.stringify(savedData));
}

let saveData = () => ({});
function onSave(callback)
{
    saveData = callback;
}

export
{
    load,
    save,
    savedData,
    onSave
};