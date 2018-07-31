var ChaincodeMockStub = require('@theledger/fabric-mock-stub').ChaincodeMockStub;
var Transform = require('@theledger/fabric-mock-stub').Transform;
var expect = require('chai').expect;

var Asset = require('../src/asset_cc.js').Asset;

const asset = new Asset();
let mockStub;

describe('Test Chaincode', () => {

    it('Should init without issues', async () => {
        mockStub = new ChaincodeMockStub('MyMockStub', asset);
        const response = await mockStub.mockInit('Init', []);

        expect(response.status).to.eql(200);
    });

    it('Should Create asset', async () => {
        const response = await mockStub.mockInvoke('tx1', ['createAsset', 'partA', 'No comments']);

        expect(response.status).to.eql(200);
    });

    it('Should Transfer asset', async () => {
        const response = await mockStub.mockInvoke('tx2', ['transferAsset', 'partA', 'No comments', 'newOwnerId']);
        const payload = Transform.bufferToObject(response.payload);

        expect(response.status).to.eql(200);
        expect(payload).to.have.property('owner', 'newOwnerId');
    });

    it('Should Throw error for Invalid function invoke', async () => {
        const response = await mockStub.mockInvoke('tx3', ['transferAsset', 'partA', 'No comments', 'selfId']);

        expect(response.status).to.eql(500);
    });

    it('Should Query from state', async () => {
        const response = await mockStub.mockInvoke('tx4', ['Query', 'partA']);
        const payload = Transform.bufferToObject(response.payload);

        expect(response.status).to.eql(200);
        expect(payload).to.have.property('name', 'partA');
        expect(payload).to.have.property('comments', 'No comments');
    });

    it('Should Throw error for Invalid function invoke', async () => {
        const response = await mockStub.mockInvoke('tx5', ['Delete']);

        expect(response.status).to.eql(500);
    });
});


