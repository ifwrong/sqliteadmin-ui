<script lang="ts">
  import type { Credentials } from '$lib/types'
  import { onMount } from 'svelte'

  import Sidebar from './sidebar.svelte'
  import TableInfo from './table-info.svelte'
  import { API } from '$lib/api'
  import { app } from '$lib/stores/app.svelte'
  import { toast } from 'svelte-sonner'

  type Props = {
    credentials: Credentials
  }

  let { credentials }: Props = $props()

  let api = $derived(
    new API(credentials)
      .addInterceptor((response) => {
        if (response.statusCode >= 400 && !response.ok) {
          toast.error('Error', {
            description: response.message,
          })
        }
        return response
      })
      .addInterceptor((response) => {
        if (response.statusCode === 401) {
          app.logout()
        }
        return response
      }),
  )

  let tables: string[] = $state([])
  let selectedTable: string | undefined = $state()

  onMount(async () => {
    const result = await api.fetchTables()
    if (result.ok) {
      tables = result.data.tables
    } else {
      // TODO: handle error
    }
  })

  function handleTableSelect(table: string) {
    selectedTable = table
  }
</script>

<div class="relative box-border grid h-full lg:grid-cols-5">
  <div class="sticky">
    <Sidebar {tables} {selectedTable} onSelect={handleTableSelect} />
  </div>
  <div class="col-span-3 lg:col-span-4 lg:border-l">
    <TableInfo {api} {selectedTable} />
  </div>
</div>
