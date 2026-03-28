/**
 * thankyou.js
 * Reads URL query parameters submitted via the join form (GET method)
 * and displays them on the thank you page.
 */

const params = new URLSearchParams(window.location.search);

const fieldMap = {
    'first-name':  'display-first-name',
    'last-name':   'display-last-name',
    'email':       'display-email',
    'phone':       'display-phone',
    'org-name':    'display-org-name',
    'timestamp':   'display-timestamp',
};

Object.entries(fieldMap).forEach(([param, elementId]) => {
    const value = params.get(param);
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value ? decodeURIComponent(value) : '—';
    }
});
