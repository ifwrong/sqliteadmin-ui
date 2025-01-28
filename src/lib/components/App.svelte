<script lang="ts">
  import { API } from '$lib/api'
  import { app } from '$lib/stores/app.svelte'
  import type { Credentials } from '$lib/types'
  import Login from './login.svelte'
  import TableViewer from './table-viewer.svelte'

  let error = $state<string | null>(null)

  async function handleLogin(credentials: Credentials) {
    const api = new API(credentials)
    const resp = await api.ping()
    if (resp.ok) {
      app.credentials = credentials
      error = null
    } else {
      error = resp.message
      console.error('Error logging in', resp.message)
    }
  }
</script>

{#if app.credentials}
  <TableViewer credentials={app.credentials} />
{:else}
  <Login {error} onLogin={handleLogin} />
{/if}
