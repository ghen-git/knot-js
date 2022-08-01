const router = require('./extension-router');
const fs = require('fs');


const jsInitialString = `import * from '../knot/js/modules/knot.js';`;
// router.route('js', (path) =>
// {
//     const data = fs.readFileSync(path); //read existing contents into data
//     const fd = fs.openSync(path, 'w+');
//     const buffer = Buffer.from(jsInitialString);

//     fs.writeSync(fd, buffer, 0, buffer.length, 0);
//     fs.writeSync(fd, data, 0, data.length, buffer.length);
//     // or fs.appendFile(fd, data);
//     fs.close(fd);
// });

module.exports = router.dispatch;