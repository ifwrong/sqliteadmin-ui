<script lang="ts">
  import { API, type TableInfo, type TableRow } from '$lib/api'
  import { DEFAULT_LIMIT, EMPTY_CONDITION } from '$lib/consts'
  import type { Condition } from '$lib/types'
  import DataTable from './table/data-table.svelte'

  const {
    api,
    selectedTable,
  }: { api: API; selectedTable: string | undefined } = $props()
  let tableData: TableRow[] = $state([])
  let tableInfo: TableInfo | undefined = $state()
  let tableLoading = $state(false)
  let queryTime = $state<number | null>(null)

  async function fetchTable({
    tableName,
    includeInfo,
    condition,
    limit,
    offset,
  }: {
    tableName: string
    includeInfo: boolean
    condition: Condition
    limit: number
    offset: number
  }) {
    const startTime = performance.now()
    const result = await api.fetchTableData({
      tableName,
      includeInfo,
      condition,
      limit,
      offset,
    })
    const endTime = performance.now()

    // Calculate queryTime in ms
    queryTime = Math.round(endTime - startTime)

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
      fetchTable({
        tableName: selectedTable,
        includeInfo: true,
        condition: EMPTY_CONDITION,
        limit: DEFAULT_LIMIT,
        offset: 0,
      })
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
      {selectedTable}
      {tableInfo}
      {tableLoading}
      {queryTime}
      onRefetch={(condition, limit, offset) =>
        fetchTable({
          tableName: selectedTable,
          includeInfo: false,
          condition,
          limit,
          offset,
        })}
    />
  </div>
{/if}

<style>
</style>
