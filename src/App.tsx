import React, { Suspense } from 'react';
import './App.less';
import { ConnectionProvider } from './utils/connection';
import { WalletProvider } from './utils/wallet';
import { GlobalStyle } from './global_style';
import { Spin } from 'antd';
import ErrorBoundary from './components/ErrorBoundary';
import { Routes } from './routes';
import { PreferencesProvider } from './utils/preferences';
import { ReferrerProvider } from './utils/referrer';
import { ProxyProvider } from './utils/proxy';

export default function App() {
  return (
    <Suspense fallback={() => <Spin size="large" />}>
      <GlobalStyle />
      <ErrorBoundary>
        <ConnectionProvider>
          <ReferrerProvider>
            <WalletProvider>
              <ProxyProvider>
                <PreferencesProvider>
                  <Suspense fallback={() => <Spin size="large" />}>
                    <Routes />
                  </Suspense>
                </PreferencesProvider>
              </ProxyProvider>
            </WalletProvider>
          </ReferrerProvider>
        </ConnectionProvider>
      </ErrorBoundary>
    </Suspense>
  );
}
