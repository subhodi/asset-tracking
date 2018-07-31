const shim = require('fabric-shim');

const Chaincode = class {
    async Init(stub) {
        let ret = stub.getFunctionAndParameters();
        let args = ret.params;
        let key = args[0]
        let val = args[1];
        await stub.putState(key, Buffer.from(val));
        return shim.success(Buffer.from('Initialized Successfully!'));
    }

    async Invoke(stub) {
        let ret = stub.getFunctionAndParameters();
        let args = ret.params;

        switch (ret.fcn) {
            case 'Add': return this.Add(stub, args);
            case 'Query': return this.Query(stub, args);
            default: return shim.error(Buffer.from('Invalid method specified'));
        }
    }

    async Add(stub, args) {
        let key = args[0]
        let delta = args[1];
        let oldValue = await stub.getState(key);
        let newValue = parseInt(oldValue) + parseInt(delta);

        await stub.putState(key, Buffer.from(newValue.toString()));
        return shim.success(Buffer.from(newValue.toString()));
    }

    async Query(stub, args) {
        let key = args[0]
        let value = await stub.getState(key);
        return shim.success(Buffer.from(value.toString()));
    }

};

module.exports = {
    Chaincode
}