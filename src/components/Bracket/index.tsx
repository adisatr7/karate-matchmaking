

export default function Bracket({}) {

  const calculateTotalMatches = (numberOfTeams: number) => {
    let totalMatches = 0
    let temp = numberOfTeams
    while (temp > 1) {
      totalMatches += temp
      temp /= 2
    }
    return totalMatches
  }

  return (
    <></>
  )
}