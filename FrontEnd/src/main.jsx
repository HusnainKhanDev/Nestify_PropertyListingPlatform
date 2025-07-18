import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import UserContext from './Context/UserContext.jsx'
import PropertyContext from './Context/PropertyContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContext>
      <PropertyContext>
        <App />
      </PropertyContext>
    </UserContext>
  </StrictMode>,
)
