<script lang="ts">
  import * as Table from '$lib/components/ui/table'
  import { cn } from '$lib/utils'

  let {
    highlight,
    initialValue,
    isEditable,
    onValueChange,
  }: {
    highlight: boolean
    initialValue: string
    isEditable: boolean
    onValueChange: (value: string) => void
  } = $props()

  let isEditing = $state(false)
  let contentElem = $state<HTMLDivElement | null>(null)
  let value = $state(initialValue)

  function setEditing() {
    isEditing = true
    if (contentElem) {
      contentElem.focus()
      const range = document.createRange()
      const sel = window.getSelection()
      range.selectNodeContents(contentElem)
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }

  function handleBlur() {
    isEditing = false
    if (isEditable) {
      value = contentElem?.textContent ?? ''
      onValueChange(value)
    }
  }
</script>

<Table.Cell
  class={cn('focus:outline focus:outline-primary', {
    'bg-secondary': highlight,
  })}
  bind:ref={contentElem}
  onclick={() => {
    contentElem?.focus()
  }}
  ondblclick={setEditing}
  contenteditable={isEditable && isEditing}
  onblur={handleBlur}
  tabindex={0}
>
  {initialValue}
</Table.Cell>
