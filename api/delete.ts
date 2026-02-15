const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL

type DeleteBody = {
  sheet?: string
  word?: string
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  if (!APPS_SCRIPT_URL) {
    res.status(500).json({ error: 'APPS_SCRIPT_URL is not configured' })
    return
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const payload: DeleteBody = {
      sheet: body?.sheet ?? 'Review',
      word: body?.word,
    }

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteRow', ...payload }),
    })

    if (!response.ok) {
      const text = await response.text()
      res.status(response.status).json({ error: text || 'Apps Script error' })
      return
    }

    const data = await response.text()
    res.status(200).json({ ok: true, data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error'
    res.status(500).json({ error: message })
  }
}
