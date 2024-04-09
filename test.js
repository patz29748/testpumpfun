import { Connection, PublicKey } from '@solana/web3.js';

import { RPC_ENDPOINT, RPC_WEBSOCKET_ENDPOINT } from '../../constants';

const COMMITMENT_LEVEL = 'finalized';

const solanaConnection = new Connection(RPC_ENDPOINT, {
  wsEndpoint: RPC_WEBSOCKET_ENDPOINT,
  commitment: COMMITMENT_LEVEL,
});

const TARGET_ACCOUNT = 'TSLvdd1pWpHVjahSpsvCXUbgwsL3JAcvokwaKt1eokM';
const HOW_MANY_SIGNATURES = 20

async function fetchEarlySignatures() {
  const accountPublicKey = new PublicKey(TARGET_ACCOUNT);
  let signatures: any = [];
  let lastSignature = null;

  while (true) {
    const options: any = { limit: 1000, commitment: 'finalized' };
    if (lastSignature) options.before = lastSignature;
    const fetchedSignatures = await solanaConnection.getSignaturesForAddress(accountPublicKey, options);

    if (fetchedSignatures.length === 0) break;

    signatures = [...signatures, ...fetchedSignatures];
    lastSignature = fetchedSignatures[fetchedSignatures.length - 1].signature;

    if (fetchedSignatures.length < 1000) break;
  }

  signatures.sort((a: any, b: any) => a.blockTime - b.blockTime);

  const firstSignatures = signatures.slice(0, HOW_MANY_SIGNATURES);

  console.log("firstSignatures")
  console.log(firstSignatures)

  return signatures;
}

fetchEarlySignatures();