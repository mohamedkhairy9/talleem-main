import React from 'react';
import IssueLicenseModal from '@/components/licenses/IssueLicenseModal';
import { useIssueTeacherLicenseMutation } from '@/api/hooks/useTeachers';
import useLocale from '@/utils/hooks/global/useLocale';

export default function IssueTeacherLicense({ teacherId, onClose, onIssued }) {
    const { currentLocale } = useLocale();
    const { mutate, isPending } = useIssueTeacherLicenseMutation();

    const labels = {
        title:
            currentLocale === 'ar'
                ? 'إصدار رخصة للمدرس'
                : 'Issue Teacher License',
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
                teacherId,
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
