import { configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"

import { authSlice } from "./slices/authSlice"
import { sidebarSlice } from "./slices/sidebarSlice"


export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    sidebar: sidebarSlice.reducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch: () => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector