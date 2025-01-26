<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte'

  export const {
    tables,
    onSelect,
    selectedTable,
  }: {
    tables: string[]
    onSelect: (table: string) => void
    selectedTable: string
  } = $props()
</script>

<div class="sticky pb-12">
  <div class="space-y-4 py-4">
    <div class="px-3 py-2">
      <h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">Tables</h2>
      <div class="space-y-1">
        {#each tables as table}
          <Button
            variant={table === selectedTable ? 'default' : 'ghost'}
            class="w-full justify-start"
            on:click={() => onSelect(table)}>{table}</Button
          >
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
</style>
