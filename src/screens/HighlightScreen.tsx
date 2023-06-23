import Sidebar from "../components/Sidebar"
import MenuBackground from "../components/MenuBackground"


export default function HighlightScreen() {
  return (
    /* Main window */
    <MenuBackground>

      {/* Sidebar - left side, collapsible */}
      <Sidebar/>

      {/* Main content - right side, scrollable */}
      <div className="flex flex-1 pl-[120px] pr-[20px] py-[28px]">

        {/* Card 1 */}
        <div className="h-fit w-fit rounded-md p-[24px] bg-dark-glass bg-opacity-50 backdrop-blur-md">
          <h2 className="text-white">Hello world</h2>
        </div>


        {/* Background image */}
        {/* <img src={imageBackground} className="absolute bg-cover h-full w-full -z-100"/> */}

        {/* Pseudo-element for background blur */}
        {/* <div className="absolute top-0 left-0 w-full h-full backdrop-blur-[2px]"/> */}

      </div>

    </MenuBackground>
  )
}