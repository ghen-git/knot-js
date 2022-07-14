var commands = {};

exports.command = (name, callback, options) =>
{
    if(!Object.keys(commands).includes(name))
        commands[name] = {callback: callback, options: options};
    else
        throw new Error('command name already exists');
}

exports.dispatch = () =>
{
    const command = process.argv[2];

    if(Object.keys(commands).includes(command))
    {
        let args;
        if(checkKey(commands[command], 'options') && !checkKey(commands[command].options, 'singlePar'))
            args = parseArgs();

        if(args == undefined)
            commands[command].callback(process.argv[3], process.cwd());
        else
            commands[command].callback(args, process.cwd());
    }
    else
        console.error(`unknown command "${command}"`);
}

function parseArgs()
{
    let args = {};

    for(let i = 3; i < process.argv.length; i += 2)
    {
        if(i + 1 > process.argv.length || process.argv[i].substring(0, 2) != '--')
        {
            console.error(`invalid command arguments`);
            break;
        }
        else
            args[process.argv[i].substring(2)] = process.argv[i + 1];
    }

    return args;
}

function checkKey(options, key)
{
    return Object.keys(options).includes(key) && options[key] == true;
}