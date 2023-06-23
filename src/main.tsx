import React from "react"
import ReactDOM from "react-dom/client"
import "./styles/index.css"
import "@fontsource/quicksand"

import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./store"

import App from "./App.tsx"
import HighlightScreen from "./screens/HighlightScreen.tsx"
import LoginScreen from "./screens/LoginScreen.tsx"

/** 
 * Define router to allow the app to navigate between screens
 */
const screens = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path: "/login",
    element: <LoginScreen/>
  },
  {
    path: "/highlight",
    element: <HighlightScreen/>
  }
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={screens}/>
    </Provider>
  </React.StrictMode>
)
