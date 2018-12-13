const DharmaSweeper = require('./contractArtifacts/DharmaSweeper');
const ethers = require('ethers');

const TX_SIGNATURE_LENGTH = 134;

const GAS_LIMIT = 250000;
const GAS_PRICE = 20000000000; // 20 GWEI

const DHARMA_REPAYMENT_ROUTER = "0xc1df9b92645cc3b6733992c692a39c34a86fae5f";
const DHARMA_TOKEN_TRANSFER_PROXY = "0x2f40766e91aaee4794d3389ac8dc3a4b8fd7ab3e";

const COUNTERFACTUAL_FUNDER = "0x3047235846402aD35E7747c7A25783e059A55C46"; // Change address to receive gas refund

// read more about this here: https://medium.com/limechain/part-two-second-layer-solutions-a-journey-into-meta-transactions-counterfactual-instantiation-b3758507af03
const COUNTERFACTUAL_SECPK_CONSTANT = `1ba079be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798a0`;

const addSweeperApi = (server, router) => {

    server.use( async (req, res, next) => {
        if (req.method === "POST" && req.path === "/sweeperRequests" && req.body.loanData) {
            const { agreementId, tokenAddress, amount } = req.body.loanData;

            const wallet = ethers.Wallet.createRandom();

            let factory = new ethers.ContractFactory(DharmaSweeper.abi, DharmaSweeper.bytecode, wallet);
            
            let contractDeployTx = factory.getDeployTransaction(
                agreementId,
                DHARMA_REPAYMENT_ROUTER,
                DHARMA_TOKEN_TRANSFER_PROXY,
                tokenAddress,
                COUNTERFACTUAL_FUNDER,
                ethers.utils.bigNumberify(amount)
            );
            contractDeployTx.gasLimit = GAS_LIMIT;
            contractDeployTx.gasPrice = GAS_PRICE;
            
            let signedDeployTx = await wallet.sign(contractDeployTx);
            
            const signedTxNoRSV = signedDeployTx.substring(0, signedDeployTx.length - TX_SIGNATURE_LENGTH);

            let randomS = ethers.utils.keccak256(ethers.utils.randomBytes(3));
            // ensure no one controls this private key
            randomS = '0' + randomS.substring(3, randomS.length - 16) + "DEADBEEFDEADBEEF";
            
            let counterfactualTx = `${signedTxNoRSV}${COUNTERFACTUAL_SECPK_CONSTANT}${randomS}`;

            const parsedTx = ethers.utils.parseTransaction(counterfactualTx);

            const sweeperFunder = parsedTx.from;

            const counterfactualContractAddress = ethers.utils.getContractAddress({
                from: sweeperFunder,
                nonce: 0
            });

            let result = { 
                agreementId,
                tokenAddress,
                repaymentAmount: amount,
                rawSignedTransaction: counterfactualTx,
                counterfactualAddress: sweeperFunder,
                gasPrice: contractDeployTx.gasPrice,
                gasLimit: contractDeployTx.gasLimit,
                receiveAddress: counterfactualContractAddress,
                createdAt: Date.now(),
            }

            req.body = result;
        }

        next();
    });
}

module.exports = { addSweeperApi };