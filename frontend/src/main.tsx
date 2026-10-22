import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { CatalogPage } from './pages/CatalogPage';
import { DetailPage } from './pages/DetailPage';
import { NotFoundPage } from './pages/NotFoundPage';
import './styles.css';

// Return navigation restores scroll itself (Design §5).
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/agents/:id" element={<DetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  </StrictMode>,
);
