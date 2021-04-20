pragma solidity 0.6.6;

/*
# Outstanding problem(s)
#
# * Is it safe, reasonable to assume randomNumber will never be zero (see requires below). Probably not!
 */

import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";

contract SleepNumber256 is VRFConsumerBase {
    mapping(bytes32 => address) public requestIdToSender;
    mapping(address => uint256) public addressToSleepNumber;
    event sleepNumberRequested(bytes32 indexed requestId); 

    // VFRConsumerBase attributes
    bytes32 internal keyHash;
    uint256 internal fee;

    constructor(address _VRFCoordinator, address _LinkToken, bytes32 _keyhash)
    public 
    VRFConsumerBase(_VRFCoordinator, _LinkToken)
    {
        keyHash = _keyhash;
        fee = 0.1 * 10 ** 18;
    }

    function requestSleepNumber(uint256 userProvidedSeed) public returns (bytes32) {
        require(addressToSleepNumber[msg.sender] == 0, "Sleep number already registered.");
        bytes32 requestId = requestRandomness(keyHash, fee, userProvidedSeed);
        requestIdToSender[requestId] = msg.sender;
        emit sleepNumberRequested(requestId);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomNumber) internal override {
        require(requestIdToSender[requestId] != address(0), "Unknown requestId.");
        address requesterAddress = requestIdToSender[requestId];
        addressToSleepNumber[requesterAddress] = randomNumber;
    }

    function retriveSleepNumber() public returns (uint256) {
        require(addressToSleepNumber[msg.sender] != 0, "No sleep number found.");
        return addressToSleepNumber[msg.sender];
    }
}
