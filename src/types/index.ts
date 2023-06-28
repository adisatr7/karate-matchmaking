/**
 * SVG React Component type definition
*/
export type SVGComponent = React.SVGProps<SVGSVGElement>

/**
 * SVG Icon type definition
*/
export type SVGIcon = React.FunctionComponent<SVGComponent>


/**
 * Options for currentPath state
 */
export type PathOptions = "highlight" | "tournaments" | "teams" | "athletes" | "settings"


/**
 * User data type definition used to login
 */
export type User = {
  id: string,
  name: string,
  password: string,
  imageUrl: string
} | null

/**
 * Tournament type definition
 */
export type Tournament = {
  idPertandingan: string,
  namaPertandingan: string,
  desc: string,
  status: "pendaftaran" | "akan main" | "berlangsung" | "selesai" | "ditunda" | "dibatalkan",
  penyelenggara: string,
  kelas: TournamentClass[],
  [key: string]: any    // Index signature to allow string indexing
}
 
/**
* Tournament subclass type definition
*/
export type TournamentClass = {
  idKelas: string,
  namaKelas: string,
  daftarTim: Contestant[],
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
  kontestan: Contestant[]
}

/**
 * Contestant type definition
 */
export type Contestant = {
  idAtlet: string,
  namaAtlet: string,
  idTim: string,
  namaTim: string,
}

/**
 * Team type definition
 */
export type Team = {
  idTim: string,
  namaTim: string,
  inisial: string,
  asal: string,
  idAnggota: string[]
}

/**
 * Athlete type definition
 */
export type Athlete = {
  idAtlet: string,
  namaAtlet: string,
  imageUrl?: string,
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