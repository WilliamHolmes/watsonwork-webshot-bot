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

app.authenticate().then(() => app.uploadPhoto('./appicon.jpg'));


app.on('message-created', (message, annotation) => {
    const { content = '', spaceId } = message;
    console.log('CONTENT', content);
    _.each(content.match(constants.regex.WEB_SHOT), str => {
        console.log('webshot match', str);
        const url = strings.chompLeft(str.toLowerCase(), constants.regex.KEY);
        console.log('URL', url);
        const filePath = `./${constants.TEMP_DIR}/webshot_${_.now()}.png`;
        console.log('filePath', filePath);
        webshot(url, filePath, err => {
            console.log('WEBSHOT response', url);
            if (_.isEmpty(err)) {
                app.sendFile(spaceId,filePath);
                del.sync(filePath, { force: true });
            } else {
                console.error('WEBSHOT ERROR', err);
                app.sendMessage(spaceId, Object.assign({
                    type: 'generic',
                    version: '1',
                    color: constants.COLOR_ERROR
                }, {
                    actor: { name: 'WebShot Error' },
                    title: url,
                    text: `\n*Error*: ${err}`,
                }));
            }
        });
    });
});
