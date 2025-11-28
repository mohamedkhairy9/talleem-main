'use client';

import React, { useEffect, useState } from 'react';

function Surah({ number = 2 }) {
    const [surah, setSurah] = useState(null);
    const [selectedAyah, setSelectedAyah] = useState(null);
    const [currentPage, setCurrentPage] = useState(0); // page index

    useEffect(() => {
        fetch(`https://api.alquran.cloud/v1/surah/${number}/uthmani`)
            .then(res => res.json())
            .then(data => setSurah(data.data));
    }, [number]);

    if (!surah) return <p>جاري التحميل...</p>;

    // ✅ group ayahs by page
    const groupedByPage = surah.ayahs.reduce((acc, ayah) => {
        const page = ayah.page;
        if (!acc[page]) acc[page] = [];
        acc[page].push(ayah);
        return acc;
    }, {});

    const pages = Object.keys(groupedByPage).sort((a, b) => a - b);
    const currentPageNumber = pages[currentPage];
    const currentAyahs = groupedByPage[currentPageNumber];

    return (
        <div
            dir="rtl"
            className="p-6 bg-gray-50 max-w-[700px] mx-auto mt-32 text-right leading-loose"
        >
            <h1 className="text-3xl mb-4 font-bold text-green-700">
                {surah.name}
            </h1>

            {/* ✅ current page ayahs */}
            <div className="text-2xl font-[quran] whitespace-pre-line border border-green-200 rounded-lg p-4 bg-white shadow-sm">
                {currentAyahs.map(a => (
                    <span
                        key={a.number}
                        onClick={() => setSelectedAyah(a)}
                        className="hover:bg-green-100 cursor-pointer p-1 rounded"
                    >
                        {a.text} ﴿{a.numberInSurah}﴾{' '}
                    </span>
                ))}
            </div>

            {/* ✅ page navigation */}
            <div className="flex justify-between items-center mt-6 text-lg">
                <button
                    onClick={() =>
                        setCurrentPage(p => (p > 0 ? p - 1 : pages.length - 1))
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    الصفحة السابقة
                </button>
                <span className="text-gray-700">
                    صفحة {currentPageNumber} من {pages[pages.length - 1]}
                </span>
                <button
                    onClick={() =>
                        setCurrentPage(p => (p < pages.length - 1 ? p + 1 : 0))
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    الصفحة التالية
                </button>
            </div>

            {/* ✅ ayah details modal */}
            {selectedAyah && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-green-700 mb-4">
                            تفاصيل الآية
                        </h2>

                        <div className="space-y-2 text-right text-lg">
                            <p>
                                <strong>نص الآية:</strong>{' '}
                                <span className="text-gray-800">
                                    {selectedAyah.text}
                                </span>
                            </p>
                            <p>
                                <strong>رقم الآية في السورة:</strong>{' '}
                                {selectedAyah.numberInSurah}
                            </p>
                            <p>
                                <strong>الجزء:</strong> {selectedAyah.juz}
                            </p>
                            <p>
                                <strong>الصفحة:</strong> {selectedAyah.page}
                            </p>
                            <p>
                                <strong>الربع:</strong>{' '}
                                {selectedAyah.hizbQuarter}
                            </p>
                            <p>
                                <strong>الحزب:</strong>{' '}
                                {Math.ceil(selectedAyah.hizbQuarter / 4)}
                            </p>
                            <p>
                                <strong>السجدة:</strong>{' '}
                                {selectedAyah.sajda ? 'نعم' : 'لا'}
                            </p>
                        </div>

                        <button
                            onClick={() => setSelectedAyah(null)}
                            className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Surah;
