import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./styles/index.css"
import "@fontsource/quicksand"
import { Provider } from "react-redux"
import { store } from "./store"
import { RouterProvider, createBrowserRouter } from "react-router-dom"

// Define router
const routes = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  }
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={routes}/>
    </Provider>
  </React.StrictMode>
)
