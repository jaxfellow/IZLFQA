document.addEventListener('DOMContentLoaded', () => {
    // Load FAQ data from server
    fetch('/api/faq')
        .then(response => response.json())
        .then(data => {
            // Populate the FAQ sections with the fetched data
            populateFAQ(data);
        })
        .catch(error => {
            console.error('Error fetching FAQ data:', error);
        });

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

    // Toggle admin mode
    let isAdmin = false;
    const editButtons = document.querySelectorAll('.edit-btn');
    const toggleAdminButton = document.getElementById('toggle-admin');

    toggleAdminButton.addEventListener('click', () => {
        isAdmin = !isAdmin;
        editButtons.forEach(button => {
            button.style.display = isAdmin ? 'block' : 'none';
        });
    });

    // Edit functionality
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.closest('.faq-item');
            const question = faqItem.querySelector('.question');
            const answer = faqItem.querySelector('.answer p');

            const isEditing = faqItem.classList.toggle('editing');

            if (isEditing) {
                // Enable editing
                question.contentEditable = true;
                question.classList.add('input-field');
                tinymce.init({
                    license_key: 'gpl',
                    target: faqItem.querySelector('.answer p'),
                    setup: function(editor) {
                        editor.on('init', function() {
                            editor.setContent(answer.innerHTML);
                        });
                        editor.on('change', function() {
                            answer.innerHTML = editor.getContent();
                        });
                    }
                });

                button.textContent = 'حفظ';
            } else {
                // Save changes
                question.contentEditable = false;
                question.classList.remove('input-field');
                const updatedAnswer = faqItem.querySelector('.answer p').innerHTML;

                // Destroy the TinyMCE editor instance
                tinymce.remove();

                button.textContent = 'تعديل';

                // Save the updated FAQ data to the server
                saveFAQ();
            }
        });
    });
});

function populateFAQ(faqData) {
    const faqContainer = document.getElementById('faq-container');

    if (!faqContainer) {
        console.error('FAQ container element not found');
        return;
    }

    faqContainer.innerHTML = ''; // Clear existing content if any

    faqData.forEach(category => {
        const categorySection = document.createElement('section');
        categorySection.id = category.id;

        const categoryTitle = document.createElement('h2');
        categoryTitle.classList.add('category-title');
        categoryTitle.textContent = category.title;
        categorySection.appendChild(categoryTitle);

        const categoryContent = document.createElement('div');
        categoryContent.classList.add('category-content');

        category.faqs.forEach(faq => {
            const faqItem = document.createElement('div');
            faqItem.classList.add('faq-item');

            const questionButton = document.createElement('button');
            questionButton.classList.add('question');
            questionButton.textContent = faq.question;
            faqItem.appendChild(questionButton);

            const answerDiv = document.createElement('div');
            answerDiv.classList.add('answer');
            answerDiv.innerHTML = `<p>${faq.answer}</p>`;
            answerDiv.style.display = 'none'; // Initially hide the answer

            questionButton.addEventListener('click', () => {
                answerDiv.style.display = answerDiv.style.display === 'none' ? 'block' : 'none';
            });

            faqItem.appendChild(answerDiv);
            categoryContent.appendChild(faqItem);
        });

        categorySection.appendChild(categoryContent);
        faqContainer.appendChild(categorySection);
    });
}

function saveFAQ() {
    const categories = document.querySelectorAll('section');
    const faqData = Array.from(categories).map(section => {
        const title = section.querySelector('.category-title').textContent;
        const id = section.id;
        const faqs = Array.from(section.querySelectorAll('.faq-item')).map(faqItem => {
            return {
                question: faqItem.querySelector('.question').textContent,
                answer: faqItem.querySelector('.answer p').innerHTML
            };
        });
        return { id, title, faqs };
    });

    fetch('/api/faq', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(faqData)
    })
    .then(response => response.text())
    .then(data => {
        console.log('FAQ data saved:', data);
    })
    .catch(error => {
        console.error('Error saving FAQ data:', error);
    });
}
