/**
 * Quran Exam Segments API Service
 * Handles all API calls related to Quran exam segments (Suggested Exam Templates)
 */

import { axiosInstance } from "../axiosInstance";

const QuranExamSegmentsService = {
    /**
     * Get exam segments for a specific juz
     * @param {number} juzNumber - Juz number (1-30)
     * @returns {Promise<Object>} Response with data and meta
     */
    getExamSegmentsByJuz: async (juzNumber) => {
        try {
            const response = await axiosInstance.get('/quran-exam-segments', {
                params: { juz_number: juzNumber }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching exam segments:', error);
            throw error;
        }
    },

    /**
     * Create or update exam segments for a juz
     * @param {Object} segmentData - Segment data
     * @param {number} segmentData.juz_number - Juz number (1-30)
     * @param {number} segmentData.segments_count - Number of segments
     * @param {Array} segmentData.items - Array of segment items
     * @param {string} segmentData.items[].first_verse_key - First verse key (e.g., "1:1")
     * @param {string} segmentData.items[].last_verse_key - Last verse key (e.g., "1:7")
     * @param {number} segmentData.is_active - Is active (0 or 1)
     * @returns {Promise<Object>} Created/updated segment data
     */
    createOrUpdateExamSegments: async (segmentData) => {
        try {
            const response = await axiosInstance.post('/quran-exam-segments', segmentData);
            return response.data;
        } catch (error) {
            console.error('Error creating/updating exam segments:', error);
            throw error;
        }
    },

    /**
     * Update exam segments for a juz
     * @param {number} segmentId - Segment ID
     * @param {Object} segmentData - Updated segment data
     * @returns {Promise<Object>} Updated segment data
     */
    updateExamSegments: async (segmentId, segmentData) => {
        try {
            const response = await axiosInstance.put(`/quran-exam-segments/${segmentId}`, segmentData);
            return response.data;
        } catch (error) {
            console.error('Error updating exam segments:', error);
            throw error;
        }
    },

    /**
     * Delete exam segments for a juz
     * @param {number} segmentId - Segment ID
     * @returns {Promise<Object>} Deletion confirmation
     */
    deleteExamSegments: async (segmentId) => {
        try {
            const response = await axiosInstance.delete(`/quran-exam-segments/${segmentId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting exam segments:', error);
            throw error;
        }
    }
};

export default QuranExamSegmentsService;

