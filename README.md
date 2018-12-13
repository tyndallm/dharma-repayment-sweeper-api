# Counterfactual Sweeper API

> NodeJS API server for providing counterfactual loan repayments for [Dharma](https://dharma.io).

## How it works

This is a simple NodeJS API server that will return the data required to facilitate counterfactual loan repayments for Dharma.

The server uses the contract artifact generated from [DharmaSweeper.sol](https://github.com/tyndallm/counterfactual-dharma-repay/blob/master/contracts/DharmaSweeper.sol).


## Getting started

run `npm i` to install dependencies and the run `npm start` to start the server

## Endpoints

To request a new counterfactual sweeper:

### POST

Make a POST request to `http://localhost:8000/sweeperRequest` with a `Content-Type: application/json` and a body containing json in the following format:

```
{
	"loanData": {
		"agreementId": "0x6c821b520670aaf49680b48803b97ac27aa134ccad892c0fb540fb8b563a780e",
		"tokenAddress": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
		"amount": "10000000000000000"
	}
}
```

This will generate and return all of the required sweeper data as a json response like this:

```
{
        "agreementId": "0x6c821b520670aaf49680b48803b97ac27aa134ccad892c0fb540fb8b563a780e",
        "tokenAddress": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        "repaymentAmount": "10000000000000000",
        "rawSignedTransaction": "0xf90318808502540be4008303d0908080b902c5608060405234801561001057600080fd5b5060405160c0806102058339810180604052810190808051906020019092919080519060200190929190805190602001909291908051906020019092919080519060200190929190805190602001909291905050508273ffffffffffffffffffffffffffffffffffffffff1663095ea7b385836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b15801561010857600080fd5b505af115801561011c573d6000803e3d6000fd5b505050508473ffffffffffffffffffffffffffffffffffffffff1663ff2681258783866040518463ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018084600019166000191681526020018381526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019350505050600060405180830381600087803b1580156101d357600080fd5b505af11580156101e7573d6000803e3d6000fd5b505050508173ffffffffffffffffffffffffffffffffffffffff16ff006c821b520670aaf49680b48803b97ac27aa134ccad892c0fb540fb8b563a780e000000000000000000000000c1df9b92645cc3b6733992c692a39c34a86fae5f0000000000000000000000002f40766e91aaee4794d3389ac8dc3a4b8fd7ab3e000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000003047235846402ad35e7747c7a25783e059a55c46000000000000000000000000000000000000000000000000002386f26fc100001ba079be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798a00ae51ea1dced1a9ca3375c98b5ce8df5473f622de5388845DEADBEEFDEADBEEF",
        "counterfactualAddress": "0xcb3238E0FB55bA4eBEB4e8bf989FEc30C48A0d6f",
        "gasPrice": 10000000000,
        "gasLimit": 250000,
        "receiveAddress": "0xB885d6a85E094773445E60546BfD33229D261290",
        "createdAt": 1544726494722,
        "id": 1
    }
```

For convenience it will also save this data to a local `db-local.json` file.

### GET

To retrieve all previously created sweeper requests make a GET request to `http://localhost:8000/sweeperRequest` which will return a json array containing all recorded sweeper requests.