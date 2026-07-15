import React from 'react';
import './MushafPage.css';

/**
 * MushafPage Component
 * Reusable component for displaying Quran pages with authentic mushaf layout
 * 
 * @param {Object} props
 * @param {Array} props.pageLines - Array of line objects from the database
 * @param {Number} props.currentPage - Current page number (1-604)
 * @param {Object} props.wordsDb - SQL.js database instance for words
 * @param {Object} props.surahData - Object containing surah information
 * @param {Set} props.selectedAyahs - Set of selected ayah keys (format: "surah:ayah")
 * @param {Function} props.onWordClick - Callback when a word is clicked (wordId, location)
 * @param {Function} props.isVerseUsed - Function to check if a verse is already used
 * @param {Object} props.editingSegment - Object indicating if we're editing a segment {index, field}
 * @param {Boolean} props.isFontLoading - Whether the font is currently loading
 */
const MushafPage = ({
    pageLines = [],
    currentPage = 1,
    wordsDb = null,
    surahData = null,
    selectedAyahs = new Set(),
    onWordClick = null,
    isVerseUsed = null,
    editingSegment = null,
    isFontLoading = false
}) => {
    /**
     * Get words for line
     */
    const getWordsForLine = (firstWordId, lastWordId) => {
        if (!wordsDb) return [];

        try {
            const query = `SELECT id, text, location FROM words WHERE id >= ${firstWordId} AND id <= ${lastWordId} ORDER BY id`;
            const result = wordsDb.exec(query);

            if (result.length > 0 && result[0].values.length > 0) {
                return result[0].values.map(row => ({
                    id: row[0],
                    text: row[1],
                    location: row[2]
                }));
            }
        } catch (error) {
            console.error('Error fetching words:', error);
        }

        return [];
    };

    /**
     * Get surah name
     */
    const getSurahName = (surahNumber) => {
        if (!surahData || !surahData[surahNumber]) return '';
        const surah = surahData[surahNumber];
        return surah.glyph || (surah.name_arabic ? `سُورَةُ ${surah.name_arabic}` : surah.name || '');
    };

    /**
     * Check if word is selected
     */
    const isWordSelected = (location) => {
        if (!location) return false;
        const [surah, ayah] = location.split(':');
        return selectedAyahs.has(`${surah}:${ayah}`);
    };

    /**
     * Render line
     */
    const renderLine = (line) => {
        switch (line.line_type) {
            case 'surah_name':
                return (
                    <div 
                        key={`${line.page_number}-${line.line_number}`} 
                        className={`line surah-name ${line.is_centered ? 'centered' : ''}`}
                    >
                        {getSurahName(line.surah_number)}
                    </div>
                );

            case 'basmallah':
                return (
                    <div 
                        key={`${line.page_number}-${line.line_number}`} 
                        className={`line basmallah ${line.is_centered ? 'centered' : ''}`}
                    >
                        ﷽
                    </div>
                );

            case 'ayah':
                { 
                const words = getWordsForLine(line.first_word_id, line.last_word_id);
                return (
                    <div 
                        key={`${line.page_number}-${line.line_number}`} 
                        className={`line ayah centered ${line.is_centered ? 'centered' : ''}`}
                        ref={el => {
                            if (el) {
                                el.style.setProperty('font-family', `'QuranicFont-${currentPage}', Arial, sans-serif`, 'important');
                            }
                        }}
                    >
                        {words.map(word => {
                            const isUsed = isVerseUsed ? isVerseUsed(word.location) : false;
                            const isSelected = isWordSelected(word.location);
                            const isEditable = editingSegment !== null;
                            
                            return (
                                <span
                                    key={word.id}
                                    data-word-id={word.id}
                                    data-location={word.location}
                                    className={`word 
                                        ${isSelected ? 'selected' : ''} 
                                        ${isEditable ? 'editable' : ''} 
                                        ${isUsed ? 'disabled' : ''}
                                    `}
                                    onClick={() => {
                                        if (!isUsed && onWordClick) {
                                            onWordClick(word.id, word.location);
                                        }
                                    }}
                                    style={{ 
                                        cursor: isUsed ? 'not-allowed' : (isEditable ? 'pointer' : 'default')
                                    }}
                                    ref={el => {
                                        if (el) {
                                            el.style.setProperty('font-family', 'inherit', 'important');
                                        }
                                    }}
                                >
                                    {word.text}
                                </span>
                            );
                        })}
                    </div>
                ); 
                }

            default:
                return null;
        }
    };

    if (isFontLoading) {
        return (
            <div className="mushaf-page">
                <div className="mushaf-border">
                    <div className="font-loading">
                        <div className="spinner"></div>
                        <p>جاري تحميل الخط...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mushaf-page">
            <div className="mushaf-border">
                <svg className="border-svg" viewBox="0 0 600 900" preserveAspectRatio="none">
                    {/* Outer border - main frame */}
                    <rect 
                        x="0" 
                        y="0" 
                        width="600" 
                        height="900" 
                        fill="none" 
                        stroke="#8B4513" 
                        strokeWidth="4"
                        rx="2"
                    />
                    
                    {/* Inner decorative border */}
                    <rect 
                        x="12" 
                        y="12" 
                        width="576" 
                        height="876" 
                        fill="none" 
                        stroke="#A0522D" 
                        strokeWidth="2"
                        rx="1"
                    />
                    
                    {/* Second inner border for depth */}
                    <rect 
                        x="20" 
                        y="20" 
                        width="560" 
                        height="860" 
                        fill="none" 
                        stroke="#CD853F" 
                        strokeWidth="1"
                        opacity="0.6"
                    />
                    
                    {/* Corner decorations - top left */}
                    <path 
                        d="M 0,0 L 40,0 M 0,0 L 0,40" 
                        stroke="#8B4513" 
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    {/* Corner decorations - top right */}
                    <path 
                        d="M 600,0 L 560,0 M 600,0 L 600,40" 
                        stroke="#8B4513" 
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    {/* Corner decorations - bottom left */}
                    <path 
                        d="M 0,900 L 40,900 M 0,900 L 0,860" 
                        stroke="#8B4513" 
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    {/* Corner decorations - bottom right */}
                    <path 
                        d="M 600,900 L 560,900 M 600,900 L 600,860" 
                        stroke="#8B4513" 
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    
                    {/* Decorative vertical lines on sides */}
                    <line x1="25" y1="0" x2="25" y2="900" stroke="#A0522D" strokeWidth="1.5" opacity="0.4"/>
                    <line x1="575" y1="0" x2="575" y2="900" stroke="#A0522D" strokeWidth="1.5" opacity="0.4"/>
                    
                    {/* Decorative horizontal lines at top and bottom */}
                    <line x1="0" y1="30" x2="600" y2="30" stroke="#A0522D" strokeWidth="1" opacity="0.3"/>
                    <line x1="0" y1="870" x2="600" y2="870" stroke="#A0522D" strokeWidth="1" opacity="0.3"/>
                </svg>
                
                <div 
                    className="page-content"
                    ref={el => {
                        if (el) {
                            el.style.setProperty('font-family', `'QuranicFont-${currentPage}', Arial, sans-serif`, 'important');
                        }
                    }}
                >
                    {pageLines.length > 0 ? (
                        pageLines.map(line => renderLine(line))
                    ) : (
                        <div className="no-content">
                            لا يوجد محتوى
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MushafPage;

