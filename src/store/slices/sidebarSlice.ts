import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { SidebarOptions } from "../../types"

/**
 * Options for statusbar state
 */
type SidebarStatusOptions = "expanded" | "collapsed" | "hidden"

/**
 * Sidebar states type definition
 */
export interface SidebarStates {
  status: SidebarStatusOptions
  currentPath: SidebarOptions
}

/**
 * Sidebar initial state containing the status whether the sidebar is
 * expanded, collapsed, or hidden and the current path (screen) the app is in
 */
const initialState: SidebarStates = {
  status: "hidden",
  currentPath: "highlight",
}

/**
 * Sidebar slice containing the reducer and actions for the sidebar
 */
export const sidebarSlice = createSlice({
  name: "sidebar",
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
    setCurrentPath: (state, action: PayloadAction<SidebarOptions>) => {
      state.currentPath = action.payload
    },
  },
})

export default sidebarSlice.reducer
export const { expandSidebar, collapseSidebar, hideSidebar, setCurrentPath } =
  sidebarSlice.actions
