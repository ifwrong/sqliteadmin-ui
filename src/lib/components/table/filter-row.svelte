<script lang="ts">
  import { TrashIcon } from 'lucide-svelte'
  import { Button } from '$lib/components/ui/button'
  import * as Select from '$lib/components/ui/select'
  import type { Column } from '$lib/api'
  import type { Selected } from 'bits-ui'
  import { Input } from '../ui/input'
  import { onMount } from 'svelte'

  const operators = [
    {
      value: 'eq',
      label: '=',
    },
    {
      value: 'neq',
      label: '!=',
    },
    {
      value: 'like',
      label: 'like',
    },
    {
      value: 'gt',
      label: '>',
    },
    {
      value: 'lt',
      label: '<',
    },
    {
      value: 'gte',
      label: '>=',
    },
    {
      value: 'lte',
      label: '<=',
    },
  ]

  let {
    columns,
    column = $bindable(),
    operator = $bindable(),
    value = $bindable(),
    onDelete,
  }: {
    columns: Column[]
    column: string
    operator: string
    value: string
    onDelete: () => void
  } = $props()

  let selectedColumn: Selected<string> | undefined = $state()
  let selectedOperator: Selected<string> | undefined = $state()

  onMount(() => {
    selectedColumn = {
      value: column,
      label: column,
    }
    selectedOperator = {
      value: operator,
      label: findLabelForOperator(operator),
    }
  })

  function findLabelForOperator(operator: string): string {
    const found = operators.find((op) => op.value === operator)
    return found ? found.label : ''
  }

  const columnNames = columns.map((column) => column.name)
</script>

<div class="flex items-center space-x-2">
  <!-- Column selector  -->
  <Select.Root
    selected={selectedColumn}
    onSelectedChange={(selected) => {
      selectedColumn = selected
      if (selected && typeof selected.value === 'string') {
        column = selected.value as string
      }
    }}
  >
    <Select.Trigger class="w-[100px]">
      <Select.Value placeholder="Column" />
    </Select.Trigger>
    <Select.Content class="w-[180px]">
      <Select.Group>
        {#each columnNames as columnName}
          <Select.Item value={columnName} label={columnName}>
            {columnName}</Select.Item
          >
        {/each}
      </Select.Group>
    </Select.Content>
    <Select.Input name="selectedColumn" />
  </Select.Root>

  <Select.Root
    selected={selectedOperator}
    onSelectedChange={(selected) => {
      selectedOperator = selected
      if (selected && typeof selected.value === 'string') {
        operator = selected.value as string
      }
    }}
  >
    <Select.Trigger class="w-[100px]">
      <Select.Value placeholder="Operator" />
    </Select.Trigger>
    <Select.Content>
      {#each operators as operator}
        <Select.Item value={operator.value} label={operator.label}>
          {operator.label}</Select.Item
        >
      {/each}
    </Select.Content>
  </Select.Root>

  <Input type="text" placeholder="Value" class="max-w-xs" bind:value />
  <Button
    variant="destructive"
    size="sm"
    onclick={onDelete}
    aria-label="Delete"
  >
    <TrashIcon class="h-3 w-3" />
  </Button>
</div>

<style>
</style>
