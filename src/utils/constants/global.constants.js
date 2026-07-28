export const allData = {
    page: 1,
    // The dashboard APIs use Laravel pagination. Sending `0` makes the
    // paginator return an empty page, which leaves every form lookup blank.
    // Lookup datasets are intentionally loaded in one request.
    per_page: 1000
};

export const multipartFormData = {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
};
