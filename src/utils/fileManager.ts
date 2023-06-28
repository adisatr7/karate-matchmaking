import { BaseDirectory, createDir, writeTextFile } from "@tauri-apps/api/fs"
import useNotification from "../hooks/useNotification"


/**
 * Create a folder inside the OS' `%AppData%` directory.
 * 
 * * On Windows: `C:\Users\<username>\AppData\Roaming\`
 * * On Mac: `/Users/<username>/Library/Application Support/`
 * * On Linux: `/home/<username>/.local/share/`
 * 
 * @param folderName The name of the folder to be created
 */
export const createFolder = async (folderName: string) => {
  await createDir(folderName, {
    dir: BaseDirectory.AppData,
    recursive: true
  }).catch(err => {
    useNotification("Terjadi kesalahan saat membuat folder baru", err)
  })
}

/**
 * Write data into a file
 * 
 * @param content The content to be written into the file
 * @param filepath The path to the file including the file name
 */
export const writeInto = async (content: any, filepath: string) => {
  await writeTextFile({
    path: `${filepath}.data`,
    contents: JSON.stringify(content)
  },
    { dir: BaseDirectory.AppData }
  ).catch(err => {
    useNotification("Terjadi kesalahan saat membuat file baru", err)
  })
}