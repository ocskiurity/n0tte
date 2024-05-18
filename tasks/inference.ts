import { EncryptedUint8 } from "fhenixjs";
import { MLPL1 } from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:inference").setAction(async function (
    _taskArguments: TaskArguments,
    hre,
) {
    const { fhenixjs, ethers, deployments } = hre;
    const [signer] = await ethers.getSigners();

    const MLPL1 = await deployments.get("MLPL1");

    console.log(`Running inference, targeting contract at: ${MLPL1.address}`);

    const contract = (await ethers.getContractAt(
        "MLPL1",
        MLPL1.address,
    )) as unknown as unknown as MLPL1;

    // console.log(await contract.counter())
    for (let i = 0; i < 30; i++) {
        await contract.inference();
        console.log(i)
    }
    const res: any = await contract.decryptInferenceResult();
    console.log(res)
    console.log(`got res: ${res.toString()}`);
});