import { createRoot } from 'react-dom/client'
import './index.css'
import './mobile/index.css'
import { ModeProvider } from './context/ModeContext'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <ModeProvider>
    <App />
  </ModeProvider>,
)
