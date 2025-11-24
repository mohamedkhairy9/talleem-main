
/**
 * Quran Segments API Service
 * Handles all API calls related to Quran page segments
 */

import { axiosInstance } from "../axiosInstance";

const QuranSegmentsService = {
    /**
     * Get all segments for a specific page
     * @param {number} pageNumber - Page number (1-604)
     * @returns {Promise<Array>} Array of segments
     */
    getSegmentsByPage: async (pageNumber) => {
        try {
            const response = await axiosInstance.get('/quran/segments', {
                params: { page_number: pageNumber }
            });
            
            // Backend may return array directly or wrapped in { data: [] }
            // Handle both cases
            if (Array.isArray(response.data)) {
                return response.data;
            } else if (response.data && Array.isArray(response.data.data)) {
                return response.data.data;
            } else {
                // Fallback to empty array
                console.warn('Unexpected response format:', response.data);
                return [];
            }
        } catch (error) {
            console.error('Error fetching segments:', error);
            // Return empty array on error so app can continue
            return [];
        }
    },

    /**
     * Create a new segment
     * @param {Object} segmentData - Segment data
     * @param {string} segmentData.first_verse_key - First verse key (e.g., "2:11")
     * @param {string} segmentData.last_verse_key - Last verse key (e.g., "2:20")
     * @param {number} segmentData.page_number - Page number
     * @param {number} segmentData.segment_number - Segment number on this page
     * @returns {Promise<Object>} Created segment data
     */
    createSegment: async (segmentData) => {
        try {
            const response = await axiosInstance.post('/quran/segments', segmentData);
            return response.data;
        } catch (error) {
            console.error('Error creating segment:', error);
            throw error;
        }
    },

    /**
     * Get a specific segment by ID
     * @param {number} segmentId - Segment ID
     * @returns {Promise<Object>} Segment data
     */
    getSegmentById: async (segmentId) => {
        try {
            const response = await axiosInstance.get(`/quran/segments/${segmentId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching segment:', error);
            throw error;
        }
    },

    /**
     * Update a segment
     * @param {number} segmentId - Segment ID
     * @param {Object} segmentData - Updated segment data
     * @returns {Promise<Object>} Updated segment data
     */
    updateSegment: async (segmentId, segmentData) => {
        try {
            const response = await axiosInstance.put(`/quran/segments/${segmentId}`, segmentData);
            return response.data;
        } catch (error) {
            console.error('Error updating segment:', error);
            throw error;
        }
    },

    /**
     * Delete a segment
     * @param {number} segmentId - Segment ID
     * @returns {Promise<Object>} Deletion confirmation
     */
    deleteSegment: async (segmentId) => {
        try {
            const response = await axiosInstance.delete(`/quran/segments/${segmentId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting segment:', error);
            throw error;
        }
    },

    /**
     * Get all segments (with pagination if needed)
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} Segments list with pagination
     */
    getAllSegments: async (params = {}) => {
        try {
            const response = await axiosInstance.get('/quran/segments', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching all segments:', error);
            throw error;
        }
    }
};

export default QuranSegmentsService;