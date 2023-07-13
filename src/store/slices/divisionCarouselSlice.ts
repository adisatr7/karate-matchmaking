import { PayloadAction, createSlice } from "@reduxjs/toolkit"

/**
 * DivisionCarousel states type definition
 */
export interface DivisionCarouselStates {
  activeSlide: number
}

/**
 * DivisionCarousel initial state containing.
 */
const initialState: DivisionCarouselStates = {

  /** 
   * The index of the divisionCarousel that is currently showing on the screen.
   */
  activeSlide: 0,
}

/**
 * DivisionCarousel slice containing the reducer and actions for the divisionCarousel
 */
export const divisionCarouselSlice = createSlice({
  name: "divisionCarousel",
  initialState,
  reducers: {
    /**
     * Set the current path of the divisionCarousel
     * 
     * @param action What the divisionCarousel is currently showing. Set to empty string to hide the divisionCarousel.
     */
    setSlide: (state, action: PayloadAction<number>) => {
      state.activeSlide = action.payload
    },

    /**
     * Progress the divisionCarousel to the next slide
     */
    nextSlide: (state) => {
      state.activeSlide++
    },

    /**
     * Progress the divisionCarousel to the previous slide
     */
    previousSlide: (state) => {
      state.activeSlide--
    }
  },
})

export default divisionCarouselSlice.reducer
export const { setSlide, nextSlide, previousSlide } = divisionCarouselSlice.actions