const router = require('./extension-router');
const fs = require('fs');


const mkGridString = /knot-grid:\d+-\d+\r\n/s
router.route('html', (path) =>
{
    const data = fs.readFileSync(path); //read existing contents into data

    let dataStr = data.toString();
    const gridInstructions = dataStr.match(mkGridString);

    if(gridInstructions != null && gridInstructions.length > 0)
        for(const instruction of gridInstructions)
            dataStr = dataStr.replace(instruction, 'foundya');

    const fd = fs.openSync(path, 'w+');
    const buffer = Buffer.from(dataStr);

    fs.writeSync(fd, buffer, 0, buffer.length, 0);
    fs.close(fd);
});

module.exports = router.dispatch;