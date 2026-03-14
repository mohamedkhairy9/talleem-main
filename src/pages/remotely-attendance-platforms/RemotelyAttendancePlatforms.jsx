import { useRemotelyAttendancePlatformsQuery } from "@/api/hooks/useRemotelyAttendancePlatforms"
import useIsOpen from "@/utils/hooks/global/useIsOpen";
import { filtersDefaultValues, remotelyAttandancePlatformsColumns } from "./configs";
import useFiltering from "@/utils/hooks/global/useFiltering";
import i18next from "i18next";
import Filters from "./Filters";
import Table from "@/components/common/table/Table";
import useLocale from "@/utils/hooks/global/useLocale";
import CreateRemotelyAttendancePlatform from "./CreateRemotelyAttendancePlatform";
import EditRemotelyAttendancePlatform from "./EditRemotelyAttendancePlatform";
import ViewRemotelyAttendancePlatform from "./ViewRemotelyAttendancePlatform";
import { DeleteRemotelyAttendancePlatorm } from "./DeleteRemotelyAttendancePlatform";
import { getOriginalObject } from "@/utils/helpers/global.fns";


export default function RemotelyAttendancePlatforms(){
    const { isOpen, toggle } = useIsOpen();
    const { t } = useLocale()
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useRemotelyAttendancePlatformsQuery(filters);

    const tableData = data?.data?.map(item => ({
        name: item.name?.[i18next.language],
        ...item
    }))

    const formData = data?.data?.map(({ created_at, updated_at, ...item }) => item)

    return (
        <div>
            <Table
                resource="remote_attendance_platforms"
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
            />
            {isOpen.add && <CreateRemotelyAttendancePlatform onClose={toggle.add}/>}
            {isOpen.edit && <EditRemotelyAttendancePlatform onClose={toggle.edit} oldData={getOriginalObject(isOpen.edit, formData)}/>}
            {isOpen.view && <ViewRemotelyAttendancePlatform onClose={toggle.view} oldData={getOriginalObject(isOpen.view, formData)}/>}
            {isOpen.delete && <DeleteRemotelyAttendancePlatorm id={isOpen.delete?.id} onClose={toggle.delete}/>}
        </div>
    )
}