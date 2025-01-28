import type { Credentials } from '$lib/types'

class AppState {
  credentials: Credentials | null = $state(null)

  logout() {
    this.credentials = null
  }
}

export const app = new AppState()
