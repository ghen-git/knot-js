const fse = require('fs-extra');
 
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
        }
    });
}

module.exports = createClient;