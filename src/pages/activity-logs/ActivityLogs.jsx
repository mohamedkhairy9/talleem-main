import React, { useState } from 'react';
import { useActivityLogsQuery } from '@/api/hooks/useActivityLogs';
import Table from '@/components/common/table/Table';
import { activityLogsColumns } from './configs';
import usePagination from '@/utils/hooks/global/usePagination';
import useLocale from '@/utils/hooks/global/useLocale';
import ViewActivityLogModal from './ViewActivityLogModal';

export default function ActivityLogs() {
    const [selectedActivityLog, setSelectedActivityLog] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refetch } = useActivityLogsQuery(pagination);
    const { t } = useLocale();

    console.log('Activity Logs data:', data);

    // Custom toggle modals for modal instead of navigation
    const toggleModals = {
        view: activityLog => {
            setSelectedActivityLog(activityLog);
            setIsViewModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsViewModalOpen(false);
        setSelectedActivityLog(null);
    };

    return (
        <div>
            <Table
                title={t('table_titles.activity_logs')}
                refresh={refetch}
                loading={isLoading}
                data={data?.data}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={activityLogsColumns}
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
                <ViewActivityLogModal
                    onClose={handleCloseModal}
                    activityLog={selectedActivityLog}
                />
            )}
        </div>
    );
}
