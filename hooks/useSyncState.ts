import { useState, useEffect, useCallback, useRef } from 'react';
import type { DeviceRole } from '../types';

/**
 * Hook for syncing state across devices on the same network
 * Uses BroadcastChannel for same-device tabs and WebSocket for cross-device sync
 */

export interface SyncMessage {
  type: 'STATE_UPDATE' | 'PING' | 'PONG' | 'INITIAL_STATE' | 'CONNECTED' | 'CLIENT_COUNT_UPDATE' | 'ROLE_CHANGE';
  timestamp: number;
  deviceId: string;
  data?: any;
  totalClients?: number;
  role?: DeviceRole;
  deviceName?: string;
}

export interface SyncStatus {
  isConnected: boolean;
  connectedDevices: number;
  lastSync: number | null;
  error: string | null;
  role: DeviceRole;
  canControl: boolean;
}

export function useSyncState<T>(
  key: string,
  initialValue: T,
  enabled: boolean = true,
  initialRole: DeviceRole = 'host'
) {
  const [state, setState] = useState<T>(initialValue);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isConnected: false,
    connectedDevices: 0,
    lastSync: null,
    error: null,
    role: initialRole,
    canControl: initialRole === 'host' || initialRole === 'controller'
  });

  const deviceIdRef = useRef<string>(
    `device-${Math.random().toString(36).substring(2, 11)}-${Date.now()}`
  );
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectedDevicesRef = useRef<Set<string>>(new Set());

  // BroadcastChannel for same-browser sync (different tabs)
  useEffect(() => {
    if (!enabled || typeof BroadcastChannel === 'undefined') return;

    const channel = new BroadcastChannel(key);
    broadcastChannelRef.current = channel;

    channel.onmessage = (event: MessageEvent<SyncMessage>) => {
      const message = event.data;

      // Ignore our own messages
      if (message.deviceId === deviceIdRef.current) return;

      if (message.type === 'STATE_UPDATE' || message.type === 'INITIAL_STATE') {
        setState(message.data);
        setSyncStatus(prev => ({
          ...prev,
          lastSync: Date.now(),
          isConnected: true
        }));
      }

      if (message.type === 'PING') {
        // Respond to ping
        channel.postMessage({
          type: 'PONG',
          timestamp: Date.now(),
          deviceId: deviceIdRef.current
        } as SyncMessage);
      }

      if (message.type === 'PONG') {
        connectedDevicesRef.current.add(message.deviceId);
        setSyncStatus(prev => ({
          ...prev,
          connectedDevices: connectedDevicesRef.current.size
        }));
      }
    };

    // Send initial ping to discover other tabs
    channel.postMessage({
      type: 'PING',
      timestamp: Date.now(),
      deviceId: deviceIdRef.current
    } as SyncMessage);

    setSyncStatus(prev => ({ ...prev, isConnected: true }));

    return () => {
      channel.close();
      broadcastChannelRef.current = null;
    };
  }, [key, enabled]);

  // WebSocket for cross-device sync (same network)
  // Only in development or when WS_ENABLED is true
  const connectWebSocket = useCallback(() => {
    if (!enabled) return;

    // Check if WebSocket is available and enabled
    const wsEnabled = (import.meta as any).env?.VITE_WS_ENABLED !== 'false';
    const isDevelopment = (import.meta as any).env?.DEV === true;

    // Only try WebSocket in development or if explicitly enabled
    if (!isDevelopment && !wsEnabled) {
      console.log('ℹ️  WebSocket deshabilitado en producción - usando solo BroadcastChannel');
      setSyncStatus(prev => ({
        ...prev,
        isConnected: true, // Still connected via BroadcastChannel
        error: null
      }));
      return;
    }

    // Get WebSocket URL and access key from environment
    const wsUrl = (import.meta as any).env?.VITE_WS_URL || 'ws://localhost:8080';
    const accessKey = (import.meta as any).env?.VITE_ACCESS_KEY || 'teleprompter2024';
    
    // Add access key to WebSocket URL
    const wsUrlWithKey = `${wsUrl}?key=${accessKey}`;

    try {
      const ws = new WebSocket(wsUrlWithKey);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket conectado');
        setSyncStatus(prev => ({
          ...prev,
          isConnected: true,
          error: null
        }));
      };

      ws.onmessage = (event) => {
        try {
          const message: SyncMessage = JSON.parse(event.data);

          // Ignore our own messages
          if (message.deviceId === deviceIdRef.current) return;

          if (message.type === 'STATE_UPDATE') {
            setState(message.data);
            setSyncStatus(prev => ({
              ...prev,
              lastSync: Date.now()
            }));
          }

          if (message.type === 'CLIENT_COUNT_UPDATE' || message.type === 'CONNECTED') {
            setSyncStatus(prev => ({
              ...prev,
              connectedDevices: message.totalClients || 0
            }));
          }
        } catch (err) {
          console.error('Error procesando mensaje WebSocket:', err);
        }
      };

      ws.onerror = () => {
        console.warn('⚠️  WebSocket no disponible - usando solo BroadcastChannel');
        // Don't set error in production, just log it
        if (isDevelopment) {
          setSyncStatus(prev => ({
            ...prev,
            error: 'WebSocket no disponible'
          }));
        }
      };

      ws.onclose = () => {
        wsRef.current = null;

        // In production, don't try to reconnect
        if (!isDevelopment) {
          console.log('ℹ️  Usando solo BroadcastChannel (multi-tab sync)');
          setSyncStatus(prev => ({
            ...prev,
            isConnected: true, // Still connected via BroadcastChannel
            error: null
          }));
          return;
        }

        // In development, try to reconnect
        console.log('⚠️  WebSocket desconectado - intentando reconectar...');
        setSyncStatus(prev => ({
          ...prev,
          isConnected: false
        }));

        // Reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      };
    } catch (err) {
      console.warn('⚠️  No se pudo conectar a WebSocket - usando solo BroadcastChannel');
      // In production, this is expected and not an error
      if (isDevelopment) {
        setSyncStatus(prev => ({
          ...prev,
          error: 'WebSocket no disponible'
        }));
      } else {
        setSyncStatus(prev => ({
          ...prev,
          isConnected: true, // Still connected via BroadcastChannel
          error: null
        }));
      }
    }
  }, [enabled]);

  useEffect(() => {
    if (enabled) {
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [enabled, connectWebSocket]);

  // Change device role
  const changeRole = useCallback((newRole: DeviceRole) => {
    setSyncStatus(prev => ({
      ...prev,
      role: newRole,
      canControl: newRole === 'host' || newRole === 'controller'
    }));

    // Notify other devices about role change
    const message: SyncMessage = {
      type: 'ROLE_CHANGE',
      timestamp: Date.now(),
      deviceId: deviceIdRef.current,
      role: newRole
    };

    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage(message);
      } catch (err) {
        console.error('Failed to broadcast role change:', err);
      }
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(message));
      } catch (err) {
        console.error('Failed to send role change:', err);
      }
    }
  }, []);

  // Broadcast state changes
  const syncedSetState = useCallback((newState: T | ((prev: T) => T)) => {
    // Check if device has permission to control
    if (!syncStatus.canControl) {
      console.warn('⚠️  Este dispositivo no tiene permisos para controlar (rol: ' + syncStatus.role + ')');
      return;
    }

    setState(prevState => {
      const nextState = typeof newState === 'function'
        ? (newState as (prev: T) => T)(prevState)
        : newState;

      // Broadcast to other tabs
      if (broadcastChannelRef.current) {
        try {
          broadcastChannelRef.current.postMessage({
            type: 'STATE_UPDATE',
            timestamp: Date.now(),
            deviceId: deviceIdRef.current,
            data: nextState,
            role: syncStatus.role
          } as SyncMessage);
        } catch (err) {
          console.error('Failed to broadcast state:', err);
        }
      }

      // Broadcast to other devices via WebSocket
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        try {
          const message: SyncMessage = {
            type: 'STATE_UPDATE',
            timestamp: Date.now(),
            deviceId: deviceIdRef.current,
            data: nextState,
            role: syncStatus.role
          };
          wsRef.current.send(JSON.stringify(message));
        } catch (err) {
          console.error('Failed to send WebSocket state:', err);
        }
      }

      return nextState;
    });
  }, [syncStatus.canControl, syncStatus.role]);

  // Periodic ping to detect connected devices
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      if (broadcastChannelRef.current) {
        // Clear old devices
        connectedDevicesRef.current.clear();

        broadcastChannelRef.current.postMessage({
          type: 'PING',
          timestamp: Date.now(),
          deviceId: deviceIdRef.current
        } as SyncMessage);

        // Update count after a delay
        setTimeout(() => {
          setSyncStatus(prev => ({
            ...prev,
            connectedDevices: connectedDevicesRef.current.size
          }));
        }, 500);
      }
    }, 5000); // Ping every 5 seconds

    return () => clearInterval(interval);
  }, [enabled]);

  return {
    state,
    setState: syncedSetState,
    syncStatus,
    deviceId: deviceIdRef.current,
    changeRole
  };
}

/**
 * Simpler version that just syncs across browser tabs
 */
export function useSyncStateTabs<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const deviceIdRef = useRef<string>(`tab-${Math.random().toString(36).substring(2, 11)}`);

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;

    const channel = new BroadcastChannel(key);

    channel.onmessage = (event: MessageEvent<SyncMessage>) => {
      if (event.data.deviceId === deviceIdRef.current) return;
      if (event.data.type === 'STATE_UPDATE' || event.data.type === 'INITIAL_STATE') {
        setState(event.data.data);
      }
    };

    // Send current state to new tabs
    channel.postMessage({
      type: 'INITIAL_STATE',
      timestamp: Date.now(),
      deviceId: deviceIdRef.current,
      data: state
    } as SyncMessage);

    return () => channel.close();
  }, [key]);

  const syncedSetState = useCallback((newState: T | ((prev: T) => T)) => {
    setState(prevState => {
      const nextState = typeof newState === 'function'
        ? (newState as (prev: T) => T)(prevState)
        : newState;

      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel(key);
        channel.postMessage({
          type: 'STATE_UPDATE',
          timestamp: Date.now(),
          deviceId: deviceIdRef.current,
          data: nextState
        } as SyncMessage);
        channel.close();
      }

      return nextState;
    });
  }, [key]);

  return [state, syncedSetState] as const;
}
