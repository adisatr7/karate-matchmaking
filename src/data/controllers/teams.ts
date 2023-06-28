import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs"
import { Athlete, Team } from "../../types"
import defaultTeamsData from "../defaults/defaultTeams.json"
import { getAthleteById, joinTeam, leaveTeam } from "./athletes"
import { createDataFolder, writeInto } from "./utils"
import useNotification from "../../hooks/useNotification"


/**
 * Save passed argument into 'teams.data' file
 * 
 * @param teams List of all teams to be saved to 'teams.data' file
 */
export const saveTeamsData = async (teams: Team[] | any) => {
    await createDataFolder()
    await writeInto(teams, "teams")
}


/**
 * Initiate teams data by creating the 'data' folder and
 * 'teams.data' file if they don't exist yet
 */
export const assignDefaultTeamsData = async () => {
  saveTeamsData(defaultTeamsData)
}


/**
 * Get all teams from 'teams.data' file
 * 
 * @returns List of all teams from 'teams.data' file
 */
export const getAllTeams = async (): Promise<Team[]> => {
  return new Promise((resolve, reject) => {
    readTextFile(
      "data/teams.data", {
      dir: BaseDirectory.AppData,
    }).then(data => {
      resolve(JSON.parse(data))
    }).catch(err => {
      useNotification("Terjadi kesalahan saat membaca file `teams.data`", err)
      assignDefaultTeamsData()
      reject(err)
    })
  })
}


/**
 * Get team object with the specified id
 * 
 * @param id Team's id to be searched
 * @returns Team object with the specified id
 */
export const getTeamById = async (id: string): Promise<Team> => {
  return new Promise(async (resolve, reject) => {
    await getAllTeams().then(teams => {
      const team = teams.find(team => team.idTim === id)
      if (team)
        resolve(team)
    })
    .catch(err => {
      useNotification("Terjadi kesalahan saat membaca file `teams.data`", err)
      reject(err)
    })
  })
}


/**
 * Add new team to 'teams.data' file
 * 
 * @param newTeam Team object to be added
 */
export const addTeam = async (newTeam: Team) => {
  const teams = await getAllTeams()
  teams.push(newTeam)

  saveTeamsData(teams)
}


/**
 * Update team data in 'teams.data' file
 * 
 * @param updatedTeam Team object to be updated
 */
export const updateTeam = async (updatedTeam: Team) => {
  const teams = await getAllTeams()
  const index = teams.findIndex(tim => tim.idTim === updatedTeam.idTim)
  teams[index] = updatedTeam

  saveTeamsData(teams)
}


/**
 * Delete team from 'teams.data' file
 * 
 * @param id Team's id to be deleted
 */
export const deleteTeam = async (id: string) => {
  const teams = await getAllTeams()
  const index = teams.findIndex(team => team.idTim === id)
  teams.splice(index, 1)

  saveTeamsData(teams)
}


/**
 * Get all members object from the specified team
 * 
 * @param teamId Team's id to get all members from
 * @returns List of all members object from the specified team
 */
export const getAllMembers = async (teamId: string): Promise<Athlete[]> => {
  return new Promise(async (resolve, reject) => {
    const teams = await getAllTeams()
    const team = teams.find(team => team.idTim === teamId)

    // If team is not found, reject the promise
    if (!team) 
      reject("Team not found")

    // Create a list of members object from the specified team
    const members: Athlete[] = []

    // Append each member object to the list
    team?.idAnggota.forEach(async (memberId) => {
      const member = await getAthleteById(memberId)

      if(member) 
        members.push(member)
    })

    // Resolve the promise with the list of members object
    resolve(members)
  })
}


/**
 * Get all members id from the specified team
 * 
 * @param teamId Team's id to get all members from
 * @returns List of all members id from the specified team
 */
export const getAllMembersId = async (teamId: string): Promise<string[]> => {
  return new Promise(async (resolve, reject) => {

    // Get the specified team data
    const team = await getTeamById(teamId)

    // Get all members id from the specified team
    const memberIds = team.idAnggota

    // If member is not found, reject the promise
    if (!memberIds)
      reject("Team not found")

    // Resolve the promise with the list of members id
    resolve(memberIds!)
  })
}


/**
 * Check if a member with specified ID belongs to a particular team
 * 
 * @param teamId Team's ID to be checked
 * @param memberId Member's ID to be checked
 * 
 * @returns True if the member belongs to the team, false otherwise
 */
export const isMember = async (teamId: string, memberId: string): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const team = await getTeamById(teamId)
      const memberIds = team.idAnggota
      resolve(memberIds.includes(memberId))
    } catch (err) {
      useNotification("Terjadi kesalahan", err)
      reject(err)
    }
  })
}


/**
 * Add new member to a team
 * 
 * @param teamId Team's ID the new member will be added to
 * @param newMemberId The new member ID to be added to the team
 */
export const addMember = async (teamId: string, newMemberId: string) => {
  const teams = await getAllTeams()
  const team = teams.find(team => team.idTim === teamId)
  team?.idAnggota.push(newMemberId)

  const newMember = await getAthleteById(newMemberId)

  // If the member is already in a team
  if(newMember?.idTimSekarang !== teamId)

    // Remove it from the previous team member list first
    kickMember(newMember!.idTimSekarang, newMemberId)

    // Update member's active team ID
    joinTeam(newMember!, teamId)

  // Save changes
  saveTeamsData(teams)
}


/**
 * Remove a member from a team
 * 
 * @param teamId Team's id the member will be removed from
 * @param memberId Member's id to be removed from the team
 */
export const kickMember = async (teamId: string, memberId: string) => {
  const teams = await getAllTeams()
  const team = teams.find(team => team.idTim === teamId)
  const index = team?.idAnggota.findIndex(id => id === memberId)
  team?.idAnggota.splice(index!, 1)

  // Update member's teamId
  const member = await getAthleteById(memberId)

  if(member?.idTimSekarang === teamId)
    leaveTeam(member!)

  // Save changes
  saveTeamsData(teams)
}