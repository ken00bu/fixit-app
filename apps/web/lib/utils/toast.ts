import { notifications } from "@mantine/notifications"

export const toast = {
    success: (title: string, message = "berhasil!") => {
        notifications.show({
            title: title,
            message: message,
            color: "green",
            autoClose: 5000,
            
        })
    },
    error: (title: string, message = "gagal!") => {
        notifications.show({
            title: title,
            message: message,
            color: "red",
            autoClose: 5000,
        })
    }
}