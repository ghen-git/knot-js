let commands = {};

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
        if(commands[command].options !== undefined && !checkKey(commands[command].options, 'singlePar'))
            args = parseArgs(commands[command].options);

        if(args == undefined)
            commands[command].callback(process.argv[3], process.cwd());
        else
            commands[command].callback(args, process.cwd());
    }
    else
        console.error(`unknown command "${command}"`);
}

function parseArgs(options)
{
    const startIndex = 'optionsStart' in options ? options.optionsStart : 0;

    const args = {};

    for(let i = 0; i < startIndex; i++)
        args[process.argv[i + 3]] = true;

    for(let i = 3 + startIndex; i < process.argv.length; i += 2)
    {
        if(i + 1 > process.argv.length || process.argv[i].substring(0, 2) != '--')
        {
            console.error(`invalid command arguments`);
            break;
        }
        else
            args[process.argv[i].substring(2)] = process.argv[i + 1] ?? true;
    }

    return args;
}

function checkKey(options, key)
{
    return options[key];
}