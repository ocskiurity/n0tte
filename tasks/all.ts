import { MLP1L } from "../types";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";
import { log } from "./shared";

task("all").setAction(async function (
    _taskArguments: TaskArguments,
    hre,
) {    
    await hre.run('set:bias');
    await hre.run('set:weights');
    await hre.run('set:quantized-data');
    await hre.run('inference');
});