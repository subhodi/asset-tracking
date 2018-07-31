const shim = require('fabric-shim');
const ClientIdentity = shim.ClientIdentity;

const Asset = class {
    async Init(stub) {
        return shim.success(Buffer.from('Initialized Successfully!'));
    }

    async Invoke(stub) {
        let ret = stub.getFunctionAndParameters();
        let args = ret.params;

        switch (ret.fcn) {
            case 'createAsset': return this.createAsset(stub, args);
            case 'transferAsset': return this.transferAsset(stub, args);
            case 'Query': return this.Query(stub, args);
            default: return shim.error(Buffer.from('Invalid method specified'));
        }
    }

    async createAsset(stub, args) {
        let name = args[0];
        let comments = args[1];
        let cid = new ClientIdentity(stub);
        const asset = {
            'name': name,
            'date': new Date().toString(),
            'owner': cid.getID(),
            'comments': comments
        };

        await stub.putState(name, Buffer.from(JSON.stringify(asset)));
        return shim.success(asset.toString());
    }

    async transferAsset(stub, args) {
        let name = args[0];
        let comments = args[1];
        let newOwner = args[2];
        let cid = new ClientIdentity(stub);
        let asset = await stub.getState(name);
        asset = JSON.parse(asset.toString());
        
        if(asset.owner !== cid.getID()) {
            return shim.error('403: Forbidden');
        }
        asset.owner = newOwner;
        await stub.putState(name, Buffer.from(JSON.stringify(asset)));
        return shim.success(Buffer.from(JSON.stringify(asset)));
    }


    async Query(stub, args) {
        let key = args[0];
        let asset = await stub.getState(key);
        
        return shim.success(asset.toString());
    }
};

module.exports = {
    Asset
}
