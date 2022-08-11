const { watch } = require('chokidar');
const { exec } = require('child_process');
const servor = require('servor');
const onAddRouter = require('./file-middleware/on-add-router');
const onEditRouter = require('./file-middleware/on-edit-router');
const options = require('../options');

async function run(args, path)
{
    const project = options.findProjectByPath(path);
    console.log(project.type);
    
    //starts tailwind
    exec('npx tailwindcss -i ./views/style.css -o ./views/tailwind.css --watch');
    exec('npx tailwindcss -i ./views/knot/css/knot-base.css -o ./views/knot/css/knot.css --watch'); // ⚠ NEEDS TO BE REMOVED FOR FINAL PACKAGE ⚠

    //for later when needing to update the js
    let watcher = watch(path, {ignored: /^\./, persistent: true, ignoreInitial: true});

    watcher
        .on('add', onAddRouter)
        //.on('change', onEditRouter)
        .on('unlink', function(path) {console.log('File', path, 'has been removed');})
        .on('error', function(error) {console.error('Error happened', error);})

    console.log(`watching ${path}`);

    //live server
    const livePage = await servor({
        root: './views',
        fallback: 'index.html',
        module: false,
        static: false,
        reload: true,
        inject: '',
        credentials: null,
        port: 4200,
    });

    const start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
    exec(`${start} http://localhost:4200`);
}

module.exports = run;