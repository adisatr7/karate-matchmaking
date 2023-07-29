import useNotification from "../../hooks/useNotification"
import { MatchStatusOptions } from "../../types"


/**
 * Get the color for bracket block or line based on the match's status and who's winning.
 * 
 * @param status The match's status
 * @param isWinning Whether the contestant is winning or not
 * 
 * @returns The color's Tailwind class name
 */
export default function statusColor(status: MatchStatusOptions, isWinning: boolean): string {
  switch (status) {
    case "akan main":
      return "bg-stone-500"

    case "berlangsung":
      return "bg-primary-gradient"

    case "selesai":
      if (isWinning) 
        return "bg-secondary-gradient"
      else 
        return "bg-stone-500"

    case "dibatalkan" || "ditunda":
      return "bg-stone-800"

    default:
      useNotification(
        "Terjadi kesalahan",
        "Status pertandingan tidak dikenali!"
      )
      return ""
  }
}
