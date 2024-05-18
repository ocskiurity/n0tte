import chalk from "chalk"
import figlet from "figlet"

export const { log } = console
export const textPrimaryBold = (text: string) => chalk.hex("#F5F5F5").bold(text)

export const welcome = () => {
    log(`${textPrimaryBold(figlet.textSync("n0tte"))}\n`)
    log(`${textPrimaryBold("CLI for easy on-chain FHE-ML")}\n`)
}
