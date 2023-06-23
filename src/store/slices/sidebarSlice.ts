import { PayloadAction, createSlice } from "@reduxjs/toolkit"


export interface SideBarState {
  isExpanded: boolean
}

const initialState: SideBarState = {
  isExpanded: false
}

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleState: (state, action: PayloadAction) => {
      state.isExpanded = !state.isExpanded
    }
  }
})

export default sidebarSlice.reducer
export const { toggleState } = sidebarSlice.actions