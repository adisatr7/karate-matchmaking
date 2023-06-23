import React from "react"
import { useAppDispatch, useAppSelector } from "../store"
import { hideSidebar } from "../store/slices/sidebarSlice"


type PropsType = {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
  label: string,
  onClick?: void,
}

export default function SidebarButton({ icon: Icon, label, onClick }: PropsType) {
  const isExpanded = useAppSelector(state => state.sidebar.isExpanded)
  const dispatch = useAppDispatch()

  const handleButtonClick = () => {
    dispatch(hideSidebar())
    onClick
  }

  return (
    // Container
    <button onClick={() => handleButtonClick()}
      className="mb-[18px] flex flex-row w-full hover:cursor-pointer text-white hover:text-primary-opaque items-center">

      {/* Icon */}
      <Icon className={`bg-cover w-[28px] h-[28px] duration-500 ease-in-out transition-transform ${isExpanded? "translate-x-0" : "translate-x-[242px]"}`}/>

      {/* Text label */}
      <p className={`ml-[14px] text-body ease-in-out transition-opacity ${isExpanded? "opacity-100 duration-500 delay-300" : "opacity-0 duration-150"}`}>
        {label}
      </p>
      {/* { isExpanded &&  */}
      {/* } */}
    </button>
  )
}