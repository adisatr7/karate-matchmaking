import { readTournamentsData } from './../../data/index';
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Pertandingan } from "../../types"


/**
 * Tournament states type definition
 */
export interface TournamentsState {
  allTournaments: Pertandingan[]
}

/**
 * Tournament initial state containing the current user and the list of registered users
 */
const initialState: TournamentsState = {
  allTournaments: []
}

/**
 * Tournament slice containing the reducer and actions for the auth
 */
export const tournamentsSlice = createSlice({
  name: "tournaments",
  initialState,
  reducers: {

    
  }
})

export default tournamentsSlice.reducer
export const {  } = tournamentsSlice.actions