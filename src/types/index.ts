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
export type Tournament = {
  idPertandingan: string,
  namaPertandingan: string,
  status: "pendaftaran" | "akan main" | "berlangsung" | "selesai" | "ditunda" | "dibatalkan",
  penyelenggara: string,
  kelas: TournamentClass[]
}
 
/**
* Tournament subclass type definition
*/
export type TournamentClass = {
  idKelas: string,
  namaKelas: string,
  daftarTim: Participant[],
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
  petarung: Participant[]
}

/**
 * Fighter type definition
 */
export type Participant = {
  idAtlet: string,
  namaAtlet: string,
  idTim?: string,
  namaTim?: string,
}

/**
 * Team type definition
 */
export type Team = {
  idTim: string,
  namaTim: string,
  inisial: string,
  asal: string,
  anggota: string[]
}

/**
 * Athlete type definition
 */
export type Athlete = {
  idAtlet: string,
  namaAtlet: string,
  jenisKelamin: "m" | "f",
  usia: number,
  berat: number,
  idTimSekarang: string
}

/**
 * Match history type definition
 */
export type MatchHistory = {
  idAtlet: string,
  idMatch: string,
  isWinning: boolean,
  yuko: number,
  wazari: number,
  ippon: number
}