import { EncryptedUint8 } from "fhenixjs";
import { MLPL1 } from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
task("task:setTestData")
  .addParam("testData", "model test data", "[[132, 5, 139, 92, 151, 201, 179, 186, 175, 154, 90, 30, 94, 69, 40, 89, 34, 76, 79, 46, 158, 36, 170, 114, 153, 157, 144, 232, 152, 106]]")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { fhenixjs, ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();

    if ((await ethers.provider.getBalance(signer.address)).toString() === "0") {
      await fhenixjs.getFunds(signer.address);
    }

    const testData = eval(taskArguments.testData);
    const MLPL1 = await deployments.get("MLPL1")

    console.log(
      `Running setTestData(${testData}), targeting contract at: ${MLPL1.address}`,
    );

    const contract = await ethers.getContractAt("MLPL1", MLPL1.address);

    let contractWithSigner = contract.connect(signer) as unknown as MLPL1;

    try {
      // add() gets `bytes calldata encryptedValue`
      // therefore we need to pass in the `data` property
      const encryptedTestData = []
      for (let i = 0; i < testData[0].length; i++) {
        const encWeight = await fhenixjs.encrypt_uint8(testData[0][i])

        await contractWithSigner.addTestData(encWeight);
      }
    } catch (e) {
      console.log(`Failed to send transaction: ${e}`);
      return;
    }
  });
