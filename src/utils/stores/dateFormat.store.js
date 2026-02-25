import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** @type {'gregorian' | 'hijri' | 'hijri_indic'} */
const DEFAULT_FORMAT = 'gregorian';

const useDateFormatStore = create(
    persist(
        (set) => ({
            dateFormat: DEFAULT_FORMAT,

            setDateFormat: (format) => {
                if (['gregorian', 'hijri', 'hijri_indic'].includes(format)) {
                    set({ dateFormat: format });
                }
            },

            toggleToHijri: () => {
                set((state) => ({
                    dateFormat: state.dateFormat === 'gregorian' ? 'hijri_indic' : 'gregorian'
                }));
            }
        }),
        {
            name: 'date-format-storage',
            partialize: (state) => ({ dateFormat: state.dateFormat })
        }
    )
);

export default useDateFormatStore;
