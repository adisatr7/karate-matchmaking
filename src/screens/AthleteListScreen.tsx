import { useState } from "react"
import MenuBackground from "../components/MenuBackground"
import Entry from "../components/Entry"
import Button from "../components/Button"
import { Search as SearchIcon } from "../assets/icons"
import AthletesTable from "../components/Tables/AthletesTable"


export default function AthleteListScreen() {
  const [searchKeyword, setSearchKeyword] = useState("")

  return (
    <MenuBackground pageName="Daftar Atlet">

      {/* Search bar and its buttons */}
      <div className="flex flex-row h-fit w-full gap-[10px]">
        <Entry 
          label="Cari nama atlet" 
          inputMode="text" 
          onChange={setSearchKeyword}
          leftIcon={SearchIcon}
          value={searchKeyword}
          className="flex-[2]"/>
        <Button 
          label="CARI ATLET"
          className="flex-[1]"/>
        <Button 
          label="DAFTARKAN ATLET BARU"
          className="flex-[1]"/>
        <Button 
          label="?"
          className="w-fit px-[18px]"/>
      </div>

      {/* Table | TODO: Implement search function5 */}
      <div className="flex flex-col w-full max-h-full overflow-y-scroll">
        <AthletesTable/>
      </div>

    </MenuBackground>
  )
}