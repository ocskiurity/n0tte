import { program } from "commander"
import { exec } from "child_process"
import { log } from "console";

program
  .command("run-task <task>")
  .description("commands w/ hardhat tasks")
  .action((task) => {
    exec(`npx hardhat ${task}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
      }
      log(stdout);
    });
  });

program.parse(process.argv);
