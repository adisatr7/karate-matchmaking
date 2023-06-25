import { BaseDirectory, createDir, readTextFile, writeTextFile } from "@tauri-apps/api/fs"
import useNotification from "../hooks/useNotification"

import defaultTournaments from "../data/defaultTournaments.json"
import { Pertandingan } from "../types"


const initiateTournamentsData = async () => {

  // Create 'data' folder
  await createDir("data", { 
    dir: BaseDirectory.AppData, 
    recursive: true 
  }).catch(err => {
    useNotification("Terjadi kesalahan saat membuat folder baru", err)
  })
  
  // Create 'tournaments.data' file
  await writeTextFile({
    path: "data/tournaments.data",
    contents: JSON.stringify(defaultTournaments)},
    { dir: BaseDirectory.AppData }
  ).catch(err => {
    useNotification("Terjadi kesalahan saat membuat file baru", err)
  })
}

export const readTournamentsData = () => {
  let tournaments: Pertandingan[] = []

  readTextFile(
      "data/tournaments.data", {
      dir: BaseDirectory.AppData,
    }
  ).then(data => {
    tournaments = JSON.parse(data)
  }).catch(err => {
    useNotification("Terjadi kesalahan saat membaca file `tournaments.data`", err)
    initiateTournamentsData()
  }).finally(() => {
    return tournaments
  })
}