/**
 * YYC3 Theme Context — 自定义主题系统 v2 (Phase 5.5)
 * 
 * 功能: 主题状态管理、颜色/字体/布局/品牌配置、预设主题切换、导入导出
 *       字体上传(IndexedDB)、背景管理、版本对比、CSS变量深度联动
 * 存储: localStorage + IndexedDB 持久化
 * 支持: 中英双语、实时预览、WCAG 对比度检测
 */

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ===== 主题类型定义 =====
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  card: string;
  popover: string;
  muted: string;
  destructive: string;
  border: string;
  input: string;
}

export interface ThemeColorsForeground {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  card: string;
  popover: string;
  muted: string;
  destructive: string;
  border: string;
  input: string;
}

export interface ChartColors {
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  chart6: string;
}

export interface SidebarColors {
  background: string;
  primary: string;
  accent: string;
  border: string;
}

export interface ThemeFonts {
  sans: string;
  serif: string;
  mono: string;
}

export interface ThemeLayout {
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
}

export interface ThemeBranding {
  appName: string;
  slogan: string;
  sloganEn: string;
  subtitle: string;
  subtitleEn: string;
}

// ===== 背景配置 =====
export interface ThemeBackground {
  type: 'color' | 'image' | 'video';
  value: string; // CSS color or base64/URL
  opacity: number;
  blur: number;
  position: string;
  size: string;
}

const DEFAULT_BACKGROUND: ThemeBackground = {
  type: 'color',
  value: '#0a0f1c',
  opacity: 100,
  blur: 0,
  position: 'center center',
  size: 'cover',
};

// ===== 自定义字体 =====
export interface CustomFont {
  id: string;
  name: string;
  family: string;
  format: string;
  dataUrl: string; // base64 data URL
  size: number; // bytes
  uploadedAt: string;
  tier: 'sans' | 'serif' | 'mono';
}

// ===== 主题版本快照 =====
export interface ThemeSnapshot {
  id: string;
  name: string;
  timestamp: string;
  theme: ThemeConfig;
}

export interface ThemeConfig {
  id: string;
  name: string;
  nameEn: string;
  type: 'light' | 'dark';
  colors: ThemeColors;
  foreground: ThemeColorsForeground;
  chart: ChartColors;
  sidebar: SidebarColors;
  fonts: ThemeFonts;
  layout: ThemeLayout;
  branding: ThemeBranding;
  background: ThemeBackground;
  version: string;
  createdAt: string;
  updatedAt: string;
}

// ===== 6 个预设主题 =====
const BASE_BRANDING: ThemeBranding = {
  appName: 'YYC3 CloudPivot Intelli-Matrix',
  slogan: '言启象限 | 语枢未来',
  sloganEn: 'Words Initiate Quadrants, Language Serves as Core for Future',
  subtitle: '万象归元于云枢 | 深栈智启新纪元',
  subtitleEn: 'All things converge in cloud pivot; Deep stacks ignite a new era of intelligence',
};

const BASE_FONTS: ThemeFonts = {
  sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  serif: "Georgia, 'Times New Roman', Times, serif",
  mono: "'Fira Code', 'Courier New', monospace",
};

const BASE_LAYOUT: ThemeLayout = {
  radiusSm: '8px',
  radiusMd: '12px',
  radiusLg: '16px',
  radiusXl: '24px',
  shadowSm: '0 1px 3px rgba(0,0,0,0.10)',
  shadowMd: '0 4px 6px rgba(0,0,0,0.10)',
  shadowLg: '0 10px 15px rgba(0,0,0,0.10)',
};

const now = () => new Date().toISOString();

export const PRESET_THEMES: ThemeConfig[] = [
  {
    id: 'cyberpunk-default',
    name: '赛博朋克 (默认)',
    nameEn: 'Cyberpunk (Default)',
    type: 'dark',
    colors: {
      primary: 'oklch(0.60 0.25 200)',
      secondary: 'oklch(0.65 0.20 280)',
      accent: 'oklch(0.70 0.30 60)',
      background: 'oklch(0.10 0.02 250)',
      card: 'oklch(0.14 0.02 250)',
      popover: 'oklch(0.14 0.02 250)',
      muted: 'oklch(0.20 0.02 250)',
      destructive: 'oklch(0.55 0.22 25)',
      border: 'oklch(0.25 0.02 250)',
      input: 'oklch(0.16 0.02 250)',
    },
    foreground: {
      primary: 'oklch(0.98 0.01 200)',
      secondary: 'oklch(0.98 0.01 280)',
      accent: 'oklch(0.98 0.01 60)',
      background: 'oklch(0.90 0.01 250)',
      card: 'oklch(0.90 0.01 250)',
      popover: 'oklch(0.90 0.01 250)',
      muted: 'oklch(0.65 0.02 250)',
      destructive: 'oklch(0.98 0.01 25)',
      border: 'oklch(0.60 0.02 250)',
      input: 'oklch(0.90 0.01 250)',
    },
    chart: {
      chart1: '#06b6d4', chart2: '#a855f7', chart3: '#f97316',
      chart4: '#22c55e', chart5: '#ec4899', chart6: '#eab308',
    },
    sidebar: {
      background: 'oklch(0.08 0.02 250)',
      primary: 'oklch(0.60 0.25 200)',
      accent: 'oklch(0.70 0.30 60)',
      border: 'oklch(0.20 0.02 250)',
    },
    fonts: BASE_FONTS,
    layout: { ...BASE_LAYOUT, shadowSm: '0 1px 3px rgba(0,0,0,0.30)', shadowMd: '0 4px 6px rgba(0,0,0,0.30)', shadowLg: '0 10px 15px rgba(0,0,0,0.30)' },
    branding: BASE_BRANDING,
    background: { ...DEFAULT_BACKGROUND },
    version: '2.0.0',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'base-light',
    name: '基础色调',
    nameEn: 'Base Light',
    type: 'light',
    colors: {
      primary: 'oklch(0.55 0.22 264)',
      secondary: 'oklch(0.65 0.15 200)',
      accent: 'oklch(0.60 0.25 30)',
      background: 'oklch(0.98 0.01 264)',
      card: 'oklch(1.00 0.00 0)',
      popover: 'oklch(1.00 0.00 0)',
      muted: 'oklch(0.95 0.02 264)',
      destructive: 'oklch(0.55 0.22 25)',
      border: 'oklch(0.85 0.02 264)',
      input: 'oklch(1.00 0.00 0)',
    },
    foreground: {
      primary: 'oklch(0.98 0.01 264)',
      secondary: 'oklch(0.98 0.01 200)',
      accent: 'oklch(0.98 0.01 30)',
      background: 'oklch(0.15 0.02 264)',
      card: 'oklch(0.15 0.02 264)',
      popover: 'oklch(0.15 0.02 264)',
      muted: 'oklch(0.40 0.02 264)',
      destructive: 'oklch(0.98 0.01 25)',
      border: 'oklch(0.15 0.02 264)',
      input: 'oklch(0.15 0.02 264)',
    },
    chart: {
      chart1: '#2563eb', chart2: '#f97316', chart3: '#0891b2',
      chart4: '#16a34a', chart5: '#dc2626', chart6: '#7c3aed',
    },
    sidebar: {
      background: 'oklch(0.95 0.02 264)',
      primary: 'oklch(0.55 0.22 264)',
      accent: 'oklch(0.60 0.25 30)',
      border: 'oklch(0.85 0.02 264)',
    },
    fonts: BASE_FONTS,
    layout: BASE_LAYOUT,
    branding: BASE_BRANDING,
    background: { type: 'color', value: '#f5f5f8', opacity: 100, blur: 0, position: 'center center', size: 'cover' },
    version: '2.0.0',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'cosmic-night',
    name: '宇宙之夜',
    nameEn: 'Cosmic Night',
    type: 'dark',
    colors: {
      primary: 'oklch(0.65 0.22 264)',
      secondary: 'oklch(0.70 0.15 200)',
      accent: 'oklch(0.68 0.25 30)',
      background: 'oklch(0.15 0.02 264)',
      card: 'oklch(0.20 0.02 264)',
      popover: 'oklch(0.20 0.02 264)',
      muted: 'oklch(0.25 0.02 264)',
      destructive: 'oklch(0.55 0.22 25)',
      border: 'oklch(0.30 0.02 264)',
      input: 'oklch(0.22 0.02 264)',
    },
    foreground: {
      primary: 'oklch(0.98 0.01 264)',
      secondary: 'oklch(0.98 0.01 200)',
      accent: 'oklch(0.98 0.01 30)',
      background: 'oklch(0.92 0.01 264)',
      card: 'oklch(0.92 0.01 264)',
      popover: 'oklch(0.92 0.01 264)',
      muted: 'oklch(0.60 0.02 264)',
      destructive: 'oklch(0.98 0.01 25)',
      border: 'oklch(0.60 0.02 264)',
      input: 'oklch(0.92 0.01 264)',
    },
    chart: {
      chart1: '#3b82f6', chart2: '#f59e0b', chart3: '#06b6d4',
      chart4: '#10b981', chart5: '#ef4444', chart6: '#8b5cf6',
    },
    sidebar: {
      background: 'oklch(0.12 0.02 264)',
      primary: 'oklch(0.65 0.22 264)',
      accent: 'oklch(0.68 0.25 30)',
      border: 'oklch(0.25 0.02 264)',
    },
    fonts: BASE_FONTS,
    layout: { ...BASE_LAYOUT, shadowSm: '0 1px 3px rgba(0,0,0,0.25)', shadowMd: '0 4px 6px rgba(0,0,0,0.25)', shadowLg: '0 10px 15px rgba(0,0,0,0.25)' },
    branding: BASE_BRANDING,
    background: { type: 'color', value: '#0f1729', opacity: 100, blur: 0, position: 'center center', size: 'cover' },
    version: '2.0.0',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'soft-pop',
    name: '柔和流行',
    nameEn: 'Soft Pop',
    type: 'light',
    colors: {
      primary: 'oklch(0.70 0.18 320)',
      secondary: 'oklch(0.75 0.15 180)',
      accent: 'oklch(0.72 0.20 40)',
      background: 'oklch(0.97 0.01 320)',
      card: 'oklch(1.00 0.00 0)',
      popover: 'oklch(1.00 0.00 0)',
      muted: 'oklch(0.94 0.02 320)',
      destructive: 'oklch(0.55 0.22 25)',
      border: 'oklch(0.88 0.01 320)',
      input: 'oklch(1.00 0.00 0)',
    },
    foreground: {
      primary: 'oklch(0.98 0.01 320)',
      secondary: 'oklch(0.98 0.01 180)',
      accent: 'oklch(0.98 0.01 40)',
      background: 'oklch(0.20 0.02 320)',
      card: 'oklch(0.20 0.02 320)',
      popover: 'oklch(0.20 0.02 320)',
      muted: 'oklch(0.45 0.02 320)',
      destructive: 'oklch(0.98 0.01 25)',
      border: 'oklch(0.20 0.02 320)',
      input: 'oklch(0.20 0.02 320)',
    },
    chart: {
      chart1: '#d946ef', chart2: '#06b6d4', chart3: '#f97316',
      chart4: '#84cc16', chart5: '#f43e5c', chart6: '#a78bfa',
    },
    sidebar: {
      background: 'oklch(0.94 0.02 320)',
      primary: 'oklch(0.70 0.18 320)',
      accent: 'oklch(0.72 0.20 40)',
      border: 'oklch(0.88 0.01 320)',
    },
    fonts: BASE_FONTS,
    layout: { ...BASE_LAYOUT, radiusSm: '12px', radiusMd: '16px', radiusLg: '20px', radiusXl: '28px' },
    branding: BASE_BRANDING,
    background: { type: 'color', value: '#faf5ff', opacity: 100, blur: 0, position: 'center center', size: 'cover' },
    version: '2.0.0',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'modern-minimal',
    name: '现代极简',
    nameEn: 'Modern Minimal',
    type: 'light',
    colors: {
      primary: 'oklch(0.30 0.00 0)',
      secondary: 'oklch(0.50 0.00 0)',
      accent: 'oklch(0.40 0.00 0)',
      background: 'oklch(0.98 0.00 0)',
      card: 'oklch(1.00 0.00 0)',
      popover: 'oklch(1.00 0.00 0)',
      muted: 'oklch(0.94 0.00 0)',
      destructive: 'oklch(0.55 0.22 25)',
      border: 'oklch(0.90 0.00 0)',
      input: 'oklch(1.00 0.00 0)',
    },
    foreground: {
      primary: 'oklch(0.98 0.00 0)',
      secondary: 'oklch(0.98 0.00 0)',
      accent: 'oklch(0.98 0.00 0)',
      background: 'oklch(0.15 0.00 0)',
      card: 'oklch(0.15 0.00 0)',
      popover: 'oklch(0.15 0.00 0)',
      muted: 'oklch(0.50 0.00 0)',
      destructive: 'oklch(0.98 0.01 25)',
      border: 'oklch(0.15 0.00 0)',
      input: 'oklch(0.15 0.00 0)',
    },
    chart: {
      chart1: '#18181b', chart2: '#71717a', chart3: '#a1a1aa',
      chart4: '#3f3f46', chart5: '#52525b', chart6: '#d4d4d8',
    },
    sidebar: {
      background: 'oklch(0.96 0.00 0)',
      primary: 'oklch(0.30 0.00 0)',
      accent: 'oklch(0.40 0.00 0)',
      border: 'oklch(0.90 0.00 0)',
    },
    fonts: BASE_FONTS,
    layout: { ...BASE_LAYOUT, radiusSm: '4px', radiusMd: '6px', radiusLg: '8px', radiusXl: '12px' },
    branding: BASE_BRANDING,
    background: { type: 'color', value: '#fafafa', opacity: 100, blur: 0, position: 'center center', size: 'cover' },
    version: '2.0.0',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'future-tech',
    name: '未来科技',
    nameEn: 'Future Tech',
    type: 'dark',
    colors: {
      primary: 'oklch(0.55 0.25 200)',
      secondary: 'oklch(0.60 0.20 160)',
      accent: 'oklch(0.65 0.30 280)',
      background: 'oklch(0.12 0.02 200)',
      card: 'oklch(0.18 0.02 200)',
      popover: 'oklch(0.18 0.02 200)',
      muted: 'oklch(0.22 0.02 200)',
      destructive: 'oklch(0.55 0.22 25)',
      border: 'oklch(0.28 0.02 200)',
      input: 'oklch(0.20 0.02 200)',
    },
    foreground: {
      primary: 'oklch(0.98 0.01 200)',
      secondary: 'oklch(0.98 0.01 160)',
      accent: 'oklch(0.98 0.01 280)',
      background: 'oklch(0.90 0.01 200)',
      card: 'oklch(0.90 0.01 200)',
      popover: 'oklch(0.90 0.01 200)',
      muted: 'oklch(0.60 0.02 200)',
      destructive: 'oklch(0.98 0.01 25)',
      border: 'oklch(0.60 0.02 200)',
      input: 'oklch(0.90 0.01 200)',
    },
    chart: {
      chart1: '#0ea5e9', chart2: '#14b8a6', chart3: '#a855f7',
      chart4: '#22c55e', chart5: '#f43f5e', chart6: '#f59e0b',
    },
    sidebar: {
      background: 'oklch(0.10 0.02 200)',
      primary: 'oklch(0.55 0.25 200)',
      accent: 'oklch(0.65 0.30 280)',
      border: 'oklch(0.22 0.02 200)',
    },
    fonts: BASE_FONTS,
    layout: { ...BASE_LAYOUT, shadowSm: '0 1px 3px rgba(0,0,0,0.30)', shadowMd: '0 4px 6px rgba(0,0,0,0.30)', shadowLg: '0 10px 15px rgba(0,0,0,0.30)' },
    branding: BASE_BRANDING,
    background: { type: 'color', value: '#0c1524', opacity: 100, blur: 0, position: 'center center', size: 'cover' },
    version: '2.0.0',
    createdAt: now(),
    updatedAt: now(),
  },
];

// ===== WCAG 对比度工具 =====
export function parseOklch(oklch: string): { l: number; c: number; h: number } | null {
  const match = oklch.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!match) return null;
  return { l: parseFloat(match[1]), c: parseFloat(match[2]), h: parseFloat(match[3]) };
}

export function getRelativeLuminance(oklchStr: string): number {
  const parsed = parseOklch(oklchStr);
  if (!parsed) return 0.5;
  return Math.pow(parsed.l, 2.2);
}

export function getContrastRatio(fg: string, bg: string): number {
  const l1 = getRelativeLuminance(fg);
  const l2 = getRelativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function getWCAGLevel(ratio: number): { level: string; pass: boolean } {
  if (ratio >= 7) return { level: 'AAA', pass: true };
  if (ratio >= 4.5) return { level: 'AA', pass: true };
  if (ratio >= 3) return { level: 'AA Large', pass: true };
  return { level: 'Fail', pass: false };
}

// ===== IndexedDB 字体存储 =====
const IDB_NAME = 'yyc3_theme_fonts';
const IDB_STORE = 'fonts';
const IDB_VERSION = 1;

function openFontDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function loadCustomFonts(): Promise<CustomFont[]> {
  try {
    const db = await openFontDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch { return []; }
}

async function saveCustomFont(font: CustomFont): Promise<void> {
  const db = await openFontDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    store.put(font);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function deleteCustomFont(id: string): Promise<void> {
  const db = await openFontDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Inject @font-face into document
function injectFontFace(font: CustomFont) {
  const existing = document.getElementById(`yyc3-font-${font.id}`);
  if (existing) existing.remove();
  const style = document.createElement('style');
  style.id = `yyc3-font-${font.id}`;
  style.textContent = `
    @font-face {
      font-family: '${font.family}';
      src: url('${font.dataUrl}') format('${font.format === '.woff2' ? 'woff2' : font.format === '.woff' ? 'woff' : font.format === '.otf' ? 'opentype' : 'truetype'}');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
}

// ===== 主题 Context =====
interface ThemeContextType {
  currentTheme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
  applyPreset: (presetId: string) => void;
  updateColors: (colors: Partial<ThemeColors>) => void;
  updateForeground: (fg: Partial<ThemeColorsForeground>) => void;
  updateFonts: (fonts: Partial<ThemeFonts>) => void;
  updateLayout: (layout: Partial<ThemeLayout>) => void;
  updateBranding: (branding: Partial<ThemeBranding>) => void;
  updateBackground: (bg: Partial<ThemeBackground>) => void;
  exportTheme: () => string;
  importTheme: (json: string) => boolean;
  resetToDefault: () => void;
  themeHistory: ThemeConfig[];
  undoTheme: () => void;
  // Font upload
  customFonts: CustomFont[];
  uploadFont: (file: File, tier: 'sans' | 'serif' | 'mono') => Promise<boolean>;
  removeFont: (id: string) => Promise<void>;
  // Snapshots / versioning
  snapshots: ThemeSnapshot[];
  createSnapshot: (name: string) => void;
  restoreSnapshot: (id: string) => void;
  deleteSnapshot: (id: string) => void;
}

const STORAGE_KEY = 'yyc3_theme_config';
const HISTORY_KEY = 'yyc3_theme_history';
const SNAPSHOT_KEY = 'yyc3_theme_snapshots';
const MAX_HISTORY = 30;
const MAX_SNAPSHOTS = 50;

const DEFAULT_THEME = PRESET_THEMES[0];

function loadTheme(): ThemeConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure background field exists for older saved configs
      if (!parsed.background) parsed.background = DEFAULT_BACKGROUND;
      return parsed;
    }
  } catch { /* ignore */ }
  return DEFAULT_THEME;
}

function saveTheme(theme: ThemeConfig) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(theme)); } catch { /* ignore */ }
}

function loadHistory(): ThemeConfig[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

function saveHistory(history: ThemeConfig[]) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-MAX_HISTORY))); } catch { /* ignore */ }
}

function loadSnapshots(): ThemeSnapshot[] {
  try {
    const stored = localStorage.getItem(SNAPSHOT_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

function saveSnapshots(snaps: ThemeSnapshot[]) {
  try { localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snaps.slice(-MAX_SNAPSHOTS))); } catch { /* ignore */ }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(loadTheme);
  const [themeHistory, setThemeHistory] = useState<ThemeConfig[]>(loadHistory);
  const [customFonts, setCustomFonts] = useState<CustomFont[]>([]);
  const [snapshots, setSnapshots] = useState<ThemeSnapshot[]>(loadSnapshots);

  // Load custom fonts from IndexedDB on mount
  useEffect(() => {
    loadCustomFonts().then(fonts => {
      setCustomFonts(fonts);
      fonts.forEach(f => injectFontFace(f));
    });
  }, []);

  // Apply CSS variables whenever theme changes
  useEffect(() => {
    applyThemeToDOM(currentTheme);
    saveTheme(currentTheme);
  }, [currentTheme]);

  const pushHistory = useCallback((theme: ThemeConfig) => {
    setThemeHistory(prev => {
      const next = [...prev, theme].slice(-MAX_HISTORY);
      saveHistory(next);
      return next;
    });
  }, []);

  const setTheme = useCallback((theme: ThemeConfig) => {
    pushHistory(currentTheme);
    setCurrentTheme({ ...theme, updatedAt: new Date().toISOString() });
  }, [currentTheme, pushHistory]);

  const applyPreset = useCallback((presetId: string) => {
    const preset = PRESET_THEMES.find(p => p.id === presetId);
    if (preset) setTheme(preset);
  }, [setTheme]);

  const updateColors = useCallback((colors: Partial<ThemeColors>) => {
    setTheme({ ...currentTheme, colors: { ...currentTheme.colors, ...colors } });
  }, [currentTheme, setTheme]);

  const updateForeground = useCallback((fg: Partial<ThemeColorsForeground>) => {
    setTheme({ ...currentTheme, foreground: { ...currentTheme.foreground, ...fg } });
  }, [currentTheme, setTheme]);

  const updateFonts = useCallback((fonts: Partial<ThemeFonts>) => {
    setTheme({ ...currentTheme, fonts: { ...currentTheme.fonts, ...fonts } });
  }, [currentTheme, setTheme]);

  const updateLayout = useCallback((layout: Partial<ThemeLayout>) => {
    setTheme({ ...currentTheme, layout: { ...currentTheme.layout, ...layout } });
  }, [currentTheme, setTheme]);

  const updateBranding = useCallback((branding: Partial<ThemeBranding>) => {
    setTheme({ ...currentTheme, branding: { ...currentTheme.branding, ...branding } });
  }, [currentTheme, setTheme]);

  const updateBackground = useCallback((bg: Partial<ThemeBackground>) => {
    const curBg = currentTheme.background || DEFAULT_BACKGROUND;
    setTheme({ ...currentTheme, background: { ...curBg, ...bg } });
  }, [currentTheme, setTheme]);

  const exportTheme = useCallback(() => JSON.stringify(currentTheme, null, 2), [currentTheme]);

  const importTheme = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json) as ThemeConfig;
      if (!parsed.colors || !parsed.id) return false;
      if (!parsed.background) parsed.background = DEFAULT_BACKGROUND;
      setTheme(parsed);
      return true;
    } catch { return false; }
  }, [setTheme]);

  const resetToDefault = useCallback(() => {
    pushHistory(currentTheme);
    setCurrentTheme(DEFAULT_THEME);
  }, [currentTheme, pushHistory]);

  const undoTheme = useCallback(() => {
    if (themeHistory.length === 0) return;
    const prev = themeHistory[themeHistory.length - 1];
    setThemeHistory(h => { const next = h.slice(0, -1); saveHistory(next); return next; });
    setCurrentTheme(prev);
  }, [themeHistory]);

  // Font upload
  const uploadFont = useCallback(async (file: File, tier: 'sans' | 'serif' | 'mono'): Promise<boolean> => {
    if (file.size > 5 * 1024 * 1024) return false; // 5MB limit
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!['.ttf', '.otf', '.woff', '.woff2'].includes(ext)) return false;
    if (customFonts.length >= 20) return false; // 20 font limit

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        const fontName = file.name.replace(/\.(ttf|otf|woff|woff2)$/i, '').replace(/[^a-zA-Z0-9\-_ ]/g, '');
        const fontFamily = `yyc3-custom-${fontName}`;
        const font: CustomFont = {
          id: `font-${Date.now()}`,
          name: fontName,
          family: fontFamily,
          format: ext,
          dataUrl,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          tier,
        };
        try {
          await saveCustomFont(font);
          injectFontFace(font);
          setCustomFonts(prev => [...prev, font]);
          resolve(true);
        } catch { resolve(false); }
      };
      reader.onerror = () => resolve(false);
      reader.readAsDataURL(file);
    });
  }, [customFonts]);

  const removeFont = useCallback(async (id: string) => {
    await deleteCustomFont(id);
    const styleEl = document.getElementById(`yyc3-font-${id}`);
    if (styleEl) styleEl.remove();
    setCustomFonts(prev => prev.filter(f => f.id !== id));
  }, []);

  // Snapshots
  const createSnapshot = useCallback((name: string) => {
    const snap: ThemeSnapshot = {
      id: `snap-${Date.now()}`,
      name,
      timestamp: new Date().toISOString(),
      theme: { ...currentTheme },
    };
    setSnapshots(prev => {
      const next = [...prev, snap].slice(-MAX_SNAPSHOTS);
      saveSnapshots(next);
      return next;
    });
  }, [currentTheme]);

  const restoreSnapshot = useCallback((id: string) => {
    const snap = snapshots.find(s => s.id === id);
    if (snap) setTheme(snap.theme);
  }, [snapshots, setTheme]);

  const deleteSnapshot = useCallback((id: string) => {
    setSnapshots(prev => {
      const next = prev.filter(s => s.id !== id);
      saveSnapshots(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{
      currentTheme, setTheme, applyPreset,
      updateColors, updateForeground, updateFonts, updateLayout, updateBranding, updateBackground,
      exportTheme, importTheme, resetToDefault, themeHistory, undoTheme,
      customFonts, uploadFont, removeFont,
      snapshots, createSnapshot, restoreSnapshot, deleteSnapshot,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

// ===== Apply theme CSS variables to DOM =====
function applyThemeToDOM(theme: ThemeConfig) {
  const root = document.documentElement;
  const s = root.style;

  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    s.setProperty(`--theme-${key}`, value);
  });
  Object.entries(theme.foreground).forEach(([key, value]) => {
    s.setProperty(`--theme-${key}-fg`, value);
  });
  Object.entries(theme.chart).forEach(([key, value]) => {
    s.setProperty(`--theme-${key}`, value);
  });
  Object.entries(theme.sidebar).forEach(([key, value]) => {
    s.setProperty(`--theme-sidebar-${key}`, value);
  });

  // Fonts
  s.setProperty('--theme-font-sans', theme.fonts.sans);
  s.setProperty('--theme-font-serif', theme.fonts.serif);
  s.setProperty('--theme-font-mono', theme.fonts.mono);

  // Layout
  s.setProperty('--theme-radius-sm', theme.layout.radiusSm);
  s.setProperty('--theme-radius-md', theme.layout.radiusMd);
  s.setProperty('--theme-radius-lg', theme.layout.radiusLg);
  s.setProperty('--theme-radius-xl', theme.layout.radiusXl);
  s.setProperty('--theme-shadow-sm', theme.layout.shadowSm);
  s.setProperty('--theme-shadow-md', theme.layout.shadowMd);
  s.setProperty('--theme-shadow-lg', theme.layout.shadowLg);

  // Background
  const bg = theme.background || { type: 'color', value: '#0a0f1c', opacity: 100, blur: 0, position: 'center center', size: 'cover' };
  s.setProperty('--theme-bg-color', bg.type === 'color' ? bg.value : 'transparent');
  s.setProperty('--theme-bg-image', bg.type === 'image' ? `url(${bg.value})` : 'none');
  s.setProperty('--theme-bg-opacity', String(bg.opacity / 100));
  s.setProperty('--theme-bg-blur', `${bg.blur}px`);
  s.setProperty('--theme-bg-position', bg.position);
  s.setProperty('--theme-bg-size', bg.size);

  // Theme type data attribute
  root.setAttribute('data-theme-type', theme.type);
  root.setAttribute('data-theme-id', theme.id);
}