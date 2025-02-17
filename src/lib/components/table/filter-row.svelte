<script lang="ts">
  import { TrashIcon } from 'lucide-svelte'
  import { Button } from '$lib/components/ui/button'
  import * as Select from '$lib/components/ui/select'
  import type { Column } from '$lib/api'
  import { Input } from '../ui/input'
  import type { Operator } from '$lib/types'

  const labelForOperator: Record<Operator, string> = {
    eq: '=',
    neq: '!=',
    like: 'like',
    gt: '>',
    lt: '<',
    gte: '>=',
    lte: '<=',
    null: 'is null',
    notnull: 'is not null',
  }

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

  function getLabelForOperator(operator: string): string {
    return labelForOperator[operator as Operator] ?? ''
  }

  const columnNames = columns.map((column) => column.name)
</script>

<div class="flex items-center space-x-2">
  <!-- Column selector  -->
  <Select.Root type="single" bind:value={column}>
    <Select.Trigger class="w-[100px]">
      {column}
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
  </Select.Root>

  <Select.Root type="single" bind:value={operator}>
    <Select.Trigger class="w-[100px]">
      {getLabelForOperator(operator)}
    </Select.Trigger>
    <Select.Content>
      {#each Object.keys(labelForOperator) as operator}
        <Select.Item value={operator} label={getLabelForOperator(operator)}>
          {getLabelForOperator(operator)}</Select.Item
        >
      {/each}
    </Select.Content>
  </Select.Root>

  {#if operator !== 'null' && operator !== 'notnull'}
    <Input type="text" placeholder="Value" class="max-w-xs" bind:value />
  {/if}
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
