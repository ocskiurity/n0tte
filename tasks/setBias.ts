import { MLP1L } from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import modelJson from "./data/sample/model.json"
import { log, textPrimaryBold } from "./shared";

task("set:bias")
  .addParam("bias", "the bias of the model", "0")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { fhenixjs, ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();
    if ((await ethers.provider.getBalance(signer.address)).toString() === "0") {
      await fhenixjs.getFunds(signer.address);
    }
    const MLP1L = await deployments.get("MLP1L")
    const contract = await ethers.getContractAt("MLP1L", MLP1L.address);
    let contractWithSigner = contract.connect(signer) as unknown as MLP1L;

    log(`getting the bias`)

    let bias = 0;

    if (!modelJson.bias)
      bias = Number(taskArguments.bias)

    bias = modelJson.bias

    log(`encrypting the bias with FHE`)

    const encryptedBias = await fhenixjs.encrypt_uint8(bias)
    
    log(`setting FHE encrypted bias on ${textPrimaryBold(MLP1L.address)}`)

    try {
      await contractWithSigner.setBias(encryptedBias);

      log(`ok`)
    } catch (e) {
      console.log(`Failed to send transaction: ${e}`);
      return;
    }
  });
