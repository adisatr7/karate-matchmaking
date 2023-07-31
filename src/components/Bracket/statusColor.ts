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
export default function statusColor(
  status: MatchStatusOptions,
  isWinning: boolean
): string {
  switch (status) {
    case "akan main":
      return "bg-stone-900 border border-stone-700 bg-opacity-50 hover:bg-opacity-70 hover:bg-stone-800"

    case "berlangsung":
      return "bg-primary-gradient hover:bg-none hover:bg-red-700 hover:underline"

    case "selesai":
      if (isWinning) 
        return "bg-secondary-gradient hover:bg-none hover:bg-blue-800"
      else 
        return "hover:bg-stone-700 bg-stone-700 border border-stone-600 bg-opacity-50"

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
