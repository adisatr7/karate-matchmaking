import { SVGIcon } from "../../types"
import { useAppDispatch, useAppSelector } from "../../store"
import { collapseSidebar } from "../../store/slices/sidebarSlice"


type PropsType = {
  icon: SVGIcon
  label: string,
  onClick?: Function,
}

export default function SidebarButton({ icon: Icon, label, onClick }: PropsType) {
  const sidebarStatus = useAppSelector(state => state.sidebar.status)
  const dispatch = useAppDispatch()

  const handleButtonClick = () => {
    onClick!()
    dispatch(collapseSidebar())
  }

  return (
    // Container
    <button onClick={() => handleButtonClick()}
      className="mb-[18px] flex flex-row w-full hover:cursor-pointer text-white hover:text-primary-opaque items-center">

      {/* Icon */}
      <Icon className={`bg-cover w-[28px] h-[28px] duration-500 ease-in-out transition-transform ${sidebarStatus === "expanded" ? "translate-x-0" : "translate-x-[242px]"}`}/>

      {/* Text label */}
      <p className={`ml-[14px] text-body ease-in-out transition-opacity ${sidebarStatus === "expanded" ? "opacity-100 duration-500 delay-300" : "opacity-0 duration-150"}`}>
        {label}
      </p>
      {/* { isExpanded &&  */}
      {/* } */}
    </button>
  )
}