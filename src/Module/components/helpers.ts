import { ObjectId } from 'mongodb';
import { Question as QuestionType, Comment } from '../types';

export const questionIsLiked = (studentAdkData: Record<string, any>, question: QuestionType) => {
  return studentAdkData.likedQuestions.some((id: string) => id === question._id.toString());
};
export const questionIsBookmarked = (
  studentAdkData: Record<string, any>,
  question: QuestionType
) => {
  return studentAdkData.bookmarkedQuestions.some((id: string) => id === question._id.toString());
};
export const questionIsDisliked = (studentAdkData: Record<string, any>, question: QuestionType) => {
  return studentAdkData.dislikedQuestions.some((id: string) => id === question._id.toString());
};
export const questionIsFlagged = (studentAdkData: Record<string, any>, question: QuestionType) => {
  return studentAdkData.flaggedQuestions.some((id: string) => id === question._id.toString());
};
export const commentIsLiked = (studentAdkData: Record<string, any>, comment: Comment) => {
  return studentAdkData.likedComments.some((id: string) => id === comment._id.toString());
};
export const commentIsFlagged = (studentAdkData: Record<string, any>, comment: Comment) => {
  return studentAdkData.flaggedComments.some((id: string) => id === comment._id.toString());
};
export const removeId = (arr: string[], _id: ObjectId) => {
  return arr.filter((id: string) => id !== _id.toString());
};
