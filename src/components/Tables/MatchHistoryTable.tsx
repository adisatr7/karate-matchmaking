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
        { matchHistory.length > 0 ? matchHistory.map((mh: MatchHistory, historyIndex: number) => {

          const time = matches[historyIndex]?.getPlayDate() || ""

            // Render the table row
            return (
              <tr
                key={historyIndex}
                className={`bg-opacity-40 hover:bg-stone-700 rounded-full ${historyIndex % 2 === 0 ? "bg-stone-900" : "bg-stone-800"}`}>

                {/* Render table cells based on the header labels */}
                { headerLabels.map((label: string, rowIndex: number) => (
                    <td key={rowIndex} className={`px-[10px] py-[4px]`}>
                      { 
                        label === "NO" ? historyIndex + 1 
                          : label === "WAKTU TANDING" ? time
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
            )})

          // If there is no match history, render a single row with a message
          : <tr className="rounded-full bg-opacity-40 hover:bg-stone-700 bg-stone-800">
              <td className="px-[10px] text-center text-caption py-[12px] opacity-60" colSpan={headerLabels.length}>Riwayat pertandingan kosong</td>
            </tr>
        }
      </tbody>
    </table>
  )
}

const headerRowStyle = "px-[10px] py-[4px] font-bold text-left"