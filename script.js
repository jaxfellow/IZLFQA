document.addEventListener('DOMContentLoaded', function () {
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

    // Admin mode toggle and editing functionality
    let isAdmin = false;
    const editButtons = document.querySelectorAll('.edit-btn');
    const toggleAdminButton = document.getElementById('toggle-admin');

    if (toggleAdminButton) {
        toggleAdminButton.addEventListener('click', function () {
            isAdmin = !isAdmin;
            editButtons.forEach(button => {
                button.style.display = isAdmin ? 'block' : 'none';
            });
        });
    }

    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const faqItem = this.closest('.faq-item');
            const question = faqItem.querySelector('.question');
            const answer = faqItem.querySelector('.answer p');

            const isEditing = faqItem.classList.toggle('editing');

            if (isEditing) {
                // Enable editing
                question.contentEditable = true;
                question.classList.add('input-field');
                const answerTextarea = document.createElement('textarea');
                answerTextarea.classList.add('input-field');
                answerTextarea.value = answer.textContent;
                faqItem.querySelector('.answer').replaceChild(answerTextarea, answer);

                this.textContent = 'حفظ';
            } else {
                // Save changes
                question.contentEditable = false;
                question.classList.remove('input-field');
                const updatedAnswer = faqItem.querySelector('.answer textarea').value;
                const updatedAnswerP = document.createElement('p');
                updatedAnswerP.textContent = updatedAnswer;
                faqItem.querySelector('.answer').replaceChild(updatedAnswerP, faqItem.querySelector('.answer textarea'));

                this.textContent = 'تعديل';
            }
        });
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        function filterFAQ() {
            const searchValue = searchInput.value.trim().toLowerCase(); 
            const categories = document.querySelectorAll('section');
            
            categories.forEach(category => {
                const faqItems = category.querySelectorAll('.faq-item');
                let categoryMatches = false;

                faqItems.forEach(item => {
                    const question = item.querySelector('.question').textContent.trim().toLowerCase(); 
                    const answer = item.querySelector('.answer').textContent.trim().toLowerCase(); 
                    const categoryTitle = category.querySelector('.category-title').textContent.trim().toLowerCase();

                    const matches = question.includes(searchValue) || answer.includes(searchValue) || categoryTitle.includes(searchValue);

                    if (matches) {
                        item.style.display = ''; 
                        categoryMatches = true; 
                    } else {
                        item.style.display = 'none'; 
                    }
                });

                if (categoryMatches) {
                    category.style.display = ''; 
                    category.classList.add('expanded'); 
                } else {
                    category.style.display = 'none'; 
                    category.classList.remove('expanded'); 
                }
            });
        }

        searchInput.addEventListener('input', filterFAQ);
        filterFAQ(); // Initial filtering if there is a default value in the search input
    } else {
        console.error('Search input element not found');
    }
});
