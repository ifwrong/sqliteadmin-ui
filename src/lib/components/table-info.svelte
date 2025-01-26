<script lang="ts">
  import { API, type TableInfo, type TableRow } from '$lib/api'
  import { EMPTY_CONDITION } from '$lib/consts'
  import type { Condition } from '$lib/types'
  import DataTable from './table/data-table.svelte'

  const {
    api,
    selectedTable,
  }: { api: API; selectedTable: string | undefined } = $props()
  let tableData: TableRow[] = $state([])
  let tableInfo: TableInfo | undefined = $state()
  let tableLoading = $state(false)

  async function fetchTable(
    tableName: string,
    includeInfo: boolean,
    condition: Condition,
  ) {
    tableLoading = true
    const result = await api.fetchTableData(tableName, includeInfo, condition)

    if (result.ok) {
      tableData = result.data.rows ?? []
      if (result.data.tableInfo) {
        tableInfo = result.data.tableInfo
      }
    } else {
      // TODO: handle error
    }
    tableLoading = false
  }

  $effect(() => {
    if (selectedTable) {
      tableLoading = true
      fetchTable(selectedTable, true, EMPTY_CONDITION)
    }
  })
</script>

{#if !selectedTable}
  <div class="px-4 py-6 lg:px-8">Select a table to view information</div>
{:else if tableInfo != null}
  <div>
    <DataTable
      {api}
      data={tableData}
      {tableLoading}
      {tableInfo}
      {selectedTable}
      onRefetch={(condition) => fetchTable(selectedTable, false, condition)}
    />
  </div>
{/if}

<style>
</style>
