<script>
    import { enhance } from '$app/forms';
    
    export let data;
    export let form; // Para recibir los errores del servidor
    
    let posts = data.posts;
    let editingId = null;
    let editTitle = '';
    let editBody = '';
    
    function handleSubmit() {
        return async ({ result, update }) => {
            if (result.type === 'success') {
                const formElement = document.querySelector('form[action="?/crear"]');
                const title = formElement.title.value;
                const body = formElement.body.value;
                
                const newPost = {
                    id: posts.length + 1,
                    title: title,
                    body: body,
                    userId: 1
                };
                
                posts = [newPost, ...posts];
                formElement.reset();
            }
            await update();
        };
    }
    
    function startEdit(post) {
        editingId = post.id;
        editTitle = post.title;
        editBody = post.body;
    }
    
    function cancelEdit() {
        editingId = null;
        editTitle = '';
        editBody = '';
    }
    
    function handleUpdate() {
        return async ({ result, update }) => {
            if (result.type === 'success') {
                posts = posts.map(post => 
                    post.id === editingId 
                        ? { ...post, title: editTitle, body: editBody }
                        : post
                );
                cancelEdit();
            }
            await update();
        };
    }
    
    function handleDelete() {
        return async ({ result, formData }) => {
            if (result.type === 'success') {
                const id = parseInt(formData.get('id'));
                posts = posts.filter(post => post.id !== id);
            }
        };
    }
</script>

<h1>Crear Nueva Publicación</h1>

<form method="POST" action="?/crear" use:enhance={handleSubmit}>
    <div>
        <label for="title">Título:</label>
        <input type="text" id="title" name="title" required />
        {#if form?.error && form?.field === 'title'}
            <p style="color: red;">{form.error}</p>
        {/if}
    </div>
    
    <div>
        <label for="body">Cuerpo:</label>
        <textarea id="body" name="body" required></textarea>
        {#if form?.error && form?.field === 'body'}
            <p style="color: red;">{form.error}</p>
        {/if}
    </div>
    
    <button type="submit">Crear Publicación</button>
</form>

<hr />

<h1>Lista de Publicaciones</h1>

{#each posts as post}
    <div class="post">
        {#if editingId === post.id}
            <form method="POST" action="?/actualizar" use:enhance={handleUpdate}>
                <input type="hidden" name="id" value={post.id} />
                
                <div>
                    <label>Título:</label>
                    <input type="text" name="title" bind:value={editTitle} required />
                    {#if form?.error && form?.field === 'title'}
                        <p style="color: red;">{form.error}</p>
                    {/if}
                </div>
                
                <div>
                    <label>Cuerpo:</label>
                    <textarea name="body" bind:value={editBody} required></textarea>
                    {#if form?.error && form?.field === 'body'}
                        <p style="color: red;">{form.error}</p>
                    {/if}
                </div>
                
                <button type="submit">Guardar</button>
                <button type="button" on:click={cancelEdit}>Cancelar</button>
            </form>
        {:else}
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <button on:click={() => startEdit(post)}>Editar</button>
            
            <form method="POST" action="?/eliminar" use:enhance={handleDelete} style="display: inline;">
                <input type="hidden" name="id" value={post.id} />
                <button type="submit">Eliminar</button>
            </form>
        {/if}
        <hr>
    </div>
{/each}