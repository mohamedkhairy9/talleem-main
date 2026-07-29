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

const findLicenseFile = files => {
    if (!Array.isArray(files)) return null;

    return files.find(file => getFileUrl(file)) ?? null;
};

/**
 * Maps the teacher-details API license payload to the form field names used by
 * the view and edit screens. Older responses may expose equivalent flat keys.
 */
export const getTeacherLicenseFormData = (teacher, fallback = {}) => {
    const license =
        teacher?.license && typeof teacher.license === 'object'
            ? teacher.license
            : null;

    const licenseImage = [
        license?.documents?.license,
        license?.documents?.license_image,
        license?.image,
        license?.document,
        license?.document_url,
        findLicenseFile(license?.files),
        teacher?.license_image,
        fallback.license_image
    ]
        .map(getFileUrl)
        .find(url => typeof url === 'string' && url.trim() !== '');

    return {
        entry_type: license
            ? 'active_with_license'
            : teacher?.entry_type ?? fallback.entry_type,
        license_number:
            license?.license_number ??
            teacher?.license_number ??
            fallback.license_number,
        license_image: licenseImage,
        license_issue_date: onlyDate(
            license?.issue_date ??
                teacher?.license_issue_date ??
                fallback.license_issue_date
        ),
        license_expiration_date: onlyDate(
            license?.expiration_date ??
                teacher?.license_expiration_date ??
                fallback.license_expiration_date
        )
    };
};
