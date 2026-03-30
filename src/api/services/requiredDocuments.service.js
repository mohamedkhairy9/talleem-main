import { axiosInstanceFront } from '../axiosInstance';
import { mapMainProgramSelectionToProgramParam } from '@/utils/helpers/mainProgramProgramParam';

/**
 * GET /required-documents?type=&program= (front API)
 * @param {{ type: 'teacher' | 'entity' | 'student', program: 'tahfiz' | 'taaleem' }} params
 */
export function getRequiredDocuments({ type, program }) {
    return axiosInstanceFront.get('/required-documents', {
        params: { type, program }
    });
}

/**
 * Resolves program from main_program_id and fetches documents (no GET /main-programs/:id).
 */
export function getRequiredDocumentsForMainProgram(type, mainProgramId) {
    const program = mapMainProgramSelectionToProgramParam(mainProgramId, null);
    if (!program) return Promise.resolve(null);
    return getRequiredDocuments({ type, program });
}
