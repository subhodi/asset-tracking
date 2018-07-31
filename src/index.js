var shim = require('fabric-shim');
var Chaincode = require('./chaincode.js').Chaincode;

shim.start(new Chaincode());