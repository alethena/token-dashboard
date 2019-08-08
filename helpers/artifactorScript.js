const Artifactor = require('truffle-artifactor');

const artifactor = new Artifactor(__dirname);

//const XCHFabi = require('../src/assets/contracts/CryptoFranc.json');
// const TTEabi = require('./TestTokenEquity.json');
const SDabi = require ('./ShareDispenser.json');

//const XCHFData = {
//    contractName: 'XCHF',
//    abi: XCHFabi
//}

// const TTEData = {
//     contractName: 'TTE',
//     abi: TTEabi
// }

const SDData = {
    contractName: 'SD',
    abi: SDabi
}

// artifactor.save(XCHFData);
// artifactor.save(TTEData);
artifactor.save(SDData);