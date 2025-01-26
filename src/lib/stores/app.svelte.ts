import type { Credentials } from '$lib/types'

class AppState {
  credentials: Credentials | null = $state(null)
}

export const app = new AppState()
