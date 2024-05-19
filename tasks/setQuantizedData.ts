import { MLP1L } from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import quantizedDataJson from "./data/sample/quantizedData.json"
import { log } from "console";

task("set:quantized-data")
  .addParam("quantizedData", "the data on which to make inferences", "[[132, 5, 139, 92, 151, 201, 179, 186, 175, 154, 90, 30, 94, 69, 40, 89, 34, 76, 79, 46, 158, 36, 170, 114, 153, 157, 144, 232, 152, 106]]")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { fhenixjs, ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();
    if ((await ethers.provider.getBalance(signer.address)).toString() === "0") {
      await fhenixjs.getFunds(signer.address);
    }
    const MLP1L = await deployments.get("MLP1L")
    const contract = await ethers.getContractAt("MLP1L", MLP1L.address);
    let contractWithSigner = contract.connect(signer) as unknown as MLP1L;

    log(`\n🔻 getting the quantized data`)

    let quantizedData: Array<number>;

    if (quantizedDataJson.input.length <= 0)
      quantizedData = taskArguments.quantizedData
    else
      quantizedData = quantizedDataJson.input[0]

    try {
      log(`✨ encrypting the quantized data with FHE`)

      for (let i = 0; i < quantizedData.length; i++) {
        const encWeight = await fhenixjs.encrypt_uint8(quantizedData[i])

        await contractWithSigner.setQuantizedData(encWeight);
      }

      log(`💫 data ready`)
    } catch (e) {
      console.log(`Failed to send transaction: ${e}`);
      return;
    }
  });
