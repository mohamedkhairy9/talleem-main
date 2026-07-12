import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const conductExamsService = {
    getBranches: async params => {
        return await axiosInstance.get(API_URLS.CONDUCT_EXAMS.BRANCHES, {
            params
        });
    },

    getEntities: async params => {
        return await axiosInstance.get(API_URLS.CONDUCT_EXAMS.ENTITIES, {
            params
        });
    },

    getTodayExams: async params => {
        return await axiosInstance.get(API_URLS.CONDUCT_EXAMS.TODAY, {
            params
        });
    },

    getScheduledExam: async scheduledExamId => {
        return await axiosInstance.get(
            API_URLS.CONDUCT_EXAMS.DETAILS(scheduledExamId)
        );
    },

    startStudentExam: async (scheduledExamId, studentId, data) => {
        return await axiosInstance.post(
            API_URLS.CONDUCT_EXAMS.START_STUDENT(scheduledExamId, studentId),
            data
        );
    },

    submitStudentExam: async (scheduledExamId, studentId, data) => {
        return await axiosInstance.post(
            API_URLS.CONDUCT_EXAMS.SUBMIT_STUDENT(scheduledExamId, studentId),
            data
        );
    },

    getStudentResult: async (scheduledExamId, studentId) => {
        return await axiosInstance.get(
            API_URLS.CONDUCT_EXAMS.RESULT_STUDENT(scheduledExamId, studentId)
        );
    },

    getEvaluationTemplates: async params => {
        return await axiosInstance.get(
            API_URLS.CONDUCT_EXAMS.EVALUATION_TEMPLATES,
            {
                params
            }
        );
    }
};
