#! /usr/bin/env node
const dispatcher = require('./dispatcher');
const run = require('./commands/run');
const createClient = require('./commands/create-client');
const createServer = require('./commands/create-server');
const createDBServer = require('./commands/create-db-server');

dispatcher.command('run', run);
dispatcher.command('create-client', createClient);
dispatcher.command('create-server', createServer);
dispatcher.command('create-db-server', createDBServer);

dispatcher.dispatch();