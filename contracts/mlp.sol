// SPDX-License-Identifier: MIT

pragma solidity >=0.8.13 <0.9.0;

import "@fhenixprotocol/contracts/FHE.sol";

/**
 * @title MLP1L
 * @author ocskurity labs.
 * @dev A contract for running inference on FHE encrypted data through a Multi-Layer Perceptron model with one layer.
 */
contract MLP1L {
  // a vector of quantized FHE encrypted weights.
  euint8[] public weights;
  // a quantized FHE encrypted bias.
  /// @dev we are assuming just one bias value for now.
  euint8 public bias;
  // an FHE encrypted accumulator of inference subsequent computations.
  /// @dev we cannot run a loop for computing an amount of steps equal to
  /// the quantizedData dimension due to "Headers Timeout Error".
  /// Therefore, we execute the inference step-by-step and accumulate
  /// each computation here.
  euint8 acc;
  // the amount of subsequent computation we need to execute the inference
  // for a particular set of quantizedData.
  uint8 numberOfComputations;
  // the dimension of the vector of the quantized data.
  uint8 quantizedDataDim;
  // the dimension of the vector of the weights.
  uint8 weightsDim;
  // a mapping between an address (user) and uint8 (counter).
  /// @dev the counter keeps track of the subsequent inference steps per user.
  mapping(address => uint8) public userToInfCnt;
  // a mapping between an address (user) and euint8 (acc).
  /// @dev each user can execute an inference using the model on their data.
  /// nb each new inference overwrites the previous one.
  mapping(address => euint8) public userToAcc;
  // a mapping between an address (user) and euint8 vector (quantized data).
  /// @dev each user can execute an inference using the model on their vector of
  /// quantized FHE encrypted data.
  /// nb each new inference overwrites the previous one.
  mapping(address => euint8[]) public userToQuantizedData;

  /// @dev initialize the MultiLayer Perceptron model.
  /// @param _numberOfComputations amount of subsequent computation we need to execute the inference.
  /// @param _quantizedDataDim the dimension of the quantized data vector.
  /// @param _weightsDim the dimension of the weights vector.
  constructor(
    uint8 _numberOfComputations,
    uint8 _quantizedDataDim,
    uint8 _weightsDim
  ) {
    numberOfComputations = _numberOfComputations;
    quantizedDataDim = _quantizedDataDim;
    weightsDim = _weightsDim;
  }

  /// @dev execute the FHE encrypted inference on the quantized data.
  /// the inference is executed step-by-step and the result is
  /// accumulated on the `acc` storage variable.
  function inference() external {
    address sender = msg.sender;

    /// @todo implement reset w/ numberOfComputations.

    // execute FHE encrypted inference step.
    /// @dev scalar product between quantized data and weights.
    userToAcc[sender] = userToAcc[sender] + 
        userToQuantizedData[sender][userToInfCnt[sender]] *
        weights[userToInfCnt[sender]];
      

    // increment the inference step counter.
    userToInfCnt[sender] = userToInfCnt[sender] + 1;
  }

  /*** GETTERS ***/

  /// @dev decrypts an FHE encrypted inference execution.
  function getDecryptedInferenceExecution() public view returns (uint8) {
    euint8 toDec = userToAcc[msg.sender];
    return FHE.decrypt(toDec);
  }

  /*** SETTERS ***/

  /// @dev set the bias of the MLP1L model.
  /// @param b the FHE encrypted bias.
  function setBias(inEuint8 calldata b) external {
    bias = FHE.asEuint8(b);
  }

  /// @dev set the vector of weights of the MLP1L model.
  /// the vector is populated by adding the individual weights one by one.
  /// @param w an FHE encrypted individual weight.
  function setWeight(inEuint8 calldata w) external {
    weights.push(FHE.asEuint8(w));
  }

  /// @dev set the vector of quantized data of the MLP1L model.
  /// the vector is populated by adding the individual data one by one.
  /// @param d an FHE encrypted individual data.
  function setQuantizedData(inEuint8 calldata d) external {
    euint8[] storage temp = userToQuantizedData[msg.sender];
    temp.push(FHE.asEuint8(d));
    userToQuantizedData[msg.sender] = temp;
  }

  /*** DEBUG ***/

  // function decryptBias() public view returns (uint8) {
  //   return FHE.decrypt(bias);
  // }

  // function decryptWeights(uint8 index) public view returns (uint8) {
  //   return FHE.decrypt(weights[index]);
  // }

  // function decryptQuantizedData(uint8 index) public view returns (uint8) {
  //   return FHE.decrypt(userToQuantizedData[msg.sender][index]);
  // }

  /// @todo implement sigmoid.
  // function sigmoid(euint8 x) public pure returns (euint8) {
  //   euint8 normalizedX = (x * FHE.asEuint8(256)) / FHE.asEuint8(255);
  //   euint8 sigmoidValue = (normalizedX * FHE.asEuint8(256)) /
  //     (FHE.asEuint8(256) + normalizedX);
  //   return ((sigmoidValue * FHE.asEuint8(255)) / FHE.asEuint8(256));
  // }
}
