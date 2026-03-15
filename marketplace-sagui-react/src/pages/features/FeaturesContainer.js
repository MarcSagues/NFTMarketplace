import React, { useEffect, useRef, useState } from "react";
import { FeatureItem } from "./components/FeatureItem";
import ActionButton from "../../components/ActionButton";
import NewFeatureModal from "./components/NewFeatureModal";
import { useCommunity } from "../../contracts/community";
import { useStateContext } from "../../context/StateProvider";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../api";
import { PageWithLoading } from "../../components/basic/PageWithLoading";
import { NotVerified } from "../../components/basic/NotVerified";
import useAccount from "../../hooks/useAccount";

export default function FeaturesContainer() {
  const { wallet, connectToWallet } = useAccount();
  const [{ verifiedAddress, literals }] = useStateContext();
  const { getProfileInfo, getActiveSuggestions } = useApi();

  const [loading, setLoading] = useState(true);
  const [suggestionsInProgress, setSuggestionsInProgress] = useState([]);
  const [showNewSuggestion, setShowNewSuggestion] = useState(false);

  const sortByVotes = (suggestionA, suggestionB) => {
    if (suggestionA.votes > suggestionB.votes) {
      return -1;
    } else {
      return 1;
    }
  };

  const sortSuggestions = (suggestions) => {
    const sorted = suggestions.sort(sortByVotes);
    return sorted;
  };
  useEffect(() => {
    const fetchSuggestions = async () => {
      await connectToWallet();
      let _suggInProg = await getActiveSuggestions();
      let formattedSugestions = await Promise.all(
        _suggInProg.map(async (item) => {
          const proposer = item.proposer;
          const profileInfo = await getProfileInfo(proposer);
          return {
            ...item,
            proposer: profileInfo,
          };
        })
      );
      setSuggestionsInProgress(sortSuggestions(formattedSugestions));
      setLoading(false);
    };
    fetchSuggestions();
  }, []);
  return (
    <PageWithLoading loading={loading}>
      <>
        {verifiedAddress ? (
          <>
            <div className="w-full dark:bg-gray-1 flex flex-col justify-center items-center gap-4">
              <div className="uppercase font-bold text-4xl mt-10">
                {literals.features.suggestions}
              </div>
              <div className=" w-5/6 text-sm md:text-lg md:w-2/3 text-center">
                {literals.features.sentence}
              </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center gap-4">
              <div className="uppercase font-bold text-xl mt-10">
                {literals.features.suggest}
              </div>
              <ActionButton
                buttonAction={() => setShowNewSuggestion(true)}
                text={literals.actions.addSuggestion}
                size="large"
              />
            </div>
            <div className="mt-10 flex flex-col justify-center items-center gap-2 mx-2 md:mx-20">
              {suggestionsInProgress.map((item) => {
                return (
                  <FeatureItem
                    wallet={wallet}
                    key={Math.random(999) * 100}
                    suggestion={item}
                  />
                );
              })}
            </div>{" "}
          </>
        ) : (
          <NotVerified text={literals.modals.artistNotVerified} />
        )}
        <NewFeatureModal
          showModal={showNewSuggestion}
          handleCloseModal={() => setShowNewSuggestion(false)}
        />
      </>
    </PageWithLoading>
  );
}
