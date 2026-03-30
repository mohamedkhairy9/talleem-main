import { useQuery } from '@tanstack/react-query';
import { getRequiredDocumentsForMainProgram } from '../services/requiredDocuments.service';

/**
 * Supporting-files hint: suggested document names from front API when main program is selected.
 * @param {'teacher' | 'entity' | 'student' | null | undefined} type
 * @param {number|string|null|undefined} mainProgramId
 */
export function useRequiredDocumentsHint(type, mainProgramId) {
    return useQuery({
        queryKey: ['requiredDocuments', type, mainProgramId],
        queryFn: () => getRequiredDocumentsForMainProgram(type, mainProgramId),
        enabled:
            !!type &&
            mainProgramId !== null &&
            mainProgramId !== undefined &&
            mainProgramId !== '' &&
            String(mainProgramId).trim() !== '',
        staleTime: 5 * 60 * 1000
    });
}
