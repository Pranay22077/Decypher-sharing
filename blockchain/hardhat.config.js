import "@nomicfoundation/hardhat-ethers";

export default {
  solidity: "0.8.28",
  networks: {
    localhost: { url: process.env.BLOCKCHAIN_RPC_URL || "http://hardhat:8545" },
  },
};

