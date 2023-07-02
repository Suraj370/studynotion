import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import rootReducer from './reducers/index.js'
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from 'react-router-dom'

const store = configureStore({
  reducer: rootReducer,
}) 


ReactDOM.createRoot(document.getElementById('root')).render(

  <Provider store = {store}>
    <BrowserRouter>
    <App />
    <Toaster />
    </BrowserRouter>
  </Provider>
    

)
