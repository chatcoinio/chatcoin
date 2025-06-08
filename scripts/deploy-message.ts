import { ethers } from 'hardhat'

async function main() {
  const F = await ethers.getContractFactory('ChatCoinMessage')
  const c = await F.deploy()
  await c.waitForDeployment()
  console.log('Message contract ->', await c.getAddress())
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
}) 