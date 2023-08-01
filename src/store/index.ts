import { configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"

import { authSlice } from "./slices/authSlice"
import { modalSlice } from "./slices/modalSlice"
import { sidebarSlice } from "./slices/sidebarSlice"
import { divisionCarouselSlice } from "./slices/divisionCarouselSlice"


export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    divisionCarousel: divisionCarouselSlice.reducer,
    modal: modalSlice.reducer,
    sidebar: sidebarSlice.reducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch: () => typeof store.dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector