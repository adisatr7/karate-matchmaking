import { useEffect, useState } from "react"
import { PolarArea } from "react-chartjs-2"
import { AthletePerformance } from "../types"
import "chart.js/auto"
import { ChartData } from "chart.js/auto"


type PropsType = {
  performanceData: AthletePerformance
}

type ChartOption = ChartData<"polarArea", number[], unknown>

export default function PerformanceChart({ performanceData }: PropsType) {
  const [dataset, setDataset] = useState<number[]>([])
  const [data, setData] = useState<ChartOption>({
    labels: [],
    datasets: []
  })

  /**
   * Assign the dataset to the state
   */
  const assignDataset = () => {
    let tempList: number[] = [0, 0, 0]

    if (performanceData === undefined) 
      return

    const { yuko, wazari, ippon }: AthletePerformance = performanceData
    const total = yuko + wazari + ippon

      
    tempList.forEach((_, index) => {

      switch (index) {
        case 0:
          tempList[index] = yuko / total
          break

        case 1:
          tempList[index] = wazari / total
          break

        case 2:
          tempList[index] = ippon / total
          break
      }
    })

    setDataset(tempList)
  }

  /**
   * Assign the data to the state
   */
  const assignData = () => {
    const temp: ChartOption = {
      labels: ["Yuko", "Wazari", "Ippon"],
      datasets: [{
        circular: true,
        clip: 0,
        data: dataset,
        borderWidth: 1,
        borderColor: ["rgba(0, 0, 0, 1)"],
        backgroundColor: [
          "rgba(81, 181, 27, 1)",
          "rgba(0, 154, 168, 1)",
          "rgba(211, 35, 65, 1)"
        ]
      }]
    }
    setData(temp)
  }

  // Assign the dataset and data to the state when the performance data is loaded
  useEffect(() => {
    assignDataset()
    assignData()
  }, [performanceData])
  
  return (
    <PolarArea 
      data={data}
      className="flex items-center justify-container bg-opacity-50 rounded-full bg-dark-glass w-[24px] h-[24px] border border-blue-800 border-opacity-50"
      options={{
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index"
          }
        },
        scales: {
          r: {
            grid: {
              display: false
            },
            ticks: {
              display: false
            }
          }
        }
      }}/>
  )
}