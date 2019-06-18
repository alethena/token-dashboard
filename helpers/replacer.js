const replace = require('replace-in-file');
const options = {
    files: 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js',
    from: 'node: false',
    to: 'node: { crypto: true, stream: true}',
};

replace(options)
    .then(results => {
        console.log('Replacement results:', results);
    })
    .catch(error => {
        console.error('Error occurred:', error);
    });
