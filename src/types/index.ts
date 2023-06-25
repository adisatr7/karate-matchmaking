
/**
 * SVG React Component type definition
*/
export type SVGComponent = React.SVGProps<SVGSVGElement>

/**
 * SVG Icon type definition
*/
export type SVGIcon = React.FunctionComponent<SVGComponent>

/**
 * User data type definition used to login
 */
export type User = {
  id: string,
  name: string,
  password: string
}

/**
 * Tournament type definition
 */
export type Pertandingan = {
  idPertandingan: string,
  namaPertandingan: string,
  status: "pendaftaran" | "akan main" | "berlangsung" | "selesai" | "ditunda" | "dibatalkan",
  penyelenggara: string,
  kelas: KelasPertandingan[]
}
 
/**
* Tournament subclass type definition
*/
export type KelasPertandingan = {
  idKelas: string,
  namaKelas: string,
  matches: Match[]
}

/**
  * Match type definition
  */
export type Match = {
  idMatch: string,
  namaMatch?: string,
  idMatchBerikutnya: string,
  waktuMain: string,
  status: "akan main" | "berlangsung" | "selesai" | "ditunda" | "dibatalkan",
  pemenang: "petarung1" | "petarung2" | "seri" | null
  petarung: Petarung[]
}

/**
 * Fighter type definition
 */
export type Petarung = {
  idPetarung: string,
  namaPetarung: string,
  idTim?: string,
  namaTim?: string,
}