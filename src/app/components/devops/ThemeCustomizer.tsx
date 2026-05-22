/**
 * YYC3 Theme Customizer — 自定义主题定制器 v2 (Phase 5.5)
 * 
 * 功能: 颜色编辑、字体配置+上传、布局调整、品牌定制、背景管理、
 *       预设主题、导入导出、对比度检测、版本对比、实时预览
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Palette, Type, Layout, Image, Download, Upload, RotateCcw,
  Check, Sun, Moon, Eye, Contrast, Copy, Undo2,
  Sparkles, AlertTriangle, CheckCircle, Settings2,
  ImageIcon, History, Trash2, Plus, Save,
} from 'lucide-react';
import { FuturisticPanel } from '../FuturisticPanel';
import { useLanguage } from '../LanguageContext';
import type { ThemeConfig, ThemeColors, ThemeColorsForeground} from '../ThemeContext';
import {
  useTheme, PRESET_THEMES,
  getContrastRatio, getWCAGLevel, parseOklch,
} from '../ThemeContext';
import { toast } from 'sonner';

// ===== Tabs =====
type TabId = 'presets' | 'colors' | 'fonts' | 'layout' | 'branding' | 'background' | 'accessibility' | 'snapshots' | 'export';

const TABS: { id: TabId; label: string; labelEn: string; icon: React.ReactNode }[] = [
  { id: 'presets', label: '预设主题', labelEn: 'Presets', icon: <Sparkles size={16} /> },
  { id: 'colors', label: '颜色系统', labelEn: 'Colors', icon: <Palette size={16} /> },
  { id: 'fonts', label: '字体排版', labelEn: 'Typography', icon: <Type size={16} /> },
  { id: 'layout', label: '布局系统', labelEn: 'Layout', icon: <Layout size={16} /> },
  { id: 'branding', label: '品牌元素', labelEn: 'Branding', icon: <Image size={16} /> },
  { id: 'background', label: '背景定制', labelEn: 'Background', icon: <ImageIcon size={16} /> },
  { id: 'accessibility', label: '无障碍', labelEn: 'A11y', icon: <Contrast size={16} /> },
  { id: 'snapshots', label: '版本管理', labelEn: 'Versions', icon: <History size={16} /> },
  { id: 'export', label: '导入/导出', labelEn: 'Import/Export', icon: <Download size={16} /> },
];

const COLOR_LABELS: Record<keyof ThemeColors, { zh: string; en: string }> = {
  primary: { zh: '主色', en: 'Primary' },
  secondary: { zh: '次色', en: 'Secondary' },
  accent: { zh: '强调色', en: 'Accent' },
  background: { zh: '背景色', en: 'Background' },
  card: { zh: '卡片色', en: 'Card' },
  popover: { zh: '弹窗色', en: 'Popover' },
  muted: { zh: '柔和色', en: 'Muted' },
  destructive: { zh: '破坏性', en: 'Destructive' },
  border: { zh: '边框色', en: 'Border' },
  input: { zh: '输入色', en: 'Input' },
};

// ===== Main Component =====
export function ThemeCustomizer() {
  const { language } = useLanguage();
  const isZh = language === 'zh';
  const theme = useTheme();
  const { currentTheme } = theme;
  const [activeTab, setActiveTab] = useState<TabId>('presets');

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl text-white flex items-center gap-3" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            <Palette className="text-cyan-400" size={28} />
            {isZh ? '自定义主题系统' : 'Theme Customization System'}
          </h1>
          <p className="text-gray-400 mt-1 text-sm" style={{ fontSize: '0.875rem' }}>
            {isZh
              ? `当前: ${currentTheme.name} (${currentTheme.type === 'dark' ? '深色' : '浅色'}) · v${currentTheme.version}`
              : `Current: ${currentTheme.nameEn} (${currentTheme.type}) · v${currentTheme.version}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { theme.undoTheme(); toast.success(isZh ? '已撤销' : 'Undone'); }}
            disabled={theme.themeHistory.length === 0}
            className="px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm flex items-center gap-1.5" style={{ fontSize: '0.8rem' }}>
            <Undo2 size={14} /> {isZh ? '撤销' : 'Undo'}
          </button>
          <button onClick={() => { theme.resetToDefault(); toast.success(isZh ? '已重置' : 'Reset'); }}
            className="px-3 py-2 rounded-lg bg-gray-800/60 border border-gray-700 text-gray-300 hover:text-white hover:border-orange-500/50 transition-all text-sm flex items-center gap-1.5" style={{ fontSize: '0.8rem' }}>
            <RotateCcw size={14} /> {isZh ? '重置' : 'Reset'}
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-gray-900/60 p-1 rounded-xl border border-gray-800 overflow-x-auto shrink-0">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-transparent'}`}
            style={{ fontSize: '0.8rem' }}>
            {tab.icon} {isZh ? tab.label : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            {activeTab === 'presets' && <PresetsTab />}
            {activeTab === 'colors' && <ColorsTab />}
            {activeTab === 'fonts' && <FontsTab />}
            {activeTab === 'layout' && <LayoutTab />}
            {activeTab === 'branding' && <BrandingTab />}
            {activeTab === 'background' && <BackgroundTab />}
            {activeTab === 'accessibility' && <AccessibilityTab />}
            {activeTab === 'snapshots' && <SnapshotsTab />}
            {activeTab === 'export' && <ExportTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ===== Presets Tab =====
function PresetsTab() {
  const { language } = useLanguage();
  const isZh = language === 'zh';
  const { currentTheme, applyPreset } = useTheme();

  return (
    <div className="space-y-4">
      <FuturisticPanel title={isZh ? '预设主题库' : 'Preset Theme Library'} subtitle={isZh ? '6 个精心设计的主题' : '6 carefully designed themes'} icon={<Sparkles size={16} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {PRESET_THEMES.map(preset => {
            const isActive = currentTheme.id === preset.id;
            return (
              <motion.button key={preset.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { applyPreset(preset.id); toast.success(isZh ? `已应用: ${preset.name}` : `Applied: ${preset.nameEn}`); }}
                className={`relative p-4 rounded-xl border text-left transition-all ${isActive ? 'border-cyan-500/60 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'border-gray-700 bg-gray-900/40 hover:border-gray-600'}`}>
                {isActive && <div className="absolute top-2 right-2"><Check size={16} className="text-cyan-400" /></div>}
                <div className="flex gap-1 mb-3">
                  {[preset.colors.primary, preset.colors.secondary, preset.colors.accent, preset.colors.background, preset.colors.card, preset.colors.border].map((c, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border border-white/20" style={{ background: c }} />
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  {preset.type === 'dark' ? <Moon size={14} className="text-indigo-400" /> : <Sun size={14} className="text-amber-400" />}
                  <span className="text-white text-sm" style={{ fontSize: '0.875rem', fontWeight: 600 }}>{isZh ? preset.name : preset.nameEn}</span>
                </div>
                <span className="text-xs text-gray-500" style={{ fontSize: '0.7rem' }}>{preset.type === 'dark' ? (isZh ? '深色' : 'Dark') : (isZh ? '浅色' : 'Light')}</span>
              </motion.button>
            );
          })}
        </div>
      </FuturisticPanel>
      <FuturisticPanel title={isZh ? '实时预览' : 'Live Preview'} icon={<Eye size={16} />}>
        <ThemePreviewCard theme={currentTheme} />
      </FuturisticPanel>
    </div>
  );
}

// ===== Colors Tab =====
function ColorsTab() {
  const { language } = useLanguage();
  const isZh = language === 'zh';
  const { currentTheme, updateColors, updateForeground } = useTheme();

  return (
    <div className="space-y-4">
      <FuturisticPanel title={isZh ? '背景颜色' : 'Background Colors'} subtitle="OKLch" icon={<Palette size={16} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(Object.keys(COLOR_LABELS) as (keyof ThemeColors)[]).map(key => (
            <ColorEditor key={key} label={isZh ? COLOR_LABELS[key].zh : COLOR_LABELS[key].en} value={currentTheme.colors[key]} onChange={v => updateColors({ [key]: v })} />
          ))}
        </div>
      </FuturisticPanel>
      <FuturisticPanel title={isZh ? '前景颜色' : 'Foreground Colors'} icon={<Palette size={16} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(Object.keys(COLOR_LABELS) as (keyof ThemeColorsForeground)[]).map(key => (
            <ColorEditor key={`fg-${key}`} label={`${isZh ? COLOR_LABELS[key].zh : COLOR_LABELS[key].en} (fg)`} value={currentTheme.foreground[key]} onChange={v => updateForeground({ [key]: v })} />
          ))}
        </div>
      </FuturisticPanel>
      <FuturisticPanel title={isZh ? '图表颜色' : 'Chart Colors'} icon={<Palette size={16} />}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(currentTheme.chart).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 p-2 bg-gray-900/40 rounded-lg border border-gray-800">
              <div className="w-8 h-8 rounded-lg border border-white/20 shrink-0" style={{ background: value }} />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-400 truncate" style={{ fontSize: '0.7rem' }}>{key}</div>
                <div className="text-xs text-gray-500 font-mono truncate" style={{ fontSize: '0.65rem' }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </FuturisticPanel>
    </div>
  );
}

// ===== Fonts Tab (with upload) =====
function FontsTab() {
  const { language } = useLanguage();
  const isZh = language === 'zh';
  const { currentTheme, updateFonts, customFonts, uploadFont, removeFont } = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadTier, setUploadTier] = useState<'sans' | 'serif' | 'mono'>('sans');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ok = await uploadFont(file, uploadTier);
    if (ok) {
      toast.success(isZh ? `字体 "${file.name}" 上传成功` : `Font "${file.name}" uploaded`);
    } else {
      toast.error(isZh ? '字体上传失败(格式/大小不符)' : 'Upload failed (format/size)');
    }
    e.target.value = '';
  };

  const fontOptions = [
    { value: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", label: 'Inter (Default)' },
    { value: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", label: 'Segoe UI' },
    { value: "system-ui, -apple-system, sans-serif", label: 'System UI' },
    ...customFonts.filter(f => f.tier === 'sans').map(f => ({ value: `'${f.family}', sans-serif`, label: `${f.name} (custom)` })),
  ];
  const monoOptions = [
    { value: "'Fira Code', 'Courier New', monospace", label: 'Fira Code (Default)' },
    { value: "'Consolas', 'Monaco', monospace", label: 'Consolas' },
    ...customFonts.filter(f => f.tier === 'mono').map(f => ({ value: `'${f.family}', monospace`, label: `${f.name} (custom)` })),
  ];
  const serifOptions = [
    { value: "Georgia, 'Times New Roman', Times, serif", label: 'Georgia (Default)' },
    { value: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", label: 'Palatino' },
    ...customFonts.filter(f => f.tier === 'serif').map(f => ({ value: `'${f.family}', serif`, label: `${f.name} (custom)` })),
  ];

  return (
    <div className="space-y-4">
      <FuturisticPanel title={isZh ? '字体配置' : 'Font Configuration'} icon={<Type size={16} />}>
        <div className="space-y-5">
          {[{ key: 'sans' as const, label: isZh ? '无衬线 (Sans)' : 'Sans-serif', opts: fontOptions },
            { key: 'mono' as const, label: isZh ? '等宽 (Mono)' : 'Monospace', opts: monoOptions },
            { key: 'serif' as const, label: isZh ? '衬线 (Serif)' : 'Serif', opts: serifOptions }].map(item => (
            <div key={item.key}>
              <label className="text-sm text-gray-300 mb-2 block" style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.label}</label>
              <select value={currentTheme.fonts[item.key]} onChange={e => updateFonts({ [item.key]: e.target.value })}
                className="w-full bg-gray-900/60 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" style={{ fontSize: '0.8rem' }}>
                {item.opts.map(o => <option key={o.label} value={o.value}>{o.label}</option>)}
              </select>
              <p className="text-xs text-gray-500 mt-1.5" style={{ fontFamily: currentTheme.fonts[item.key], fontSize: '0.75rem' }}>
                {item.key === 'mono' ? 'const yyc3 = "CloudPivot";' : isZh ? '预览: 言启象限 ABCDEFG 0123' : 'Preview: Quick brown fox 0123'}
              </p>
            </div>
          ))}
        </div>
      </FuturisticPanel>

      {/* Font Upload */}
      <FuturisticPanel title={isZh ? '字体上传' : 'Font Upload'} subtitle={isZh ? `已上传 ${customFonts.length}/20` : `Uploaded ${customFonts.length}/20`} icon={<Upload size={16} />}>
        <div className="space-y-3">
          <p className="text-xs text-gray-400" style={{ fontSize: '0.75rem' }}>
            {isZh ? '支持 TTF/OTF/WOFF/WOFF2，单文件最大 5MB，通过 IndexedDB 本地存储' : 'TTF/OTF/WOFF/WOFF2 supported, max 5MB each, stored in IndexedDB'}
          </p>
          <div className="flex gap-2 items-center">
            <select value={uploadTier} onChange={e => setUploadTier(e.target.value as 'sans' | 'serif' | 'mono')}
              className="bg-gray-900/60 border border-gray-700 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-cyan-500" style={{ fontSize: '0.75rem' }}>
              <option value="sans">{isZh ? '无衬线' : 'Sans'}</option>
              <option value="serif">{isZh ? '衬线' : 'Serif'}</option>
              <option value="mono">{isZh ? '等宽' : 'Mono'}</option>
            </select>
            <input ref={fileRef} type="file" accept=".ttf,.otf,.woff,.woff2" className="hidden" onChange={handleUpload} />
            <button onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/20 border border-purple-500/40 rounded-lg text-purple-400 hover:bg-purple-600/30 transition-all text-xs" style={{ fontSize: '0.75rem' }}>
              <Upload size={12} /> {isZh ? '选择字体文件' : 'Choose Font'}
            </button>
          </div>
          {customFonts.length > 0 && (
            <div className="space-y-1.5">
              {customFonts.map(f => (
                <div key={f.id} className="flex items-center gap-2 p-2 bg-gray-900/40 rounded-lg border border-gray-800">
                  <Type size={14} className="text-purple-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-300 truncate" style={{ fontSize: '0.75rem' }}>{f.name}</div>
                    <div className="text-xs text-gray-500" style={{ fontSize: '0.6rem' }}>{f.tier} · {(f.size / 1024).toFixed(0)}KB · {f.format}</div>
                  </div>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-400" style={{ fontFamily: `'${f.family}'`, fontSize: '0.65rem' }}>Aa</span>
                  <button onClick={() => { removeFont(f.id); toast.success(isZh ? '已删除' : 'Removed'); }}
                    className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </FuturisticPanel>

      {/* Type Scale */}
      <FuturisticPanel title={isZh ? '字号规范预览' : 'Type Scale'} icon={<Type size={16} />}>
        <div className="space-y-2">
          {[{ size: '0.75rem', label: 'xs (12px)', weight: 400 }, { size: '0.875rem', label: 'sm (14px)', weight: 400 },
            { size: '1rem', label: 'base (16px)', weight: 400 }, { size: '1.125rem', label: 'lg (18px)', weight: 500 },
            { size: '1.25rem', label: 'xl (20px)', weight: 600 }, { size: '1.5rem', label: '2xl (24px)', weight: 600 },
            { size: '1.875rem', label: '3xl (30px)', weight: 700 }].map(item => (
            <div key={item.label} className="flex items-baseline gap-3 py-1">
              <span className="text-xs text-gray-500 w-24 shrink-0" style={{ fontSize: '0.65rem' }}>{item.label}</span>
              <span className="text-white" style={{ fontSize: item.size, fontWeight: item.weight, fontFamily: currentTheme.fonts.sans }}>
                {isZh ? 'YYC3 云枢智脑' : 'YYC3 Brain'}
              </span>
            </div>
          ))}
        </div>
      </FuturisticPanel>
    </div>
  );
}

// ===== Layout Tab =====
function LayoutTab() {
  const { language } = useLanguage();
  const isZh = language === 'zh';
  const { currentTheme, updateLayout } = useTheme();

  const radiusFields = [
    { key: 'radiusSm' as const, label: isZh ? '小圆角' : 'SM', desc: isZh ? '按钮' : 'Buttons' },
    { key: 'radiusMd' as const, label: isZh ? '中圆角' : 'MD', desc: isZh ? '卡片' : 'Cards' },
    { key: 'radiusLg' as const, label: isZh ? '大圆角' : 'LG', desc: isZh ? '面板' : 'Panels' },
    { key: 'radiusXl' as const, label: isZh ? '特大' : 'XL', desc: isZh ? '容器' : 'Containers' },
  ];

  return (
    <div className="space-y-4">
      <FuturisticPanel title={isZh ? '圆角系统' : 'Border Radius'} icon={<Layout size={16} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {radiusFields.map(f => (
            <div key={f.key} className="p-3 bg-gray-900/40 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm text-gray-300" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{f.label}</div>
                  <div className="text-xs text-gray-500" style={{ fontSize: '0.65rem' }}>{f.desc}</div>
                </div>
                <input type="text" value={currentTheme.layout[f.key]} onChange={e => updateLayout({ [f.key]: e.target.value })}
                  className="w-20 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-xs text-center focus:outline-none focus:border-cyan-500" style={{ fontSize: '0.75rem' }} />
              </div>
              <div className="h-12 bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-xs text-cyan-300"
                style={{ borderRadius: currentTheme.layout[f.key], fontSize: '0.7rem' }}>{currentTheme.layout[f.key]}</div>
            </div>
          ))}
        </div>
      </FuturisticPanel>
      <FuturisticPanel title={isZh ? '阴影系统' : 'Shadows'} icon={<Layout size={16} />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {([{ key: 'shadowSm' as const, label: 'SM' }, { key: 'shadowMd' as const, label: 'MD' }, { key: 'shadowLg' as const, label: 'LG' }]).map(s => (
            <div key={s.key} className="space-y-2">
              <label className="text-sm text-gray-300 block" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{s.label}</label>
              <div className="h-20 bg-gray-800 rounded-lg flex items-center justify-center text-xs text-gray-400"
                style={{ boxShadow: currentTheme.layout[s.key], borderRadius: currentTheme.layout.radiusMd, fontSize: '0.7rem' }}>{s.label}</div>
              <input type="text" value={currentTheme.layout[s.key]} onChange={e => updateLayout({ [s.key]: e.target.value })}
                className="w-full bg-gray-900/60 border border-gray-700 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-cyan-500" style={{ fontSize: '0.7rem' }} />
            </div>
          ))}
        </div>
      </FuturisticPanel>
      <FuturisticPanel title={isZh ? '间距参考' : 'Spacing Ref'} icon={<Layout size={16} />}>
        <div className="flex flex-wrap gap-3">
          {[{ n: '1', px: 4 }, { n: '2', px: 8 }, { n: '3', px: 12 }, { n: '4', px: 16 }, { n: '5', px: 20 }, { n: '6', px: 24 }, { n: '8', px: 32 }, { n: '10', px: 40 }, { n: '12', px: 48 }].map(sp => (
            <div key={sp.n} className="flex flex-col items-center gap-1">
              <div className="bg-cyan-500/30 border border-cyan-500/40" style={{ width: sp.px, height: sp.px, borderRadius: 2 }} />
              <span className="text-xs text-gray-500" style={{ fontSize: '0.6rem' }}>sp-{sp.n}</span>
              <span className="text-xs text-gray-600" style={{ fontSize: '0.55rem' }}>{sp.px}px</span>
            </div>
          ))}
        </div>
      </FuturisticPanel>
    </div>
  );
}

// ===== Branding Tab =====
function BrandingTab() {
  const { language } = useLanguage();
  const isZh = language === 'zh';
  const { currentTheme, updateBranding } = useTheme();

  return (
    <div className="space-y-4">
      <FuturisticPanel title={isZh ? '品牌配置' : 'Brand Config'} icon={<Image size={16} />}>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-1.5 block" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{isZh ? '应用名称' : 'App Name'}</label>
            <input type="text" maxLength={50} value={currentTheme.branding.appName} onChange={e => updateBranding({ appName: e.target.value })}
              className="w-full bg-gray-900/60 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" style={{ fontSize: '0.875rem' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[{ k: 'slogan' as const, l: isZh ? '中文标语' : 'Chinese Slogan', max: 50 },
              { k: 'sloganEn' as const, l: isZh ? '英文标语' : 'English Slogan', max: 100 },
              { k: 'subtitle' as const, l: isZh ? '中文副标语' : 'Chinese Subtitle', max: 100 },
              { k: 'subtitleEn' as const, l: isZh ? '英文副标语' : 'English Subtitle', max: 100 }].map(item => (
              <div key={item.k}>
                <label className="text-sm text-gray-300 mb-1.5 block" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{item.l}</label>
                <input type="text" maxLength={item.max} value={currentTheme.branding[item.k]} onChange={e => updateBranding({ [item.k]: e.target.value })}
                  className="w-full bg-gray-900/60 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" style={{ fontSize: '0.8rem' }} />
              </div>
            ))}
          </div>
        </div>
      </FuturisticPanel>
      <FuturisticPanel title={isZh ? '品牌预览' : 'Brand Preview'} icon={<Eye size={16} />}>
        <div className="p-6 rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900/80 to-gray-800/60 text-center space-y-2">
          <h2 className="text-xl text-white" style={{ fontSize: '1.25rem', fontWeight: 700 }}>{currentTheme.branding.appName}</h2>
          <p className="text-cyan-400 text-sm" style={{ fontSize: '0.875rem' }}>{isZh ? currentTheme.branding.slogan : currentTheme.branding.sloganEn}</p>
          <p className="text-gray-500 text-xs" style={{ fontSize: '0.75rem' }}>{isZh ? currentTheme.branding.subtitle : currentTheme.branding.subtitleEn}</p>
        </div>
      </FuturisticPanel>
    </div>
  );
}

// ===== Background Tab =====
function BackgroundTab() {
  const { language } = useLanguage();
  const isZh = language === 'zh';
  const { currentTheme, updateBackground } = useTheme();
  const bg = currentTheme.background || { type: 'color', value: '#0a0f1c', opacity: 100, blur: 0, position: 'center center', size: 'cover' };
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error(isZh ? '文件过大(最大5MB)' : 'File too large (max 5MB)'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateBackground({ type: 'image', value: ev.target?.result as string });
      toast.success(isZh ? '背景图片已设置' : 'Background image set');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) { toast.error(isZh ? '视频过大(最大20MB)' : 'Video too large (max 20MB)'); return; }
    if (!file.type.startsWith('video/')) { toast.error(isZh ? '仅支持视频文件' : 'Only video files'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateBackground({ type: 'video', value: ev.target?.result as string });
      toast.success(isZh ? '背景视频已设置' : 'Background video set');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <FuturisticPanel title={isZh ? '背景类型' : 'Background Type'} icon={<ImageIcon size={16} />}>
        <div className="space-y-4">
          <div className="flex gap-2">
            {(['color', 'image', 'video'] as const).map(t => (
              <button key={t} onClick={() => updateBackground({ type: t })}
                className={`px-4 py-2 rounded-lg border text-sm transition-all ${bg.type === t ? 'bg-cyan-600/20 border-cyan-500/40 text-cyan-400' : 'bg-gray-900/40 border-gray-700 text-gray-400 hover:text-white'}`}
                style={{ fontSize: '0.8rem' }}>
                {t === 'color' ? (isZh ? '纯色' : 'Color') : t === 'image' ? (isZh ? '图片' : 'Image') : (isZh ? '视频' : 'Video')}
              </button>
            ))}
          </div>

          {bg.type === 'color' && (
            <div>
              <label className="text-sm text-gray-300 mb-1.5 block" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{isZh ? '背景颜色 (HEX)' : 'Background Color (HEX)'}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={bg.value.startsWith('#') ? bg.value : '#0a0f1c'} onChange={e => updateBackground({ value: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-gray-700 bg-transparent" />
                <input type="text" value={bg.value} onChange={e => updateBackground({ value: e.target.value })}
                  className="flex-1 bg-gray-900/60 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" style={{ fontSize: '0.8rem' }} />
              </div>
            </div>
          )}

          {bg.type === 'image' && (
            <div className="space-y-3">
              <input ref={fileRef} type="file" accept="image/png,image/jpg,image/jpeg,image/webp" className="hidden" onChange={handleImageUpload} />
              <button onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 px-4 py-2 bg-purple-600/20 border border-purple-500/40 rounded-lg text-purple-400 hover:bg-purple-600/30 transition-all text-sm" style={{ fontSize: '0.8rem' }}>
                <Upload size={14} /> {isZh ? '上传背景图片' : 'Upload Image'}
              </button>
              <p className="text-xs text-gray-500" style={{ fontSize: '0.7rem' }}>{isZh ? 'PNG/JPG/WebP，最大 5MB' : 'PNG/JPG/WebP, max 5MB'}</p>
              {bg.value.startsWith('data:image') && (
                <div className="w-full h-32 rounded-lg border border-gray-700 overflow-hidden">
                  <img src={bg.value} alt="bg" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          )}

          {bg.type === 'video' && (
            <div className="space-y-3">
              <input ref={videoRef} type="file" accept="video/mp4,video/webm" className="hidden" onChange={handleVideoUpload} />
              <button onClick={() => videoRef.current?.click()}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600/20 border border-indigo-500/40 rounded-lg text-indigo-400 hover:bg-indigo-600/30 transition-all text-sm" style={{ fontSize: '0.8rem' }}>
                <Upload size={14} /> {isZh ? '上传背景视频' : 'Upload Video'}
              </button>
              <p className="text-xs text-gray-500" style={{ fontSize: '0.7rem' }}>{isZh ? 'MP4/WebM，最大 20MB，自动循环静音播放' : 'MP4/WebM, max 20MB, auto-loop muted'}</p>
              {bg.value.startsWith('data:video') && (
                <div className="w-full h-40 rounded-lg border border-gray-700 overflow-hidden">
                  <video src={bg.value} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-amber-400 flex items-center gap-1.5" style={{ fontSize: '0.7rem' }}>
                  <AlertTriangle size={12} />
                  {isZh ? '视频背景会增加内存消耗，建议使用短循环视频(10s内)' : 'Video bg increases memory usage, use short loops (<10s)'}
                </p>
              </div>
            </div>
          )}

          {/* Opacity & Blur */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block" style={{ fontSize: '0.7rem' }}>{isZh ? '透明度' : 'Opacity'}: {bg.opacity}%</label>
              <input type="range" min={0} max={100} value={bg.opacity} onChange={e => updateBackground({ opacity: Number(e.target.value) })}
                className="w-full accent-cyan-500" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block" style={{ fontSize: '0.7rem' }}>{isZh ? '模糊度' : 'Blur'}: {bg.blur}px</label>
              <input type="range" min={0} max={30} value={bg.blur} onChange={e => updateBackground({ blur: Number(e.target.value) })}
                className="w-full accent-cyan-500" />
            </div>
          </div>

          {/* Position & Size */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block" style={{ fontSize: '0.7rem' }}>{isZh ? '位置' : 'Position'}</label>
              <select value={bg.position} onChange={e => updateBackground({ position: e.target.value })}
                className="w-full bg-gray-900/60 border border-gray-700 rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-cyan-500" style={{ fontSize: '0.7rem' }}>
                {['center center', 'top center', 'bottom center', 'left center', 'right center'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block" style={{ fontSize: '0.7rem' }}>{isZh ? '大小' : 'Size'}</label>
              <select value={bg.size} onChange={e => updateBackground({ size: e.target.value })}
                className="w-full bg-gray-900/60 border border-gray-700 rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-cyan-500" style={{ fontSize: '0.7rem' }}>
                {['cover', 'contain', 'auto', '100% 100%'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      </FuturisticPanel>
    </div>
  );
}

// ===== Accessibility Tab =====
function AccessibilityTab() {
  const { language } = useLanguage();
  const isZh = language === 'zh';
  const { currentTheme } = useTheme();

  const checks = [
    { fg: 'primary (fg)', fgVal: currentTheme.foreground.primary, bg: 'primary', bgVal: currentTheme.colors.primary },
    { fg: 'background (fg)', fgVal: currentTheme.foreground.background, bg: 'background', bgVal: currentTheme.colors.background },
    { fg: 'card (fg)', fgVal: currentTheme.foreground.card, bg: 'card', bgVal: currentTheme.colors.card },
    { fg: 'muted (fg)', fgVal: currentTheme.foreground.muted, bg: 'muted', bgVal: currentTheme.colors.muted },
    { fg: 'destructive (fg)', fgVal: currentTheme.foreground.destructive, bg: 'destructive', bgVal: currentTheme.colors.destructive },
    { fg: 'accent (fg)', fgVal: currentTheme.foreground.accent, bg: 'accent', bgVal: currentTheme.colors.accent },
    { fg: 'background (fg)', fgVal: currentTheme.foreground.background, bg: 'card', bgVal: currentTheme.colors.card },
    { fg: 'background (fg)', fgVal: currentTheme.foreground.background, bg: 'muted', bgVal: currentTheme.colors.muted },
  ].map(c => { const r = getContrastRatio(c.fgVal, c.bgVal); const w = getWCAGLevel(r); return { ...c, ratio: r, ...w }; });

  const passCount = checks.filter(r => r.pass).length;
  const allPass = passCount === checks.length;

  return (
    <div className="space-y-4">
      <FuturisticPanel title={isZh ? 'WCAG 对比度检测' : 'WCAG Contrast Check'} subtitle={`${passCount}/${checks.length}`} icon={<Contrast size={16} />}>
        <div className={`p-3 rounded-lg border mb-4 flex items-center gap-2 ${allPass ? 'bg-green-500/10 border-green-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
          {allPass ? <CheckCircle size={18} className="text-green-400" /> : <AlertTriangle size={18} className="text-amber-400" />}
          <span className="text-sm" style={{ fontSize: '0.8rem', fontWeight: 500, color: allPass ? '#4ade80' : '#fbbf24' }}>
            {allPass ? (isZh ? '全部通过 WCAG AA' : 'All pass WCAG AA') : (isZh ? '部分未通过' : 'Some fail')}
          </span>
        </div>
        <div className="space-y-2">
          {checks.map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-2 bg-gray-900/40 rounded-lg border border-gray-800">
              {r.pass ? <CheckCircle size={14} className="text-green-400 shrink-0" /> : <AlertTriangle size={14} className="text-amber-400 shrink-0" />}
              <div className="flex gap-1.5 shrink-0">
                <div className="w-5 h-5 rounded border border-white/20" style={{ background: r.bgVal }} />
                <div className="w-5 h-5 rounded border border-white/20" style={{ background: r.fgVal }} />
              </div>
              <span className="text-xs text-gray-300 flex-1 truncate" style={{ fontSize: '0.7rem' }}>{r.fg} / {r.bg}</span>
              <span className="text-xs font-mono shrink-0" style={{ fontSize: '0.7rem', color: r.pass ? '#4ade80' : '#fbbf24' }}>{r.ratio.toFixed(1)}:1</span>
              <span className={`text-xs px-1.5 py-0.5 rounded shrink-0 ${r.level === 'AAA' ? 'bg-green-500/20 text-green-400' : r.level === 'AA' ? 'bg-blue-500/20 text-blue-400' : r.level === 'AA Large' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}
                style={{ fontSize: '0.6rem', fontWeight: 600 }}>{r.level}</span>
            </div>
          ))}
        </div>
      </FuturisticPanel>
    </div>
  );
}

// ===== Snapshots Tab (版本对比) =====
function SnapshotsTab() {
  const { language } = useLanguage();
  const isZh = language === 'zh';
  const { currentTheme, snapshots, createSnapshot, restoreSnapshot, deleteSnapshot } = useTheme();
  const [snapName, setSnapName] = useState('');
  const [compareId, setCompareId] = useState<string | null>(null);

  const handleCreate = () => {
    const name = snapName.trim() || `Snapshot ${snapshots.length + 1}`;
    createSnapshot(name);
    setSnapName('');
    toast.success(isZh ? `快照 "${name}" 已保存` : `Snapshot "${name}" saved`);
  };

  const compareSnap = compareId ? snapshots.find(s => s.id === compareId) : null;

  return (
    <div className="space-y-4">
      {/* Create Snapshot */}
      <FuturisticPanel title={isZh ? '创建快照' : 'Create Snapshot'} subtitle={isZh ? `已保存 ${snapshots.length}/50` : `Saved ${snapshots.length}/50`} icon={<Save size={16} />}>
        <div className="flex gap-2">
          <input type="text" value={snapName} onChange={e => setSnapName(e.target.value)}
            placeholder={isZh ? '快照名称 (可选)' : 'Snapshot name (optional)'}
            className="flex-1 bg-gray-900/60 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" style={{ fontSize: '0.8rem' }} />
          <button onClick={handleCreate}
            className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600/20 border border-cyan-500/40 rounded-lg text-cyan-400 hover:bg-cyan-600/30 transition-all text-sm" style={{ fontSize: '0.8rem' }}>
            <Plus size={14} /> {isZh ? '保存' : 'Save'}
          </button>
        </div>
      </FuturisticPanel>

      {/* Snapshot List */}
      <FuturisticPanel title={isZh ? '快照列表' : 'Snapshot List'} icon={<History size={16} />}>
        {snapshots.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8" style={{ fontSize: '0.8rem' }}>{isZh ? '暂无快照' : 'No snapshots yet'}</p>
        ) : (
          <div className="space-y-2">
            {[...snapshots].reverse().map(snap => (
              <div key={snap.id} className={`p-3 rounded-lg border transition-all ${compareId === snap.id ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-gray-800 bg-gray-900/40'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm text-gray-300" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{snap.name}</div>
                    <div className="text-xs text-gray-500" style={{ fontSize: '0.65rem' }}>{new Date(snap.timestamp).toLocaleString()} · {snap.theme.name}</div>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => setCompareId(compareId === snap.id ? null : snap.id)}
                      className="px-2 py-1 rounded text-xs bg-gray-800 border border-gray-700 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all" style={{ fontSize: '0.65rem' }}>
                      {isZh ? '对比' : 'Compare'}
                    </button>
                    <button onClick={() => { restoreSnapshot(snap.id); toast.success(isZh ? '已恢复' : 'Restored'); }}
                      className="px-2 py-1 rounded text-xs bg-blue-600/20 border border-blue-500/40 text-blue-400 hover:bg-blue-600/30 transition-all" style={{ fontSize: '0.65rem' }}>
                      {isZh ? '恢复' : 'Restore'}
                    </button>
                    <button onClick={() => { deleteSnapshot(snap.id); if (compareId === snap.id) setCompareId(null); toast.success(isZh ? '已删除' : 'Deleted'); }}
                      className="px-2 py-1 rounded text-xs text-gray-600 hover:text-red-400 transition-colors" style={{ fontSize: '0.65rem' }}>
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>
                {/* Color swatches */}
                <div className="flex gap-1">
                  {[snap.theme.colors.primary, snap.theme.colors.secondary, snap.theme.colors.accent, snap.theme.colors.background, snap.theme.colors.card].map((c, i) => (
                    <div key={i} className="w-4 h-4 rounded-full border border-white/10" style={{ background: c }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </FuturisticPanel>

      {/* Version Comparison */}
      {compareSnap && (
        <FuturisticPanel title={isZh ? '版本对比' : 'Version Comparison'} subtitle={`${compareSnap.name} vs ${isZh ? '当前' : 'Current'}`} icon={<Eye size={16} />}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-400 mb-2" style={{ fontSize: '0.7rem', fontWeight: 600 }}>{compareSnap.name}</div>
              <ThemePreviewCard theme={compareSnap.theme} />
            </div>
            <div>
              <div className="text-xs text-cyan-400 mb-2" style={{ fontSize: '0.7rem', fontWeight: 600 }}>{isZh ? '当前主题' : 'Current'}</div>
              <ThemePreviewCard theme={currentTheme} />
            </div>
          </div>
          {/* Diff table */}
          <div className="mt-4 space-y-1">
            <div className="text-xs text-gray-400 mb-1" style={{ fontSize: '0.7rem', fontWeight: 600 }}>{isZh ? '差异项' : 'Differences'}</div>
            {(Object.keys(currentTheme.colors) as (keyof typeof currentTheme.colors)[]).map(key => {
              const oldVal = compareSnap.theme.colors[key];
              const newVal = currentTheme.colors[key];
              if (oldVal === newVal) return null;
              return (
                <div key={key} className="flex items-center gap-2 p-1.5 bg-gray-900/40 rounded border border-gray-800">
                  <span className="text-xs text-gray-500 w-20 shrink-0" style={{ fontSize: '0.6rem' }}>{key}</span>
                  <div className="w-4 h-4 rounded border border-white/10" style={{ background: oldVal }} />
                  <span className="text-xs text-gray-600" style={{ fontSize: '0.55rem' }}>→</span>
                  <div className="w-4 h-4 rounded border border-white/10" style={{ background: newVal }} />
                  <span className="text-xs text-gray-600 font-mono truncate flex-1" style={{ fontSize: '0.5rem' }}>{oldVal} → {newVal}</span>
                </div>
              );
            })}
          </div>
        </FuturisticPanel>
      )}
    </div>
  );
}

// ===== Export Tab =====
function ExportTab() {
  const { language } = useLanguage();
  const isZh = language === 'zh';
  const { currentTheme, exportTheme, importTheme } = useTheme();
  const [importText, setImportText] = useState('');
  const [showExport, setShowExport] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExportCopy = () => {
    navigator.clipboard.writeText(exportTheme()).then(() => toast.success(isZh ? 'JSON 已复制' : 'JSON copied')).catch(() => toast.error(isZh ? '复制失败' : 'Copy failed'));
  };

  const handleExportDownload = () => {
    const blob = new Blob([exportTheme()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yyc3-theme-${currentTheme.id}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(isZh ? '已下载' : 'Downloaded');
  };

  const handleImportText = () => {
    if (!importText.trim()) { toast.error(isZh ? '请粘贴 JSON' : 'Paste JSON'); return; }
    importTheme(importText) ? toast.success(isZh ? '导入成功' : 'Imported') : toast.error(isZh ? '格式无效' : 'Invalid format');
    if (importTheme(importText)) setImportText('');
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      importTheme(ev.target?.result as string) ? toast.success(isZh ? '导入成功' : 'Imported') : toast.error(isZh ? '无效文件' : 'Invalid');
    };
    reader.readAsText(file); e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <FuturisticPanel title={isZh ? '导出主题' : 'Export'} icon={<Download size={16} />}>
        <div className="space-y-3">
          <div className="flex gap-2">
            <button onClick={handleExportCopy} className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600/20 border border-cyan-500/40 rounded-lg text-cyan-400 hover:bg-cyan-600/30 transition-all text-sm" style={{ fontSize: '0.8rem' }}>
              <Copy size={14} /> {isZh ? '复制' : 'Copy'}
            </button>
            <button onClick={handleExportDownload} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600/20 border border-blue-500/40 rounded-lg text-blue-400 hover:bg-blue-600/30 transition-all text-sm" style={{ fontSize: '0.8rem' }}>
              <Download size={14} /> {isZh ? '下载' : 'Download'}
            </button>
            <button onClick={() => setShowExport(!showExport)} className="flex items-center gap-1.5 px-4 py-2 bg-gray-800/60 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-all text-sm" style={{ fontSize: '0.8rem' }}>
              <Eye size={14} /> {isZh ? '预览' : 'Preview'}
            </button>
          </div>
          {showExport && (
            <pre className="p-3 bg-gray-950 rounded-lg border border-gray-800 text-xs text-green-400 overflow-auto max-h-60 font-mono" style={{ fontSize: '0.65rem' }}>{exportTheme()}</pre>
          )}
        </div>
      </FuturisticPanel>
      <FuturisticPanel title={isZh ? '导入主题' : 'Import'} icon={<Upload size={16} />}>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFileImport} />
            <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-4 py-2 bg-purple-600/20 border border-purple-500/40 rounded-lg text-purple-400 hover:bg-purple-600/30 transition-all text-sm" style={{ fontSize: '0.8rem' }}>
              <Upload size={14} /> {isZh ? '选择文件' : 'File'}
            </button>
          </div>
          <textarea value={importText} onChange={e => setImportText(e.target.value)}
            placeholder={isZh ? '粘贴 JSON...' : 'Paste JSON...'}
            className="w-full h-32 bg-gray-900/60 border border-gray-700 rounded-lg p-3 text-white text-xs font-mono focus:outline-none focus:border-cyan-500 resize-none" style={{ fontSize: '0.7rem' }} />
          <button onClick={handleImportText} disabled={!importText.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-green-600/20 border border-green-500/40 rounded-lg text-green-400 hover:bg-green-600/30 disabled:opacity-30 transition-all text-sm" style={{ fontSize: '0.8rem' }}>
            <Check size={14} /> {isZh ? '导入' : 'Import'}
          </button>
        </div>
      </FuturisticPanel>
      <FuturisticPanel title={isZh ? '主题信息' : 'Theme Info'} icon={<Settings2 size={16} />}>
        <div className="grid grid-cols-2 gap-2 text-sm" style={{ fontSize: '0.75rem' }}>
          {[{ k: 'ID', v: currentTheme.id }, { k: isZh ? '名称' : 'Name', v: isZh ? currentTheme.name : currentTheme.nameEn },
            { k: isZh ? '类型' : 'Type', v: currentTheme.type }, { k: 'Version', v: currentTheme.version },
            { k: isZh ? '创建' : 'Created', v: currentTheme.createdAt?.slice(0, 10) || '-' },
            { k: isZh ? '更新' : 'Updated', v: currentTheme.updatedAt?.slice(0, 10) || '-' }].map(i => (
            <div key={i.k} className="flex justify-between p-2 bg-gray-900/40 rounded border border-gray-800">
              <span className="text-gray-500">{i.k}</span>
              <span className="text-gray-300 font-mono">{i.v}</span>
            </div>
          ))}
        </div>
      </FuturisticPanel>
    </div>
  );
}

// ===== Reusable: Color Editor =====
function ColorEditor({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const parsed = parseOklch(value);
  return (
    <div className="flex items-center gap-3 p-2.5 bg-gray-900/40 rounded-lg border border-gray-800">
      <div className="w-8 h-8 rounded-lg border border-white/20 shrink-0 shadow-inner" style={{ background: value }} />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-300 mb-0.5 truncate" style={{ fontSize: '0.75rem', fontWeight: 500 }}>{label}</div>
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          className="w-full bg-transparent border-b border-gray-700 text-xs text-gray-400 font-mono focus:outline-none focus:border-cyan-500 py-0.5" style={{ fontSize: '0.65rem' }} />
      </div>
      {parsed && <div className="text-xs text-gray-600 shrink-0 font-mono" style={{ fontSize: '0.55rem' }}>L:{parsed.l.toFixed(2)}</div>}
    </div>
  );
}

// ===== Reusable: Theme Preview Card =====
function ThemePreviewCard({ theme }: { theme: ThemeConfig }) {
  const { language } = useLanguage();
  const isZh = language === 'zh';

  return (
    <div className="rounded-xl overflow-hidden border border-gray-700" style={{ background: theme.colors.background }}>
      <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ background: theme.sidebar.background, borderColor: theme.colors.border }}>
        <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#eab308' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#22c55e' }} />
        <span className="text-xs ml-2" style={{ color: theme.foreground.background, fontSize: '0.7rem' }}>{theme.branding.appName}</span>
      </div>
      <div className="flex" style={{ minHeight: '160px' }}>
        <div className="w-28 p-2 border-r shrink-0" style={{ background: theme.sidebar.background, borderColor: theme.colors.border }}>
          {['Dashboard', 'Devices', 'Monitor'].map(item => (
            <div key={item} className="px-2 py-1.5 rounded text-xs mb-0.5" style={{
              fontSize: '0.6rem', color: item === 'Dashboard' ? theme.foreground.primary : theme.foreground.muted,
              background: item === 'Dashboard' ? `color-mix(in srgb, ${theme.sidebar.primary} 15%, transparent)` : 'transparent',
              borderRadius: theme.layout.radiusSm,
            }}>{item}</div>
          ))}
        </div>
        <div className="flex-1 p-3 space-y-2">
          <div className="flex gap-2">
            {[theme.colors.primary, theme.colors.secondary, theme.colors.accent].map((c, i) => (
              <div key={i} className="flex-1 p-2 rounded" style={{ background: c, borderRadius: theme.layout.radiusMd }}>
                <div className="text-xs" style={{ color: [theme.foreground.primary, theme.foreground.secondary, theme.foreground.accent][i], fontSize: '0.55rem', fontWeight: 600 }}>
                  {['P', 'S', 'A'][i]}
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 rounded border" style={{ background: theme.colors.card, borderColor: theme.colors.border, borderRadius: theme.layout.radiusMd }}>
            <div className="text-xs" style={{ color: theme.foreground.card, fontSize: '0.6rem', fontWeight: 600 }}>{isZh ? '卡片' : 'Card'}</div>
            <div className="text-xs" style={{ color: theme.foreground.muted, fontSize: '0.5rem' }}>{isZh ? '预览文本' : 'Preview'}</div>
          </div>
          <div className="flex gap-2">
            <div className="px-2 py-1 rounded text-xs" style={{ background: theme.colors.primary, color: theme.foreground.primary, borderRadius: theme.layout.radiusSm, fontSize: '0.5rem' }}>{isZh ? '主' : 'Prim'}</div>
            <div className="px-2 py-1 rounded text-xs border" style={{ borderColor: theme.colors.border, color: theme.foreground.background, borderRadius: theme.layout.radiusSm, fontSize: '0.5rem' }}>{isZh ? '次' : 'Sec'}</div>
            <div className="px-2 py-1 rounded text-xs" style={{ background: theme.colors.destructive, color: theme.foreground.destructive, borderRadius: theme.layout.radiusSm, fontSize: '0.5rem' }}>{isZh ? '危' : 'Del'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
