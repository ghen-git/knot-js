const fse = require('fs-extra');
const { exec } = require('child_process');
const options = require('../options');
const fs = require('fs');

 
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
            options.addProject(name, 'client', path + '\\' + name);

            //properties.js compilation
            const fd = fs.openSync(path + '/' + name + '/views/knot/js/modules/properties.js', 'w+');
            const buffer = Buffer.from(
                `export default 
                {
                    name: '${name}'
                }`
            );
            fs.writeSync(fd, buffer, 0, buffer.length, 0);
            fs.close(fd);
            
            exec(`cd ${path + '/' + name} & npm i tailwindcss & npm i`);
        }
    });
}

module.exports = createClient;