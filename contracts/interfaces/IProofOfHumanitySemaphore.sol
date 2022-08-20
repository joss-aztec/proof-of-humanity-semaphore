//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/// @title Proof of Humanity Semaphore interface.
/// @dev Interface of a ProofOfHumanitySemaphore contract.
interface IProofOfHumanitySemaphore {
    error ProofOfHumanitySemaphore__CallerIsNotRegistered();
    error ProofOfHumanitySemaphore__AlreadyRegistered();
    error ProofOfHumanitySemaphore__IncorrectPayment();
    error ProofOfHumanitySemaphore__RegistrationNotFound();
    error ProofOfHumanitySemaphore__RegistrationStillValid();
    error ProofOfHumanitySemaphore__PaymentFailed();

    /// @dev Emitted when a Semaphore proof is verified.
    /// @param submissionId: PoH submissionId i.e. the user's address
    /// @param identityCommitment: The identity commitment
    event IdentityCommitmentRegistered(
        address indexed submissionId,
        uint256 identityCommitment
    );

    /// @dev This should probably be in the constructor instead.
    /// @param groupDepth: Depth of the group tree.
    /// @param groupDepth: Leaf initialisation value for tree.
    function initGroup(uint8 groupDepth, uint256 zeroValue) external;

    /// @dev Registers an identity commitment against the caller. The must pay
    /// enough to reward whoever later removes the registration.
    /// @param identityCommitment: identityCommitment of the user.
    function registerIdentityCommitment(uint256 identityCommitment)
        external
        payable;

    /// @dev Removes a registered identity commitment and pays the caller if
    /// the caller can prove it's dur for removal.
    /// @param submissionID: PoH submissionID counterpart of identitiy commitment.
    /// @param proofSiblings: Array of the sibling nodes of the proof of membership.
    /// @param proofPathIndices: Path of the proof of membership.
    function deregisterIdentityCommitment(
        address submissionID,
        uint256[] calldata proofSiblings,
        uint8[] calldata proofPathIndices
    ) external;

    /// @dev Saves the nullifier hash to avoid double signaling and emits an event
    /// if the zero-knowledge proof is valid.
    /// @param signal: The signal is arbitrary for this use case.
    /// @param nullifierHash: Nullifier hash.
    /// @param serviceNullifier: Service nullifier.
    /// @param externalNullifier: External nullifier.
    /// @param serviceNullifierProof: Zero-knowledge proof.
    /// @param semaphoreProof: Zero-knowledge proof.
    function verifyProof(
        bytes32 signal,
        uint256 nullifierHash,
        uint256 serviceNullifier,
        uint256 externalNullifier,
        uint256[8] calldata serviceNullifierProof,
        uint256[8] calldata semaphoreProof
    ) external;
}
