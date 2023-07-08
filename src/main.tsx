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

import { library } from "@fortawesome/fontawesome-svg-core"
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons"
import TournamentListScreen from "./screens/TournamentListScreen.tsx"
import TeamListScreen from "./screens/TeamListScreen.tsx"
import AthleteListScreen from "./screens/AthleteListScreen.tsx"
import TournamentDetailScreen from "./screens/TournamentDetailScreen.tsx"
import UnderConstructionScreen from "./screens/UnderConstructionScreen.tsx"
import TeamDetailScreen from "./screens/TeamDetailScreen.tsx"
import AthleteProfileScreen from "./screens/AthleteProfileScreen.tsx"
import AthleteFormScreen from "./screens/AthleteFormScreen.tsx"
import JoinTeamScreen from "./screens/JoinTeamScreen.tsx"
import TeamFormScreen from "./screens/TeamFormScreen.tsx"
import RecruitMemberScreen from "./screens/RecruitMemberScreen.tsx"


/**
 * Initializes icon library from FontAwesome
 */
library.add(faBars, faXmark)  


/** 
 * Define router to allow the app to navigate between screens
 */
const screens = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/login",
    element: <LoginScreen/>
  },
  {
    path: "/highlight",
    element: <HighlightScreen/>
  },
  {
    path: "/tournament/all",
    element: <TournamentListScreen/>
  },
  {
    path: "/tournament/:tournamentId",
    element: <TournamentDetailScreen/>
  },
  {
    path: "/team/all",
    element: <TeamListScreen/>
  },
  {
    path: "/team/:teamId",
    element: <TeamDetailScreen/>
  },
  {
    path: "/team/:teamId/:mode",
    element: <TeamFormScreen/>
  },
  {
    path: "team/:teamId/addmember",
    element: <RecruitMemberScreen/>
  },
  {
    path: "/athlete/all",
    element: <AthleteListScreen/>
  },
  {
    path: "/athlete/:athleteId",
    element: <AthleteProfileScreen/>
  },
  {
    path: "/athlete/:athleteId/:mode",
    element: <AthleteFormScreen/>
  },
  {
    path: "athlete/:athleteId/jointeam",
    element: <JoinTeamScreen/>
  },
  {
    path: "/settings",
    element: <UnderConstructionScreen/>
  }
])


/**
 * Render the app to the root element (DO NOT TOUCH!)
 */
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={screens}/>
    </Provider>
  </React.StrictMode>
)
