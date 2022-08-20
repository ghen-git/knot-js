const fs = require('fs');

 
function add(args, path)
{
    if(args.font)
    {
        let defaultStr = '';
        const fontName = args.url.split('family=')[1].split('&')[0].split(':')[0].replace('+', ' ');

        if(args.default)
        {
            defaultStr = `\n*\n{\n\tfont-family: '${fontName}';\n}`;
        }

        insertAfter(path + '/views/style.css', '@import', `@import url('${args.url}');\n${defaultStr}`)
    }
    else if(args['material-icons'])
    {
        insertAfter(path + '/views/style.css', '@import', `@import url('https://fonts.googleapis.com/icon?family=Material+Icons');\n\n.material-icons\n{\n\t@apply text-base;\n}`);
    }
}

function insertAfter(path, refStr, text)
{
    const data = fs.readFileSync(path);
    const fd = fs.openSync(path, 'w+');
    
    const dataStr = data.toString();

    if(dataStr.includes(refStr))
    {
        const buffer = Buffer.from(text);

        const dataBefore = Buffer.from(dataStr.replace(new RegExp(`(?!([.+\n]*${refStr}.+))(\n+.+)+`, 'g'), '\n'));
        const dataAfter = Buffer.from(dataStr.replace(new RegExp(`([.+\n]*${refStr}.+)+`, 'g'), ''));
    
        fs.writeSync(fd, dataBefore, 0, dataBefore.length, 0);
        fs.writeSync(fd, buffer, 0, buffer.length, dataBefore.length);
        fs.writeSync(fd, dataAfter, 0, dataAfter.length, dataBefore.length + buffer.length);
    }
    else
    {
        const buffer = Buffer.from(text + '\n' + '\n');

        fs.writeSync(fd, buffer, 0, buffer.length, 0);
        fs.writeSync(fd, data, 0, data.length, buffer.length);
    }

    fs.close(fd);
}

module.exports = add;