# ChatCoin  
![CI](https://github.com/chatcoinio/chatcoin/actions/workflows/ci.yml/badge.svg)

ChatCoin is a simple demonstration dApp built with Next.js and Solidity. It implements a basic profile contract and frontend described in the ChatCoin whitepaper.

## Installation

```bash
npm install
```

## Running the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to view the app in your browser.

## Deploying Contracts with Hardhat

Compile and deploy the smart contracts using Hardhat:

```bash
# compile contracts
npx hardhat compile

# start a local node (in a separate terminal)
npx hardhat node

# deploy to the local network
npx hardhat run scripts/deploy.ts --network localhost
```

### Avatar uploads

```bash
export NEXT_PUBLIC_WEB3STORAGE_TOKEN=your-token-here
```

### Run agent (optional)

```bash
cd agents
pip install -r requirements.txt
python profile_agent.py
```

