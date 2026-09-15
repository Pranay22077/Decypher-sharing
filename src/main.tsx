import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./index.css"
import { LocaleProvider } from "./context/LocaleContext"

const savedTheme = localStorage.getItem("ui.theme")
document.documentElement.classList.toggle("light", savedTheme !== "dark")

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LocaleProvider>
        <App />
      </LocaleProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
