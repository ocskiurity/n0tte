<p align="center">
    <picture>
        <source srcset="https://github.com/ocskiurity/n0tte/assets/20580910/d9f24eec-192c-4d10-80bb-0d63a6c18d99">
        <img width="250" alt="logo"
            src="https://github.com/ocskiurity/n0tte/assets/20580910/d9f24eec-192c-4d10-80bb-0d63a6c18d99">
    </picture>
<h1 align="center">
    🐺 n0tte 🐺
</h1>
</p>

| n0tte enables private on-chain FHE-ML inference on one-layer MLP models interacting with a command-line interface running hardhat scripts |
| ----------------------------------------------------------------------------------------------------------------------------------------- |

The current machine learning (ML) landscape is controlled by a few major players who keep their high-quality trained models proprietary to maintain their dominance in the industry. This creates a significant obstacle for individuals, such as researchers, students, and small institutions, who want to leverage these high-quality models to analyze their own data. 

__n0tte__ addresses this issue by facilitating ML inference through Fully Homomorphic Encryption (FHE) within Ethereum Smart Contracts. This approach allows model owners to set the encrypted weights and biases of a pre-trained general-purpose 1-layer MLP model on a smart contract. Using the provided [initiator](https://github.com/ocskiurity/initiator) set of Python scripts, model owners can train and quantize ML models and data off-chain. Consequently, any user can perform inference on their encrypted data directly on-chain, ensuring the privacy and security of user data.

## Prerequisities
Please, make sure you have Docker installed and running on your machine. You can find instructions on how to install docker [here](https://docs.docker.com/get-docker/).
 
## Install

Clone this repository:

```bash
git clone https://github.com/ocskiurity/n0tte.git
```

And install the dependencies and build the project:
nb. the build script compiles the smart contract too.

```bash
cd n0tte && pnpm install && pnpm build
```

## Config

Copy the `.env.example` file as `.env`:

```bash
cp .env.example .env
```

And add your environment variables. You can leave the default values for the sake of demoing.

Remember to put your data about the model and / or inference under the `tasks/data/` folder and update the paths accordingly. Right now, we are pointing to the `tasks/data/sample` JSON files (and please, follow their structure and naming conventions).

## Usage
Run the LocalFhenix instance with Docker

```bash
pnpm localfhenix:start
```

⚠️ you may need to `chmod` the `docker.sock` file on Linux distros. 

```bash
sudo chmod 666 /var/run/docker.sock
```

Deploy the 1L MLP model running. You can modify the configuration on the task.

```bash
pnpm task:deploy
```

## CLI

We provide a command line interface to run hardhat scripts and have a fancy output on your console. You can use it locally by linking for now (__heads up: it needs an hardhat environment for execution!__)

To link and have the `n0tte` CLI locally
```bash
npm link
n0tte
```

You can run the hardhat tasks through the CLI (or through `pnpm run-task <name>`)

```bash
n0tte run-task set:bias
n0tte run-task set:weights
n0tte run-task set:quantized-data
n0tte run-task inference

# or use 'all' to run everything in order (bias, weights, data, inference).

n0tte run-task all 
```

- set:bias: sets the quantized bias of the model in an FHE encrypted form on-chain.
- set:weights: sets the quantized weights of the model in an FHE encrypted form on-chain. The weights are obtained from the off-chain training of the model + quantization.
- set:quantized-data: sets the quantized data of the model in an FHE encrypted form on-chain for doing inference.
- set:inference: computes a run of the inference of the model in a private-preserving fashion.

nb. the CLI may hang due to latency & heavy computations (there's one tx x computation step) - do not exit before seeing any output of the CLI.

--

Note that you can run just one inference because we are not resetting anything (data + result). Therefore, we suggest to execute the following (long) one-time script to make an e2e run

```bash
pnpm clean && pnpm compile && pnpm task:deploy && pnpm run build && npm link && clear && n0tte run-task all
```

## Learn more
To learn more about the Fhenix, please visit the official [docs](https://docs.fhenix.zone/docs/devdocs/intro) and [Github org](https://github.com/FhenixProtocol).

## Team
ocskiurity team - zkHack Krakow
- [0xjei](https://github.com/0xjei) 
- [0xfrankly](https://github.com/francescopisu)

