import { API_KEYS } from "@/api/endpoints";
import i18next from 'i18next';

    const currentLang = i18next.language;

    // Days of the week options
    export const weekDaysOptions =  [
        { value: 'السبت', label: currentLang === 'ar' ? 'السبت' : 'Saturday', id: 'السبت', name: currentLang === 'ar' ? 'السبت' : 'Saturday' },
        { value: 'الأحد', label: currentLang === 'ar' ? 'الأحد' : 'Sunday', id: 'الأحد', name: currentLang === 'ar' ? 'الأحد' : 'Sunday' },
        { value: 'الاثنين', label: currentLang === 'ar' ? 'الاثنين' : 'Monday', id: 'الاثنين', name: currentLang === 'ar' ? 'الاثنين' : 'Monday' },
        { value: 'الثلاثاء', label: currentLang === 'ar' ? 'الثلاثاء' : 'Tuesday', id: 'الثلاثاء', name: currentLang === 'ar' ? 'الثلاثاء' : 'Tuesday' },
        { value: 'الأربعاء', label: currentLang === 'ar' ? 'الأربعاء' : 'Wednesday', id: 'الأربعاء', name: currentLang === 'ar' ? 'الأربعاء' : 'Wednesday' },
        { value: 'الخميس', label: currentLang === 'ar' ? 'الخميس' : 'Thursday', id: 'الخميس', name: currentLang === 'ar' ? 'الخميس' : 'Thursday' },
        { value: 'الجمعة', label: currentLang === 'ar' ? 'الجمعة' : 'Friday', id: 'الجمعة', name: currentLang === 'ar' ? 'الجمعة' : 'Friday' }
    ];

    // Teaching method options (وجاهي / إلكتروني)
    export const teachingMethodOptions = [
        { 
            value: 'وجاهي', 
            label: currentLang === 'ar' ? 'وجاهي / حضوري' : 'On-site / In-person', 
            id: 'وجاهي',
            name: currentLang === 'ar' ? 'وجاهي / حضوري' : 'On-site / In-person'
        },
        { 
            value: 'إلكتروني', 
            label: currentLang === 'ar' ? 'عن بعد / إلكتروني' : 'Remote / Online', 
            id: 'إلكتروني',
            name: currentLang === 'ar' ? 'عن بعد / إلكتروني' : 'Remote / Online'
        }
    ];


// API Calls Configuration
export const configurationApiCalls = [ API_KEYS.REMOTELY_ATTENDANCE_PLATFORMS ];