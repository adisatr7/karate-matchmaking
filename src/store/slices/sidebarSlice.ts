import { PayloadAction, createSlice } from "@reduxjs/toolkit"


/**
 * Options for statusbar state
 */
type SidebarStatusOptions = "expanded" | "collapsed" | "hidden"

/**
 * Options for currentPath state
 */
type PathOptions = "highlight" | "tournaments" | "teams" | "athletes" | "settings"

/**
 * Sidebar states type definition
 */
export interface SidebarStates {
  status: SidebarStatusOptions,
  currentPath: PathOptions
}

/**
 * Sidebar initial state containing the status whether the sidebar is 
 * expanded, collapsed, or hidden and the current path (screen) the app is in
 */
const initialState: SidebarStates = {
  status: "hidden",
  currentPath: "highlight"
}

/**
 * Sidebar slice containing the reducer and actions for the sidebar
 */
export const sidebarSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    /**
     * Expand the sidebar
     */
    expandSidebar: (state) => {
      state.status = "expanded"
    },

    /**
     * Collapse the sidebar
     */
    collapseSidebar: (state) => {
      state.status = "collapsed"
    },

    /**
     * Hide the sidebar
     */
    hideSidebar: (state) => {
      state.status = "hidden"
    },

    /**
     * Set the current path (screen) the app is in
     * 
     * @param action The path to be set as the current path
     */
    setCurrentPath: (state, action: PayloadAction<PathOptions>) => {
      state.currentPath = action.payload
    }
  }
})

export default sidebarSlice.reducer
export const { expandSidebar, collapseSidebar, hideSidebar, setCurrentPath } = sidebarSlice.actions