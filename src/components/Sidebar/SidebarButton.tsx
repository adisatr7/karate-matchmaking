import { SidebarOptions, SVGIcon } from "../../types"
import { useAppDispatch, useAppSelector } from "../../store"
import { collapseSidebar, setCurrentPath } from "../../store/slices/sidebarSlice"


type PropsType = {
  icon: SVGIcon
  label: string,
  path?: SidebarOptions,
  onClick?: Function,
}

export default function SidebarButton({ icon: Icon, label, path, onClick }: PropsType) {
  const sidebarStatus = useAppSelector(state => state.sidebar.status)
  const currentPath = useAppSelector(state => state.sidebar.currentPath)
  const dispatch = useAppDispatch()

  const handleButtonClick = () => {
    if (path)
      dispatch(setCurrentPath(path))

    dispatch(collapseSidebar())
    onClick!()
  }

  return (
    // Container
    <button onClick={() => handleButtonClick()}
      className={`mb-[18px] flex flex-row w-full hover:cursor-pointer items-center
      ${currentPath === path || !path ? "text-stone-200 hover:text-white" : "text-stone-400 hover:text-white"}`}>

      {/* Icon */}
      <Icon 
        className={`bg-cover w-[28px] h-[28px] duration-500 ease-in-out transition-transform 
        ${sidebarStatus === "expanded" ? "translate-x-0" : "translate-x-[255px]"}`}/>

      {/* Text label */}
      <p 
        className={`ml-[14px] text-body ease-in-out transition-opacity 
        ${sidebarStatus === "expanded" ? "opacity-100 duration-500 delay-300" : "opacity-0 duration-150"}`}>
        {label}
      </p>
      
      {/* Indicator */}
      { path &&
        <div className={`bg-stone-100 w-[4px] right-[0px] fixed rounded-l-sm transition-all duration-300 ease-out ${currentPath === path ? "h-[22px]" : "h-0"}`}/> }

    </button>
  )
}