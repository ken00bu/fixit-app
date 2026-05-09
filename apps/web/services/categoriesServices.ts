import { http } from "../lib/http";

async function fetchCategories(){
    return await http('/categories')
}

async function createCategory(name: string, priorityId: number){
    console.log('creating category with', { name, priorityId })
    return await http('/categories', {
        method: 'POST',
        body: {
            name,
            priorityId
        }
    })
    
}

async function deleteCategory(categoryId: number){
    return await http(`/categories/${categoryId}`, {
        method: 'DELETE'
    })
}

export { fetchCategories, deleteCategory, createCategory }