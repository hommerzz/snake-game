import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// 禁用浏览器的默认滚动行为（防止使用方向键时页面滚动）
window.addEventListener('keydown', function(e) {
  if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)