const uswap = require('./uSwapRouter');
const jmswap = require('./jmSwapRouter');
const ssswap = require('./socialSwapRouter');
const sunSwapFactory = require('./sunSwapFactroy')
const sunSwapExchange = require('./sunSwapExchange')
const TronWeb = require('tronweb');

const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
const privateKey = "233fe783502de848a65be43c745aaa2e4fa90d6b0b5387b9e77186ad4e6dd7d5";
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

let token1 = "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR";
let token2 = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
let deadAddress = "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb";
const sst = "TBLQs7LqUYAgzYirNtaiX3ixnCKnhrVVCe";
const Wtrx = "TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR"
let amount = "100000000";

const factoryABI = [{"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token0","type":"address"},{"indexed":true,"internalType":"address","name":"token1","type":"address"},{"indexed":false,"internalType":"address","name":"pair","type":"address"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"}],"name":"PairCreated","type":"event"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"allPairsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"createPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeTo","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeToSetter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"getPair","outputs":[{"internalType":"address","name":"pair","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"pairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeTo","type":"address"}],"name":"setFeeTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_feeToSetter","type":"address"}],"name":"setFeeToSetter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]

const ufactorContract = tronWeb.contract(factoryABI, uswap.factoryAddress);
const urouterCcontract = tronWeb.contract(uswap.abi, uswap.routerAddress);

const jmfactorContract = tronWeb.contract(factoryABI, jmswap.factoryAddress);
const jmrouterCcontract = tronWeb.contract(jmswap.abi, jmswap.routerAddress);

const ssfactorContract = tronWeb.contract(factoryABI, ssswap.factoryAddress);
const ssrouterCcontract = tronWeb.contract(ssswap.abi, ssswap.routerAddress);

const SunSwapfactorContract = tronWeb.contract(sunSwapFactory.abi, sunSwapFactory.sunSwapFactoryAddress);

async function main(){
   const isUPair = await ufactorContract.methods.getPair(token1,token2).call()
   if(tronWeb.address.fromHex(isUPair.pair)!== deadAddress){
       const price = await urouterCcontract.methods.getAmountsOut(amount,[token1,token2]).call()
       console.log(price.amounts[1].toString(),"uswap");
   }
   else{
       console.log("pair does not exits on uswap")
   }
   const isjmPair = await jmfactorContract.methods.getPair(token1,token2).call()
   if(tronWeb.address.fromHex(isjmPair.pair)!== deadAddress){
       const price = await jmrouterCcontract.methods.getAmountsOut(amount,[token1,token2]).call()
       console.log(price.amounts[1].toString(),"jmwap");
   }
   else{
       console.log("pair does not exits on jmswap")
   }
   const isSSPair = await ssfactorContract.methods.getPair(token1,token2).call()
   if(tronWeb.address.fromHex(isSSPair.pair) !== deadAddress){
       const price = await ssrouterCcontract.methods.getAmountsOut(amount,[token1,token2]).call()
       console.log(price.amounts[1].toString(),"ssswap");
   }
   else{
       console.log("pair does not exits on ssswap")
   }

   if(token1 == Wtrx || token2 == Wtrx){
       const notWtrx = token1 == Wtrx? token2:token1;
       const exchange = await SunSwapfactorContract.methods.getExchange(notWtrx).call()
       const exChangeContract = tronWeb.contract(sunSwapExchange.abi,tronWeb.address.fromHex(exchange))
       const price = await exChangeContract.methods.getTrxToTokenInputPrice(amount).call()
       console.log(price.toString(),"ssswap");
   }
   else{
       console.log("pair does not exits on Sun Swap")
   }
}

main()
