import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import SEO from './SEO.jsx'

createRoot(document.getElementById('root')).render(
   <BrowserRouter>
    <SEO />
    <App />
  </BrowserRouter>
)
