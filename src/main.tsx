import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HashRouter, Route, Routes } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <Routes>
      <Route path="/:productId" element={<App />} />
    </Routes>
  </HashRouter>
)
