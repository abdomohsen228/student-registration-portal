// resources/js/lang-switch.js


function switchLang() {
    const translations = {
        en: window.translations?.en || {},
        ar: window.translations?.ar || {}
    };
    const button = document.getElementById('lang-button');
    const currentLocale = button.textContent === 'EN' ? 'en' : 'ar';
    const newLocale = currentLocale === 'en' ? 'ar' : 'en';

    // Update button text
    button.textContent = newLocale === 'en' ? 'EN' : 'AR';

    // Update HTML lang and direction
    document.documentElement.setAttribute('lang', currentLocale);
    document.documentElement.setAttribute('dir', newLocale === 'en' ? 'rtl' : 'ltr');

    // Update all elements with translations
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translations[currentLocale][key] || key;
    });

}
window.switchLang = switchLang;