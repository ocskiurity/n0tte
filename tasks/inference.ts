import { MLP1L } from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import { log } from "./shared";

task("inference").setAction(async function (
    _taskArguments: TaskArguments,
    hre,
) {
    const { ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();
    const MLP1L = await deployments.get("MLP1L")
    const contract = await ethers.getContractAt("MLP1L", MLP1L.address);
    let contractWithSigner = contract.connect(signer) as unknown as MLP1L;

    log(`running FHE encrypted ML inference of the MLP1L model`)

    for (let i = 0; i < 30; i++)
        await contractWithSigner.inference();

    log(`decrypting the result`)
    const decryptedInference: any = await contractWithSigner.getDecryptedInferenceExecution();

    log(`Diagnosis: ${decryptedInference > 127 ? "malignant" : "benign"}`)
});