const fse = require('fs-extra');
const { exec } = require('child_process');
const options = require('../options');
 
function createDbServer(name, path)
{
    fse.copy(__dirname.replace('commands', 'db-server'), path + '/' + name, function (err) 
    {
        if (err) 
        {                 
            console.error(err);      
        } 
        else 
        {
            console.log("success!");
            options.addProject(name, 'db-server', path + '\\' + name);
        }
    });
}

module.exports = createDbServer;