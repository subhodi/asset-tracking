var shim = require('fabric-shim');
var MyChaincode = require('./chaincode.js');

shim.start(new MyChaincode());