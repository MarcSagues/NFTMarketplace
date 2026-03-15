import { formatEther } from "ethers/lib/utils";
import useContract from "../hooks/useContract";
import { COMMUNITY_ABI } from "./abi";
import { useAddressRegistry } from "./addressRegistry";

const formatSuggestion = (suggestions) => {
  return suggestions.map((sugg) => {
    return {
      suggestionId: sugg.suggestionId.toNumber(),
      title: sugg.title,
      description: sugg.description,
      totalAmount: formatEther(sugg.totalAmount),
      progress: formatEther(sugg.progress),
      proposer: sugg.proposer,
    };
  });
};

export const useCommunity = () => {
  const { getCommunityAddress } = useAddressRegistry();
  const { getContract } = useContract();

  const getContractAddress = async () => await getCommunityAddress();

  const getCommunityContract = async () => {
    const address = await getContractAddress();
    return await getContract(address, COMMUNITY_ABI);
  };

  const getSuggestionsInProgress = async () => {
    const communityContract = await getCommunityContract();
    let _suggInProg = await communityContract.getInProgressSuggestions();

    return formatSuggestion(_suggInProg);
  };

  const addTokensToSuggestion = async (suggestionId, value) => {
    const communityContract = await getCommunityContract();
    let addTokensTx = await communityContract.addTokensToSuggestion(
      suggestionId,
      {
        value: value,
      }
    );
    await addTokensTx.wait();
  };

  return {
    getContractAddress,
    getCommunityContract,
    getSuggestionsInProgress,
    addTokensToSuggestion,
  };
};
