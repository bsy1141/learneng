import type { VocabEntry } from '../services/sheets'

type FlashcardProps = {
  entry: VocabEntry
  flipped: boolean
  onToggle: () => void
  onPrev: () => void
  onNext: () => void
  onGenerateExample: () => void
  aiExample?: string | null
  aiLoading?: boolean
  index: number
  total: number
}

const Flashcard = ({
  entry,
  flipped,
  onToggle,
  onPrev,
  onNext,
  onGenerateExample,
  aiExample,
  aiLoading,
  index,
  total,
}: FlashcardProps) => {
  return (
    <section className="flashcard">
      <div className={`card ${flipped ? 'is-flipped' : ''}`} onClick={onToggle}>
        <div className="card-face card-front">
          <p className="card-label">오늘의 단어</p>
          <h2 className="word">{entry.word || '단어 없음'}</h2>
          {entry.level && <span className="chip">{entry.level}</span>}
        </div>
        <div className="card-face card-back">
          <p className="card-label">의미</p>
          <h3 className="meaning">{entry.meaning || '의미 없음'}</h3>
          {entry.example && (
            <div className="example-block">
              <p className="example-title">기본 예문</p>
              <p className="example-text">{entry.example}</p>
            </div>
          )}
          {entry.tags && entry.tags.length > 0 && (
            <div className="tag-list">
              {entry.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card-controls">
        <button type="button" className="btn ghost" onClick={onPrev}>
          이전
        </button>
        <div className="counter">
          {index + 1} / {total}
        </div>
        <button type="button" className="btn ghost" onClick={onNext}>
          다음
        </button>
      </div>

      <div className="actions">
        <button type="button" className="btn primary" onClick={onToggle}>
          {flipped ? '단어 보기' : '정답 확인'}
        </button>
        <button
          type="button"
          className="btn accent"
          onClick={onGenerateExample}
          disabled={aiLoading}
        >
          {aiLoading ? 'AI 예문 생성 중...' : 'AI 예문 생성'}
        </button>
      </div>

      {aiExample && (
        <div className="ai-example">
          <p className="example-title">AI 예문</p>
          <p className="example-text">{aiExample}</p>
        </div>
      )}
    </section>
  )
}

export default Flashcard
