export const generateExample = async (word: string, meaning?: string) => {
  const response = await fetch('/api/example', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word, meaning }),
  })

  if (!response.ok) {
    throw new Error('AI 예문 생성에 실패했습니다.')
  }

  const data = (await response.json()) as { sentence?: string }
  return data.sentence?.trim() ?? ''
}
