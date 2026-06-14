import React, { useState, useEffect, useMemo, useRef } from 'react';
import i18next from 'i18next';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper
} from '@tanstack/react-table';
import {
    MdChevronLeft,
    MdChevronRight,
    MdFirstPage,
    MdLastPage,
    MdSearch,
    MdFilterList,
    MdDownload,
    MdRefresh,
    MdExpandMore,
    MdExpandLess,
    MdClose,
    MdSettings,
    MdFileDownload,
    MdTableChart,
    MdPrint,
    MdFullscreen,
    MdFullscreenExit,
    MdCheckBox,
    MdCheckBoxOutlineBlank,
    MdMoreVert,
    MdEdit,
    MdDelete,
    MdContentCopy,
    MdAdd,
    MdViewColumn,
    MdSwapVert,
    MdShare,
    MdInfo,
    MdUpload,
    MdDragIndicator
} from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import useLanguageStore from '@/utils/stores/language.store';
import { FaEye } from 'react-icons/fa';
import { getObjectName } from '@/utils/helpers/global.fns';
import { formatDateForDisplay, isDateObject } from '@/utils/helpers/dateObjectHelpers';
import Can from '@/components/common/Can';

const columnHelper = createColumnHelper();

const Table = ({
    data,
    columns: externalColumns = [],
    onServerAction,
    loading = false,
    serverPagination = false,
    totalCount = data?.length || 0,
    className = '',
    title = 'Data Table',
    enableRowSelection = true,
    enableExport = true,
    enableAdd = true,
    enableEdit = true,
    enableDelete = true,
    enableCopy = true,
    enableView = true,
    enableImport = false,
    enableExportExample = false,
    onImport,
    onExportExample,
    onRowClick,
    customActions = [],
    refresh,
    toggleModals,
    pagination,
    setPagination,
    Actions = null,
    Filters = null,
    setFilters = null,
    filters = null,
    // New props for expandable rows and drag-and-drop
    enableExpandableRows = false,
    renderExpandedRow = null,
    enableDragAndDrop = false,
    onDragEnd = null,
    onSaveOrder = null,
    getRowId = null,
    orderField = 'order',
    resource = null
}) => {
    // Core state
    const { t } = useTranslation();
    const isRTL = useLanguageStore(state => state.isRTL);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});

    // UI state
    const [showColumnSettings, setShowColumnSettings] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showSelectedExportMenu, setShowSelectedExportMenu] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [density, setDensity] = useState('normal');
    const [showFiltersModal, setShowFiltersModal] = useState(false);

    // Expandable rows state
    const [expandedRows, setExpandedRows] = useState(new Set());

    // Drag and drop state
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [optimisticData, setOptimisticData] = useState(null); // Optimistic update state
    const [movedItemInfo, setMovedItemInfo] = useState(null); // Track moved item for API call

    const tableRef = useRef(null);

    // Enhanced columns with selection

    const SELECT = columnHelper.display({
        id: 'select',
        size: 50,
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <input
                    type="checkbox"
                    checked={table.getIsAllRowsSelected()}
                    ref={input => {
                        if (input)
                            input.indeterminate = table.getIsSomeRowsSelected();
                    }}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                />
            </div>
        )
    });

    const ACTIONS = columnHelper.display({
        id: 'actions',
        header: t('table.actions'),
        size: 120,
        cell: ({ row }) => (
            <div className="flex items-center space-x-1">
                {enableView && (resource ? (
                    <Can resource={resource} action="r">
                        <button
                            onClick={e => {
                                e.stopPropagation();
                                toggleModals?.view(row.original);
                            }}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title={t('table.view')}
                        >
                            <FaEye className="w-4 h-4" />
                        </button>
                    </Can>
                ) : (
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            toggleModals?.view(row.original);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        title={t('table.view')}
                    >
                        <FaEye className="w-4 h-4" />
                    </button>
                ))}
                {enableEdit && (resource ? (
                    <Can resource={resource} action="u">
                        <button
                            onClick={e => {
                                e.stopPropagation();
                                toggleModals?.edit(row.original);
                            }}
                            className="p-1 text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded transition-colors"
                            title={t('table.edit')}
                        >
                            <MdEdit className="w-4 h-4" />
                        </button>
                    </Can>
                ) : (
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            toggleModals?.edit(row.original);
                        }}
                        className="p-1 text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded transition-colors"
                        title={t('table.edit')}
                    >
                        <MdEdit className="w-4 h-4" />
                    </button>
                ))}
                {enableCopy && (
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            try {
                                navigator.clipboard.writeText(
                                    JSON.stringify(row.original, null, 2)
                                );
                            } catch (err) {
                                console.log('Copy failed:', err);
                            }
                        }}
                        className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                        title={t('table.copy')}
                    >
                        <MdContentCopy className="w-4 h-4" />
                    </button>
                )}
                {enableDelete && (resource ? (
                    <Can resource={resource} action="d">
                        <button
                            onClick={e => {
                                e.stopPropagation();
                                toggleModals?.delete(row.original);
                            }}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                            title={t('table.delete')}
                        >
                            <MdDelete className="w-4 h-4" />
                        </button>
                    </Can>
                ) : (
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            toggleModals?.delete(row.original);
                        }}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        title={t('table.delete')}
                    >
                        <MdDelete className="w-4 h-4" />
                    </button>
                ))}
                {Actions && (
                    <Actions row={row.original} toggleModals={toggleModals} />
                )}
            </div>
        )
    });

    // Check if any action is enabled
    const hasAnyAction = enableEdit || enableDelete || enableCopy || enableView;

    // Expandable column
    const EXPAND = columnHelper.display({
        id: 'expand',
        size: 50,
        header: () => null,
        cell: ({ row }) => {
            if (!enableExpandableRows || !renderExpandedRow) return null;
            const rowId = getRowId ? getRowId(row.original) : row.id;
            const isExpanded = expandedRows.has(rowId);
            return (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpandedRows(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has(rowId)) {
                                newSet.delete(rowId);
                            } else {
                                newSet.add(rowId);
                            }
                            return newSet;
                        });
                    }}
                    className="text-gray-600 hover:text-gray-800"
                >
                    {isExpanded ? (
                        <MdExpandLess className="w-5 h-5" />
                    ) : (
                        <MdExpandMore className="w-5 h-5" />
                    )}
                </button>
            );
        }
    });

    // Drag handle column
    const DRAG_HANDLE = columnHelper.display({
        id: 'drag',
        size: 50,
        header: () => null,
        cell: () => {
            if (!enableDragAndDrop) return null;
            return <MdDragIndicator className="w-5 h-5 text-gray-400" />;
        }
    });

    const columns = [
        ...(enableRowSelection ? [SELECT] : []),
        ...(enableExpandableRows ? [EXPAND] : []),
        ...(enableDragAndDrop ? [DRAG_HANDLE] : []),
        ...externalColumns,
        ...(hasAnyAction ? [ACTIONS] : [])
    ];

    // Convert pagination from {page, per_page} to {pageIndex, pageSize} for TanStack Table
    const tanstackPagination = {
        pageIndex: (pagination.page || 1) - 1, // Convert 1-based page to 0-based index
        pageSize: pagination.per_page || 10
    };

    // Handler to convert TanStack pagination changes back to {page, per_page} format
    const handlePaginationChange = updater => {
        if (typeof updater === 'function') {
            const newTanstackPagination = updater(tanstackPagination);
            const newPagination = {
                page: newTanstackPagination.pageIndex + 1, // Convert 0-based index to 1-based page
                per_page: newTanstackPagination.pageSize
            };
            setPagination(newPagination);
        } else {
            const newPagination = {
                page: updater.pageIndex + 1, // Convert 0-based index to 1-based page
                per_page: updater.pageSize
            };
            setPagination(newPagination);
        }
    };

    // Use optimistic data if available, otherwise use original data
    const displayData = optimisticData || data || [];

    // Table instance
    const table = useReactTable({
        data: displayData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: serverPagination
            ? undefined
            : getPaginationRowModel(),
        onPaginationChange: handlePaginationChange,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getRowId: getRowId || ((row) => row.id?.toString() || Math.random().toString()),
        state: {
            pagination: tanstackPagination,
            sorting,
            columnFilters,
            globalFilter,
            columnVisibility,
            rowSelection
        },
        pageCount: serverPagination
            ? Math.ceil(totalCount / pagination.per_page)
            : undefined,
        manualPagination: serverPagination,
        manualSorting: false, // Keep client-side sorting enabled
        manualFiltering: false, // Keep client-side filtering enabled
        enableRowSelection: enableRowSelection
    });

    // Drag and drop handlers
    const handleDragStart = (e, index) => {
        if (!enableDragAndDrop) return;
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
        e.currentTarget.style.opacity = '0.5';
    };

    const handleDragOver = (e, index) => {
        if (!enableDragAndDrop) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (draggedIndex !== null && draggedIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDragLeave = () => {
        if (!enableDragAndDrop) return;
        setDragOverIndex(null);
    };

    const handleDrop = (e, dropIndex) => {
        if (!enableDragAndDrop) return;
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        // Get current data (use optimistic if available, otherwise original)
        const currentData = optimisticData || data || [];
        const draggedItem = currentData[draggedIndex];
        const newOrder = dropIndex + 1;
        
        // Optimistically update the UI immediately
        const newData = [...currentData];
        newData.splice(draggedIndex, 1);
        newData.splice(dropIndex, 0, draggedItem);
        
        // Update order numbers if orderField is provided
        const updatedData = newData.map((item, idx) => {
            if (orderField && item[orderField] !== undefined) {
                return {
                    ...item,
                    [orderField]: idx + 1
                };
            }
            return item;
        });

        // Update UI immediately (optimistic update)
        setOptimisticData(updatedData);
        
        // Store moved item info for API call
        setMovedItemInfo({
            item: draggedItem,
            new_order: newOrder
        });

        setDraggedIndex(null);
        setDragOverIndex(null);
        
        // Call onDragEnd callback if provided
        if (onDragEnd) {
            onDragEnd(updatedData);
        }
    };

    const handleDragEnd = (e) => {
        if (!enableDragAndDrop) return;
        e.currentTarget.style.opacity = '1';
        
        // Call API automatically after drag ends if an item was moved
        if (movedItemInfo && onSaveOrder) {
            onSaveOrder(movedItemInfo.item, movedItemInfo.new_order, () => {
                // Clear optimistic state and moved item info after API call completes
                setOptimisticData(null);
                setMovedItemInfo(null);
            });
        }
    };

    // Export functions
    const exportToCSV = () => {
        try {
            const visibleColumns = table
                .getVisibleFlatColumns()
                .filter(col => col.id !== 'select' && col.id !== 'actions');
            const headers = visibleColumns
                .map(col => t(col.columnDef.header))
                .join(',');
            const rows = table.getFilteredRowModel().rows.map(row =>
                visibleColumns
                    .map(col => {
                        const value = row.original[col.id];
                        console.log(col.id, value);

                        return typeof value === 'string' && value.includes(',')
                            ? `"${value}"`
                            : getObjectName(value) || '';
                    })
                    .join(',')
            );

            const csvContent = [headers, ...rows].join('\n');
            const BOM = '\uFEFF'; // UTF-8 BOM
            const blob = new Blob([BOM + csvContent], {
                type: 'text/csv;charset=utf-8;'
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title.replace(/\s+/g, '_')}_${
                new Date().toISOString().split('T')[0]
            }.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            setShowExportMenu(false);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        }
    };

    const exportToJSON = () => {
        try {
            const data = table
                .getFilteredRowModel()
                .rows.map(row => row.original);
            const jsonContent = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonContent], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title.replace(/\s+/g, '_')}_${
                new Date().toISOString().split('T')[0]
            }.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            setShowExportMenu(false);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        }
    };

    const getPrintableColumns = rowsTable =>
        rowsTable
            .getVisibleFlatColumns()
            .filter(
                col =>
                    !['select', 'actions', 'expand', 'drag'].includes(col.id)
            );

    const escapeHtml = value =>
        String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

    const formatPrintableValue = value => {
        if (value === null || value === undefined || value === '') return '-';

        if (typeof value === 'boolean') {
            return value ? t('common.enabled') : t('common.disabled');
        }

        if (
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'bigint'
        ) {
            return String(value);
        }

        if (Array.isArray(value)) {
            const formatted = value
                .map(formatPrintableValue)
                .filter(item => item && item !== '-');
            return formatted.length ? formatted.join(', ') : '-';
        }

        if (isDateObject(value)) {
            return formatDateForDisplay(value);
        }

        if (typeof value === 'object') {
            const localizedValue = getObjectName(value);
            if (localizedValue) return localizedValue;

            if (value.label) return formatPrintableValue(value.label);
            if (value.value && typeof value.value !== 'object') {
                return formatPrintableValue(value.value);
            }

            const formatted = Object.values(value)
                .map(formatPrintableValue)
                .filter(item => item && item !== '-');

            return formatted.length ? formatted.join(', ') : '-';
        }

        return String(value);
    };

    const getPrintableHeader = column => {
        const header = column.columnDef.header;
        if (typeof header === 'string') return t(header);
        return column.id;
    };

    const getPrintableCellValue = (row, column) => {
        let value;

        try {
            value = row.getValue(column.id);
        } catch {
            value = row.original?.[column.id];
        }

        return formatPrintableValue(value);
    };

    const openPrintPreview = ({
        heading,
        rows,
        count,
        countLabel,
        onCloseMenu
    }) => {
        const visibleColumns = getPrintableColumns(table);
        const printWindow = window.open('', '_blank');

        if (!printWindow) {
            throw new Error('Unable to open print window');
        }

        const tableHTML = `
            <table>
                <thead>
                    <tr>
                        ${visibleColumns
                            .map(
                                col =>
                                    `<th>${escapeHtml(
                                        getPrintableHeader(col)
                                    )}</th>`
                            )
                            .join('')}
                    </tr>
                </thead>
                <tbody>
                    ${rows
                        .map(
                            row => `
                                <tr>
                                    ${visibleColumns
                                        .map(
                                            col =>
                                                `<td>${escapeHtml(
                                                    getPrintableCellValue(
                                                        row,
                                                        col
                                                    )
                                                )}</td>`
                                        )
                                        .join('')}
                                </tr>
                            `
                        )
                        .join('')}
                </tbody>
            </table>
        `;

        printWindow.document.write(`
            <html>
                <head>
                    <title>${escapeHtml(heading)}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                            direction: ${isRTL ? 'rtl' : 'ltr'};
                        }
                        h1 {
                            margin-bottom: 8px;
                        }
                        .meta {
                            margin: 0 0 16px;
                            color: #555;
                            font-size: 14px;
                        }
                        table {
                            border-collapse: collapse;
                            width: 100%;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 8px;
                            text-align: ${isRTL ? 'right' : 'left'};
                            vertical-align: top;
                            font-size: 12px;
                        }
                        th {
                            background-color: #f2f2f2;
                            font-weight: bold;
                        }
                        @media print {
                            body {
                                margin: 12px;
                            }
                        }
                    </style>
                </head>
                <body>
                    <h1>${escapeHtml(heading)}</h1>
                    <p class="meta">${escapeHtml(
                        `${countLabel}: ${count}`
                    )}</p>
                    ${tableHTML}
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
        }, 250);

        onCloseMenu?.();
    };

    const printTable = () => {
        try {
            const rows = table.getSortedRowModel().rows;
            openPrintPreview({
                heading: title,
                rows,
                count: rows.length,
                countLabel: isRTL ? 'إجمالي السجلات' : 'Total records',
                onCloseMenu: () => setShowExportMenu(false)
            });
        } catch (error) {
            console.error('Print failed:', error);
            alert('Print failed. Please try again.');
        }
    };

    // Export functions for selected rows
    const exportSelectedToCSV = () => {
        try {
            const visibleColumns = table
                .getVisibleFlatColumns()
                .filter(col => col.id !== 'select' && col.id !== 'actions');
            const headers = visibleColumns
                .map(col => t(col.columnDef.header))
                .join(',');
            const selectedData = selectedRows.map(row => row.original);
            const rows = selectedData.map(rowData =>
                visibleColumns
                    .map(col => {
                        const value = rowData[col.id];
                        return typeof value === 'string' && value.includes(',')
                            ? `"${value}"`
                            : value || '';
                    })
                    .join(',')
            );

            const csvContent = [headers, ...rows].join('\n');
            const BOM = '\uFEFF'; // UTF-8 BOM
            const blob = new Blob([BOM + csvContent], {
                type: 'text/csv;charset=utf-8;'
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `selected_${title.replace(/\s+/g, '_')}_${
                new Date().toISOString().split('T')[0]
            }.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            setShowSelectedExportMenu(false);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        }
    };

    const exportSelectedToJSON = () => {
        try {
            const selectedData = selectedRows.map(row => row.original);
            const jsonContent = JSON.stringify(selectedData, null, 2);
            const blob = new Blob([jsonContent], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `selected_${title.replace(/\s+/g, '_')}_${
                new Date().toISOString().split('T')[0]
            }.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            setShowSelectedExportMenu(false);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        }
    };

    const printSelectedRows = () => {
        try {
            openPrintPreview({
                heading: `${title} - ${t('table.print_selected')}`,
                rows: selectedRows,
                count: selectedCount,
                countLabel: isRTL ? 'عدد السجلات المحددة' : 'Selected records',
                onCloseMenu: () => setShowSelectedExportMenu(false)
            });
        } catch (error) {
            console.error('Print failed:', error);
            alert('Print failed. Please try again.');
        }
    };

    // Enhanced filter dropdown
    const FilterDropdown = ({ column }) => {
        const [isOpen, setIsOpen] = useState(false);
        const [filterValue, setFilterValue] = useState('');
        const buttonRef = React.useRef(null);
        const [position, setPosition] = useState({ top: 0, left: 0 });

        const uniqueValues = useMemo(() => {
            if (!data) return [];

            try {
                const values = data
                    .map(row => row[column.id])
                    .filter(val => val != null && val !== '')
                    .map(el => el[i18next.language] || el);

                return [...new Set(values)].slice(0, 10);
            } catch (error) {
                console.error('Filter error:', error);
                return [];
            }
        }, [data, column.id]);

        const handleFilterApply = value => {
            try {
                column.setFilterValue(value);
                setIsOpen(false);
            } catch (error) {
                console.error('Filter apply error:', error);
            }
        };

        // Calculate dropdown position when opened
        React.useEffect(() => {
            if (isOpen && buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                const dropdownWidth = 256; // w-64 = 256px
                const viewportWidth = window.innerWidth;
                
                // Check if dropdown would overflow on the right
                let leftPosition = rect.left;
                if (rect.left + dropdownWidth > viewportWidth) {
                    // Align to right edge of button
                    leftPosition = rect.right - dropdownWidth;
                }
                
                // Make sure it doesn't overflow on the left
                if (leftPosition < 0) {
                    leftPosition = 10; // Small margin from left edge
                }
                
                setPosition({
                    top: rect.bottom + window.scrollY,
                    left: leftPosition
                });
            }
        }, [isOpen]);

        // Close dropdown when clicking outside
        React.useEffect(() => {
            if (!isOpen) return;
            
            const handleClickOutside = (e) => {
                if (buttonRef.current && !buttonRef.current.contains(e.target)) {
                    const dropdown = document.getElementById(`filter-dropdown-${column.id}`);
                    if (dropdown && !dropdown.contains(e.target)) {
                        setIsOpen(false);
                    }
                }
            };
            
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, [isOpen, column.id]);

        return (
            <div className="relative">
                <button
                    ref={buttonRef}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-1 rounded transition-colors ${
                        column.getFilterValue()
                            ? 'bg-primary-100 text-primary-600'
                            : 'hover:bg-gray-100 text-gray-400'
                    }`}
                >
                    <MdFilterList className="w-4 h-4" />
                </button>

                {isOpen && (
                    <div 
                        id={`filter-dropdown-${column.id}`}
                        className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-[999] w-64"
                        style={{
                            top: `${position.top}px`,
                            left: `${position.left}px`
                        }}
                    >
                        <div className="p-3 border-b border-gray-200">
                            <input
                                type="text"
                                placeholder={t('table.filter_value')}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={filterValue}
                                onChange={e => setFilterValue(e.target.value)}
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        handleFilterApply(filterValue);
                                    }
                                }}
                            />
                        </div>

                        <div className="max-h-48 overflow-y-auto">
                            {uniqueValues.map((value, index) => (
                                <button
                                    key={index}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                                    onClick={() => handleFilterApply(value)}
                                >
                                    {String(value)}
                                </button>
                            ))}
                        </div>

                        <div className="p-3 border-t border-gray-200 flex justify-between">
                            <button
                                onClick={() => {
                                    column.setFilterValue('');
                                    setFilterValue('');
                                    setIsOpen(false);
                                }}
                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                                {t('table.clear')}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-sm text-gray-600 hover:text-gray-700"
                            >
                                {t('table.close')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Density classes
    const densityClasses = {
        compact: 'px-3 py-2',
        normal: 'px-6 py-4',
        comfortable: 'px-8 py-6'
    };

    // Clear optimistic data when new data arrives from server
    useEffect(() => {
        if (data && optimisticData) {
            // Clear optimistic state when fresh data arrives
            setOptimisticData(null);
            setMovedItemInfo(null);
        }
    }, [data]);

    // Server-side actions
    useEffect(() => {
        if (serverPagination && onServerAction) {
            try {
                onServerAction({
                    pagination,
                    sorting,
                    columnFilters,
                    globalFilter
                });
            } catch (error) {
                console.error('Server action error:', error);
            }
        }
    }, [pagination, sorting, columnFilters, globalFilter, serverPagination]);

    // Click outside handlers
    useEffect(() => {
        const handleClickOutside = event => {
            if (!event.target.closest('.export-menu')) {
                setShowExportMenu(false);
            }
            if (!event.target.closest('.column-settings')) {
                setShowColumnSettings(false);
            }
            if (!event.target.closest('.selected-export-menu')) {
                setShowSelectedExportMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Selection helpers
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedCount = selectedRows.length;

    // Calculate sticky column positions
    const stickyColumnsInfo = useMemo(() => {
        const visibleColumns = table.getVisibleFlatColumns();
        const firstColumnIndex = 0;
        const secondColumnIndex = 1; // Second column (first data column after checkbox)
        const actionsColumnIndex = visibleColumns.findIndex(col => col.id === 'actions');
        
        // Calculate left positions for sticky columns
        let firstColumnLeft = 0;
        let secondColumnLeft = 0;
        const hasSecondColumn = visibleColumns.length > 1 && secondColumnIndex < visibleColumns.length;
        if (hasSecondColumn) {
            // Second column should be positioned right after the first column
            secondColumnLeft = visibleColumns[0]?.getSize() || 50;
        }
        
        // Calculate right position for actions column (cumulative width of columns after it)
        let actionsColumnRight = 0;
        if (actionsColumnIndex !== -1) {
            for (let i = actionsColumnIndex + 1; i < visibleColumns.length; i++) {
                actionsColumnRight += visibleColumns[i].getSize() || 120;
            }
        }
        
        return {
            firstColumnIndex,
            secondColumnIndex,
            actionsColumnIndex,
            firstColumnLeft,
            secondColumnLeft,
            actionsColumnRight,
            hasSecondColumn
        };
    }, [table, columnVisibility]);

    return (
        <div
            className={`text-lg ${
                isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''
            } ${className}`}
        >
            <div
                className={`bg-white rounded-xl shadow-sm border border-gray-200 ${
                    isFullscreen ? 'h-full flex flex-col' : ''
                }`}
            >
                {/* Header Controls */}
                <div className="p-6 border-b rounded-t-xl border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex flex-col space-y-4">
                        {/* Title Row */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                            <div className="flex items-center space-x-4">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {title}
                                </h2>
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                                        {totalCount.toLocaleString()}{' '}
                                        {t('table.total')}
                                    </span>
                                    {selectedCount > 0 && (
                                        <span className="text-sm text-primary-600 bg-primary-100 px-3 py-1 rounded-full font-medium">
                                            {selectedCount}{' '}
                                            {t('table.selected')}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">

                                {/* Density Control */}
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    {['compact', 'normal', 'comfortable'].map(
                                        d => (
                                            <button
                                                key={d}
                                                onClick={() => setDensity(d)}
                                                className={`px-2 sm:px-3 py-1 text-xs font-medium rounded transition-colors ${
                                                    density === d
                                                        ? 'bg-white text-gray-900 shadow-sm'
                                                        : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                            >
                                                <span className="hidden sm:inline">{t(`table.${d}`)}</span>
                                                <span className="sm:hidden">{t(`table.${d}`).charAt(0).toUpperCase()}</span>
                                            </button>
                                        )
                                    )}
                                </div>

                                {/* Fullscreen Toggle */}
                                <button
                                    onClick={() =>
                                        setIsFullscreen(!isFullscreen)
                                    }
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    title={
                                        isFullscreen
                                            ? t('table.exit_fullscreen')
                                            : t('table.enter_fullscreen')
                                    }
                                >
                                    {isFullscreen ? (
                                        <MdFullscreenExit className="w-4 h-4" />
                                    ) : (
                                        <MdFullscreen className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Controls Row */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                            {/* Filters Button */}
                            <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                                {Filters && (
                                    <button
                                        onClick={() => setShowFiltersModal(true)}
                                        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        title={t('table.filters')}
                                    >
                                        <MdFilterList className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-sm font-medium hidden sm:inline">
                                            {t('table.filters')}
                                        </span>
                                    </button>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-2">
                                {/* Add Button */}
                                {enableAdd && (resource ? (
                                    <Can resource={resource} action="c">
                                        <button
                                            onClick={toggleModals?.add}
                                            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary transition-colors"
                                            title={t('table.add_new')}
                                        >
                                            <MdAdd className="w-4 h-4 flex-shrink-0" />
                                            <span className="text-sm font-medium hidden sm:inline">
                                                {t('table.add_new')}
                                            </span>
                                        </button>
                                    </Can>
                                ) : (
                                    <button
                                        onClick={toggleModals?.add}
                                        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary transition-colors"
                                        title={t('table.add_new')}
                                    >
                                        <MdAdd className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-sm font-medium hidden sm:inline">
                                            {t('table.add_new')}
                                        </span>
                                    </button>
                                ))}

                                {/* Import Button */}
                                {enableImport && onImport && (resource ? (
                                    <Can resource={resource} action="im">
                                        <button
                                            onClick={onImport}
                                            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            title={t('table.import')}
                                        >
                                            <MdUpload className="w-4 h-4 flex-shrink-0" />
                                            <span className="text-sm font-medium hidden sm:inline">
                                                {t('table.import')}
                                            </span>
                                        </button>
                                    </Can>
                                ) : (
                                    <button
                                        onClick={onImport}
                                        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        title={t('table.import')}
                                    >
                                        <MdUpload className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-sm font-medium hidden sm:inline">
                                            {t('table.import')}
                                        </span>
                                    </button>
                                ))}

                                {/* Export Example Button */}
                                {enableExportExample && onExportExample && (resource ? (
                                    <Can resource={resource} action="ex">
                                        <button
                                            onClick={onExportExample}
                                            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            title={t('table.download_example')}
                                        >
                                            <MdFileDownload className="w-4 h-4 flex-shrink-0" />
                                            <span className="text-sm font-medium hidden sm:inline">
                                                {t('table.download_example')}
                                            </span>
                                        </button>
                                    </Can>
                                ) : (
                                    <button
                                        onClick={onExportExample}
                                        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        title={t('table.download_example')}
                                    >
                                        <MdFileDownload className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-sm font-medium hidden sm:inline">
                                            {t('table.download_example')}
                                        </span>
                                    </button>
                                ))}

                                {/* Column Settings */}
                                <div className="relative column-settings">
                                    <button
                                        onClick={() =>
                                            setShowColumnSettings(
                                                !showColumnSettings
                                            )
                                        }
                                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        title={t('table.column_settings')}
                                    >
                                        <MdViewColumn className="w-4 h-4 text-gray-600" />
                                    </button>

                                    {showColumnSettings && (
                                        <div
                                            className={`absolute ${
                                                isRTL ? 'left-0' : 'right-0'
                                            } top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-64`}
                                        >
                                            <div className="p-4 border-b border-gray-200">
                                                <h3 className="font-medium text-gray-900">
                                                    {t(
                                                        'table.column_visibility'
                                                    )}
                                                </h3>
                                            </div>
                                            <div className="p-2 max-h-64 overflow-y-auto">
                                                {table.getAllColumns().map(
                                                    column =>
                                                        column.id !==
                                                            'select' &&
                                                        column.id !==
                                                            'actions' && (
                                                            <label
                                                                key={column.id}
                                                                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={column.getIsVisible()}
                                                                    onChange={column.getToggleVisibilityHandler()}
                                                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                                />
                                                                <span className="text-sm text-gray-700">
                                                                    {t(
                                                                        column
                                                                            .columnDef
                                                                            .header
                                                                    )}
                                                                </span>
                                                            </label>
                                                        )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Export Menu */}
                                {enableExport && (
                                    <div className="relative export-menu">
                                        <button
                                            onClick={() =>
                                                setShowExportMenu(
                                                    !showExportMenu
                                                )
                                            }
                                            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                            title={t('table.export')}
                                        >
                                            <MdDownload className="w-4 h-4 flex-shrink-0" />
                                            <span className="text-sm font-medium hidden sm:inline">
                                                {t('table.export')}
                                            </span>
                                            <MdExpandMore className="w-4 h-4 flex-shrink-0 hidden sm:block" />
                                        </button>

                                        {showExportMenu && (
                                            <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-48`}>
                                                <div className="p-2">
                                                    <button
                                                        onClick={exportToCSV}
                                                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-50 rounded transition-colors"
                                                    >
                                                        <MdTableChart className="w-4 h-4 text-primary-600" />
                                                        <span>
                                                            {t(
                                                                'table.export_as_csv'
                                                            )}
                                                        </span>
                                                    </button>
                                                    <button
                                                        onClick={exportToJSON}
                                                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-50 rounded transition-colors"
                                                    >
                                                        <MdFileDownload className="w-4 h-4 text-primary-600" />
                                                        <span>
                                                            {t(
                                                                'table.export_as_json'
                                                            )}
                                                        </span>
                                                    </button>
                                                    <button
                                                        onClick={printTable}
                                                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-50 rounded transition-colors"
                                                    >
                                                        <MdPrint className="w-4 h-4 text-purple-600" />
                                                        <span>
                                                            {t(
                                                                'table.print_table'
                                                            )}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Refresh Button */}
                                <button
                                    onClick={refresh}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={loading}
                                    title={t('table.refresh_data')}
                                >
                                    <MdRefresh
                                        className={`w-4 h-4 text-gray-600 ${
                                            loading ? 'animate-spin' : ''
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Bulk Actions */}
                        {selectedCount > 0 && (
                            <div className="flex items-center justify-between bg-primary-50 border border-primary-200 rounded-lg p-3">
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm font-medium text-primary-900">
                                        {selectedCount} {t('table.selected')}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <div className="relative selected-export-menu">
                                            <button
                                                onClick={() =>
                                                    setShowSelectedExportMenu(
                                                        !showSelectedExportMenu
                                                    )
                                                }
                                                className="flex items-center space-x-1 px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition-colors"
                                            >
                                                <MdDownload className="w-4 h-4" />
                                                <span>
                                                    {t('table.export_selected')}
                                                </span>
                                                <MdExpandMore
                                                    className={`w-4 h-4 transition-transform ${
                                                        showSelectedExportMenu
                                                            ? 'rotate-180'
                                                            : ''
                                                    }`}
                                                />
                                            </button>

                                            {showSelectedExportMenu && (
                                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[160px]">
                                                    <button
                                                        onClick={
                                                            exportSelectedToCSV
                                                        }
                                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <MdDownload className="w-4 h-4" />
                                                        {t(
                                                            'table.export_as_csv'
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={
                                                            exportSelectedToJSON
                                                        }
                                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <MdDownload className="w-4 h-4" />
                                                        {t(
                                                            'table.export_as_json'
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={
                                                            printSelectedRows
                                                        }
                                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <MdPrint className="w-4 h-4" />
                                                        {t(
                                                            'table.print_selected'
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        {/* <button
                                            onClick={() => {
                                                if (
                                                    window.confirm(
                                                        `Are you sure you want to delete ${selectedCount} selected items?`
                                                    )
                                                ) {
                                                    console.log(
                                                        'Bulk delete:',
                                                        selectedRows.map(
                                                            row => row.original
                                                        )
                                                    );
                                                    setRowSelection({});
                                                }
                                            }}
                                            className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                                        >
                                            <MdDelete className="w-4 h-4" />
                                            <span>Delete Selected</span>
                                        </button> */}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setRowSelection({})}
                                    className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                                >
                                    {t('table.clear_selection')}
                                </button>
                            </div>
                        )}

                        {/* Active Filters */}
                        {(columnFilters.length > 0 || globalFilter) && (
                            <div className="flex items-center space-x-2 flex-wrap">
                                <span className="text-sm text-gray-500 flex items-center space-x-1">
                                    <MdInfo className="w-4 h-4" />
                                    <span>{t('table.active_filters')}:</span>
                                </span>
                                {globalFilter && (
                                    <span className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
                                        <span>
                                            {t('table.search')}: "{globalFilter}
                                            "
                                        </span>
                                        <button
                                            onClick={() => setGlobalFilter('')}
                                        >
                                            <MdClose className="w-3 h-3 hover:text-primary-900" />
                                        </button>
                                    </span>
                                )}
                                {columnFilters.map(filter => (
                                    <span
                                        key={filter.id}
                                        className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                                    >
                                        <span>
                                            {filter.id}: {filter.value}
                                        </span>
                                        <button
                                            onClick={() =>
                                                table
                                                    .getColumn(filter.id)
                                                    ?.setFilterValue('')
                                            }
                                        >
                                            <MdClose className="w-3 h-3 hover:text-purple-900" />
                                        </button>
                                    </span>
                                ))}
                                <button
                                    onClick={() => {
                                        console.log('filters', filters);
                                        setColumnFilters([]);
                                        setGlobalFilter('');
                                        setFilters({});
                                    }}
                                    className="text-sm text-red-600 hover:text-red-800 font-medium ml-2"
                                >
                                    Clear All
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div
                    className={`relative ${
                        isFullscreen ? 'flex-1 overflow-hidden' : ''
                    }`}
                >
                    <div 
                        className="overflow-x-auto overflow-y-auto"
                        ref={tableRef}
                        style={{ 
                            maxHeight: isFullscreen ? 'calc(100vh - 300px)' : '70vh'
                        }}
                    >
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-40 shadow-sm">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header, idx) => {
                                        const isFirstColumn = idx === stickyColumnsInfo.firstColumnIndex;
                                        const isSecondColumn = stickyColumnsInfo.hasSecondColumn && idx === stickyColumnsInfo.secondColumnIndex;
                                        const isActionsColumn = header.id === 'actions';
                                        const isSticky = isFirstColumn || isSecondColumn || isActionsColumn;
                                        
                                        // Calculate sticky position
                                        let stickyStyle = {};
                                        let stickyShadowClass = '';
                                        if (isSticky) {
                                            // Add shadow for sticky columns
                                            if (isFirstColumn) {
                                                stickyShadowClass = isRTL ? 'shadow-[2px_0_4px_rgba(0,0,0,0.1)]' : 'shadow-[2px_0_4px_rgba(0,0,0,0.1)]';
                                                stickyStyle = {
                                                    position: 'sticky',
                                                    [isRTL ? 'right' : 'left']: 0,
                                                    zIndex: 50, // Increased from 30 to 50 to ensure headers stay above row cells
                                                    backgroundColor: '#f9fafb' // gray-50 to match thead - solid, not transparent
                                                };
                                            } else if (isSecondColumn) {
                                                stickyShadowClass = isRTL ? 'shadow-[2px_0_4px_rgba(0,0,0,0.1)]' : 'shadow-[2px_0_4px_rgba(0,0,0,0.1)]';
                                                stickyStyle = {
                                                    position: 'sticky',
                                                    [isRTL ? 'right' : 'left']: stickyColumnsInfo.secondColumnLeft,
                                                    zIndex: 50, // Increased from 30 to 50 to ensure headers stay above row cells
                                                    backgroundColor: '#f9fafb' // gray-50 to match thead - solid, not transparent
                                                };
                                            } else if (isActionsColumn) {
                                                stickyShadowClass = isRTL ? 'shadow-[-2px_0_4px_rgba(0,0,0,0.1)]' : 'shadow-[-2px_0_4px_rgba(0,0,0,0.1)]';
                                                stickyStyle = {
                                                    position: 'sticky',
                                                    [isRTL ? 'left' : 'right']: 0,
                                                    zIndex: 50, // Increased from 30 to 50 to ensure headers stay above row cells
                                                    backgroundColor: '#f9fafb' // gray-50 to match thead - solid, not transparent
                                                };
                                            }
                                        }
                                        
                                        return (
                                        <th
                                            key={header.id}
                                            className={`${densityClasses[density]} min-w-fit text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200  ${stickyShadowClass}`}
                                            style={{ width: header.getSize(), ...stickyStyle }}
                                        >
                                            <div
                                                className={`flex items-center ${
                                                    idx === 0 &&
                                                    enableRowSelection
                                                        ? 'justify-center'
                                                        : 'justify-between'
                                                } `}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    {header.isPlaceholder ? null : (
                                                        <button
                                                            className={`flex ${
                                                                isRTL
                                                                    ? 'text-right'
                                                                    : 'text-left'
                                                            } items-center space-x-1 hover:text-gray-700 transition-colors ${
                                                                header.column.getCanSort()
                                                                    ? 'cursor-pointer select-none'
                                                                    : ''
                                                            }`}
                                                            onClick={header.column.getToggleSortingHandler()}
                                                        >
                                                            <span className='min-w-fit'>
                                                                {(() => {
                                                                    const headerValue = flexRender(
                                                                        header.column.columnDef.header,
                                                                        header.getContext()
                                                                    );
                                                                    
                                                                    // If header is null or empty, don't translate
                                                                    if (headerValue === null || headerValue === undefined || headerValue === '') {
                                                                        return headerValue;
                                                                    }
                                                                    
                                                                    // If header is already a React element or object, render it directly
                                                                    if (React.isValidElement(headerValue) || typeof headerValue === 'object') {
                                                                        return headerValue;
                                                                    }
                                                                    
                                                                    // If it's a string, translate it
                                                                    return typeof headerValue === 'string' ? t(headerValue) : headerValue;
                                                                })()}
                                                            </span>
                                                            {header.column.getCanSort() && (
                                                                <div className="flex flex-col">
                                                                    {header.column.getIsSorted() ===
                                                                    'asc' ? (
                                                                        <MdExpandLess className="w-4 h-4 text-primary-600" />
                                                                    ) : header.column.getIsSorted() ===
                                                                      'desc' ? (
                                                                        <MdExpandMore className="w-4 h-4 text-primary-600" />
                                                                    ) : (
                                                                        <MdSwapVert className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                                {/* {header.column.getCanFilter() && (
                                                    <FilterDropdown
                                                        column={header.column}
                                                    />
                                                )} */}
                                            </div>
                                        </th>
                                        );
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-6 py-16 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="flex space-x-1">
                                                <div
                                                    className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
                                                    style={{
                                                        animationDelay: '0ms'
                                                    }}
                                                ></div>
                                                <div
                                                    className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
                                                    style={{
                                                        animationDelay: '150ms'
                                                    }}
                                                ></div>
                                                <div
                                                    className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
                                                    style={{
                                                        animationDelay: '300ms'
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="text-gray-500 text-lg font-medium">
                                                Loading data...
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ) : table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-6 py-16 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <MdSearch className="w-12 h-12 text-gray-300" />
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {t('table.no_data_found')}
                                                </h3>
                                                <p className="text-gray-500">
                                                    {t('table.no_data_description')}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setColumnFilters([]);
                                                    setGlobalFilter('');
                                                    setFilters({});
                                                }}
                                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                            >
                                                {t('table.clear_all')}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row, index) => {
                                    const rowId = getRowId ? getRowId(row.original) : row.id;
                                    const isExpanded = enableExpandableRows && expandedRows.has(rowId);
                                    const isDragged = enableDragAndDrop && draggedIndex === index;
                                    const isDragOver = enableDragAndDrop && dragOverIndex === index;

                                    return (
                                        <React.Fragment key={row.id}>
                                            <tr
                                                draggable={enableDragAndDrop}
                                                onDragStart={(e) => {
                                                    if (enableDragAndDrop) {
                                                        handleDragStart(e, index);
                                                    }
                                                }}
                                                onDragOver={(e) => enableDragAndDrop && handleDragOver(e, index)}
                                                onDragLeave={enableDragAndDrop ? handleDragLeave : undefined}
                                                onDrop={(e) => enableDragAndDrop && handleDrop(e, index)}
                                                onDragEnd={enableDragAndDrop ? handleDragEnd : undefined}
                                                className={`
                      hover:bg-primary-50 transition-all duration-200 group
                      ${
                          row.getIsSelected()
                              ? 'bg-primary-100 border-l-4 border-primary-500'
                              : ''
                      }
                      ${index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}
                      ${enableDragAndDrop ? 'cursor-move' : ''}
                      ${isDragged ? 'opacity-50 bg-blue-100' : ''}
                      ${isDragOver ? 'border-t-2 border-blue-500 bg-blue-50' : ''}
                    `}
                                                onClick={() =>
                                                    onRowClick?.(row.original)
                                                }
                                            >
                                                {row.getVisibleCells().map((cell, cellIdx) => {
                                                    const isFirstColumn = cellIdx === stickyColumnsInfo.firstColumnIndex;
                                                    const isSecondColumn = stickyColumnsInfo.hasSecondColumn && cellIdx === stickyColumnsInfo.secondColumnIndex;
                                                    const isActionsColumn = cell.column.id === 'actions';
                                                    const isSticky = isFirstColumn || isSecondColumn || isActionsColumn;
                                                    
                                                    // Calculate sticky position
                                                    let stickyStyle = {};
                                                    let stickyClassName = '';
                                                    let stickyShadowClass = '';
                                                    if (isSticky) {
                                                        if (isFirstColumn) {
                                                            stickyShadowClass = isRTL ? 'shadow-[2px_0_4px_rgba(0,0,0,0.1)]' : 'shadow-[2px_0_4px_rgba(0,0,0,0.1)]';
                                                            stickyStyle = {
                                                                position: 'sticky',
                                                                [isRTL ? 'right' : 'left']: 0,
                                                                zIndex: 20
                                                            };
                                                            // Solid background colors - no transparency
                                                            stickyClassName = row.getIsSelected() 
                                                                ? 'bg-primary-100' 
                                                                : (index % 2 === 0 ? 'bg-gray-50' : 'bg-white');
                                                        } else if (isSecondColumn) {
                                                            stickyShadowClass = isRTL ? 'shadow-[2px_0_4px_rgba(0,0,0,0.1)]' : 'shadow-[2px_0_4px_rgba(0,0,0,0.1)]';
                                                            stickyStyle = {
                                                                position: 'sticky',
                                                                [isRTL ? 'right' : 'left']: stickyColumnsInfo.secondColumnLeft,
                                                                zIndex: 20
                                                            };
                                                            // Solid background colors - no transparency
                                                            stickyClassName = row.getIsSelected() 
                                                                ? 'bg-primary-100' 
                                                                : (index % 2 === 0 ? 'bg-gray-50' : 'bg-white');
                                                        } else if (isActionsColumn) {
                                                            stickyShadowClass = isRTL ? 'shadow-[-2px_0_4px_rgba(0,0,0,0.1)]' : 'shadow-[-2px_0_4px_rgba(0,0,0,0.1)]';
                                                            stickyStyle = {
                                                                position: 'sticky',
                                                                [isRTL ? 'left' : 'right']: 0,
                                                                zIndex: 20
                                                            };
                                                            // Solid background colors - no transparency
                                                            stickyClassName = row.getIsSelected() 
                                                                ? 'bg-primary-100' 
                                                                : (index % 2 === 0 ? 'bg-gray-50' : 'bg-white');
                                                        }
                                                    }
                                                    
                                                    return (
                                                    <td
                                                        key={cell.id}
                                                        className={`${densityClasses[density]} whitespace-nowrap text-sm border-b border-gray-100 group-hover:border-primary-200 transition-colors ${stickyClassName} ${isSticky ? 'group-hover:bg-primary-50' : ''} ${stickyShadowClass}`}
                                                        style={stickyStyle}
                                                    >
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </td>
                                                    );
                                                })}
                                            </tr>
                                            {isExpanded && renderExpandedRow && (
                                                <tr>
                                                    <td
                                                        colSpan={columns.length}
                                                        className="px-6 py-4 bg-gray-50"
                                                    >
                                                        {renderExpandedRow(row.original, row)}
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 rounded-b-xl border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-700 font-medium">
                                    {t('table.rows_per_page')}:
                                </span>
                                <select
                                    value={pagination.per_page}
                                    onChange={e => {
                                        const newPerPage = Number(
                                            e.target.value
                                        );
                                        setPagination({
                                            ...pagination,
                                            per_page: newPerPage,
                                            page: 1 // Reset to first page when changing page size
                                        });
                                    }}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                                >
                                    {[10, 20, 30, 50, 100].map(pageSize => (
                                        <option key={pageSize} value={pageSize}>
                                            {pageSize}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="text-sm text-gray-700">
                                <span className="font-medium">
                                    {(pagination.page - 1) *
                                        pagination.per_page +
                                        1}
                                </span>{' '}
                                -{' '}
                                <span className="font-medium">
                                    {Math.min(
                                        pagination.page * pagination.per_page,
                                        totalCount
                                    )}
                                </span>{' '}
                                {t('table.of')}{' '}
                                <span className="font-medium">
                                    {totalCount.toLocaleString()}
                                </span>{' '}
                                {t('table.entries')}
                            </div>

                            {selectedCount > 0 && (
                                <div className="text-sm text-primary-600 bg-primary-100 px-3 py-1 rounded-full font-medium">
                                    {selectedCount} {t('table.selected')}
                                </div>
                            )}
                        </div>

                        <div dir="ltr" className="flex items-center space-x-2">
                            <button
                                onClick={() =>
                                    setPagination({ ...pagination, page: 1 })
                                }
                                disabled={pagination.page <= 1}
                                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                                title={t('table.first_page')}
                            >
                                <MdFirstPage className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() =>
                                    setPagination({
                                        ...pagination,
                                        page: pagination.page - 1
                                    })
                                }
                                disabled={pagination.page <= 1}
                                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                                title={t('table.previous_page')}
                            >
                                <MdChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex items-center space-x-1">
                                {Array.from(
                                    {
                                        length: Math.min(
                                            5,
                                            Math.ceil(
                                                totalCount / pagination.per_page
                                            )
                                        )
                                    },
                                    (_, i) => {
                                        const currentPage = pagination.page;
                                        const totalPages = Math.ceil(
                                            totalCount / pagination.per_page
                                        );
                                        let displayPage;

                                        if (totalPages <= 5) {
                                            displayPage = i + 1;
                                        } else if (currentPage <= 3) {
                                            displayPage = i + 1;
                                        } else if (
                                            currentPage >=
                                            totalPages - 2
                                        ) {
                                            displayPage = totalPages - 4 + i;
                                        } else {
                                            displayPage = currentPage - 2 + i;
                                        }

                                        if (
                                            displayPage < 1 ||
                                            displayPage > totalPages
                                        )
                                            return null;

                                        return (
                                            <button
                                                key={displayPage}
                                                onClick={() =>
                                                    setPagination({
                                                        ...pagination,
                                                        page: displayPage
                                                    })
                                                }
                                                className={`px-3 py-2 text-sm rounded-lg transition-colors font-medium ${
                                                    displayPage === currentPage
                                                        ? 'bg-primary-600 text-white shadow-lg'
                                                        : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                {displayPage}
                                            </button>
                                        );
                                    }
                                )}
                            </div>

                            <button
                                onClick={() =>
                                    setPagination({
                                        ...pagination,
                                        page: pagination.page + 1
                                    })
                                }
                                disabled={
                                    pagination.page >=
                                    Math.ceil(totalCount / pagination.per_page)
                                }
                                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                                title={t('table.next_page')}
                            >
                                <MdChevronRight className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() =>
                                    setPagination({
                                        ...pagination,
                                        page: Math.ceil(
                                            totalCount / pagination.per_page
                                        )
                                    })
                                }
                                disabled={
                                    pagination.page >=
                                    Math.ceil(totalCount / pagination.per_page)
                                }
                                className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                                title={t('table.last_page')}
                            >
                                <MdLastPage className="w-5 h-5" />
                            </button>

                            <div className="ml-4 text-sm text-gray-500">
                                {t('table.page')}{' '}
                                <span className="font-medium">
                                    {pagination.page}
                                </span>{' '}
                                {t('table.of')}{' '}
                                <span className="font-medium">
                                    {Math.ceil(
                                        totalCount / pagination.per_page
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Modal */}
            {showFiltersModal && Filters && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col m-4">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center space-x-3">
                                <MdFilterList className="w-6 h-6 text-primary-600" />
                                <h3 className="text-xl font-bold text-gray-900">
                                    {t('table.filters')}
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowFiltersModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <MdClose className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-4">
                                {Filters}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={() => {
                                    // Clear all filters
                                    setColumnFilters([]);
                                    setGlobalFilter('');
                                    setFilters({});
                                }}
                                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                {t('table.clear_all')}
                            </button>
                            <button
                                onClick={() => setShowFiltersModal(false)}
                                className="px-6 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                {t('table.apply')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;
