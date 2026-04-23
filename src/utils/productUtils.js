/**
 * Generates a deterministic "seeded" review count for products with no real reviews.
 * This ensures consistency (same product always shows same count) while building trust.
 * 
 * @param {string} id - The product ID (Firebase push ID or static slug).
 * @returns {number} - A number between 5 and 10.
 */
export const getSeededReviewCount = (id) => {
    if (!id) return 5;
    // Simple hash of the string
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 6) + 5; // Results in 5, 6, 7, 8, 9, or 10
};
