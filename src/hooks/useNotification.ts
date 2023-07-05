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

      // Converts the title and message to a string if they are not already.
      title = typeof title === "string" ? title : JSON.stringify(title)
      message = typeof message === "string" ? message : JSON.stringify(message)

      sendNotification({ title: title, body: `${message || ""}` })
    }
  } catch (err) {
    useNotification("Notification error", err)
  }
}