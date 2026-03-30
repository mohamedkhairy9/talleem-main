/**
 * Maps main_program_id to `program` query param for GET /required-documents (tahfiz | taaleem).
 * id 2 → tahfiz, id 1 → taaleem (align with product conventions).
 */
export function mapMainProgramSelectionToProgramParam(mainProgramId, mainProgram) {
    const raw = (mainProgram?.slug ?? mainProgram?.code ?? '').toString().toLowerCase().trim();
    if (raw === 'tahfiz' || raw === 'taaleem') return raw;

    const id = Number(mainProgramId);
    if (!Number.isFinite(id)) return null;
    if (id === 2) return 'tahfiz';
    if (id === 1) return 'taaleem';
    return null;
}
