import { isPermissionGranted, requestPermission, sendNotification } from "@tauri-apps/api/notification"


/**
 * Send a notification to the user through the OS's notification system.
 * 
 * @param title The title of the notification.
 * @param message The message of the notification.
 */
export default async function useNotification (title: any, message?: any) {
  try {
    let permissionGranted = await isPermissionGranted()

    if (!permissionGranted) {
      const permission = await requestPermission()
      permissionGranted = permission === "granted"
    }
    if (permissionGranted) {
      sendNotification({ title: `${JSON.stringify(title)}`, body: `${JSON.stringify(message) || ""}` })
    }
  } catch (err) {
    useNotification("Notification error", err)
  }
}