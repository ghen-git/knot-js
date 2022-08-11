const fs = require('fs');

const projects = JSON.parse(fs.readFileSync(__dirname + '/projects.json'));

function addProject(name, type, path)
{
    const project = {name: name, type: type, path: path};

    if(findProjectByPath(path) == undefined)
        projects.push(project);

    const strData = JSON.stringify(projects);
    fs.writeFileSync(__dirname + '/projects.json', strData);

    console.log(strData);
}

function findProjectByPath(path)
{
    return projects.find(p => p.path == path );
}

exports.projects = projects;
exports.addProject = addProject;
exports.findProjectByPath = findProjectByPath;