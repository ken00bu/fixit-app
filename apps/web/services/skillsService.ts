import { http } from "../lib/http";
import type { Skill } from "../types/skill";

async function fetchSkills(): Promise<Skill[]>{
    return await http('/skills')
}

export { fetchSkills }