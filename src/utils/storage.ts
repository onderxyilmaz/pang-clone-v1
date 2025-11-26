// LocalStorage utility for high scores
const HIGH_SCORE_KEY = 'pang_high_score';

export function getHighScore(): number {
  const stored = localStorage.getItem(HIGH_SCORE_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

export function setHighScore(score: number): void {
  localStorage.setItem(HIGH_SCORE_KEY, score.toString());
}

export function updateHighScore(score: number): boolean {
  const currentHigh = getHighScore();
  if (score > currentHigh) {
    setHighScore(score);
    return true;
  }
  return false;
}


