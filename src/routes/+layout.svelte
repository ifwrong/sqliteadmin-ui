<script lang="ts">
  import ModeSwitcher from '$lib/components/mode-switcher.svelte'
  import { Button } from '$lib/components/ui/button'
  import { Toaster } from '$lib/components/ui/sonner'
  import { app } from '$lib/stores/app.svelte'
  import * as Tooltip from '$lib/components/ui/tooltip'
  import Unplug from 'lucide-svelte/icons/unplug'
  import '../app.css'
  let { children } = $props()
</script>

<Toaster />
<Tooltip.Provider>
  <div class="h-full w-full bg-background flex flex-col">
    <div class="flex items-center justify-between border-b px-4">
      <h1 class="p-4 text-3xl font-bold text-primary">SQLiteAdmin</h1>
      <div class="items-center space-x-2">
        {#if app.credentials}
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button
                variant="outline"
                size="icon"
                onclick={() => {
                  app.logout()
                }}
              >
                <Unplug class="h-[1.2rem] w-[1.2rem]" />
                <span class="sr-only">Disconnect</span></Button
              >
            </Tooltip.Trigger>
            <Tooltip.Content>Disconnect</Tooltip.Content>
          </Tooltip.Root>
        {/if}
        <ModeSwitcher />
      </div>
    </div>
    <div class="grow">
      {@render children()}
    </div>
  </div>
</Tooltip.Provider>
