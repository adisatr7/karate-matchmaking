import { BaseDirectory, createDir, writeTextFile } from "@tauri-apps/api/fs"
import useNotification from "../../hooks/useNotification"


export const createDataFolder = async () => {
  await createDir("data", {
    dir: BaseDirectory.AppData,
    recursive: true
  }).catch(err => {
    useNotification("Terjadi kesalahan saat membuat folder baru", err)
  })
}

export const writeInto = async (data: any, filename: string) => {
  await writeTextFile({
    path: `data/${filename}.data`,
    contents: JSON.stringify(data)
  },
    { dir: BaseDirectory.AppData }
  ).catch(err => {
    useNotification("Terjadi kesalahan saat membuat file baru", err)
  })
}