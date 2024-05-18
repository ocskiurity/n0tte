import { EncryptedUint8 } from "fhenixjs";
import { MLPL1 } from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:getTestData").setAction(async function (
  _taskArguments: TaskArguments,
  hre,
) {
  const { fhenixjs, ethers, deployments } = hre;
  const [signer] = await ethers.getSigners();

  const MLPL1 = await deployments.get("MLPL1");

  console.log(`Running getBiases, targeting contract at: ${MLPL1.address}`);

  const contract = (await ethers.getContractAt(
    "MLPL1",
    MLPL1.address,
  )) as unknown as unknown as MLPL1;

  const res: any = await contract.test_data(29);
  console.log(`got bias: ${res.toString()}`);
  console.log(`decrypted: ${await contract.decryptTestData(29)}`)
});