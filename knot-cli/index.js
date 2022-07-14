#! /usr/bin/env node
const dispatcher = require('./dispatcher');
const run = require('./commands/run');
const createClient = require('./commands/create-client');

dispatcher.command('run', run);
dispatcher.command('create-client', createClient);

dispatcher.dispatch();