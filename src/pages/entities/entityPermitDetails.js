import { onlyDate } from '@/utils/helpers/global.fns';

const getFileUrl = file => {
    if (typeof file === 'string') return file;
    if (file && typeof file === 'object') {
        return (
            file.url ??
            file.full_url ??
            file.original_url ??
            file.file_url ??
            file.preview_url ??
            file.path ??
            null
        );
    }
    return null;
};

const findPermitFile = files => {
    if (!Array.isArray(files)) return null;

    return (
        files.find(
            file => file?.collection === 'entity_business_license' && getFileUrl(file)
        ) ?? null
    );
};

/**
 * Normalizes permit fields from the entity-details response for entity forms.
 * The current API nests a permit under `licenses.business_license`, while
 * older responses may still expose it as a flat `license` object.
 */
export const getEntityPermitFormData = (entity, fallback = {}) => {
    const businessLicense =
        entity?.licenses?.business_license &&
        typeof entity.licenses.business_license === 'object'
            ? entity.licenses.business_license
            : null;
    const legacyLicense =
        entity?.license && typeof entity.license === 'object'
            ? entity.license
            : null;
    const license = businessLicense ?? legacyLicense;
    const permitFile = findPermitFile(license?.files);
    const entityPermitFile = findPermitFile(entity?.files);
    const permitDocument = [
        license?.documents?.business_license,
        license?.document,
        license?.document_url,
        permitFile,
        entityPermitFile,
        entity?.license_image,
        fallback.license_image
    ]
        .map(getFileUrl)
        .find(url => typeof url === 'string' && url.trim() !== '');

    return {
        entry_type: license
            ? 'active_with_license'
            : entity?.entry_type ?? fallback.entry_type,
        license_number:
            license?.license_number ?? entity?.license_number ?? fallback.license_number,
        license_image: permitDocument,
        license_issue_date: onlyDate(
            license?.issue_date ??
                entity?.license_issue_date ??
                fallback.license_issue_date
        ),
        license_expiration_date: onlyDate(
            license?.expiration_date ??
                entity?.license_expiration_date ??
                fallback.license_expiration_date
        ),
        registration_date: onlyDate(entity?.registration_date ?? fallback.registration_date)
    };
};
