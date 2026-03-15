import { Contracts } from "../constants/networks";
import { createForwarderInstance } from "./forwarder";
import { signMetaTxRequest } from "./signer";
import { ChainId } from "@sushiswap/sdk";

const autotaksURL = Contracts[ChainId.FANTOM_TESTNET].autotaskURL;

export const sendMetaTx = async (contract, provider, signer, txParams) => {
  const url = autotaksURL;
  if (!url) throw new Error(`Missing relayer url`);

  const { functionName, args } = txParams;

  const forwarder = createForwarderInstance(provider);
  const from = await signer.getAddress();

  const data = contract.interface.encodeFunctionData(functionName, args);
  const to = contract.address;
  const request = await signMetaTxRequest(signer.provider, forwarder, {
    to,
    from,
    data,
  });

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(request),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.data;
};
