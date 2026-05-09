export function validatePassword(password: string){
    let errors = ''

    if (password.length < 8) {
        errors += " Minimal 8 karakter, "
    }

    if (!/[A-Z]/.test(password)) {
        errors += "Minimal 1 Huruf besar, "
    }

    if (!/\d/.test(password)) {
        errors += " Minimal 1 Angka, "
    }

    const error = errors.slice(0, -2);
    return error.length > 0 ? error : null
    
}