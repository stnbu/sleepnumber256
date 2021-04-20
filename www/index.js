
var web3;
var account;
var contract;

// Checking if Web3 has been injected by the browser (Mist/MetaMask)
if (typeof web3 !== 'undefined') {
  // Use Mist/MetaMask's provider
  web3 = new Web3(web3.currentProvider);
} else {
  alert("You need to install metamask!");
}

const ethereumButton = document.querySelector("#enableEthereumButton");
ethereumButton.addEventListener("click", () => {
  getAccount();
});

async function getAccount() {
  const accounts = await ethereum.enable();
  account = accounts[0];
}

$(document).ready(function() {
  contract = web3.eth.contract(abi).at("0x6ec7CA02251829D8a9F4a75c215A95C0f657963f");
});

function updateOwnageBlurb(owner, thingID) {
      document.getElementById("ownageBlurb").classList.remove("hidden");
      document.getElementById("resultThingID").innerHTML = thingID;
      document.getElementById("resultAddress").innerHTML = owner;
}

function recordBirth() {
  let thingID = document.querySelector("#thingID").value;
  contract.birth(thingID, function(error, result) {
    if(!error) {
      updateOwnageBlurb(account, thingID);
    } else {
      alert(error.message);
    }
  });
}

function transferThing() {
  let thingID = document.querySelector("#thingID").value;
  let newOwnerAddress = document.querySelector("#newOwnerAddress").value;
  contract.transfer(newOwnerAddress, thingID, function(error, result) {
    if(!error) {
      updateOwnageBlurb(account, thingID);
    } else {
      alert(error.message);
    }
  });
}

function getThingOwner() {
  let thingID = document.querySelector("#thingID").value;
  contract.thing(thingID, function(error, result) {
    if(!error) {
      updateOwnageBlurb(result, thingID);
    } else {
      alert(error.message);
    }
  });
};

// We use this inside of document.ready() which means we can tuck it away at the end:
abi = JSON.parse(`[
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "thingID",
				"type": "uint256"
			}
		],
		"name": "birth",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "thingID",
				"type": "uint256"
			}
		],
		"name": "Sent",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "thingID",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "thing",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "rancher",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]`);
