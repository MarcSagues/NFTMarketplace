import useContract from "../hooks/useContract";
import { COMMUNITY_ABI, VERIFICATION_ABI } from "./abi";
import { useAddressRegistry } from "./addressRegistry";

export const useVerification = () => {
  const { getVerificationAddress } = useAddressRegistry();
  const { getContract } = useContract();

  const getContractAddress = async () => await getVerificationAddress();

  const geVerificationContract = async () => {
    const address = await getContractAddress();

    return await getContract(address, VERIFICATION_ABI);
  };

  const checkWalletVerified = async (wallet) => {
    const verifyContract = await geVerificationContract();
    let isVerified = await verifyContract.checkIfVerified(wallet);

    return isVerified;
  };

  return {
    getContractAddress,
    checkWalletVerified,
  };
};
