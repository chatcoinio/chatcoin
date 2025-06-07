import { ethers } from "hardhat"

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log("Deploying contracts with:", deployer.address)

  // Deploy Profile contract
  const ProfileFactory = await ethers.getContractFactory("ChatCoinProfile")
  const profile = await ProfileFactory.deploy()
  await profile.waitForDeployment()
  console.log("✅ ChatCoinProfile deployed to:", await profile.getAddress())
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
