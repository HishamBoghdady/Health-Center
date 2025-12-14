import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, Routes, Route,HashRouter} from "react-router-dom";
import ProvInfo from "./context/ContextData";
import LoginProvider from "./context/ContextLogin";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LoginProvider>
        <ProvInfo>{/* Main Context Data */}
          <App />
        </ProvInfo>
      </LoginProvider>
    </BrowserRouter>
  </StrictMode>,
)
