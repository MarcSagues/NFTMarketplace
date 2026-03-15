export const truncateWallet = (wallet, slicer) => {
  if (slicer) {
    return `${wallet.slice(0, slicer)}...${wallet.slice(
      wallet.length - slicer,
      wallet.length
    )}`;
  } else {
    return `${wallet.slice(0, 8)}...${wallet.slice(
      wallet.length - 8,
      wallet.length
    )}`;
  }
};
