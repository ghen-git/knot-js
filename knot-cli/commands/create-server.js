const fse = require('fs-extra');
const { exec } = require('child_process');
const options = require('../options');
 
function createServer(name, path)
{
    fse.copy(__dirname.replace('commands', 'server'), path + '/' + name, function (err) 
    {
        if (err) 
        {                 
            console.error(err);      
        } 
        else 
        {
            console.log("success!");
            options.addProject(name, 'server', path + '\\' + name);
        }
    });
}

module.exports = createServer;