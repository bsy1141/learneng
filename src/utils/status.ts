export const isDoneStatus = (value?: string) => {
  const normalized = value?.trim().toLowerCase();
  return normalized === "done" || normalized === "완료";
};
