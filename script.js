document.addEventListener('DOMContentLoaded', () => {
    // Toggle the display of answers
    const questions = document.querySelectorAll('.question');

    questions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Toggle the display of category content
    const categories = document.querySelectorAll('.category-title');

    categories.forEach(category => {
        category.addEventListener('click', () => {
            const content = category.nextElementSibling;
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });
});
