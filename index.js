'use strict';

const webshot = require('webshot');

const del = require('delete');
const _ = require('underscore');

const appFramework = require('watsonworkspace-bot');
appFramework.level('verbose');
appFramework.startServer();
const app = appFramework.create();

const UI = require('watsonworkspace-sdk').UI;

const constants = require('./js/constants');
const strings = require('./js/strings');

app.authenticate().then(() => app.uploadPhoto('./appicon.jpeg'));


app.on('message-created', (message, annotation) => {
    const { content = '', spaceId } = message;
    _.each(content.match(constants.regex.WEB_SHOT), str => {
        const URL = strings.chompLeft(str.toLowerCase(), constants.regex.KEY);
        const filePath = `./${constants.TEMP_DIR}/webshot_${packageName}.png`;
        webshot(URL, filePath, err => {
            app.sendMessage(spaceId, data);
            if (_.isEmpty(err)) {
                app.sendFile(spaceId,filePath);
                del.sync(filePath, { force: true });
            }
        });
    });
});
