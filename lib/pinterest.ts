const PINTEREST_API_URL = 'https://api-sandbox.pinterest.com/v5'
const PINTEREST_AUTH_URL = 'https://api-sandbox.pinterest.com/oauth'
const CLIENT_ID = process.env.NEXT_PUBLIC_PINTEREST_CLIENT_ID
const CLIENT_SECRET = process.env.PINTEREST_CLIENT_SECRET
const REDIRECT_URI = process.env.NEXT_PUBLIC_PINTEREST_REDIRECT_URI

export async function getPinterestAuthUrl() {
  const url = new URL(`${PINTEREST_AUTH_URL}/authorize`)
  url.searchParams.append('client_id', CLIENT_ID!)
  url.searchParams.append('redirect_uri', REDIRECT_URI!)
  url.searchParams.append('response_type', 'code')
  url.searchParams.append('scope', 'read_users,read_boards,write_pins')

  return url.toString()
}

export async function exchangeCodeForToken(code: string) {
  const response = await fetch(`${PINTEREST_AUTH_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      redirect_uri: REDIRECT_URI!,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to exchange code for token')
  }

  return response.json()
}

export async function refreshPinterestToken(refreshToken: string) {
  const response = await fetch(`${PINTEREST_AUTH_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh token')
  }

  return response.json()
}

export async function fetchPinterestBoards(accessToken: string) {
  const response = await fetch(`${PINTEREST_API_URL}/boards`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch boards')
  }

  return response.json()
}

export async function createPin(accessToken: string, boardId: string, pin: any) {
  const response = await fetch(`${PINTEREST_API_URL}/pins`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      board_id: boardId,
      title: pin.title,
      description: pin.description,
      link: pin.link,
      media_source: {
        source_type: 'image_url',
        url: pin.imageUrl,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to create pin: ${response.statusText}`)
  }

  return response.json()
}

