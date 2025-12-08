import React, { useState } from 'react';
import { useImportErrorsQuery, useClearImportErrorsMutation } from '@/api/hooks/useImportErrors';
import Table from '@/components/common/table/Table';
import { importErrorsColumns } from './configs';
import usePagination from '@/utils/hooks/global/usePagination';
import useLocale from '@/utils/hooks/global/useLocale';
import ViewImportErrorModal from './ViewImportErrorModal';
import DeleteModal from '@/components/common/form/DeleteModal';
import { MdDelete } from 'react-icons/md';
import toastService from '@/utils/helpers/Toastservice';

export default function ImportErrors() {
    const [selectedImportError, setSelectedImportError] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refetch } = useImportErrorsQuery(pagination);
    const { mutate: clearErrors, isPending: isClearing } = useClearImportErrorsMutation();
    const { t } = useLocale();

    // Custom toggle modals for modal instead of navigation
    const toggleModals = {
        view: importError => {
            setSelectedImportError(importError);
            setIsViewModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsViewModalOpen(false);
        setSelectedImportError(null);
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleClearAll = () => {
        clearErrors(undefined, {
            onSuccess: () => {
                toastService.success(t('import_errors.clear_success'));
                setIsDeleteModalOpen(false);
                refetch();
            },
            onError: () => {
                toastService.error(t('import_errors.clear_failed'));
            }
        });
    };

    return (
        <div>
            <div className="mb-4 flex justify-end">
                <button
                    onClick={handleDeleteClick}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                    <MdDelete className="w-5 h-5" />
                    {t('import_errors.clear_all')}
                </button>
            </div>

            <Table
                title={t('table_titles.import_errors')}
                refresh={refetch}
                loading={isLoading}
                data={data?.data}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={importErrorsColumns}
                pagination={pagination}
                setPagination={setPagination}
                enableView={true}
                enableEdit={false}
                enableDelete={false}
                enableCopy={false}
                enableAdd={false}
                toggleModals={toggleModals}
            />

            {/* View Modal */}
            {isViewModalOpen && (
                <ViewImportErrorModal
                    onClose={handleCloseModal}
                    importError={selectedImportError}
                />
            )}

            {/* Delete All Modal */}
            {isDeleteModalOpen && (
                <DeleteModal
                    deleteFn={handleClearAll}
                    loading={isClearing}
                    onClose={() => setIsDeleteModalOpen(false)}
                    message={t('import_errors.clear_confirmation')}
                />
            )}
        </div>
    );
}

