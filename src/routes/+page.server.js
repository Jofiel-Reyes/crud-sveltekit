import { fail } from '@sveltejs/kit';

export async function load() {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();
    
    return {
        posts: posts
    };
}

export const actions = {
    crear: async ({ request }) => {
        const formData = await request.formData();
        const title = formData.get('title');
        const body = formData.get('body');
        
        // Validación
        if (!title || title.trim() === '') {
            return fail(400, { 
                error: 'El título es obligatorio',
                field: 'title'
            });
        }
        
        if (!body || body.trim() === '') {
            return fail(400, { 
                error: 'El cuerpo es obligatorio',
                field: 'body'
            });
        }
        
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title.trim(),
                body: body.trim(),
                userId: 1
            })
        });
        
        const newPost = await response.json();
        console.log('Publicación creada:', newPost);
        
        return { success: true };
    },
    
    actualizar: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id');
        const title = formData.get('title');
        const body = formData.get('body');
        
        // Validación
        if (!title || title.trim() === '') {
            return fail(400, { 
                error: 'El título es obligatorio',
                field: 'title'
            });
        }
        
        if (!body || body.trim() === '') {
            return fail(400, { 
                error: 'El cuerpo es obligatorio',
                field: 'body'
            });
        }
        
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                title: title.trim(),
                body: body.trim(),
                userId: 1
            })
        });
        
        const updatedPost = await response.json();
        console.log('Publicación actualizada:', updatedPost);
        
        return { success: true };
    },
    
    eliminar: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id');
        
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
            method: 'DELETE'
        });
        
        console.log('Publicación eliminada, ID:', id);
        
        return { success: true };
    }
};