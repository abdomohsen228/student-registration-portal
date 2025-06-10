// resources/js/lang-switch.js


function switchLang() {
    const translations = {
        en: window.translations?.en || {},
        ar: window.translations?.ar || {}
    };
    const validationMessages = {
        en: window.validationMessages?.en || {},
        ar: window.validationMessages?.ar || {}
    };
    const button = document.getElementById('lang-button');
    const currentLocale = button.textContent === 'EN' ? 'en' : 'ar';
    const newLocale = currentLocale === 'en' ? 'ar' : 'en';

    // Update button text
    button.textContent = newLocale === 'en' ? 'EN' : 'AR';

    // Store locale in localStorage
    localStorage.setItem('locale', currentLocale);

    // Update HTML lang and direction
    document.documentElement.setAttribute('lang', currentLocale);
    document.documentElement.setAttribute('dir', newLocale === 'en' ? 'rtl' : 'ltr');

    // Update all elements with translations
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translations[currentLocale][key] || key;
    });

    if (window.revalidateAll) {
        window.revalidateAll();
    }

}
window.switchLang = switchLang;

document.addEventListener('DOMContentLoaded', () => {
    const savedLocale = localStorage.getItem('locale') || 'en';
    const translations = window.translations?.[savedLocale] || {};

    document.documentElement.setAttribute('lang', savedLocale);
    document.documentElement.setAttribute('dir', savedLocale === 'ar' ? 'rtl' : 'ltr');

    document.getElementById('locale').value = savedLocale;

    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translations[key] || element.textContent;
    });

    if (window.revalidateAll) {
        window.revalidateAll();
    }
});

function onPageReload() {

    if (performance.navigation.type === 1) {
        localStorage.setItem('locale','en');
    }
}
window.onload = onPageReload;