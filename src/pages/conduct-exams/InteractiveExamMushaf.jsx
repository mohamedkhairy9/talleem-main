import React, { useEffect, useMemo, useState } from 'react';
import MushafPage from '@/components/quran/MushafPage';
import { dbLoader } from '@/utils/helpers/databaseLoader';
import { fontLoader } from '@/utils/helpers/fontLoader';

const getSegmentJuz = segment => Number(segment?.juzNumber ?? segment?.juz_number) || 1;

const JUZ_START_PAGES = [
    1, 22, 42, 62, 82, 102, 121, 142, 162, 182,
    201, 222, 242, 262, 282, 302, 322, 342, 362, 382,
    402, 422, 442, 462, 482, 502, 522, 542, 562, 582
];

const getJuzStartPage = juz => {
    const normalizedJuz = Math.min(Math.max(Number(juz) || 1, 1), 30);
    return JUZ_START_PAGES[normalizedJuz - 1];
};

const loadPageLines = (linesDb, pageNumber) => {
    const result = linesDb.exec(
        `SELECT * FROM pages WHERE page_number = ${Number(pageNumber)} ORDER BY line_number`
    );
    if (!result?.[0]?.values?.length) return [];

    return result[0].values.map(row => Object.fromEntries(
        result[0].columns.map((column, index) => [column, row[index]])
    ));
};

export default function InteractiveExamMushaf({ segments = [], activeSegmentId, onSegmentChange }) {
    const [linesDb, setLinesDb] = useState(null);
    const [wordsDb, setWordsDb] = useState(null);
    const [surahData, setSurahData] = useState(null);
    const [pageLines, setPageLines] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isFontLoading, setIsFontLoading] = useState(false);
    const [error, setError] = useState('');

    const activeSegment = useMemo(
        () => segments.find(segment => String(segment.id) === String(activeSegmentId)) || segments[0] || null,
        [activeSegmentId, segments]
    );

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        dbLoader.initialize()
            .then(data => {
                if (cancelled) return;
                setLinesDb(data.linesDb);
                setWordsDb(data.wordsDb);
                setSurahData(data.surahData);
            })
            .catch(requestError => {
                if (!cancelled) setError(requestError?.message || 'Failed to load the Mushaf.');
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (activeSegment) setCurrentPage(getJuzStartPage(getSegmentJuz(activeSegment)));
    }, [activeSegment]);

    useEffect(() => {
        if (!linesDb) return undefined;
        let cancelled = false;
        setIsFontLoading(true);

        const loadPage = async () => {
            try {
                fontLoader.loadPageFont(currentPage);
                fontLoader.preloadNearbyPages(currentPage);
                if (document.fonts) await document.fonts.load(`1em QuranicFont-${currentPage}`);
                if (!cancelled) setPageLines(loadPageLines(linesDb, currentPage));
            } catch {
                if (!cancelled) setPageLines(loadPageLines(linesDb, currentPage));
            } finally {
                if (!cancelled) setIsFontLoading(false);
            }
        };

        loadPage();
        return () => { cancelled = true; };
    }, [currentPage, linesDb]);

    if (isLoading) {
        return <div className="flex min-h-72 items-center justify-center text-sm text-gray-500">جارٍ تحميل المصحف...</div>;
    }
    if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;

    return (
        <div className="space-y-4">
            {segments.length ? (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {segments.map((segment, index) => {
                        const isActive = String(segment.id) === String(activeSegment?.id);
                        return <button
                            key={segment.id}
                            type="button"
                            onClick={() => onSegmentChange?.(segment.id)}
                            className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-semibold transition ${isActive ? 'border-primary bg-primary text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-primary/50'}`}
                        >
                            المقطع {segment.order ?? index + 1} · الجزء {getSegmentJuz(segment)}
                        </button>;
                    })}
                </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                <button type="button" disabled={currentPage <= 1} onClick={() => setCurrentPage(page => page - 1)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40">السابق</button>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    الصفحة
                    <input type="number" min="1" max="604" value={currentPage} onChange={event => setCurrentPage(Math.min(604, Math.max(1, Number(event.target.value) || 1)))} className="w-20 rounded-lg border border-gray-300 bg-white px-3 py-2 text-center" />
                    <span className="font-normal text-gray-500">من 604</span>
                </label>
                <button type="button" disabled={currentPage >= 604} onClick={() => setCurrentPage(page => page + 1)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 disabled:opacity-40">التالي</button>
            </div>

            <div className="max-h-[68vh] overflow-auto rounded-2xl border border-amber-100 bg-[#fbfaf4] p-3">
                <MushafPage pageLines={pageLines} currentPage={currentPage} wordsDb={wordsDb} surahData={surahData} isFontLoading={isFontLoading} />
            </div>
        </div>
    );
}
