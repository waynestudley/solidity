export function openModal(e, modalId) {
    e.preventDefault();
    document.getElementById(modalId).style.display = 'block';
};

export function closeModal(e, modalId) {
    e.preventDefault();
    document.getElementById(modalId).style.display = 'none';
};
