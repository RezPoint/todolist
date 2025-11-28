import { useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

export function useTelegram() {
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    WebApp.ready()
    setReady(true)

    const initData = WebApp.initDataUnsafe
    if (initData?.user) {
      setUser(initData.user)
    }
  }, [])

  return {
    user,
    ready,
    WebApp,
  }
}

