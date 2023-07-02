import { PayloadAction, createSlice } from "@reduxjs/toolkit"

/**
 * Modal states type definition
 */
export interface ModalStates {
  showing: string
}

/**
 * Modal initial state containing.
 */
const initialState: ModalStates = {

  /** 
   * Shows what the modal is currently showing. If the modal is not showing
   * anything, the value will be an empty string. 
   */
  showing: "",
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
     * 
     * @param action What the modal is currently showing. Set to empty string to hide the modal.
     */
    setModal: (state, action: PayloadAction<string>) => {
      state.showing = action.payload
    },

    closeModal: (state) => {
      state.showing = ""
    }
  },
})

export default modalSlice.reducer
export const { setModal, closeModal } = modalSlice.actions