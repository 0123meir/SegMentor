export const convertSecondsToSrtTimestamp = (seconds: number): string => {
  const date = new Date(seconds * 1_000);

  // Timestamps formatted as HH:MM:SS,SSS
  return date.toISOString().slice(11, -1).replace('.', ',');
};
