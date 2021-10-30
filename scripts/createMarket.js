const anchor = require('@project-serum/anchor');
const utils = require('./utils');

const { PublicKey } = require('@project-serum/anchor').web3;

(async () => {
  const provider = anchor.Provider.local('https://api.devnet.solana.com');
  anchor.setProvider(provider);
  // const program = anchor.workspace.PermissionedMarkets;
  const { marketProxyClient, marketPublicKey } = await utils.genesis({
    provider,
    proxyProgramId: new PublicKey(
      'DQJPbP4enjKjKQaWMZjq6dSJYLJeMpY1YPCEZRWKDECb',
    ),
  });

  console.log(marketPublicKey.toString());
})().catch(console.error);
