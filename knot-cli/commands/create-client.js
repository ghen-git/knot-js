const fse = require('fs-extra');
const { exec } = require('child_process');

 
function createClient(name, path)
{
    fse.copy(__dirname.replace('commands', 'client'), path + '/' + name, function (err) 
    {
        if (err) 
        {                 
            console.error(err);      
        } 
        else 
        {
            console.log("success!");
            exec(`cd ${path + '/' + name} & npm i tailwindcss & npm i`);
        }
    });
}

module.exports = createClient;