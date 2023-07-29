import { ReactNode } from "react"
import { useAppDispatch, useAppSelector } from "../store"
import Sidebar from "./Sidebar/"
import { collapseSidebar } from "../store/slices/sidebarSlice"
import Header from "./Header"
import LogoutPrompt from "./Modal/LogoutPrompt"


type PropsType = {
  children: ReactNode,
  currentPageName: string,
  prevPageName?: string,
  prevPageUrl?: string,
  backButton?: boolean
}

export default function MainLayout({ children, currentPageName, prevPageName, prevPageUrl, backButton }: PropsType) {
  const sidebarStatus = useAppSelector(state => state.sidebar.status)

  const dispatch = useAppDispatch()

  const handleDismissSidebar = () => {
    if (sidebarStatus === "expanded")
      dispatch(collapseSidebar())
  }

  return (
    <div className={`w-screen h-screen flex flex-row bg-cover hover:cursor-default bg-gradient-to-br from-pink-900 via-[18%] via-indigo-900 to-purple-900 font-quicksand text-white`}>
      
      {/* Sidebar - left side, collapsible */}
      <Sidebar/>

      <div
        onClick={handleDismissSidebar}
        className={`flex flex-1 w-full flex-col pl-[130px] pr-[30px] py-[28px] transition-all duration-500 bg-black ${sidebarStatus === "expanded" ? "blur-sm bg-opacity-20" : "blur-0 bg-opacity-0"}`}>

        {/* Page header */}
        <Header 
          currentPageName={currentPageName}
          prevPageName={prevPageName}
          prevPageUrl={prevPageUrl}
          backButton={backButton}/>

        {/* Page content */}
        <div className="flex flex-col py-[12px] gap-[12px] overflow-x-clip overflow-y-scroll">
          {children}
        </div>

        {/* Logout modal prompt */}
        <LogoutPrompt/>
        
      </div>
    </div>
  )
}