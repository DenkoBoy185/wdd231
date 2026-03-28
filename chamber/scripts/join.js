/**
 * join.js
 * Handles:
 *  - Setting the hidden timestamp field on page load
 *  - Opening and closing the HTML <dialog> modals for each membership card
 */

// 1. Set hidden timestamp when the page loads
const timestampField = document.getElementById('timestamp');
if (timestampField) {
    timestampField.value = new Date().toLocaleString();
}

// 2. Modal functionality
const learnMoreBtns = document.querySelectorAll('.learn-more-btn');
const closeBtns = document.querySelectorAll('.modal-close-btn');

learnMoreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.showModal();
        }
    });
});

closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close');
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.close();
        }
    });
});

// Close modal when clicking outside of it (on the backdrop)
document.querySelectorAll('.membership-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        const rect = modal.getBoundingClientRect();
        const clickedOutside =
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top  ||
            e.clientY > rect.bottom;
        if (clickedOutside) {
            modal.close();
        }
    });
});
