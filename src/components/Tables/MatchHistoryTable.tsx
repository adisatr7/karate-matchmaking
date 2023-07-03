import Match from "../../data/classes/Match"
import MatchHistory from "../../data/classes/MatchHistory"


type PropsType = {
  matchHistory: MatchHistory[],
  matches: Match[]
}

export default function MatchHistoryTable({ matchHistory, matches }: PropsType) {
  const headerLabels = [
    "NO",
    "WAKTU TANDING",
    "STATUS",
    "YUKO",
    "WAZARI",
    "IPPON"
  ]

  return (
    <table className="w-full text-white bg-opacity-50 border border-separate rounded-md table-auto h-fit bg-dark-glass border-stone-600 backdrop-blur-md font-quicksand">
      
      {/* Header */}
      <thead className="sticky top-0 border border-separate rounded-md rounded-t-lg bg-dark-glass hover:bg-stone-700 border-stone-600">
        <tr className="">
          { headerLabels.map((label: string, index: number) => {
            return ( <td key={index} className={headerRowStyle}>{label}</td> )
          })}
        </tr>
      </thead>
      
      <tbody>
        { matchHistory.map((mh: MatchHistory, historyIndex: number) => {

            // Render the table row
            return (
              <tr
                key={historyIndex}
                className={`bg-opacity-40 hover:bg-primary-gradient rounded-full hover:cursor-pointer ${historyIndex % 2 === 0 ? "bg-stone-900" : "bg-stone-800"}`}>

                {/* Render table cells based on the header labels */}
                { headerLabels.map((label: string, rowIndex: number) => (
                    <td key={rowIndex} className={`px-[10px] py-[4px]`}>
                      { 
                        label === "NO" ? historyIndex + 1 
                          : label === "WAKTU TANDING" ? matches[historyIndex].getPlayDate()
                          : label === "STATUS" 
                            ? mh.getIsWinning() 
                              ? "Menang"
                              : "Kalah"
                          : label === "YUKO" ? mh.getYuko()
                          : label === "WAZARI" ? mh.getWazari()
                          : label === "IPPON" ? mh.getIppon()
                          : ""
                      }
                    </td>
                ))}
              </tr>
        )})}
      </tbody>
    </table>
  )
}

const headerRowStyle = "px-[10px] py-[4px] font-bold text-left"