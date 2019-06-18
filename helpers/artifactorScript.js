const Artifactor = require('truffle-artifactor');

const artifactor = new Artifactor(__dirname);

const XCHFabi = require('../src/assets/contracts/CryptoFranc.json');
const ALEQabi = require('../src/assets/contracts/AlethenaShares.json');

const XCHFData = {
    contractName: 'XCHF',
    abi: XCHFabi
}

const ALEQData = {
    contractName: 'ALEQ',
    abi: ALEQabi
}

artifactor.save(XCHFData);
artifactor.save(ALEQData);
