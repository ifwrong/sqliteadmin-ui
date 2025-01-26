<script lang="ts">
  import { API } from '$lib/api'
  import { app } from '$lib/stores/app.svelte'
  import type { Credentials } from '$lib/types'
  import Login from './login.svelte'
  import TableViewer from './table-viewer.svelte'

  async function handleLogin(credentials: Credentials) {
    const api = new API(credentials)
    const resp = await api.ping()
    if (resp.ok) {
      app.credentials = credentials
    } else {
      // TODO: handle error
      console.error('Error logging in', resp.error)
    }
  }
</script>

{#if app.credentials}
  <TableViewer credentials={app.credentials} />
{:else}
  <Login onLogin={handleLogin} />
{/if}
