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

import TournamentListScreen from "./screens/tournament/TournamentListScreen.tsx"
import TeamListScreen from "./screens/team/TeamListScreen.tsx"
import AthleteListScreen from "./screens/athlete/AthleteListScreen.tsx"
import TournamentDetailScreen from "./screens/tournament/TournamentDetailScreen.tsx"
import UnderConstructionScreen from "./screens/errors/UnderConstructionScreen.tsx"
import TeamDetailScreen from "./screens/team/TeamDetailScreen.tsx"
import AthleteProfileScreen from "./screens/athlete/AthleteProfileScreen.tsx"
import AthleteFormScreen from "./screens/athlete/AthleteFormScreen.tsx"
import JoinTeamScreen from "./screens/athlete/JoinTeamScreen.tsx"
import TeamFormScreen from "./screens/team/TeamFormScreen.tsx"
import RecruitMemberScreen from "./screens/team/RecruitMemberScreen.tsx"
import TournamentFormScreen from "./screens/tournament/TournamentFormScreen.tsx"


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
    path: "/tournament/:tournamentId/:mode",
    element: <TournamentFormScreen/>
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
    path: "/athlete/profile/:athleteId/:prevPage",
    element: <AthleteProfileScreen/>
  },
  {
    path: "/athlete/form/:athleteId/:mode",
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
