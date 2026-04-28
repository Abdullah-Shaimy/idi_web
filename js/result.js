document.addEventListener('DOMContentLoaded', () => {
    const resultForm = document.getElementById('result-form');
    const resultDisplay = document.getElementById('result-display');
    const errorMessage = document.getElementById('error-message');
    const marksBody = document.getElementById('marks-body');
    const printButton = document.getElementById('print-result-btn');
    const i18n = window.IDI_I18N;
    let resultsCache = null;
    let activeResult = null;

    if (!resultForm || !resultDisplay || !errorMessage || !marksBody) {
        return;
    }

    function getText(path, fallback) {
        if (!i18n) {
            return fallback;
        }
        return i18n.getText('pages.result.' + path, fallback) || fallback;
    }

    function showError(message, useHtml) {
        errorMessage.style.display = 'block';
        if (useHtml) {
            errorMessage.innerHTML = message;
        } else {
            errorMessage.textContent = message;
        }
    }

    function hideError() {
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';
    }

    function closeAllSelects(exceptDisplay) {
        document.querySelectorAll('.select-items').forEach((item) => {
            const display = item.previousElementSibling;
            if (display !== exceptDisplay) {
                item.style.display = 'none';
                if (display) {
                    display.classList.remove('select-arrow-active');
                }
            }
        });
    }

    function setupCustomSelect(groupId, displayId, itemsId, inputId) {
        const group = document.getElementById(groupId);
        const display = document.getElementById(displayId);
        const items = document.getElementById(itemsId);
        const input = document.getElementById(inputId);

        if (!group || !display || !items || !input) {
            return;
        }

        display.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpen = items.style.display === 'block';
            closeAllSelects(display);
            items.style.display = isOpen ? 'none' : 'block';
            display.classList.toggle('select-arrow-active', !isOpen);
        });

        items.querySelectorAll('div').forEach((item) => {
            item.addEventListener('click', () => {
                display.textContent = item.textContent;
                input.value = item.dataset.value || '';
                items.style.display = 'none';
                display.classList.remove('select-arrow-active');
                group.classList.add('active');
            });
        });
    }

    function updateSelectCopy() {
        const examInput = document.getElementById('exam');
        const yearInput = document.getElementById('year');
        const examDisplay = document.getElementById('exam-display');
        const yearDisplay = document.getElementById('year-display');

        const examItems = document.querySelectorAll('#exam-items div');
        examItems.forEach((item) => {
            item.textContent = i18n ? i18n.translateExam(item.dataset.value || '') : item.textContent;
        });

        if (examDisplay) {
            examDisplay.textContent = examInput && examInput.value
                ? (i18n ? i18n.translateExam(examInput.value) : examInput.value)
                : getText('search.examPlaceholder', 'Select Exam');
        }

        if (yearDisplay) {
            yearDisplay.textContent = yearInput && yearInput.value
                ? yearInput.value
                : getText('search.yearPlaceholder', 'Select Year');
        }
    }

    function buildMarksTable(marks) {
        marksBody.replaceChildren();
        const fragment = document.createDocumentFragment();

        Object.entries(marks).forEach(([subject, mark]) => {
            const row = document.createElement('tr');

            const subjectCell = document.createElement('td');
            subjectCell.textContent = i18n ? i18n.translateSubject(subject) : subject;
            row.appendChild(subjectCell);

            const maxMarksCell = document.createElement('td');
            maxMarksCell.style.textAlign = 'center';
            maxMarksCell.style.color = 'var(--text-muted)';
            maxMarksCell.textContent = '100';
            row.appendChild(maxMarksCell);

            const markCell = document.createElement('td');
            markCell.style.textAlign = 'right';
            markCell.style.fontWeight = '600';
            markCell.style.color = 'var(--accent-emerald)';
            markCell.textContent = String(mark);
            row.appendChild(markCell);

            fragment.appendChild(row);
        });

        marksBody.appendChild(fragment);
    }

    async function getResults() {
        if (resultsCache) {
            return resultsCache;
        }

        const response = await fetch('data/results.json', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error('Unable to access result data.');
        }

        resultsCache = await response.json();
        return resultsCache;
    }

    function renderStudentResult(studentResult) {
        activeResult = studentResult;
        document.getElementById('student-name').textContent = studentResult.name;
        document.getElementById('student-reg').textContent = studentResult.regNo;
        document.getElementById('student-class').textContent = i18n
            ? i18n.translateClassName(studentResult.class)
            : studentResult.class;
        document.getElementById('student-exam').textContent = i18n
            ? i18n.translateExam(studentResult.exam)
            : studentResult.exam;
        document.getElementById('student-year').textContent = studentResult.year;
        document.getElementById('current-date').textContent = new Date().toLocaleDateString(
            i18n && i18n.getLanguage() === 'ta' ? 'ta-LK' : 'en-GB',
            {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            }
        );

        buildMarksTable(studentResult.marks);

        document.getElementById('student-total').textContent = studentResult.total;
        document.getElementById('student-grade').textContent = studentResult.grade;

        const statusBadge = document.getElementById('student-status');
        const isPass = studentResult.status.toLowerCase() === 'pass';
        statusBadge.textContent = isPass
            ? getText('result.status.pass', 'Pass')
            : getText('result.status.fail', 'Fail');
        statusBadge.className = 'status-badge ' + (isPass ? 'status-pass' : 'status-fail');

        resultDisplay.style.display = 'block';
        resultDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    document.addEventListener('click', () => {
        closeAllSelects();
    });

    setupCustomSelect('exam-group', 'exam-display', 'exam-items', 'exam');
    setupCustomSelect('year-group', 'year-display', 'year-items', 'year');

    resultForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const regNo = document.getElementById('regNo').value.trim().toUpperCase();
        const exam = document.getElementById('exam').value;
        const year = document.getElementById('year').value;

        hideError();
        resultDisplay.style.display = 'none';
        activeResult = null;

        if (!exam || !year) {
            showError(getText('search.selectBoth', 'Please select both Examination and Academic Year.'));
            return;
        }

        try {
            const results = await getResults();
            const studentResult = results.find((result) => {
                return result.regNo.toUpperCase() === regNo &&
                    result.exam === exam &&
                    result.year === year;
            });

            if (!studentResult) {
                showError(getText('search.notFound', 'No result was found for the provided details.'));
                return;
            }

            renderStudentResult(studentResult);
        } catch (error) {
            console.error(error);
            if (window.location.protocol === 'file:') {
                showError(getText('search.localBlocked', '<strong>Local file access blocked:</strong> open the website through a local server or host it online so the result database can be read.'), true);
            } else {
                showError(getText('search.dbError', 'Error accessing result database. Please try again later.'));
            }
        }
    });

    if (printButton) {
        printButton.addEventListener('click', () => {
            window.print();
        });
    }

    updateSelectCopy();

    document.addEventListener('idi:languagechange', () => {
        updateSelectCopy();

        if (activeResult) {
            renderStudentResult(activeResult);
        }
    });
});
