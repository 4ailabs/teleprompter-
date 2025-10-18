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
  
  const lastUpdateRef = useRef<number>(0);
  const isUpdatingRef = useRef<boolean>(false);

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
        // Only accept control messages from host or controller
        // Viewers should only receive, never send
        const senderCanControl = message.role === 'host' || message.role === 'controller';
        
        // If we're a host, only accept from other hosts (for multi-tab same device)
        // If we're a viewer, accept from anyone who can control
        if (syncStatus.role === 'viewer' && senderCanControl) {
          // Viewer accepts control from host/controller
          if (!isUpdatingRef.current) {
            isUpdatingRef.current = true;
            setState(message.data);
            setTimeout(() => {
              isUpdatingRef.current = false;
            }, 100);
          }
        } else if (syncStatus.role === 'host' || syncStatus.role === 'controller') {
          // Host/Controller updates state normally
          if (!isUpdatingRef.current) {
            isUpdatingRef.current = true;
            setState(message.data);
            setTimeout(() => {
              isUpdatingRef.current = false;
            }, 100);
          }
        }
        
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

  // WebSocket disabled - using only BroadcastChannel for same-browser sync
  const connectWebSocket = useCallback(() => {
    if (!enabled) return;

    // WebSocket disabled - only using BroadcastChannel
    console.log('ℹ️  Usando solo BroadcastChannel (multi-pestaña)');
    console.log('✅ Sincronización entre pestañas activada');
    setSyncStatus(prev => ({
      ...prev,
      isConnected: true, // Connected via BroadcastChannel
      error: null
    }));
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
    // Only hosts and controllers can send updates
    const canSendUpdates = syncStatus.canControl;
    
    setState(prevState => {
      const nextState = typeof newState === 'function'
        ? (newState as (prev: T) => T)(prevState)
        : newState;

      // Only broadcast if this device can control
      if (canSendUpdates && typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel(key);
        channel.postMessage({
          type: 'STATE_UPDATE',
          timestamp: Date.now(),
          deviceId: deviceIdRef.current,
          data: nextState,
          role: syncStatus.role
        } as SyncMessage);
        channel.close();
      }

      return nextState;
    });
  }, [key, syncStatus.canControl, syncStatus.role]);

  return [state, syncedSetState] as const;
}
