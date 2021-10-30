import React from 'react';
import { PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { ENDPOINTS, useConnectionConfig } from './connection';
import { MarketProxyBuilder } from '@project-serum/serum';

export type Cluster = 'mainnet-beta' | 'devnet' | 'testnet' | 'civic';

export const getProxyProgramId = (endpoint): PublicKey => {
  const cluster = ENDPOINTS.find(e => e.endpoint === endpoint)?.name as Cluster;

  switch(cluster) {
    default:
      return new PublicKey('DQJPbP4enjKjKQaWMZjq6dSJYLJeMpY1YPCEZRWKDECb');
  }
}

export class Identity {
  gatewayToken?: PublicKey;

  constructor(gatewayToken?: PublicKey) {
    this.gatewayToken = gatewayToken;
  }

  setToken(gatewayToken?: PublicKey) {
    this.gatewayToken = gatewayToken;
  }

  initOpenOrders(ix) {
    this.proxy(ix);
  }
  newOrderV3(ix) {
    this.proxy(ix);
  }
  cancelOrderV2(ix) {
    this.proxy(ix);

    // Temporary fix
    // @ts-ignore
    ix.programId = getProxyProgramId(ENDPOINTS.find(({ name }) => name === 'mainnet-beta').endpoint).toBase58();
  }
  cancelOrderByClientIdV2(ix) {
    this.proxy(ix);
  }
  settleFunds(ix) {
    this.proxy(ix);
  }
  closeOpenOrders(ix) {
    this.proxy(ix);
  }
  prune(ix) {
    this.proxyRevoked(ix);
  }
  proxy(ix) {
    if (!this.gatewayToken) {
      throw new Error(`Gateway token is not set or loaded yet.`);
    }

    ix.keys = [
      { pubkey: this.gatewayToken, isWritable: false, isSigner: false },
      ...ix.keys,
    ];
  }
  proxyRevoked(ix) {
    if (!this.gatewayToken) {
      throw new Error(`Gateway token is not set or loaded yet.`);
    }

    ix.keys = [
      { pubkey: this.gatewayToken, isWritable: false, isSigner: false },
      ...ix.keys,
    ];
  }
  static async pruneAuthority(market, dexProgramId, proxyProgramId) {
    const [address] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode('prune'),
        dexProgramId.toBuffer(),
        market.toBuffer(),
      ],
      proxyProgramId
    );
    return address;
  }
}

interface ProxyContextProps {
  proxyProgramId: PublicKey,
}

export const ProxyContext = React.createContext<null | ProxyContextProps>(null);
export const ProxyBuilderContext = React.createContext<null | MarketProxyBuilder>(null);

export const ProxyProvider = ({ children }: { children: React.ReactNode }) => {
  const { endpoint } = useConnectionConfig();

  const proxyProgramId = getProxyProgramId(endpoint);

  return (
    <ProxyContext.Provider value={{ proxyProgramId }}>
      {children}
    </ProxyContext.Provider>
  )
}

export const useProxy = () => {
  const context = React.useContext(ProxyContext);

  if (context === null) {
    throw new Error(`Missing Proxy Context`);
  }

  return {
    proxyProgramId: context.proxyProgramId,
  };
}