#!/usr/bin/python3

# Outstanding problem(s)
#
# * If the contract is succesfully deployed and then fund() fails, you'll have a useless contract on the network.

from brownie import SleepNumber256, accounts, network, config, interface

def fund(contract):
    dev = accounts.add(config["wallets"]["from_key"])
    fee = config["networks"][network.show_active()]["fee"]
    link_token = config["networks"][network.show_active()]["link_token"]
    interface.LinkTokenInterface(link_token).transfer(contract, fee, {"from": dev})

def main():
    dev = accounts.add(config["wallets"]["from_key"])
    collectible = SleepNumber256.deploy(
        config["networks"][network.show_active()]["vrf_coordinator"],
        config["networks"][network.show_active()]["link_token"],
        config["networks"][network.show_active()]["keyhash"],
        {"from": dev},
        publish_source=False,
    )
    print("Attempting to fund new contract's VRF....")
    fund(collectible)
    return collectible
