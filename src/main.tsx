import { initFx } from "./lib/fx"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// ?fx=off turns every scroll effect off (remembered); ?fx=on restores them
initFx()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
