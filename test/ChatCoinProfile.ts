import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('ChatCoinProfile', () => {
  it('registers a profile and emits event', async () => {
    const [user] = await ethers.getSigners()
    const Factory = await ethers.getContractFactory('ChatCoinProfile')
    const contract = await Factory.deploy()
    await contract.waitForDeployment()

    const tx = await (contract as any).connect(user).register('alice', '', 'hi')
    await expect(tx)
      .to.emit(contract, 'ProfileRegistered')
      .withArgs(user.address, 'alice', '', 'hi')

    const profile = await (contract as any).getProfile(user.address)
    expect(profile.username).to.equal('alice')
  })

  it('reverts on duplicate register', async () => {
    const [user] = await ethers.getSigners()
    const Factory = await ethers.getContractFactory('ChatCoinProfile')
    const contract = await Factory.deploy()
    await contract.waitForDeployment()

    await (contract as any).connect(user).register('bob', '', '')
    await expect(
      (contract as any).connect(user).register('bob2', '', '')
    ).to.be.revertedWith('Profile already exists')
  })

  it('updates avatar and bio', async () => {
    const [user] = await ethers.getSigners()
    const F = await ethers.getContractFactory('ChatCoinProfile')
    const c = await F.deploy()
    await c.waitForDeployment()

    await (c as any).connect(user).register('alice', '', '')
    const tx = await (c as any).connect(user).updateProfile('ipfs://avatar.png', 'gm')
    await expect(tx)
      .to.emit(c, 'ProfileUpdated')
      .withArgs(user.address, 'ipfs://avatar.png', 'gm')

    const p = await (c as any).getProfile(user.address)
    expect(p.avatarUrl).to.equal('ipfs://avatar.png')
    expect(p.bio).to.equal('gm')
  })
}) 