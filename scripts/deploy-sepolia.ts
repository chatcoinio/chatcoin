import { ethers } from 'hardhat'

async function main() {
  const ChatCoinProfile = await ethers.getContractFactory('ChatCoinProfile')
  const contract = await ChatCoinProfile.deploy()
  await contract.waitForDeployment()
  console.log('Sepolia →', await contract.getAddress())
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
}) 