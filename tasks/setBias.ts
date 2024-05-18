import { MLP1L } from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:setBias")
  .addParam("bias", "the bias of the model", "0")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { fhenixjs, ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();

    if ((await ethers.provider.getBalance(signer.address)).toString() === "0") {
      await fhenixjs.getFunds(signer.address);
    }

    const bias = Number(taskArguments.bias);
    const MLP1L = await deployments.get("MLP1L")

    console.log(
      `Running setBias(${bias}), targeting contract at: ${MLP1L.address}`,
    );

    const contract = await ethers.getContractAt("MLP1L", MLP1L.address);

    let contractWithSigner = contract.connect(signer) as unknown as MLP1L;

    try {
      await contractWithSigner.setBias(await fhenixjs.encrypt_uint8(bias));
    } catch (e) {
      console.log(`Failed to send transaction: ${e}`);
      return;
    }
  });
