import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { useApi } from "../../../api";
import { ButtonTooltip } from "../../../components/tooltips/ButtonTooltip";
import { useStateContext } from "../../../context/StateProvider";

export const FeatureItem = ({ suggestion, wallet }) => {
  const [{ literals }] = useStateContext();
  const { voteIntoSuggestion } = useApi();

  const [hasVoted, setHasVoted] = useState(false);
  const [numberOfVotes, setNumberOfVotes] = useState(0);

  const { suggestionId, title, description, proposer, votes, voters } =
    suggestion;

  const voteSuggestion = async () => {
    if (!hasVoted) {
      await voteIntoSuggestion(wallet, title, proposer.wallet);
      setHasVoted(true);
      setNumberOfVotes(numberOfVotes + 1);
    }
  };

  useEffect(() => {
    setHasVoted(voters.includes(wallet));
    setNumberOfVotes(votes);
  }, []);

  return (
    <Container>
      <div
        disabled={hasVoted}
        onClick={voteSuggestion}
        className={`border-r pr-4 flex flex-col gap-2 items-center justify-center`}
      >
        <ButtonTooltip
          tooltip={`feature-${suggestionId}`}
          tooltipText={literals.features.vote}
          tooltipPlacement="top"
          disabled={hasVoted}
          onClick={() => hasVoted && voteSuggestion()}
        >
          <Icon
            className={`${
              hasVoted
                ? "cursor-not-allowed"
                : "cursor-pointer hover:text-primary-2"
            } `}
            width={32}
            icon={!hasVoted ? "bx:upvote" : "bxs:upvote"}
          />
        </ButtonTooltip>
        <div className="text-lg">
          <b>{numberOfVotes}</b>
        </div>
      </div>
      <div>
        <TitleContainer>{title}</TitleContainer>
        <DescriptionContainer>{description}</DescriptionContainer>
        <div className="flex gap-5 mt-3 text-sm md:text-base items-center">
          <div>{literals.features.proposedFor}</div>
          <div className="flex gap-2 items-center border p-2 rounded-xl">
            <img
              className="rounded-full"
              width={32}
              src={proposer.profileImg}
              alt={`from-${proposer._id}-img`}
            />
            <p
              className="text-primary-2 underline cursor-pointer"
              onClick={() =>
                window.open(`/account/${proposer.wallet}`, "_blank")
              }
            >
              {proposer.username}
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = tw.div`
    flex   w-full border rounded-md border-gray-300 p-2 dark:bg-dark-2 gap-4
`;

const TitleContainer = tw.div`
    flex text-xl font-bold
`;

const DescriptionContainer = tw.div`
  text-sm md:text-lg
`;

const ProgressContainer = tw.div`
    flex justify-between my-5
`;

const DepositContainer = tw.div`
    flex justify-between gap-3 items-center

`;

const Input = tw.input`
    text-black flex-1 outline-none p-2 bg-gray-300 font-bold rounded-md
`;

const FilledButton = tw.button`
 flex items-center justify-center uppercase cursor-pointer bg-[#BFC500] hover:bg-gray-300 text-black font-bold py-2 px-4 rounded
`;

const OutlinedButton = tw(FilledButton)`
 bg-black text-[#BFC500] border-[#BFC500] border-2 hover:bg-[#BFC500] hover:text-black
`;
