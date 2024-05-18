import { MLP1L } from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
task("task:setQuantizedData")
  .addParam("quantizedData", "the data on which to make inferences", "[[132, 5, 139, 92, 151, 201, 179, 186, 175, 154, 90, 30, 94, 69, 40, 89, 34, 76, 79, 46, 158, 36, 170, 114, 153, 157, 144, 232, 152, 106]]")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { fhenixjs, ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();

    if ((await ethers.provider.getBalance(signer.address)).toString() === "0") {
      await fhenixjs.getFunds(signer.address);
    }

    const quantizedData = eval(taskArguments.quantizedData);
    const MLP1L = await deployments.get("MLP1L")

    console.log(
      `Running setQuantizedData(${quantizedData}), targeting contract at: ${MLP1L.address}`,
    );

    const contract = await ethers.getContractAt("MLP1L", MLP1L.address);

    let contractWithSigner = contract.connect(signer) as unknown as MLP1L;

    try {
      for (let i = 0; i < quantizedData[0].length; i++) {
        const encWeight = await fhenixjs.encrypt_uint8(quantizedData[0][i])

        await contractWithSigner.setQuantizedData(encWeight);
      }
    } catch (e) {
      console.log(`Failed to send transaction: ${e}`);
      return;
    }
  });
