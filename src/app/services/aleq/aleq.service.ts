import { Injectable } from '@angular/core';
import { InfuraService } from '../infura/infura.service';
import { DataService } from '../data/data.service';
import { Web3Service } from '../metamask/web3.service';

declare var require: any;
const config = require('../../equity/companyInformation.json');
const BN = require('bn.js');
const bigInt = require('big-integer');
const ALEQData = require('../../../../helpers/ALEQ.json');
const SDData = require('../../../../helpers/ShareDispenser.json');
const XCHFData = require('../../../../helpers/XCHF.json');

@Injectable({ providedIn: 'root' })

export class AleqService {
  ALEQInstance: any;
  SDInstance: any;
  XCHFInstance: any;
  MMenabled = false;
  XCHFAddressSD = '0x84286f1e0Aaa59787131DA691b5D5cFC2Aff289A';

  constructor(
    private infuraService: InfuraService,
    private dataService: DataService,
    private web3Service: Web3Service) { }

  async bootstrapALEQ(selectedAddress) {
    if (this.ALEQInstance === undefined) {
    const ALEQAbstraction = await this.infuraService.artifactsToContract(ALEQData);
    const SDAbstraction = await this.infuraService.artifactsToContract(SDData);
    this.ALEQInstance = await ALEQAbstraction.at(selectedAddress);
    this.SDInstance = await SDAbstraction.at(config[selectedAddress].SD);
    // console.log(this.ALEQInstance);
    // console.log(this.SDInstance);
    this.refreshVariables();
    } else {
      const ALEQAbstraction = await this.infuraService.artifactsToContract(ALEQData);
      this.ALEQInstance = await ALEQAbstraction.at(selectedAddress);
      const SDAbstraction = await this.infuraService.artifactsToContract(SDData);
      this.SDInstance = await SDAbstraction.at(config[selectedAddress].SD);
    }
  }

  async refreshVariables() {
    setInterval(async () => {
      const pauseStatus = await this.ALEQInstance.isPaused.call();
      this.dataService.pauseStatusObservable.next(pauseStatus);

      const nameStatus = await this.ALEQInstance.name.call();
      this.dataService.nameStatusObservable.next(nameStatus);

      const symbolStatus = await this.ALEQInstance.symbol.call();
      this.dataService.symbolStatusObservable.next(symbolStatus);

      const totalSupplyStatus = await this.ALEQInstance.totalSupply.call();
      this.dataService.totalSupplyStatusObservable.next(totalSupplyStatus);

      const totalSharesStatus = await this.ALEQInstance.totalShares.call();
      this.dataService.totalSharesStatusObservable.next(totalSharesStatus);

      const termsandconditions = await this.ALEQInstance.termsAndConditions.call();
      this.dataService.termsandconditionsObservable.next(termsandconditions);

      const collateralRate = await this.ALEQInstance.collateralRate.call();
      this.dataService.collateralRateObservable.next(collateralRate);

      const preClaimPeriod = await this.ALEQInstance.preClaimPeriod.call();
      this.dataService.preClaimPeriodObservable.next(preClaimPeriod);

      const claimPeriod = await this.ALEQInstance.claimPeriod.call();
      this.dataService.claimPeriodObservable.next(claimPeriod);

      const contractAddress = await this.ALEQInstance.address;
      this.dataService.contractAddressObservable.next(contractAddress);

      const ownerAddress = await this.ALEQInstance.owner.call();
      this.dataService.ownerAddressObservable.next(ownerAddress);

      const masterAddress = await this.ALEQInstance.master.call();
      this.dataService.masterAddressObservable.next(masterAddress);

      const contractAddressSD = await this.SDInstance.address;
      this.dataService.SDcontractAddressObservable.next(contractAddressSD);

      const ownerAddressSD = await this.SDInstance.owner.call();
      this.dataService.SDownerAddressObservable.next(ownerAddressSD);

      const contractAddressXCHF = await this.SDInstance.XCHFContractAddress.call();
      this.dataService.XCHFcontractAddressObservable.next(contractAddressXCHF);

      const availableSharesSD = await this.SDInstance.getERC20Balance.call(contractAddress);
      this.dataService.SDavailableSharesObservable.next(availableSharesSD);

      const availableXCHFSD = await this.SDInstance.getERC20Balance.call(contractAddressXCHF);
      this.dataService.SDavailableXCHFObservable.next(availableXCHFSD);

      const minimumPrice = await this.SDInstance.minPriceInXCHF.call();
      this.dataService.SDminPriceObservable.next(minimumPrice);

      const maximumPrice = await this.SDInstance.maxPriceInXCHF.call();
      this.dataService.SDmaxPriceObservable.next(maximumPrice);

      const minimumVolume = await this.SDInstance.minVolume.call();
      this.dataService.SDminVolumeObservable.next(minimumVolume);

      const slope = await this.SDInstance.initialNumberOfShares.call();
      this.dataService.SDslopeObservable.next(slope);

      const pauseStatusSD = await this.SDInstance.paused.call();
      this.dataService.SDpauseStatusObservable.next(pauseStatusSD);

      const buyStatusSD = await this.SDInstance.buyEnabled.call();
      this.dataService.SDbuySideStatusObservable.next(buyStatusSD);

      const sellStatusSD = await this.SDInstance.sellEnabled.call();
      this.dataService.SDsellSideStatusObservable.next(sellStatusSD);

      if (this.web3Service.MM) {
        this.MMenabled = true;
      }
      this.dataService.MMenabledObservable.next(this.MMenabled);
    }, 1000);
  }

  async minting(selectedAddress, shareholderAddress, numberOfShares, messageMinting, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const ALEQAbstraction = await this.web3Service.artifactsToContract(ALEQData);
        const ALEQInstance = await ALEQAbstraction.at(selectedAddress);
        const numberOfSharesBN = new BN(numberOfShares);
        const mintingTx = await ALEQInstance.mint
        .sendTransaction(shareholderAddress, numberOfSharesBN.toString(),
        messageMinting, { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        // console.log(mintingTx.tx);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async unminting(selectedAddress, numberOfShares, messageUnminting, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const ALEQAbstraction = await this.web3Service.artifactsToContract(ALEQData);
        const ALEQInstance = await ALEQAbstraction.at(selectedAddress);
        const numberOfSharesBN = new BN(numberOfShares);
        const unmintingTx = await ALEQInstance.unmint.sendTransaction(numberOfSharesBN.toString(),
        messageUnminting, { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        // console.log(unmintingTx.tx);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async pausing(selectedAddress, fromBlock, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const ALEQAbstraction = await this.web3Service.artifactsToContract(ALEQData);
        const ALEQInstance = await ALEQAbstraction.at(selectedAddress);
        const messagePausing = 'Pausing contract.';
        const pausingFlag = true;
        const pausingTx = await ALEQInstance.pause
        .sendTransaction(pausingFlag, messagePausing, selectedAddress, fromBlock, { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        // console.log(pausingTx.tx);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async unpausing(selectedAddress, fromBlock, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const ALEQAbstraction = await this.web3Service.artifactsToContract(ALEQData);
        const ALEQInstance = await ALEQAbstraction.at(selectedAddress);
        const messageUnpausing = 'Unpausing contract.';
        const pausingFlag = false;
        const unpausingTx = await ALEQInstance.pause
        .sendTransaction(pausingFlag, messageUnpausing, selectedAddress, fromBlock, { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        // console.log(unpausingTx.tx);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async setTotalShares(selectedAddress, numberOfShares, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const ALEQAbstraction = await this.web3Service.artifactsToContract(ALEQData);
        const ALEQInstance = await ALEQAbstraction.at(selectedAddress);
        const numberOfSharesBN = new BN(numberOfShares);
        const totalSharesTx = await ALEQInstance.setTotalShares
        .sendTransaction(numberOfSharesBN.toString(), { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        // console.log(totalSharesTx.tx);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async setClaimParameters(selectedAddress, collateralRate, claimPeriod, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const ALEQAbstraction = await this.web3Service.artifactsToContract(ALEQData);
        const ALEQInstance = await ALEQAbstraction.at(selectedAddress);
        const collateralRateBN = bigInt(collateralRate);
        const claimPeriodBN = bigInt(claimPeriod);
        const claimParametersTx = await ALEQInstance.setClaimParameters
        .sendTransaction(collateralRateBN.toString(), claimPeriodBN.toString(), { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        // console.log(claimParametersTx.tx);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async changeOwner(selectedAddress, newOwner, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const ALEQAbstraction = await this.web3Service.artifactsToContract(ALEQData);
        const ALEQInstance = await ALEQAbstraction.at(selectedAddress);
        const changeOwnerTx = await ALEQInstance.transferOwnership
        .sendTransaction(newOwner, { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        // console.log(changeOwnerTx.tx);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async renounceOwnership(selectedAddress, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const ALEQAbstraction = await this.web3Service.artifactsToContract(ALEQData);
        const ALEQInstance = await ALEQAbstraction.at(selectedAddress);
        const renounceOwnerTx = await ALEQInstance.renounceOwnership
        .sendTransaction({ from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        // console.log(renounceOwnerTx.tx);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async feedSharesSD(selectedAddress, amount, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const ALEQAbstraction = await this.web3Service.artifactsToContract(ALEQData);
        const ALEQInstance = await ALEQAbstraction.at(selectedAddress);
        const changeOwnerTx = await ALEQInstance.transfer
        .sendTransaction(config[selectedAddress].SD, amount, { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        // console.log(changeOwnerTx.tx);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async feedXCHFSD(selectedAddress, amount, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const XCHFAbstraction = await this.web3Service.artifactsToContract(XCHFData);
        const XCHFInstance = await XCHFAbstraction.at(this.XCHFAddressSD);
        const XCHFamountBN = bigInt(amount);
        const changeOwnerTx = await XCHFInstance.transfer
        .sendTransaction(config[selectedAddress].SD, XCHFamountBN.toString(), { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        // console.log(changeOwnerTx.tx);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async retrieveSD(selectedAddress, contractAddress, adminUser, amount, user) {
    return new Promise(async (resolve, reject) => {
      try {
        if (contractAddress === 'XCHF') {
        const SDAbstraction = await this.web3Service.artifactsToContract(SDData);
        const SDInstance = await SDAbstraction.at(config[selectedAddress].SD);
        const amountBN = bigInt(amount);
        const changeOwnerTx = await SDInstance.retrieveERC20
        .sendTransaction(this.XCHFAddressSD, adminUser, amountBN.toString(), { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        // console.log(changeOwnerTx.tx);
        } else if (contractAddress === 'EQ') {
        const SDAbstraction = await this.web3Service.artifactsToContract(SDData);
        const SDInstance = await SDAbstraction.at(config[selectedAddress].SD);
        const changeOwnerTx = await SDInstance.retrieveERC20
        .sendTransaction(selectedAddress, adminUser, amount, { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        // console.log(changeOwnerTx.tx);
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async changeTradeVolume(selectedAddress, newVolume, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const SDAbstraction = await this.web3Service.artifactsToContract(SDData);
        const SDInstance = await SDAbstraction.at(config[selectedAddress].SD);
        const changeOwnerTx = await SDInstance.setMinVolume
        .sendTransaction(newVolume, { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        // console.log(changeOwnerTx.tx);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async pause(selectedAddress, pausingFlag, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const SDAbstraction = await this.web3Service.artifactsToContract(SDData);
        const SDInstance = await SDAbstraction.at(config[selectedAddress].SD);
        if (pausingFlag === true) {
        const changeOwnerTx = await SDInstance.pause.sendTransaction({ from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        // console.log(changeOwnerTx.tx);
        } else if (pausingFlag === false) {
          const changeOwnerTx = await SDInstance.unpause.sendTransaction({ from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
          // console.log(changeOwnerTx.tx);
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async updateStatus(selectedAddress, sideFlag, updateFlag, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const SDAbstraction = await this.web3Service.artifactsToContract(SDData);
        const SDInstance = await SDAbstraction.at(config[selectedAddress].SD);
        if (sideFlag === 'buy' && updateFlag === false) {
        const changeOwnerTx = await SDInstance.buyStatus(true, { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        // console.log(changeOwnerTx.tx);
        } else if (sideFlag === 'buy' && updateFlag === true) {
          const changeOwnerTx = await SDInstance.buyStatus(false, { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
          // console.log(changeOwnerTx.tx);
        } else if (sideFlag === 'sell' && updateFlag === false) {
          const changeOwnerTx = await SDInstance.sellStatus(true, { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
          // console.log(changeOwnerTx.tx);
        } else if (sideFlag === 'sell' && updateFlag === true) {
          const changeOwnerTx = await SDInstance.sellStatus(false, { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
          // console.log(changeOwnerTx.tx);
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async setPrice(selectedAddress, priceFlag, price, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const SDAbstraction = await this.web3Service.artifactsToContract(SDData);
        const SDInstance = await SDAbstraction.at(config[selectedAddress].SD);
        if (priceFlag === 'min') {
        const changeOwnerTx = await SDInstance.setminPriceInXCHF.
        sendTransaction(price, { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        // console.log(changeOwnerTx.tx);
        } else if (priceFlag === 'max') {
          const changeOwnerTx = await SDInstance.setmaxPriceInXCHF.
          sendTransaction(price, { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
          // console.log(changeOwnerTx.tx);
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async setSlope(selectedAddress, numberOfShares, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const SDAbstraction = await this.web3Service.artifactsToContract(SDData);
        const SDInstance = await SDAbstraction.at(config[selectedAddress].SD);
        const changeOwnerTx = await SDInstance.setInitialNumberOfShares.
        sendTransaction(numberOfShares, { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        // console.log(changeOwnerTx.tx);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async changeOwnerSD(selectedAddress, newOwner, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const SDAbstraction = await this.web3Service.artifactsToContract(SDData);
        const SDInstance = await SDAbstraction.at(config[selectedAddress].SD);
        const changeOwnerTx = await SDInstance.transferOwnership
        .sendTransaction(newOwner, { from: user, gasPrice: 20 * 10 ** 9, gas: 150000 });
        // console.log(changeOwnerTx.tx);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
}
