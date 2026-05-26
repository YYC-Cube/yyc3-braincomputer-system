/**
 * file main.tsx
 * description YYC³ Brain Computer System 应用入口 · React DOM 挂载点
 * author YanYuCloudCube Team
 * version v3.1.0
 * created 2026-02-26
 * updated 2026-05-19
 * status: active
 * tags: [entry],[main],[react]
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import '../styles/index.css';
import App from './App';
import { reportWebVitals } from './utils/webVitals';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
