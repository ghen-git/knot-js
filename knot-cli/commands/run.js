const { watch } = require('chokidar');
const { exec } = require('child_process');
const liveServer = require('live-server');

function run(args, path)
{
    //starts tailwind
    exec('npx tailwindcss -i ./views/style.css -o ./views/tailwind.css --watch');

    //for later when needing to update the js
    let watcher = watch(path, {ignored: /^\./, persistent: true, ignoreInitial: true});

    watcher
        .on('add', function(path) {console.log('File', path, 'has been added');})
        .on('change', function(path) {console.log('File', path, 'has been changed');})
        .on('unlink', function(path) {console.log('File', path, 'has been removed');})
        .on('error', function(error) {console.error('Error happened', error);})

    console.log(`watching ${path}`);

    //live server
    const params = 
    {
        host: '127.0.0.1',
        port: '4200',
        root: 'views',
        open: true,
        file: 'index.html',
        wait: 50,
        logLevel: 0
    };
    
    liveServer.start(params);
}

module.exports = run;