import { createSlice } from "@reduxjs/toolkit"


/**
 * Modal states type definition
 */
export interface ModalStates {
  isShown: boolean
}

/**
 * Modal initial state containing the status whether the modal is 
 * shown or hidden
 */
const initialState: ModalStates = {
  isShown: false,
}

/**
 * Modal slice containing the reducer and actions for the modal
 */
export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {

    /**
     * Set the current path of the modal
     */
    toggleModal: (state) => {
      state.isShown = !state.isShown
    },

    /**
     * Set the current path of the modal
     */
    showModal: (state) => {
      state.isShown = true
    },

    /**
     * Set the current path of the modal
     */
    hideModal: (state) => {
      state.isShown = false
    }
  }
})

export default modalSlice.reducer
export const { toggleModal, showModal, hideModal } = modalSlice.actions