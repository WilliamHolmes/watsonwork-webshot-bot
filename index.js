const webshot = require('webshot');

const del = require('delete');
const linkifyjs = require('linkifyjs');
const _ = require('underscore');

const appFramework = require('watsonworkspace-bot');
appFramework.level('verbose');
appFramework.startServer();
const app = appFramework.create();

const UI = require('watsonworkspace-sdk').UI;

const constants = require('./js/constants');
const strings = require('./js/strings');

app.authenticate().then(() => app.uploadPhoto('./appicon.jpg'));

const sendErrorMessage = (spaceId, url, invalid) => {
    app.sendMessage(spaceId, {
        actor: { name: 'Oh no!' },
        color: constants.COLOR_ERROR,
        text: invalid ? url : `[${url}](${url})`,
        title: 'something went wrong',
        type: 'generic',
        version: '1'
    });
}


app.on('message-created', (message, annotation) => {
    const { content = '', spaceId } = message;
    console.log('CONTENT', content);
    _.each(content.match(constants.regex.WEB_SHOT), str => {
        console.log('webshot match', str);
        const url = strings.chompLeft(str.toLowerCase(), constants.regex.KEY);
        console.log('URL', url);

        if(linkifyjs.test(url)) {
            const filePath = `./${constants.TEMP_DIR}/webshot_${_.now()}.png`;
            console.log('filePath', filePath);
            webshot(url, filePath, err => {
                console.log('WEBSHOT response', url, err);
                if (err) {
                    console.log('WEBSHOT ERROR', err);
                    sendErrorMessage(spaceId, url);
                } else {
                    app.sendFile(spaceId,filePath);
                    del.sync(filePath, { force: true });
                }
            });
        } else {
            console.log('LINK ERROR', url);
            sendErrorMessage(spaceId, url, true);
        }
    });
});
