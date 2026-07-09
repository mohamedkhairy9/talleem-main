import React from 'react';
import IssueLicenseModal from '@/components/licenses/IssueLicenseModal';
import { useIssueEntityLicenseMutation } from '@/api/hooks/useEntities';
import useLocale from '@/utils/hooks/global/useLocale';

export default function IssueEntityLicense({ entityId, onClose, onIssued }) {
    const { currentLocale } = useLocale();
    const { mutate, isPending } = useIssueEntityLicenseMutation();

    const labels = {
        title:
            currentLocale === 'ar'
                ? 'إصدار رخصة للكيان'
                : 'Issue Entity License',
        submit:
            currentLocale === 'ar'
                ? 'إصدار الرخصة'
                : 'Issue License',
        issueDate:
            currentLocale === 'ar'
                ? 'تاريخ الإصدار'
                : 'Issue Date',
        notes: currentLocale === 'ar' ? 'ملاحظات' : 'Notes',
        issueDatePlaceholder:
            currentLocale === 'ar'
                ? 'اختر تاريخ الإصدار'
                : 'Select issue date',
        notesPlaceholder:
            currentLocale === 'ar'
                ? 'اكتب أي ملاحظات إضافية'
                : 'Enter any additional notes'
    };

    const handleSubmit = data => {
        mutate(
            {
                entityId,
                data
            },
            {
                onSuccess: () => {
                    onIssued?.(data);
                    onClose(false);
                }
            }
        );
    };

    return (
        <IssueLicenseModal
            onClose={onClose}
            onSubmit={handleSubmit}
            isPending={isPending}
            title={labels.title}
            submitLabel={labels.submit}
            notesLabel={labels.notes}
            issueDateLabel={labels.issueDate}
            notesPlaceholder={labels.notesPlaceholder}
            issueDatePlaceholder={labels.issueDatePlaceholder}
        />
    );
}
