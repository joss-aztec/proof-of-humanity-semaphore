# Proof of Humanity Semaphore

A wrapper around the Proof of Humanity Protocol and Semaphore protocol for enabling anonymous sybil-proof services.

### Deployments

#### Kovan

[ProofOfHumanitySemaphore](https://kovan.etherscan.io/address/0x9f778Eb1320D48376B1F35aC83bB8Ea023655059)

[NullifierConsistencyVerifier](https://kovan.etherscan.io/address/0x320F890B1D5298f338E292dF3Cea6d748C26E988)

## Development

Install dependencies

```
yarn
```

Build circuit and verifier contract

```
. scripts/compile.circuit.sh
```

Build and test contract and circuit

```
npx hardhat test
```
