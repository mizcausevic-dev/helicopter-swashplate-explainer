export function stageAt(frame) {
  const f = clampFrame(frame);
  for (let i = 0; i < STAGES.length; i++) {
    if (f <= STAGES[i].end) return { ...STAGES[i], index: i };
  }
  return { ...STAGES[4], index: 4 };
}
