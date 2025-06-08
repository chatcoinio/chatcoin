import * as dotenv from 'dotenv'
import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'

dotenv.config()

const { INFURA_API_KEY, PRIVATE_KEY } = process.env
const isPK = PRIVATE_KEY?.startsWith('0x') && PRIVATE_KEY.length === 66

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: isPK ? [PRIVATE_KEY!] : [],
    },
    polygonMumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${INFURA_API_KEY}`,
      accounts: isPK ? [PRIVATE_KEY!] : [],
    },
  },
}

export default config
