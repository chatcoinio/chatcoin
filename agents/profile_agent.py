import json
import time
import os
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()
RPC = os.getenv('SEPOLIA_RPC')
CONTRACT = os.getenv('PROFILE_ADDRESS')

if not RPC or not CONTRACT:
    raise SystemExit('⚠️  Missing SEPOLIA_RPC or PROFILE_ADDRESS env vars')

abi_path = 'artifacts/contracts/ChatCoinProfile.sol/ChatCoinProfile.json'
with open(abi_path) as f:
    abi = json.load(f)['abi']

w3 = Web3(Web3.HTTPProvider(RPC))
contract = w3.eth.contract(address=Web3.to_checksum_address(CONTRACT), abi=abi)

def watch():
    flt = contract.events.ProfileUpdated.create_filter(fromBlock='latest')
    print('👀 Watching ProfileUpdated events on-chain...')
    while True:
        for ev in flt.get_new_entries():
            user = ev['args']['user']
            print('ProfileUpdated:', user)
            # TODO: AI moderation / enrichment step
        time.sleep(5)

if __name__ == '__main__':
    watch() 