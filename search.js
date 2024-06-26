document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        function filterFAQ() {
            let searchValue = searchInput.value.trim().toLowerCase(); // Trim whitespace and convert to lowercase
            let categories = document.querySelectorAll('section');
            
            categories.forEach(category => {
                let faqItems = category.querySelectorAll('.faq-item');
                let categoryMatches = false;

                faqItems.forEach(item => {
                    let question = item.querySelector('.question').textContent.trim().toLowerCase(); // Trim whitespace and convert to lowercase
                    let answer = item.querySelector('.answer').textContent.trim().toLowerCase(); // Trim whitespace and convert to lowercase
                    let categoryTitle = category.querySelector('.category-title').textContent.trim().toLowerCase(); // Get the category title

                    // Check if the search value matches the question, answer, or category title
                    let matches = question.includes(searchValue) || answer.includes(searchValue) || categoryTitle.includes(searchValue);

                    if (matches) {
                        item.style.display = ''; // Show the FAQ item
                        categoryMatches = true; // Set categoryMatches to true if any item matches
                    } else {
                        item.style.display = 'none'; // Hide the FAQ item
                    }
                });

                // Expand category if it matches the search value
                if (categoryMatches) {
                    category.style.display = ''; // Show the category
                    category.classList.add('expanded'); // Add expanded class to category
                } else {
                    category.style.display = 'none'; // Hide the category
                    category.classList.remove('expanded'); // Remove expanded class from category
                }
            });
        }

        searchInput.addEventListener('input', filterFAQ);

        // Optional: Trigger initial filtering if there is a default value in the search input
        filterFAQ();
    } else {
        console.error('Search input element not found');
    }
});
