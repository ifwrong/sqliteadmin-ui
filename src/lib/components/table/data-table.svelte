<script lang="ts">
  import { API, type TableInfo, type TableRow } from '$lib/api'
  import * as Table from '$lib/components/ui/table'
  import { Checkbox } from '$lib/components/ui/checkbox'
  import { SvelteSet } from 'svelte/reactivity'
  import { Button } from '$lib/components/ui/button'
  import { ChevronDown } from 'lucide-svelte/icons'
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
  import type { Condition, Filter } from '$lib/types'
  import { EMPTY_CONDITION } from '$lib/consts'
  import FilterRow from './filter-row.svelte'
  import { validateCondition } from '$lib/utils'
  const {
    api,
    data,
    tableLoading,
    tableInfo,
    selectedTable,
    onRefetch,
  }: {
    api: API
    data: TableRow[]
    tableLoading: boolean
    tableInfo: TableInfo
    selectedTable: string
    onRefetch: (condition: Condition) => void
  } = $props()

  const selectedIds: SvelteSet<string> = $state(new SvelteSet())
  let showFilter = $state(false)
  let loading = $state(false)

  let condition = $state<Condition>(EMPTY_CONDITION)

  const columnNames = Object.keys(data[0])

  const columnVisibileMapping: { [columnName: string]: boolean } = $state(
    columnNames.reduce((acc, columnName) => {
      return {
        ...acc,
        [columnName]: true,
      }
    }, {}),
  )
  const hideableColumnNames = columnNames.filter(
    (columnName) => columnName !== 'id',
  )

  const showActions = columnNames.includes('id')

  const sortedColumnNames = columnNames.sort((a, b) => {
    if (a === 'id' && b !== 'id') return -1
    if (b === 'id' && a !== 'id') return 1
    return 0
  })

  const validFilters = $derived(validateCondition(condition))

  function createEmptyFilter(): Filter {
    return {
      column: '',
      operator: 'eq',
      value: '',
    }
  }

  async function triggerDelete() {
    if (selectedIds.size > 0) {
      if (
        confirm(`Are you sure you want to delete ${selectedIds.size} items?`)
      ) {
        loading = true
        const result = await api.deleteRows(
          selectedTable,
          Array.from(selectedIds),
        )

        if (result.ok) {
          console.log(`Deleted ${result.data.rowsAffected} rows}`)
          selectedIds.clear()
          onRefetch(condition)
        } else {
          // TODO: handle error
          console.error('Error deleting rows', result.error)
        }

        loading = false
      }
    }
  }

  function toggleFilter() {
    showFilter = !showFilter
  }
</script>

<div class="flex flex-col overflow-hidden h-[calc(100vh-72px)]">
  {#if tableLoading}
    <div class="px-4 py-6 lg:px-8">Loading...</div>
  {:else}
    <div class="flex flex-wrap items-center p-4">
      <div class="mb-4 mt-2 text-center">
        Table: <strong class="ml-1">{selectedTable}</strong>
      </div>
      <div class="flex grow justify-between">
        <div class="mb-3 ml-4 space-x-2">
          <Button variant="outline" onclick={toggleFilter}>Filter</Button>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
              <Button variant="outline" builders={[builder]}
                >Columns <ChevronDown class="ml-2 h-4 w-4" /></Button
              >
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {#each hideableColumnNames as columnName}
                <DropdownMenu.CheckboxItem
                  bind:checked={columnVisibileMapping[columnName]}
                >
                  {columnName}
                </DropdownMenu.CheckboxItem>
              {/each}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          {#if selectedIds.size > 0}
            <Button size="sm" variant="destructive" onclick={triggerDelete}
              >Delete {selectedIds.size}</Button
            >
          {/if}
        </div>
      </div>
    </div>
    {#if showFilter}
      <div class="border-t p-3 space-y-3">
        <div class="flex justify-between">
          <h3 class="text-lg">Filters</h3>
          <div class="flex items-center space-x-2">
            <Button
              variant="outline"
              onclick={() => condition.cases.push(createEmptyFilter())}
              >Add</Button
            >
            <Button
              variant="ghost"
              onclick={() => {
                condition.cases = []
                onRefetch(condition)
              }}>Clear all</Button
            >
            <Button
              onclick={() => {
                onRefetch(condition)
              }}
              disabled={!validFilters}>Apply</Button
            >
          </div>
        </div>
        {#each condition.cases as filter, i (i)}
          <!-- We need to do this check for now to refine the type to a `Filter`
               because eventually we might want to nest conditions -->
          {#if 'column' in filter}
            <FilterRow
              columns={tableInfo.columns}
              bind:column={filter.column}
              bind:operator={filter.operator}
              bind:value={filter.value}
              onDelete={() => {
                // This works for now as we don't have nested conditions
                condition.cases = condition.cases.filter(
                  (_, index) => index !== i,
                )
                if (condition.cases.length === 0) {
                  showFilter = false
                }

                onRefetch(condition)
              }}
            />
          {/if}
        {/each}
      </div>
    {/if}
    <!--
	<form onsubmit={preventDefault(filterResults)} class="mb-4 flex space-x-2">
		<Input
			type="text"
			placeholder={'Filter data like age > 25 and name contains "Bob"'}
			bind:value={filterText}
		/>
		<Button type="submit">Filter</Button>
	</form>
	-->
    <div class="border-t overflow-y-auto">
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <!-- We only want to show actions when there is an `id` column -->
            {#if showActions}
              <Table.Head></Table.Head>
            {/if}
            {#each sortedColumnNames as columnName}
              {#if columnVisibileMapping[columnName]}
                <Table.Head>{columnName}</Table.Head>
              {/if}
            {/each}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each data as item, i (i)}
            <Table.Row>
              <!-- We only want to show actions when there is an `id` column -->
              {#if showActions}
                <Table.Cell
                  ><Checkbox
                    onCheckedChange={(v) => {
                      if ('id' in item) {
                        if (v) {
                          selectedIds.add('' + item.id)
                        } else {
                          selectedIds.delete('' + item.id)
                        }
                      }
                    }}
                  /></Table.Cell
                >
              {/if}
              {#each sortedColumnNames as columnName}
                {#if columnVisibileMapping[columnName]}
                  <Table.Cell>{item[columnName]}</Table.Cell>
                {/if}
              {/each}
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </div>
  {/if}
</div>

<style>
</style>
