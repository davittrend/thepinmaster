const PINTEREST_API_URL = 'https://api-sandbox.pinterest.com/v5'
const PINTEREST_AUTH_URL = 'https://www.pinterest.com/oauth'
const CLIENT_ID = '1507772'
const CLIENT_SECRET = '12e86e7dd050a39888c5e753908e80fae94f7367'
const REDIRECT_URI = 'https://pinorganizer.netlify.app/callback'
const SCOPES = ['boards:read', 'pins:read', 'pins:write']

export async function getAuthUrl() {
  const url = new URL(`${PINTEREST_AUTH_URL}/authorize`)
  url.searchParams.append('client_id', CLIENT_ID)
  url.searchParams.append('redirect_uri', REDIRECT_URI)
  url.searchParams.append('response_type', 'code')
  url.searchParams.append('scope', SCOPES.join(','))
  
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
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to exchange code for token')
  }

  return response.json()
}

export async function getBoards(accessToken: string) {
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

export async function createPin(accessToken: string, boardId: string, pin: {
  title: string
  description: string
  link: string
  imageUrl: string
}) {
  const response = await fetch(`${PINTEREST_API_URL}/pins`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
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
    throw new Error('Failed to create pin')
  }

  return response.json()
}

