import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // تأكد إن الملف ده موجود أو امسح السطر ده

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)