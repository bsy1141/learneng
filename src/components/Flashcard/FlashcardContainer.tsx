import { useEffect, useMemo } from "react";
import { useAppStore, selectReviewWordSet, selectVisibleList } from "../../stores/useAppStore";
import Flashcard from "./Flashcard";

const FlashcardContainer = () => {
  const {
    activeTab,
    data,
    index,
    flipped,
    aiExample,
    aiLoading,
    addLoading,
    doneLoading,
    prevCard,
    nextCard,
    toggleFlip,
    generateExample,
    addReviewEntry,
    markDone,
    setIndex,
  } = useAppStore();

  const currentList = useMemo(
    () => selectVisibleList(data, activeTab),
    [data, activeTab],
  );

  const currentEntry = currentList[index];

  const reviewWordSet = useMemo(
    () => selectReviewWordSet(data.review),
    [data.review],
  );

  const canAddToReview =
    activeTab === "today" &&
    !!currentEntry?.word &&
    !reviewWordSet.has(currentEntry.word.trim().toLowerCase());

  const canMarkDone =
    !!currentEntry?.word &&
    (activeTab === "review" || currentEntry.status !== "done");

  useEffect(() => {
    if (index >= currentList.length) {
      setIndex(0);
    }
  }, [currentList.length, index, setIndex]);

  if (!currentEntry) return null;

  return (
    <Flashcard
      entry={currentEntry}
      flipped={flipped}
      onToggle={toggleFlip}
      onPrev={() => prevCard(currentList.length)}
      onNext={() => nextCard(currentList.length)}
      onGenerateExample={() => generateExample(currentEntry)}
      onAddToReview={activeTab === "today" ? () => addReviewEntry(currentEntry) : undefined}
      canAddToReview={canAddToReview}
      addLoading={addLoading}
      onMarkDone={() => markDone(currentEntry)}
      canMarkDone={canMarkDone}
      markDoneLabel="학습 완료"
      doneLoading={doneLoading}
      aiExample={aiExample}
      aiLoading={aiLoading}
      index={index}
      total={currentList.length}
    />
  );
};

export default FlashcardContainer;
