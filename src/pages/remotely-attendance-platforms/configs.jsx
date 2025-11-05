import ActiveCell from "@/components/common/table/cells/ActiveCell";
import DateCell from "@/components/common/table/cells/DateCell";
import NameCell from "@/components/common/table/cells/NameCell"; 
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export const remotelyAttandancePlatformsColumns = [
    columnHelper.accessor('name', {
        header: 'table_headers.remotely_attendance_platforms',
        cell: info => <NameCell directValue={info.row.original.name}/>
    }),

    columnHelper.accessor('status', {
        header: 'table_headers.status',
        cell: info => <ActiveCell info={info}/>
    }),

    columnHelper.accessor('created_at', {
        header: 'table_headers.created_at',
        cell: info => {
            // console.log("info: ", info.getValue()) && 
            <DateCell fullDate value={info.getValue()}/>
        }
    })

]

export const remotelyAttandancePlatformsFields = [
    {
        name: "name.ar",
        label: "validation.name.label.ar",
        placeholder: "validation.name.placeholder.ar",
        type: "text",
        editMode: true,
        viewMode: true
    },
    {
        name: "name.en",
        label: "validation.name.label.en",
        placeholder: "validation.name.placeholder.en",
        type: "text",
        editMode: true,
        viewMode: true
    },
    {
        name: "status",
        label: "validation.status.label",
        placeholder: "validation.status.placeholder",
        type: "select",
        editMode: true,
        viewMode: true
    }
]

export const remotelyAttendanceplatformsFilters = [
    {
        name: "search",
        placeholder: "validation.search.placeholder",
        type: "text",
        defaultValue: ""
    },
    {
        name: "status",
        placeholder: "validation.status.placeholder",
        type: "select",
        defaultValue: 1
    }
]


export const filtersDefaultValues = {
    status: 1,
    search: ''
}