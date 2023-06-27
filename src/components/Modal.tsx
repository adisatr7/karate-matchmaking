import { ReactNode, useEffect, useState } from "react";
import { useAppDispatch } from "../store";
import { hideModal } from "../store/slices/modalSlice";


type PropsType = {
  title: string,
  caption?: string,
  children?: ReactNode
}

export default function Modal ({ children, title, caption }: PropsType) {
  const [animationState, setAnimationState] = useState<number>(0)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setAnimationState(1)
  }, [])

  /**
   * Dismiss the modal by fading out the background and the modal itself
   */
  const dismissModal = () => {
    setAnimationState(0)
    setTimeout(() => {
      dispatch(hideModal())
    }, 500)
  }

  return (
    <div
      onClick={dismissModal}
      className={`fixed top-0 left-0 w-screen h-screen bg-black ease-in-out duration-500 text-white font-quicksand flex flex-col justify-center items-center
      ${animationState === 0 ? "bg-opacity-0" : "bg-opacity-70"}`}>

      {/* Popup window */}
      <div
        onClick={(event) => event.stopPropagation()}
        className={`bg-stone-900 border border-stone-700 w-fit h-fit flex flex-col min-w-[300px] px-[22px] py-[24px] rounded-md gap-[10px] transition-all ease-in-out bg-opacity-70 backdrop-blur-sm
        ${animationState === 0 ? "opacity-0 translate-y-10 duration-500" : "opacity-100 translate-y-0 duration-300"}`}>

        {/* Header */}
        <div className="flex flex-row justify-between items-start gap-[18px] w-full h-fit">
          <h1 className="text-heading text-center w-full">{title}</h1>
          <button
            onClick={dismissModal}
            className="text-2xl hover:text-gray-400 absolute right-0 top-0 pt-[24px] pr-[24px]">
            x
          </button>
        </div>

        {/* Caption */}
        { caption && <p className="text-body text-left w-full">{caption}</p> }

        {/* Content */}
        {children}
      </div>
    </div>
  )
}