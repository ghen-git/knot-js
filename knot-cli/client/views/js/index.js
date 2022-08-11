import { localSerializer } from "../knot/js/modules/knot.js";

localSerializer.onSave(() => 
({
    name: window.idk
}));

loadData(localSerializer.savedData);

function loadData(data)
{
    window.idk = data.name;
}