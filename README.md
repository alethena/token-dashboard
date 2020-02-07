# Token Dashboard
This is the token dashboard that let clients manage in a user-friendly way their equity token and share dispenser.
## Get Started on Windows
### Clone the Repository
```
git clone https://github.com/Alethena/token-dashboard.git
cd token-dashboard
```
### Required Tools and Configurations (Run as Administrator)
```
npm install --global --production windows-build-tools
npm config set python /path/to/executable/python2.7
```
### Required npm Packages
```
npm install
npm install --save web3@1.0.0-beta.37
npm install node-sass --save
```
Note: Probably you need to delete the `websocket` folder after the first `npm install`. Also, make sure you are not working with Node.js >= 12.0.0 as `node-gyp` then will fail. `Version 11.15.0` is the latest working version.
### Fixes
```
cd helpers
node replacer.js
```
### Serve the Environment
```
ng serve
```
### Deployment on AWS
Just run `sh deploy_aws.sh` in your shell (if this doesn't work, update your npm packages).