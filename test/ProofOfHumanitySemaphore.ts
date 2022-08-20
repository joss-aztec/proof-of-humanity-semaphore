import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import {
  IProofOfHumanity__factory,
  ISemaphore__factory,
} from "../typechain-types";

const { deployMockContract } = waffle;

describe("ProofOfHumanitySemaphore", () => {
  async function deployContracts() {
    const [owner, otherAccount] = await ethers.getSigners();

    const pohMock = await deployMockContract(
      owner,
      IProofOfHumanity__factory.abi
    );
    const semaphoreMock = await deployMockContract(
      owner,
      ISemaphore__factory.abi
    );

    const ProofOfHumanitySemaphore = await ethers.getContractFactory(
      "ProofOfHumanitySemaphore"
    );

    const DEREGISTER_INCENTIVE = 10n ** 16n;
    const SEMAPHORE_GROUP_ID = 0;
    const GROUP_DEPTH = 20;
    const ZERO_VALUE = 0;

    const pohSemaphore = await ProofOfHumanitySemaphore.deploy(
      DEREGISTER_INCENTIVE,
      pohMock.address,
      semaphoreMock.address,
      SEMAPHORE_GROUP_ID
    );
    await semaphoreMock.mock.createGroup
      .withArgs(
        SEMAPHORE_GROUP_ID,
        GROUP_DEPTH,
        ZERO_VALUE,
        pohSemaphore.address
      )
      .returns();
    await pohSemaphore.connect(owner).initGroup(GROUP_DEPTH, ZERO_VALUE);
    return {
      pohMock,
      semaphoreMock,
      pohSemaphore,
      owner,
      otherAccount,
      DEREGISTER_INCENTIVE,
      SEMAPHORE_GROUP_ID,
    };
  }

  describe("Identity commitment registration", () => {
    it("Should revert for a user without a PoH registration", async function () {
      const { pohMock, pohSemaphore, otherAccount } = await loadFixture(
        deployContracts
      );

      await pohMock.mock.isRegistered.returns(false);
      await expect(
        pohSemaphore.connect(otherAccount).registerIdentityCommitment(0)
      ).to.be.revertedWith("ProofOfHumanitySemaphore__CallerIsNotRegistered()");
    });

    it("Should refuse an underpaid registration", async () => {
      const {
        pohMock,
        semaphoreMock,
        pohSemaphore,
        otherAccount,
        SEMAPHORE_GROUP_ID,
        DEREGISTER_INCENTIVE,
      } = await loadFixture(deployContracts);
      const identityCommitment = 0;
      await pohMock.mock.isRegistered
        .withArgs(otherAccount.address)
        .returns(true);
      await semaphoreMock.mock.addMember
        .withArgs(SEMAPHORE_GROUP_ID, identityCommitment)
        .returns();
      await expect(
        pohSemaphore
          .connect(otherAccount)
          .registerIdentityCommitment(identityCommitment, {
            value: DEREGISTER_INCENTIVE / 2n,
          })
      ).to.be.revertedWith("ProofOfHumanitySemaphore__IncorrectPayment()");
    });

    it("Should accept a valid registration registration", async () => {
      const {
        pohMock,
        semaphoreMock,
        pohSemaphore,
        otherAccount,
        SEMAPHORE_GROUP_ID,
        DEREGISTER_INCENTIVE,
      } = await loadFixture(deployContracts);
      const identityCommitment = 0;
      await pohMock.mock.isRegistered
        .withArgs(otherAccount.address)
        .returns(true);
      await semaphoreMock.mock.addMember
        .withArgs(SEMAPHORE_GROUP_ID, identityCommitment)
        .returns();
      await expect(
        pohSemaphore
          .connect(otherAccount)
          .registerIdentityCommitment(identityCommitment, {
            value: DEREGISTER_INCENTIVE,
          })
      )
        .to.emit(pohSemaphore, "IdentityCommitmentRegistered")
        .withArgs(otherAccount.address, identityCommitment);
    });
  });
});
