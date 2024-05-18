import { MLP1L } from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:setWeights")
  .addParam("weights", "the weights of the model", "[[146, 104, 136, 197, 48, 161, 236, 254, 67, 0, 222, 34, 215, 255, 26, 98, 119, 94, 18, 56, 165, 102, 170, 234, 69, 160, 200, 179, 89, 78]]")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { fhenixjs, ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();

    if ((await ethers.provider.getBalance(signer.address)).toString() === "0") {
      await fhenixjs.getFunds(signer.address);
    }

    const weights = eval(taskArguments.weights);
    const MLP1L = await deployments.get("MLP1L")

    console.log(
      `Running setWeights(${weights}), targeting contract at: ${MLP1L.address}`,
    );

    const contract = await ethers.getContractAt("MLP1L", MLP1L.address);

    let contractWithSigner = contract.connect(signer) as unknown as MLP1L;

    try {
      for (let i = 0; i < weights[0].length; i++) {
        const encWeight = await fhenixjs.encrypt_uint8(weights[0][i])

        await contractWithSigner.setWeight(encWeight);
      }
    } catch (e) {
      console.log(`Failed to send transaction: ${e}`);
      return;
    }
  });
