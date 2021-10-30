const { BN } = require('@project-serum/anchor');
const { PublicKey } = require('@project-serum/anchor').web3;
const marketProxy = require('./market-proxy');
const marketLister = require('./market-lister');
const { DEX_PID } = require('./common');

async function genesis({ provider, proxyProgramId }) {
  //
  // List the market.
  //
  const [marketPublicKey] = await marketLister.list({
    provider: provider,
    connection: provider.connection,
    wallet: provider.wallet,
    baseMint: new PublicKey('H9PDyuBsar5NvaEfAThVqPymQcxUpJhm3CFRakFa6TSp'), // dCVC
    quoteMint: new PublicKey('97va9dqNvQxsgQNaH5BRj6QWbcvpnrwEGLZZp2P4VBwZ'), // dUSD
    baseLotSize: 100000,
    quoteLotSize: 100,
    dexProgramId: DEX_PID,
    proxyProgramId,
    feeRateBps: 0,
  });

  //
  // Load a proxy client for the market.
  //
  const marketProxyClient = await marketProxy.load(
    provider.connection,
    proxyProgramId,
    DEX_PID,
    marketPublicKey,
  );

  //
  // Done.
  //
  return {
    marketProxyClient,
    marketPublicKey,
  };
}

module.exports = {
  genesis,
  DEX_PID,
};
