var ChaincodeMockStub = require('@theledger/fabric-mock-stub').ChaincodeMockStub;
var Transform = require('@theledger/fabric-mock-stub').Transform;
var expect = require('chai').expect;

var Chaincode = require('../src/chaincode.js').Chaincode;

const chaincode = new Chaincode();
let mockStub;

describe('Test Chaincode', () => {

    it("Should init without issues", async () => {
        mockStub = new ChaincodeMockStub("MyMockStub", chaincode);
        const response = await mockStub.mockInit("Init", ['Init', 'a', '10']);

        expect(response.status).to.eql(200)
    });

    it("Should Add delta to the history", async () => {
        const response = await mockStub.mockInvoke("tx1", ['Add', 'a', '20']);

        expect(response.status).to.eql(200)
    });

    it("Should Query from state", async () => {
        const response = await mockStub.mockInvoke("tx1", ['Query', 'a']);

        expect(response.status).to.eql(200)
        expect(Transform.bufferToString(response.payload)).to.eql('30')
       
    });
});


