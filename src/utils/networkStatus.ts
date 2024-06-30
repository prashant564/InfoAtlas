/* eslint-disable react-hooks/rules-of-hooks */
import {createContext, useContext, useEffect, useRef, useState} from 'react';
import NetInfo, {NetInfoSubscription} from '@react-native-community/netinfo';

export const networkStatusHook = () => {
  const networkStatusUnsub = useRef<NetInfoSubscription | undefined>(undefined);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isInternetReachable, setIsInternetReachable] = useState<
    boolean | null
  >(null);
  const [connectionStrength, setConnectionStrength] = useState<
    number | null | undefined
  >(undefined);
  const [connectionType, setConnectionType] = useState<string | null>(null);

  useEffect(() => {
    networkStatusUnsub.current = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected !== false);
      setIsInternetReachable(state.isInternetReachable !== false);
      setConnectionStrength(
        state.type === 'wifi' ? state.details.strength : undefined,
      );
      setConnectionType(
        state.type === 'wifi'
          ? 'wifi'
          : state.type === 'cellular'
          ? state.details.cellularGeneration
          : null,
      );
    });

    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected !== false);
      setIsInternetReachable(state.isInternetReachable !== false);
      setConnectionStrength(
        state.type === 'wifi' ? state.details.strength : null,
      );
      setConnectionType(
        state.type === 'wifi'
          ? 'wifi'
          : state.type === 'cellular'
          ? state.details.cellularGeneration
          : null,
      );
    });

    return () => {
      if (typeof networkStatusUnsub.current === 'function') {
        networkStatusUnsub.current();
      }
    };
  }, []);

  return {
    isConnected,
    isInternetReachable,
    connectionStrength,
    connectionType,
  };
};

export type AppNetworkConnectivityState = ReturnType<typeof networkStatusHook>;

const AppNetworkConnectivityContext =
  createContext<AppNetworkConnectivityState>({} as AppNetworkConnectivityState);

export const AppNetworkConnectivityProvider =
  AppNetworkConnectivityContext.Provider;

export const useNetworkStatus = (): AppNetworkConnectivityState =>
  useContext(AppNetworkConnectivityContext);
