import { mkdirSync, writeFileSync } from "node:fs";
import hre from "hardhat";

const { ethers } = hre;

const registry = await ethers.deployContract("EvidenceRegistry");
await registry.waitForDeployment();
const address = await registry.getAddress();
mkdirSync("deployment", { recursive: true });
writeFileSync("deployment/local.json", JSON.stringify({ address, network: "Hardhat Local EVM" }, null, 2));
console.log(`EvidenceRegistry deployed to ${address}`);
