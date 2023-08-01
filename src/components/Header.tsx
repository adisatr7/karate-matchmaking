import { Link, useNavigate } from "react-router-dom"
import ProfileButton from "./ProfileButton"
import BackButton from "./BackButton"
import { useAppDispatch } from "../store"
import { collapseSidebar } from "../store/slices/sidebarSlice"


type PropsType = {
  currentPageName: string
  prevPageName?: string
  prevPageUrl?: string
  backButton?: boolean
  hideProfileButton?: boolean
}

export default function Header({ currentPageName, prevPageName, prevPageUrl, backButton, hideProfileButton }: PropsType) {

  /**
   * React router's navigate function.
   */
  const navigate = useNavigate()

  /**
   * Redux's dispatch function.
   */
  const dispatch = useAppDispatch()


  /**
   * Handles the click event on the prev page button.
   */
  const handleGoToPrevPage = () => {
    dispatch(collapseSidebar())

    if (prevPageUrl)
      navigate(prevPageUrl)

    else
      window.history.back()
  }
  

  return (
    <div className="flex flex-row items-end justify-between w-full h-fit">
      <div className="flex flex-row items-center">
          {/* Back button */}
          { backButton && (
            <div className="flex flex-row justify-center items-center mr-[12px]">
              <BackButton/>
            </div>
            ) 
          }
        { // If prev page name and url is provided
          prevPageName &&
          <div className="flex flex-row items-center gap-[12px]">

            {/* Prev page button */}
            <button onClick={handleGoToPrevPage}>
              <h2 className="text-stone-300 hover:text-white hover:underline font-quicksand text-subheading">
                {prevPageName}
              </h2>
            </button>
            <p className="text-white font-quicksand text-subheading mr-[13px]">/</p>
                    
          </div>
        }
        <h1 className="font-bold text-white font-quicksand text-heading">{currentPageName}</h1>
      </div>
      { !hideProfileButton &&
        <ProfileButton/>
      }
    </div>
  )
}