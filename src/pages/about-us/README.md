# About Us Module

This module manages the "About Us" page content for the application.

## Structure

Since this is a single-item resource (not a list), the structure is simpler than typical CRUD modules:

```
about-us/
├── AboutUs.jsx         # Main page component
├── FormAboutUs.jsx     # Form component
├── DeleteAboutUs.jsx   # Delete modal component
├── configs.jsx         # Field configurations
└── README.md           # This file
```

## API Integration

### Endpoints

-   **GET** `/about-us` - Fetch the About Us data
-   **POST** `/about-us` - Update the About Us data
-   **DELETE** `/about-us` - Delete the About Us data

### Data Structure

**Request:**

```json
{
    "description": {
        "en": "KSA About Us",
        "ar": "عننا السعودية"
    },
    "status": true
}
```

**Response:**

```json
{
    "id": 3,
    "description": {
        "en": "KSA About Us",
        "ar": "عننا السعودية"
    },
    "status": true,
    "created_at": "2025-10-13T03:24:57.000000Z",
    "updated_at": "2025-10-13T03:25:04.000000Z"
}
```

## Files Created/Modified

### New Files:

1. `src/api/services/aboutUs.service.js` - API service layer
2. `src/api/hooks/useAboutUs.js` - React Query hooks
3. `src/utils/yup/aboutUs.schemas.js` - Validation schema
4. `src/pages/about-us/AboutUs.jsx` - Main page
5. `src/pages/about-us/FormAboutUs.jsx` - Form component
6. `src/pages/about-us/DeleteAboutUs.jsx` - Delete modal component
7. `src/pages/about-us/configs.jsx` - Field configurations

### Modified Files:

1. `src/api/endpoints.js` - Added ABOUT_US endpoints
2. `src/routes/routes.jsx` - Added /about-us route
3. `public/locales/en/translation.json` - Added English translations
4. `public/locales/ar/translation.json` - Added Arabic translations

## Features

-   ✅ Bilingual support (English & Arabic)
-   ✅ Textarea fields for descriptions
-   ✅ Status toggle (Enabled/Disabled)
-   ✅ Form validation with Yup
-   ✅ Responsive UI with Tailwind CSS
-   ✅ Loading states
-   ✅ Success/Error handling
-   ✅ Delete functionality with confirmation modal

## Validation Rules

-   **Description (EN)**: Required, 10-5000 characters
-   **Description (AR)**: Required, 10-5000 characters
-   **Status**: Required boolean

## Usage

Navigate to `/about-us` in the application to:

-   View the current About Us content
-   Edit the description and status
-   Delete the About Us entry using the delete button in the header
