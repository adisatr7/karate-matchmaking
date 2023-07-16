import { Link, useNavigate } from "react-router-dom"
import ProfileButton from "./ProfileButton"
import BackButton from "./BackButton"


type PropsType = {
  currentPageName: string,
  prevPageName?: string,
  prevPageUrl?: string,
  backButton?: boolean
}

export default function Header({ currentPageName, prevPageName, prevPageUrl, backButton }: PropsType) {
  const navigate = useNavigate()


  const handleGoToPrevPage = () => {
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
      <ProfileButton/>
    </div>
  )
}