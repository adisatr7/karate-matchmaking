import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useAppDispatch, useAppSelector } from "../../store"
import { expandSidebar, collapseSidebar, hideSidebar } from "../../store/slices/sidebarSlice"

import * as Icons from "../../assets/icons"
import SidebarButton from "./SidebarButton"


export default function Sidebar() {
  // State for whether the sidebar is expanded (true) or collapsed (false)
  const sidebarStatus = useAppSelector(state => state.sidebar.status)
  const dispatch = useAppDispatch()

  /**
   * Toggle sidebar status between expanded and collapsed
   */
  const toggleSideBar = () => {
    if (sidebarStatus === "collapsed")
      dispatch(expandSidebar())

    else if (sidebarStatus === "expanded")
      dispatch(collapseSidebar())
  }

  return (
    <div 
      className={`flex flex-col items-end h-full w-fit px-[36px] py-[14px] left-0 bg-stone-900 text-white fixed 
      ${sidebarStatus === "expanded" && "translate-x-0"}
      ${sidebarStatus === "collapsed" &&  "-translate-x-[72%]"}
      ${sidebarStatus === "hidden" && "translate-x-[-100%]"}
      duration-500 ease-in-out z-10`}>

      {/* Title and X icon container */}
      <div className="flex flex-row h-[64px] w-full justify-between items-center">

        {/* Title label */}
        <h1 className="font-bold text-heading pr-[40px] line-clamp-1">Karate Matcher</h1> 
        
        {/* Icon container */}
        <div className="w-[24px] h-[24px] flex justify-center items-center text-white hover:text-primary-opaque" onClick={toggleSideBar}>
          
          {/* Close button */}
          <FontAwesomeIcon icon="xmark" width={20} className={`absolute cursor-pointer text-xl ${sidebarStatus === "expanded" ? "opacity-100" : "opacity-0"} transition-opacity duration-300 ease-in-out`} />
          
          {/* Expand button */}
          <FontAwesomeIcon icon="bars" width={20} className={`absolute cursor-pointer text-xl ${sidebarStatus === "expanded" ? "opacity-0" : "opacity-100"} transition-opacity duration-300 ease-in-out`} />
        </div>
      </div>

      {/* Middle buttons container */}
      <div className="flex flex-col h-full my-[12px] transition-all w-full">

        {/* Highlight | TODO: Implement Redux */}
        <SidebarButton icon={Icons.Highlight} label="Highlight"/>
        {/* Tournaments */}
        <SidebarButton icon={Icons.Tournaments} label="Pertandingan"/>
        {/* Teams */}
        <SidebarButton icon={Icons.Teams} label="Tim"/>
        {/* Athletes */}
        <SidebarButton icon={Icons.Athletes} label="Atlet"/>
        {/* Settings */}
        <SidebarButton icon={Icons.Settings} label="Pengaturan"/>
        
      </div>
      {/* Logout button container */}
      <div className="flex flex-col h-fit my-[12px] transition-all w-full">
        <SidebarButton icon={Icons.Logout} label="Keluar"/>
      </div>
    </div>
  )
}