import { useRemotelyAttendancePlatformsQuery } from "@/api/hooks/useRemotelyAttendancePlatforms"
import useIsOpen from "@/utils/hooks/global/useIsOpen";
import { filtersDefaultValues, remotelyAttandancePlatformsColumns } from "./configs";
import useFiltering from "@/utils/hooks/global/useFiltering";
import i18next from "i18next";
import Filters from "./Filters";
import Table from "@/components/common/table/Table";
import useLocale from "@/utils/hooks/global/useLocale";


export default function RemotelyAttendancePlatforms(){
    const { isOpen, toggle } = useIsOpen();
    const { t } = useLocale()
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useRemotelyAttendancePlatformsQuery(filters);

    const tableData = data?.data?.map(({created_at, updated_at, ...item}) => ({
        name: item.name?.[i18next.language],
        ...item
    }))

    return (
        <div>
            <Table
                title={t('table_titles.remotely_attendance_platforms')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={remotelyAttandancePlatformsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
                enableAdd={false}
                enableEdit={false}
                enableDelete={false}
                enableView={false}
            />
        </div>
    )
}