export function getIdByName(name: string, data: any) {
    const obj = data.find((field: any)=> field.name === name)
    return obj.id
}