/**
 * Meeting RunBook — Powered by KarkhooneAI
 * Author: Kourosh Sedigh (iamkourosh)
 * License: MIT
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'
import { I18nProvider } from './i18n'
import { StoreProvider } from './store/store'
import { ToastProvider } from './components/Toast'
import { applySavedTheme } from './components/Toolbar'

applySavedTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <StoreProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </StoreProvider>
    </I18nProvider>
  </StrictMode>,
)
