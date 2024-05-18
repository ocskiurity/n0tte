// SPDX-License-Identifier: MIT

/// @todo add permissions.
/// @todo ...

pragma solidity >=0.8.13 <0.9.0;
import "hardhat/console.sol";

import "@fhenixprotocol/contracts/FHE.sol";
// import {Permissioned, Permission} from "@fhenixprotocol/contracts/access/Permissioned.sol";

contract MLPL1 {
  euint8[] public weights;
  euint8 public bias;
  euint8[] public test_data;
  euint8 neuronResultsLayer1;
  uint8 public counter = 0;

  constructor() {}

  function decryptBias() public view returns (uint8) {
    return FHE.decrypt(bias);
  }

  function decryptWeights(uint8 index) public view returns (uint8) {
    return FHE.decrypt(weights[index]);
  }

  function decryptTestData(uint8 index) public view returns (uint8) {
    return FHE.decrypt(test_data[index]);
  }

  function sigmoid(euint8 x) public pure returns (euint8) {
    // Normalize x to the range [0, 1] as a fixed-point number with 8 fractional bits
    euint8 normalizedX = (x * FHE.asEuint8(256)) / FHE.asEuint8(255);

    // Apply a modified sigmoid-like function in the range [0, 256]
    euint8 sigmoidValue = (normalizedX * FHE.asEuint8(256)) /
      (FHE.asEuint8(256) + normalizedX);

    // Scale to uint8 range [0, 255]
    return ((sigmoidValue * FHE.asEuint8(255)) / FHE.asEuint8(256));
  }

  function setBias(inEuint8 calldata b) external {
    // require(
    //   b.length == biases[0].length,
    //   "Size of input biases does not match neuron number"
    // );

    // euint8[] memory tempBiases = new euint8[](b.length);

    // for (uint256 i = 0; i < b.length; i++) {
    //   tempBiases[i] = FHE.asEuint8(b[i]);
    // }

    bias = FHE.asEuint8(b);
  }

  function addWeight(inEuint8 calldata w) external {
    // euint8[] memory tempWeights = new euint8[](w.length);

    // for (uint256 i = 0; i < w.length; i++) {
    //   tempWeights[i] = FHE.asEuint8(w[i]);
    // }

    weights.push(FHE.asEuint8(w));
  }

  function addTestData(inEuint8 calldata d) external {
    test_data.push(FHE.asEuint8(d));
  }

  function inference() external {
    if (counter == 0) neuronResultsLayer1 = bias;

    

    neuronResultsLayer1 = FHE.add(
      neuronResultsLayer1,
      FHE.mul(test_data[counter], weights[counter])
    );

    // if (counter == 30) neuronResultsLayer1 = sigmoid(neuronResultsLayer1);

    counter++;
  }

  function decryptInferenceResult() public view returns (uint8) {
    return FHE.decrypt(neuronResultsLayer1);
  }
}
