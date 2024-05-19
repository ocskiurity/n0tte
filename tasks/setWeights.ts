import { MLP1L } from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import modelJson from "./data/sample/model.json"
import { log } from "./shared";

task("set:weights")
  .addParam("weights", "the weights of the model", "[[146, 104, 136, 197, 48, 161, 236, 254, 67, 0, 222, 34, 215, 255, 26, 98, 119, 94, 18, 56, 165, 102, 170, 234, 69, 160, 200, 179, 89, 78]]")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { fhenixjs, ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();
    if ((await ethers.provider.getBalance(signer.address)).toString() === "0") {
      await fhenixjs.getFunds(signer.address);
    }
    const MLP1L = await deployments.get("MLP1L")
    const contract = await ethers.getContractAt("MLP1L", MLP1L.address);
    let contractWithSigner = contract.connect(signer) as unknown as MLP1L;

    log(`\n🔻 getting the weights`)

    let weights: Array<number>;

    if (modelJson.weights.length <= 0)
      weights = taskArguments.weights
    else
      weights = modelJson.weights[0]

    try {
      log(`✨ encrypting the weights with FHE`)

      for (let i = 0; i < weights.length; i++) {
        const encWeight = await fhenixjs.encrypt_uint8(weights[i])

        await contractWithSigner.setWeight(encWeight);
      }

      log(`💫 weights ready`)
    } catch (e) {
      console.log(`Failed to send transaction: ${e}`);
      return;
    }
  });
