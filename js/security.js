(function () {
    const NOTICE_DURATION_MS = 2200;
    const SCREENSHOT_PROTECTION_ENABLED = false;
    let toastEl;
    let shieldEl;
    let printMessageEl;
    let toastTimer;
    let shieldTimer;

    function ensureUi() {
        if (!document.body) {
            return;
        }

        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.className = 'security-toast';
            toastEl.setAttribute('aria-live', 'polite');
            document.body.appendChild(toastEl);
        }

        if (!shieldEl) {
            shieldEl = document.createElement('div');
            shieldEl.className = 'security-shield';

            const shieldText = document.createElement('p');
            shieldText.textContent = 'Protected content';
            shieldEl.appendChild(shieldText);

            document.body.appendChild(shieldEl);
        }

        if (!printMessageEl) {
            printMessageEl = document.createElement('div');
            printMessageEl.className = 'security-print-message';
            printMessageEl.textContent = 'Printing is disabled on this page.';
            document.body.appendChild(printMessageEl);
        }
    }

    function showToast(message) {
        ensureUi();
        if (!toastEl) {
            return;
        }

        toastEl.textContent = message;
        toastEl.classList.add('visible');

        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toastEl.classList.remove('visible');
        }, NOTICE_DURATION_MS);
    }

    function showShield(message) {
        ensureUi();
        if (!shieldEl) {
            return;
        }

        const textNode = shieldEl.querySelector('p');
        if (textNode) {
            textNode.textContent = message;
        }

        shieldEl.classList.add('active');

        clearTimeout(shieldTimer);
        shieldTimer = setTimeout(() => {
            shieldEl.classList.remove('active');
        }, 1000);
    }

    function isProtectedPage() {
        return Boolean(document.body && document.body.classList.contains('content-protected'));
    }

    function targetElement(target) {
        return target instanceof Element ? target : null;
    }

    function isEditable(target) {
        const element = targetElement(target);
        return Boolean(element && element.closest('input, textarea, select, option, [contenteditable="true"]'));
    }

    function isWhitelisted(target) {
        const element = targetElement(target);
        return Boolean(element && element.closest('[data-allow-copy], [data-allow-context-menu]'));
    }

    function shouldBlock(target) {
        return isProtectedPage() && !isEditable(target) && !isWhitelisted(target);
    }

    function clearClipboard() {
        if (!window.isSecureContext || !navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
            return;
        }

        navigator.clipboard.writeText('').catch(() => {
            // Ignore clipboard permission failures.
        });
    }

    function blockAction(event, message, withShield) {
        if (event.cancelable) {
            event.preventDefault();
        }
        event.stopPropagation();
        showToast(message);
        if (withShield) {
            showShield(message);
        }
    }

    function syncPrivacyState(isHidden) {
        if (!SCREENSHOT_PROTECTION_ENABLED || !document.body || document.body.dataset.sensitivePage !== 'true') {
            return;
        }

        document.body.classList.toggle('privacy-obscured', isHidden);
    }

    document.addEventListener('keydown', (event) => {
        if (!isProtectedPage() || isEditable(event.target)) {
            return;
        }

        const key = (event.key || '').toUpperCase();
        const hasCommandKey = event.ctrlKey || event.metaKey;

        if (SCREENSHOT_PROTECTION_ENABLED && key === 'PRINTSCREEN') {
            blockAction(event, 'Screenshots are restricted on this page.', true);
            clearClipboard();
            return;
        }

        if (key === 'F12' || (hasCommandKey && event.shiftKey && ['I', 'J', 'C'].includes(key))) {
            blockAction(event, 'Developer tools are disabled on this page.');
            return;
        }

        if (!hasCommandKey) {
            return;
        }

        const shortcuts = {
            C: 'Copy is disabled on this page.',
            P: 'Printing is disabled on this page.',
            S: 'Saving the page is disabled on this page.',
            U: 'Viewing source is disabled on this page.',
            X: 'Cut is disabled on this page.',
        };

        if (key === 'P' && document.body && document.body.dataset.allowPrint === 'true') {
            return;
        }

        if (shortcuts[key]) {
            blockAction(event, shortcuts[key], key === 'P');
        }
    }, true);

    document.addEventListener('keyup', (event) => {
        if (!isProtectedPage()) {
            return;
        }

        if (SCREENSHOT_PROTECTION_ENABLED && (event.key || '').toUpperCase() === 'PRINTSCREEN') {
            showShield('Screenshots are restricted on this page.');
            clearClipboard();
        }
    }, true);

    document.addEventListener('contextmenu', (event) => {
        if (shouldBlock(event.target)) {
            blockAction(event, 'Right-click is disabled on this page.');
        }
    }, true);

    document.addEventListener('selectstart', (event) => {
        if (shouldBlock(event.target)) {
            blockAction(event, 'Text selection is disabled on this page.');
        }
    }, true);

    document.addEventListener('copy', (event) => {
        if (shouldBlock(event.target)) {
            blockAction(event, 'Copy is disabled on this page.');
        }
    }, true);

    document.addEventListener('cut', (event) => {
        if (shouldBlock(event.target)) {
            blockAction(event, 'Cut is disabled on this page.');
        }
    }, true);

    document.addEventListener('dragstart', (event) => {
        const element = targetElement(event.target);

        if (!isProtectedPage() || !element || isEditable(element)) {
            return;
        }

        if (element.closest('img, .protected-content')) {
            blockAction(event, 'Dragging protected content is disabled on this page.');
        }
    }, true);

    document.addEventListener('error', (event) => {
        const target = event.target;

        if (!(target instanceof HTMLImageElement)) {
            return;
        }

        target.setAttribute('draggable', 'false');

        const fallbackSrc = target.dataset.fallbackSrc;
        if (fallbackSrc && target.getAttribute('src') !== fallbackSrc) {
            target.setAttribute('src', fallbackSrc);
        }
    }, true);

    document.addEventListener('visibilitychange', () => {
        syncPrivacyState(document.hidden);
    });

    window.addEventListener('blur', () => {
        syncPrivacyState(true);
    });

    window.addEventListener('focus', () => {
        syncPrivacyState(false);
    });

    window.addEventListener('beforeprint', () => {
        if (!document.body || document.body.dataset.allowPrint === 'true') {
            return;
        }

        document.body.classList.add('print-protected');
        showShield('Printing is disabled on this page.');
    });

    window.addEventListener('afterprint', () => {
        if (document.body) {
            document.body.classList.remove('print-protected');
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        ensureUi();

        document.querySelectorAll('a[target="_blank"]').forEach((link) => {
            const relParts = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
            relParts.add('noopener');
            relParts.add('noreferrer');
            link.setAttribute('rel', Array.from(relParts).join(' '));
        });

        document.querySelectorAll('img').forEach((image) => {
            image.setAttribute('draggable', 'false');
        });
    });
})();
