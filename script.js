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

    // Function to load the custom Arabic font
    function loadArabicFont() {
        const fontUrl = 'Amiri-Regular.ttf'; // Replace with the URL to your custom Arabic font

        const xhr = new XMLHttpRequest();
        xhr.open('GET', fontUrl, true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function () {
            const uint8Array = new Uint8Array(this.response);
            jsPDF.API.addFileToVFS('Amiri-Regular.ttf', uint8Array);
            jsPDF.API.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
        };

        xhr.send();
    }

    loadArabicFont();


    const { jsPDF } = window.jspdf;

    function exportToPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4', });
    
        const categories = document.querySelectorAll('section');
    
        let yOffset = 10;
        categories.forEach((category, categoryIndex) => {
            const categoryTitle = category.querySelector('.category-title').textContent;
            doc.setFont('Amiri', 'normal');
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(categoryTitle, 10, yOffset, { align: 'right' });
    
            const faqItems = category.querySelectorAll('.faq-item');
            faqItems.forEach((item, index) => {
                const question = item.querySelector('.question').textContent;
                const answer = item.querySelector('.answer').textContent;
    
                yOffset += 10;
                doc.text(`${question}: ${answer}`, 10, yOffset, { align: 'right' });
    
                if (yOffset > 270) {
                    doc.addPage();
                    yOffset = 10;
                }
            });
    
            yOffset += 10;
        });
    
        doc.save('FAQ.pdf');
    }
    

    document.getElementById('export-pdf').addEventListener('click', exportToPDF);
    
});
