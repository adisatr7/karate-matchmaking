import { Gender } from "../types"


/**
 * Converts `m` and `f` to `Laki-laki` and `Perempuan` respectively
 *
 * @returns `Laki-laki` or `Perempuan`
 */
export const genderToString = (gender: Gender | string): string => {
  if (gender === "m") 
    return "Laki-laki"

  else if (gender === "f") 
    return "Perempuan"

  else 
    return ""
}
