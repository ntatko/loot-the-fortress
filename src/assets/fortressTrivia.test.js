import { FortressTrivia, getTriviaQuestion } from './fortressTrivia';

describe('the question bank', () => {
  it('has no duplicate questions', () => {
    const questions = FortressTrivia.map((q) => q.question);
    expect(new Set(questions).size).toBe(questions.length);
  });

  it('gives every question exactly three wrong answers', () => {
    FortressTrivia.forEach((q) => {
      expect(q.incorrect).toHaveLength(3);
      expect(new Set(q.incorrect).size).toBe(3);
    });
  });

  it('never lists the correct answer among the wrong ones', () => {
    FortressTrivia.forEach((q) => {
      expect(q.incorrect).not.toContain(q.correct);
    });
  });

  it('has no blank questions or answers', () => {
    FortressTrivia.forEach((q) => {
      expect(q.question.trim()).not.toHaveLength(0);
      expect(q.correct.trim()).not.toHaveLength(0);
      q.incorrect.forEach((answer) => expect(answer.trim()).not.toHaveLength(0));
    });
  });
});

describe('getTriviaQuestion', () => {
  it('returns four answers, exactly one of them correct', () => {
    for (let i = 0; i < 100; i++) {
      const { answers } = getTriviaQuestion();
      expect(answers).toHaveLength(4);
      expect(answers.filter((a) => a.correct)).toHaveLength(1);
    }
  });

  it('returns the answers belonging to the question it picked', () => {
    for (let i = 0; i < 100; i++) {
      const question = getTriviaQuestion();
      const source = FortressTrivia.find((q) => q.question === question.question);
      const texts = question.answers.map((a) => a.text).sort();
      expect(texts).toEqual([source.correct, ...source.incorrect].sort());
      expect(question.answers.find((a) => a.correct).text).toBe(source.correct);
    }
  });

  it('does not always put the correct answer first', () => {
    // The whole point of the shuffle. Landing on slot 0 two hundred times in a
    // row is a 4^-200 fluke, so this is deterministic in practice.
    const slots = new Set();
    for (let i = 0; i < 200; i++) {
      slots.add(getTriviaQuestion().answers.findIndex((a) => a.correct));
    }
    expect([...slots].sort()).toEqual([0, 1, 2, 3]);
  });

  it('never repeats the question it was just asked', () => {
    let previous = getTriviaQuestion();
    for (let i = 0; i < 500; i++) {
      const next = getTriviaQuestion(previous);
      expect(next.question).not.toBe(previous.question);
      previous = next;
    }
  });
});
