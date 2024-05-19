import chalk from "chalk"
import figlet from "figlet"

export const { log } = console
export const textPrimaryBold = (text: string) => chalk.hex("#F5F5F5").bold(text)

export const welcome = () => {
    log(`${textPrimaryBold(figlet.textSync("notte", {font: "Bloody"}))}\n`)
    log(`${textPrimaryBold("🩸 command-line interface for making private on-chain FHE-ML inference 🩸")}\n`)
}
