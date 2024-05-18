import { EncryptedUint8 } from "fhenixjs";
import { MLP1L } from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:inference").setAction(async function (
    _taskArguments: TaskArguments,
    hre,
) {
    const { ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();

    const MLP1L = await deployments.get("MLP1L");

    console.log(`Running inference, targeting contract at: ${MLP1L.address}`);

    const contract = (await ethers.getContractAt(
        "MLP1L",
        MLP1L.address,
    )) as unknown as unknown as MLP1L;

    let contractWithSigner = contract.connect(signer) as unknown as MLP1L;

    for (let i = 0; i < 30; i++)
        await contractWithSigner.inference();

    const decryptedInference: any = await contractWithSigner.getDecryptedInferenceExecution();

    console.log(`decryptedInference: ${decryptedInference.toString()}`);
});