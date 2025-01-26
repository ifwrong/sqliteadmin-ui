<script lang="ts">
  import ModeSwitcher from '$lib/components/mode-switcher.svelte'
  import '../app.css'
  let { children } = $props()
</script>

<div class="h-full w-full bg-background flex flex-col">
  <div class="flex items-center justify-between border-b px-4">
    <h1 class="p-4 text-3xl font-bold text-primary">SQLiteAdmin</h1>
    <ModeSwitcher />
  </div>
  <div class="grow">
    {@render children()}
  </div>
</div>
