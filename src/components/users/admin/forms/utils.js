// utils.js
import registrationQuestions from "../../../../data/registrationQuestions.json";
import consentQuestions from "../../../../data/consentQuestions.json";
import menteeFeedbackQuestions from "../../../../data/menteeFeedbackQuestions.json";

export const getQuestionSet = (formType) => {
  switch (formType) {
    case "1":
      return registrationQuestions;
    case "2":
      return consentQuestions;
    case "3":
      return menteeFeedbackQuestions;
    default:
      return [];
  }
};

export const statusOptions = {
  0: "Accepted",
  1: "Rejected",
};

export const getAnswerForQuestion = (questionId, response, formType) => {
  if (formType === "1") {
    if (questionId === "score") {
      return response.responses[questionId];
    }
    const question = registrationQuestions.questions.find(
      (q) => q.id === questionId
    );
    return question ? question.options[response.responses[questionId]] : "";
  } else if (formType === "2") {
    if (questionId === "score") {
      return statusOptions[response.responses[questionId]];
    }
    const question = consentQuestions.questions.find(
      (q) => q.id === questionId
    );
    return question ? question.options[response.responses[questionId]] : "";
  }
  // Handle other form types if needed
  return response.responses[questionId];
};

export const truncateText = (text, maxLength) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}` : text;
};
