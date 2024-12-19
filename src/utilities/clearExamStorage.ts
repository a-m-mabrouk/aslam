export const clearAllExamItems = () => {
    [
        "activeAssessment",
        "activeAssessQuestionIndex",
        "examAnswers",
        "examTimeRemaining",
      ].forEach((key) => localStorage.removeItem(key));
}