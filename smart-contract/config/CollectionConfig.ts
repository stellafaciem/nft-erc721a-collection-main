import CollectionConfigInterface from "../lib/CollectionConfigInterface";
import whitelistAddresses from "./whitelist.json";

const CollectionConfig: CollectionConfigInterface = {
  // The contract name can be updated using the following command:
  // yarn rename-contract NEW_CONTRACT_NAME
  // Please DO NOT change it manually!
  contractName: "StellaFaciem",
  tokenName: "StellaFaciem Faciem NFT",
  tokenSymbol: "SF",
  hiddenMetadataUri:
    "https://stellafaciem.mypinata.cloud/ipfs/QmdqefdwFy35x1UNnC6Md5nW2AqfvKKbrrZUQuyr6wMJT8/",
  maxSupply: 9999,
  maxReserve: 10,
  whitelistSale: {
    price: 0.0,
    maxMintAmountPerTx: 1,
    maxMintPerAddr: 1, // whitelist open
  },
  // preSale: {
  //   price: 0.0,
  //   maxMintAmountPerTx: 10, // pre sale open
  // },
  publicSale: {
    price: 0.0555,
    maxMintAmountPerTx: 5,
    maxMintPerAddr: 20, // public sale open
  },
  contractAddress: null, // Change after deploy
  openSeaSlug: "stella-faciem-nft",
  whitelistAddresses: whitelistAddresses,
};

export default CollectionConfig;
