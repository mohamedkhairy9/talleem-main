import Cell from '@/components/common/table/cells/Cell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import useLocale from '@/utils/hooks/global/useLocale';

const columnHelper = createColumnHelper();

// Helper function to parse verse key (format: "surah:ayah")
const parseVerseKey = (verseKey) => {
    if (!verseKey || typeof verseKey !== 'string') {
        return { surah: null, ayah: null };
    }
    const parts = verseKey.split(':');
    if (parts.length !== 2) {
        return { surah: null, ayah: null };
    }
    return {
        surah: parseInt(parts[0], 10),
        ayah: parseInt(parts[1], 10)
    };
};

// Component to display verse info
const VerseInfoCell = ({ verseKey }) => {
    const { t } = useLocale();
    const { surah, ayah } = parseVerseKey(verseKey);
    
    if (!surah || !ayah) {
        return <Cell value="-" />;
    }
    
    return (
        <Cell value={`${t('exam_templates.surah')} ${surah}, ${t('exam_templates.ayah')} ${ayah}`} />
    );
};

export const quoranPartsColumns = [
    columnHelper.accessor('juz_number', {
        header: 'table_headers.quoran_parts',
        cell: info => {
            const juzNumber = info.row.original.juz_number;
            return <NameCell directValue={juzNumber != null ? String(juzNumber) : ''} />;
        }
    }),
    columnHelper.accessor('verses_count', {
        header: 'table_headers.verses_count',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('first_verse_key', {
        header: 'table_headers.start_verse',
        cell: info => <VerseInfoCell verseKey={info.getValue()} />
    }),
    columnHelper.accessor('last_verse_key', {
        header: 'table_headers.end_verse',
        cell: info => <VerseInfoCell verseKey={info.getValue()} />
    }),
];

export const quoranPartsFields = [
    {
        name: 'name.en',
        label: 'validation.name.label.en',
        type: 'text',
        placeholder: 'validation.name.placeholder.en',
        editMode: true,
        viewMode: true
    },
    {
        name: 'name.ar',
        label: 'validation.name.label.ar',
        type: 'text',
        placeholder: 'validation.name.placeholder.ar',
        editMode: true,
        viewMode: true
    }
];

export const quoranPartsFilters = [
    {
        name: 'search',
        type: 'text',
        placeholder: 'validation.search.placeholder',
        defaultValue: ''
    },
    {
        name: 'status',
        type: 'select',
        placeholder: 'validation.status.placeholder',
        defaultValue: 1
    }
];

export const filtersDefaultValues = {
    status: true,
    search: ''
};
