
import imageBackground from "./assets/background2.jpg"

// Import components
import Sidebar from "./components/Sidebar"

// Import icons that will be used throughout the app
import { library } from "@fortawesome/fontawesome-svg-core"
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons"

// Register the icons
library.add(faBars, faXmark)  


export default function App() {
  

  return (
    /* Main window */
    <div className="w-screen h-screen flex flex-row">

      {/* Sidebar - left side, collapsible */}
      <Sidebar/>

      {/* Main content - right side, scrollable */}
      <div style={{ backgroundImage: `url(${imageBackground})` }} className="flex flex-1 bg-cover pl-[120px] pr-[20px] py-[28px]">

        {/* Card 1 */}
        <div className="h-fit w-fit rounded-md bg-opacity-80 backdrop-blur-lg p-[24px] bg-stone-800">
          <h2 className="text-white">Hello world</h2>
        </div>


        {/* Background image */}
        {/* <img src={imageBackground} className="absolute bg-cover h-full w-full -z-100"/> */}

        {/* Pseudo-element for background blur */}
        {/* <div className="absolute top-0 left-0 w-full h-full backdrop-blur-[2px]"/> */}

      </div>

    </div>
  )
}