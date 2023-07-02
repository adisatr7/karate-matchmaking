import { v4 as uuidv4 } from "uuid"
import { BaseDirectory, readDir } from "@tauri-apps/api/fs"
import useNotification from "../hooks/useNotification"


/**
 * Generate a random ID for a new object
 * 
 * @returns Random ID
 */
export function generateID (prefix?: string) {

  // Generate a random ID using UUID v4
  const id = uuidv4()

  // If prefix is provided, add it to the ID
  const pre = prefix + "-" || ""

  // Return the whole ID
  return pre + id
}

/**
 * Checks if the given ID is unique.
 * 
 * @param id ID to be checked
 */
// export async function isIDUnique (id: string) {
//   return new Promise(async (resolve, reject) => {

//     // Read all files in the given path
//     await readDir("", { dir: BaseDirectory.AppData })
//     .then(folder => {

//       // Filter the files and put all IDs into a list of IDs
//       const filteredIds = folder.filter(file => {
//         file.name?.endsWith(".data")
//       })
      
//       // Remove the file extension from the file name
//       .map(file => {
//         file.name?.replace(".data", "")
//       })

//       // Check if the given ID is unique
//       const isUnique = !filteredIds.includes(id)
//       resolve(isUnique)
//     })

//     .catch(err => {
//       useNotification("Terjadi kesalahan saat memeriksa ID", err)
//       reject(err)
//     })
//   })
// }