import { API_URL } from "@/config/config"
import { HttpMethod } from "../types/http"

interface RequestOptions {
    method?: HttpMethod
    body?: unknown
    params?: Record<string, string>,
    cache?: RequestCache
}

export class HttpError extends Error {
    constructor(public status: number, message: string) {
        super(message)
    }
}

export async function http(path: string, options: RequestOptions = {}) {
    const { method = 'GET', body, params } = options

    const url = new URL(`${API_URL}${path}`)
    if(params){
        Object.entries(params).forEach(([key, value])=>{
            url.searchParams.set(key, value)
        })
    }

    const isServer = typeof window === 'undefined'
    let cookieHeader: string | undefined
    if (isServer) {
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()
        cookieHeader = cookieStore.toString()
    }   

    const response = await fetch(url.toString(), {
        method,
        headers: {
            ...body ? body instanceof FormData ?    undefined : { 'Content-Type': 'application/json' } : undefined,
            ...cookieHeader ? { 'Cookie': cookieHeader } : undefined
        },
        body: body ? body instanceof FormData ? body : JSON.stringify(body) : undefined,
        credentials: 'include',
        cache: options.cache ? options.cache : undefined
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new HttpError(response.status, errorText || response.statusText)
    }

    return response.json()

}