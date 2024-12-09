export const clearAllExamItems = () => {
    [
        "activeAssessment",
        "activeAssessQuestionIndex",
        "examAnswers",
        "examTimeRemaining",
        "isAssessmentRunning",
      ].forEach((key) => localStorage.removeItem(key));
}