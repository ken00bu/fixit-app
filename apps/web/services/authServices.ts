import { http } from "../lib/http";

function loginWithCredentials(email: string, password: string) {
    return http('/auth/login', {
        method: 'POST',
        body: { email, password }
    })
}

function loginWithToken(token: string) {
    return http(`/auth/verify/${token}`, {
        method: 'PATCH'
    })
}

function register(form: Record<string, any>) {
    return http('/auth/register', {
        method: 'POST',
        body: form
     })
}

async function changePassword(oldPassword: string, newPassword: string) {
    return http('/auth/change-password', {
        method: 'PATCH',
        body: { oldPassword, newPassword }
    });
}

export { loginWithCredentials, loginWithToken, register, changePassword }