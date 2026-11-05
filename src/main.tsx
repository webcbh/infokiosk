import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary.tsx";
import App from './App.tsx';
import React, { Suspense } from 'react';
const AdminDashboard = React.lazy(() => import('./AdminDashboard.tsx'));
import './index.css';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ErrorBoundary><App /></ErrorBoundary>} />
        <Route path="/admin" element={<ErrorBoundary><Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}><AdminDashboard /></Suspense></ErrorBoundary>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

// Unregister old service workers to fix caching issues
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}
