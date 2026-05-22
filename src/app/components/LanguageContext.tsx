/**
 * file LanguageContext.tsx
 * description 国际化 Context · 支持中文/English 动态切换 · localStorage 持久化
 * author YanYuCloudCube Team
 * version v3.1.0
 * created 2026-02-26
 * updated 2026-05-19
 * status: active
 * tags: [i18n],[context],[locale]
 *
 * brief: 提供国际化功能，支持中英文动态切换，localStorage 持久化语言偏好
 * dependencies: React, Context API
 * exports: useLanguage, LanguageProvider
 * notes: 需要在 App 根组件包裹 LanguageProvider
 */

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'zh' | 'en';

const LANGUAGE_STORAGE_KEY = 'yyc3_language';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  zh: {
    appTitle: 'YYC³ 脑机系统',
    subtitleStandard: '基于五高五标五化的智能架构',
    searchPlaceholder: '系统全域搜索...',
    systemTime: '系统时间',
    online: '在线',
    offline: '离线',
    standby: '待机模式',
    systemOptimal: '运行良好',
    alerts: '警报',
    criticalSystems: '关键系统概览',
    telemetryAndDiagnostics: '实时遥测与诊断',
    systemStatus: '系统状态',
    neuralDataVis: '神经数据可视化',
    quantumAnalytics: '多模态分析引擎',
    systemLogs: '系统运行日志',
    realTimeMonitoring: '实时监控',
    holographicDisplay: '全息显示',
    controlMatrix: '控制矩阵',
    version: 'YYC³ System v1.0.0',
    uptime: '运行时间',
    load: '负载',
    memory: '内存',
    neuralLink: '神经链接',
    active: '活跃',
    inactive: '非活跃',
    streaming: '流传输中',
    quantumCore: '核心计算',
    dashboard: '系统总览',
    whitepaper: '技术文档',
    perception: '感知交互',
    computing: '边缘计算',
    platform: '平台服务',
    security: '安全防护',
    settings: '系统设置',
    network: '网络传输',
    devops: 'DevOps',
    deviceMgmt: '设备管理',
    monitor: '数据监控',
    auditLog: '操作审计',
    permission: '权限管理',
    quickActions: '快速操作',
  },
  en: {
    appTitle: 'YYC³ Brain System',
    subtitleStandard: 'Intelligent Architecture based on 5-High 5-Std 5-Mod',
    searchPlaceholder: 'System Search...',
    systemTime: 'System Time',
    online: 'ONLINE',
    offline: 'OFFLINE',
    standby: 'STANDBY',
    systemOptimal: 'OPTIMAL',
    alerts: 'ALERTS',
    criticalSystems: 'CRITICAL SYSTEMS',
    telemetryAndDiagnostics: 'Real-time Telemetry',
    systemStatus: 'SYSTEM STATUS',
    neuralDataVis: 'NEURAL VISUALIZATION',
    quantumAnalytics: 'MULTIMODAL ANALYTICS',
    systemLogs: 'SYSTEM LOGS',
    realTimeMonitoring: 'Real-time Monitoring',
    holographicDisplay: 'HOLOGRAPHIC DISPLAY',
    controlMatrix: 'CONTROL MATRIX',
    version: 'YYC³ System v1.0.0',
    uptime: 'UPTIME',
    load: 'LOAD',
    memory: 'MEMORY',
    neuralLink: 'NEURAL LINK',
    active: 'ACTIVE',
    inactive: 'INACTIVE',
    streaming: 'STREAMING',
    quantumCore: 'CORE COMP',
    dashboard: 'Overview',
    whitepaper: 'Tech Docs',
    perception: 'Perception',
    computing: 'Computing',
    platform: 'Platform',
    security: 'Security',
    settings: 'Settings',
    network: 'Network',
    devops: 'DevOps',
    deviceMgmt: 'Devices',
    monitor: 'Monitor',
    auditLog: 'Audit',
    permission: 'Permissions',
    quickActions: 'Quick Actions',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'zh' || stored === 'en') return stored;
  } catch {}
  return 'zh';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {}
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
