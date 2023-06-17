import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


export default function Sidebar() {
  // State for whether the sidebar is expanded (true) or collapsed (false)
  const [sideBarIsExpanded, setSidebarIsExpanded] = useState(false)

  const toggleSideBar = () => {
    setSidebarIsExpanded(!sideBarIsExpanded)
  }

  return (
    <div className={`
      flex 
      h-full 
      w-fit 
      px-[36px] 
      py-[14px] 
      left-0 
      bg-stone-900 
      text-white 
      fixed 
      ${sideBarIsExpanded ? "translate-x-0 w-fit" : "-translate-x-[68%]"} 
      transition-transform 
      duration-500 
      ease-in-out 
      z-10
    `}>

      {/* Title and Hamburger Button */}
      <div className={`flex flex-row h-[64px] w-full justify-between items-center`}>

        {/* Title */}
        <h1 className={`font-bold text-2xl pr-[40px] line-clamp-1`}>Karate Matcher</h1> 
        
        <div className="w-[24px] h-[23px]" onClick={toggleSideBar}>
          {/* Close button */}
          <FontAwesomeIcon icon="xmark" width={26} className={`absolute cursor-pointer text-xl ${sideBarIsExpanded ? "opacity-100" : "opacity-0"} transition-opacity duration-300 ease-in-out`} />
          
          {/* Expand button */}
          <FontAwesomeIcon icon="bars" width={26} className={`absolute cursor-pointer text-xl ${sideBarIsExpanded ? "opacity-0" : "opacity-100"} transition-opacity duration-300 ease-in-out`} />
        </div>
      </div>
    </div>
  )
}