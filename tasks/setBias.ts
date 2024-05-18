import { EncryptedUint8 } from "fhenixjs";
import { MLPL1 } from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:setBias")
  .addParam("bias", "model bias", "0")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { fhenixjs, ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();

    if ((await ethers.provider.getBalance(signer.address)).toString() === "0") {
      await fhenixjs.getFunds(signer.address);
    }

    const bias = Number(taskArguments.bias);
    const MLPL1 = await deployments.get("MLPL1")

    console.log(
      `Running addBias(${bias}), targeting contract at: ${MLPL1.address}`,
    );

    const contract = await ethers.getContractAt("MLPL1", MLPL1.address);

    let contractWithSigner = contract.connect(signer) as unknown as MLPL1;

    try {
      // add() gets `bytes calldata encryptedValue`
      // therefore we need to pass in the `data` property
      await contractWithSigner.setBias(await fhenixjs.encrypt_uint8(bias));
    } catch (e) {
      console.log(`Failed to send transaction: ${e}`);
      return;
    }
  });
