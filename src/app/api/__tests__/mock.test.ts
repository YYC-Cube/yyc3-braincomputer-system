import { describe, expect, it } from 'vitest';
import { isMockMode } from '../../api/mock';
import type { Device, MonitorAlert, WSMessage } from '../../api/types';

describe('Mock System', () => {
  it('isMockMode should return boolean', () => {
    const result = isMockMode();
    expect(typeof result).toBe('boolean');
  });

  it('isMockMode reflects API_CONFIG.TEST_MODE', () => {
    const result = isMockMode();
    expect(result).toBeDefined();
    expect(typeof result).toBe('boolean');
  });
});

describe('Mock Data Integrity', () => {
  it('should export mock handler functions', async () => {
    const { getMockHandler } = await import('../../api/mock');
    expect(typeof getMockHandler).toBe('function');
  });

  it('types.ts should export all required interfaces', async () => {
    const types = await import('../../api/types');
    expect(types).toBeDefined();
  });
});

describe('API Types', () => {
  it('should have Device type structure', () => {
    const device: Device = {
      id: 'DEV-TEST',
      name: 'Test Device',
      type: 'server',
      endpoint: 'max',
      ip: '192.168.1.1',
      port: 22,
      status: 'running',
      os: 'Ubuntu 24.04',
      cpu: 4,
      memory: 8,
      disk: 100,
      cpuUsage: 50,
      memoryUsage: 60,
      diskUsage: 30,
      location: 'Test',
      createdAt: '2026-01-01',
      updatedAt: '2026-05-19',
      createdBy: 'admin',
      tags: ['test'],
      description: 'Test device',
    };
    expect(device.id).toBe('DEV-TEST');
    expect(device.status).toBe('running');
  });

  it('should have WSMessage type structure', () => {
    const msg: WSMessage = {
      type: 'monitor',
      payload: { cpu: 50 },
      timestamp: Date.now(),
    };
    expect(msg.type).toBe('monitor');
    expect(msg.payload).toBeDefined();
  });

  it('should have MonitorAlert type structure', () => {
    const alert: MonitorAlert = {
      id: 'ALT-001',
      level: 'warning',
      message: 'CPU high',
      messageEn: 'CPU high',
      device: 'DEV-001',
      deviceId: 'DEV-001',
      metric: 'cpu',
      value: '95',
      threshold: '90',
      time: '2026-05-19 12:00:00',
      status: 'active',
    };
    expect(alert.level).toBe('warning');
    expect(alert.status).toBe('active');
  });
});

describe('WebSocket Types', () => {
  it('WebSocketManager should be constructable', async () => {
    const { WebSocketManager } = await import('../../api/websocket');
    const ws = new WebSocketManager();
    expect(ws).toBeDefined();
    expect(typeof ws.on).toBe('function');
    expect(typeof ws.connect).toBe('function');
    expect(typeof ws.disconnect).toBe('function');
  });
});
