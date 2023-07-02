import { Link } from "react-router-dom"
import ProfileButton from "../../components/ProfileButton"
import { Back as BackButton } from "../../assets/icons"


type PropsType = {
  currentPageName: string,
  prevPageName?: string,
  prevPageUrl?: string,
}

export default function Header({ currentPageName, prevPageName, prevPageUrl }: PropsType) {

  return (
    <div className="flex flex-row items-end justify-between w-full h-fit">
      <div className="flex flex-row items-center">
        { // If prev page name and url is provided
          prevPageName && prevPageUrl &&
          <div className="flex flex-row items-center gap-[10px]">
          
            {/* Back button */}
            <BackButton
              onClick={() => window.history.back()}
              className="text-gray-400 bg-cover hover:text-white hover:cursor-pointer"/>

            {/* Prev page button */}
            <Link to={prevPageUrl}>
              <h2 className="text-stone-300 hover:text-white font-quicksand text-subheading">
                {prevPageName}
              </h2>
            </Link>
            <p className="text-white font-quicksand text-subheading mr-[10px]">/</p>
                    
          </div>
        }
        <h1 className="font-bold text-white font-quicksand text-heading">{currentPageName}</h1>
      </div>
      <ProfileButton/>
    </div>
  )
}