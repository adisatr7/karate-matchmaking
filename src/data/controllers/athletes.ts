import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs"
import useNotification from "../../hooks/useNotification"
import { Athlete } from "../../types"
import defaultAthletesData from "../defaults/defaultAthletes.json"
import { addMember, isMember, kickMember } from "./teams"
import { createDataFolder, writeInto } from "./utils"


/**
 * Save all athletes into 'athletes.data' file
 * 
 * @param athletes List of all athletes to be saved to 'athletes.data' file
 */
export const saveAthletesData = async (athletes: Athlete[] | any) => {
  await createDataFolder()
  await writeInto(athletes, "athletes")
}


/**
 * Initiate athletes data by creating the 'data' folder 
 * and 'athletes.data' file if they don't exist yet
 */
export const assignDefaultAthletesData = async () => {
  saveAthletesData(defaultAthletesData)
}


/**
 * Get all athletes from 'athletes.data' file
 * 
 * @returns List of all athletes from 'athletes.data' file
 */
export const getAllAthletes = async (): Promise<Athlete[]> => {
  return new Promise((resolve, reject) => {
    readTextFile(
      "data/athletes.data", {
      dir: BaseDirectory.AppData
    }).then(res => {
      resolve(JSON.parse(res))
    }).catch(err => {
      useNotification("Terjadi kesalahan saat membaca file", err)
      assignDefaultAthletesData()
      reject(err)
    })
  })
}


/**
 * Get an athlete object with the specified id
 * 
 * @param id The id of the athlete to be searched
 * @returns The athlete object with the specified id
 */
export const getAthleteById = async (id: string): Promise<Athlete> => {
  return new Promise(async (resolve, reject) => {
    let athletes = await getAllAthletes()
    let athlete = athletes.find(atlet => atlet.idAtlet === id)

    if (athlete) resolve(athlete)
    else reject("Athlete not found")
  })
}


/**
 * Add an athlete object and save it to 'athletes.data' file
 * 
 * @param athlete The athlete object to be added
 */
export const addAthlete = async (athlete: Athlete) => {
  let athletes = await getAllAthletes()
  athletes.push(athlete)

  saveAthletesData(athletes)
}


/**
 * Delete an athlete object with the specified id
 * 
 * @param athlete The athlete object to be deleted
 */
export const updateAthlete = async (athlete: Athlete) => {
  let athletes = await getAllAthletes()
  let athleteIndex = athletes.findIndex(atlet => atlet.idAtlet === athlete.idAtlet)

  athletes[athleteIndex] = athlete

  saveAthletesData(athletes)
}


/**
 * Delete an athlete object with the specified id
 * 
 * @param athlete The athlete object to be deleted
 */
export const deleteAthlete = async (athlete: Athlete) => {
  let athletes = await getAllAthletes()
  let athleteIndex = athletes.findIndex(atlet => atlet.idAtlet === athlete.idAtlet)

  // If the athlete is a part of a team, remove them from that team first
  if (athletes[athleteIndex].idTimSekarang !== "")
    kickMember(athlete.idTimSekarang, athlete.idAtlet)

  // Delete the athlete object
  athletes.splice(athleteIndex, 1)

  // Save the updated athletes data
  saveAthletesData(athletes)
}


/**
 * Have an athlete join a team
 * 
 * @param athlete Athlete object to be added to the team
 * @param teamId The id of the team to be joined
 */
export const joinTeam = async (athlete: Athlete, teamId: string) => {
  let athletes = await getAllAthletes()
  let athleteIndex = athletes.findIndex(atlet => atlet.idAtlet === athlete.idAtlet)

  // If the athlete is already a part of another team, remove them from that team first
  if (athletes[athleteIndex].idTimSekarang !== "")
    kickMember(athlete.idTimSekarang, athlete.idAtlet)

  // Add the athlete to the new team
  athletes[athleteIndex].idTimSekarang = teamId

  // Also update the team's member list
  if (!isMember(teamId, athlete.idAtlet))
    addMember(teamId, athlete.idAtlet)

  // Save the updated athletes data
  saveAthletesData(athletes)
}


/**
 * Have an athlete leave their team
 * 
 * @param athlete Athlete object to be removed from the team
 */
export const leaveTeam = async (athlete: Athlete) => {
  let athletes = await getAllAthletes()
  let athleteIndex = athletes.findIndex(atlet => atlet.idAtlet === athlete.idAtlet)

  // Remove the athlete from the team
  kickMember(athlete.idTimSekarang, athlete.idAtlet)
  athletes[athleteIndex].idTimSekarang = ""

  // Save the updated athletes data
  saveAthletesData(athletes)
}