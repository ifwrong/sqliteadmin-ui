<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte'
  import * as Collapsible from '$lib/components/ui/collapsible'
  import { ChevronDown, ChevronUp } from 'lucide-svelte'

  export const {
    tables,
    onSelect,
    selectedTable,
  }: {
    tables: string[]
    onSelect: (table: string) => void
    selectedTable: string
  } = $props()

  let isTablesExpanded = $state(false)
</script>

<div class="sticky pb-12 overflow-y-auto h-[calc(100vh-72px)]">
  <div class="space-y-4 py-4">
    <div class="px-3 py-2">
      <Collapsible.Root bind:open={isTablesExpanded}>
        <Collapsible.Trigger asChild let:builder>
          <Button
            builders={[builder]}
            variant="ghost"
            class="w-full p-2 flex justify-between"
          >
            <h2 class="font-semibold tracking-tight">Tables</h2>
            {#if isTablesExpanded}
              <ChevronUp class="h-4 w-4" />
            {:else}
              <ChevronDown class="h-4 w-4" />
            {/if}
          </Button>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div class="space-y-1 ml-4">
            {#each tables as table}
              <Button
                variant={table === selectedTable ? 'default' : 'ghost'}
                class="w-full justify-start"
                on:click={() => onSelect(table)}>{table}</Button
              >
            {/each}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  </div>
</div>

<style>
</style>
