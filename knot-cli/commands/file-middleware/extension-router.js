function Router() 
{
    this.routes = {};

    this.route = (ext, callback) =>
    {
        if(!Object.keys(this.routes).includes(ext))
            this.routes[ext] = callback;
        else
            throw new Error('command name already exists');
    };

    this.dispatch = (path) =>
    {
        const ext = path.split('.').pop();

        if(Object.keys(this.routes).includes(ext))
            this.routes[ext](path);
    };
}

module.exports = new Router();