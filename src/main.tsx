import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "@/AuthProvider.tsx";
import './i18n.ts';
import {setupFetchProxy} from "@/lib/fetch-proxy";

// Setup fetch proxy for ZET API CORS issues (development only)
setupFetchProxy();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AuthProvider>
        <BrowserRouter>
          <App/>
        </BrowserRouter>
      </AuthProvider>
    </StrictMode>
)
