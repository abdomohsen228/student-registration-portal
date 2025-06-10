
export class AjaxValidator {
    static async checkUsernameAvailability(username) {
        const locale = localStorage.getItem('locale') || 'en';
        try {
            const formatError = this.validateUsernameFormat(username);
            if (formatError) {
                return { available: false, error: formatError };
            }

            const response = await fetch(`/ajax/check-username?locale=${locale}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ username })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error checking username:', error);
            const translations = window.validationMessages?.[locale] || {};
            return {
                available: true,
                error: translations.check_username_error || 'Could not verify username availability'
            };
        }
    }

    static validateUsernameFormat(username) {
        const minLength = 3;
        const maxLength = 20;
        const regex = /^[a-zA-Z0-9_-]+$/;
        const locale = localStorage.getItem('locale') || 'en';
        const translations = window.translations?.[locale] || {};
        const validationMessages = window.validationMessages?.[locale] || {};

        if (username.length < minLength) {
            return validationMessages.min?.string?.replace(':attribute', translations.user_name || 'username')?.replace(':min', minLength) || `Username must be at least ${minLength} characters`;
        }
        if (username.length > maxLength) {
            return validationMessages.max?.string?.replace(':attribute', translations.user_name || 'username')?.replace(':max', maxLength) || `Username must be no more than ${maxLength} characters`;
        }
        if (!regex.test(username)) {
            return validationMessages.regex?.user_name || 'Only letters, numbers, _ and - allowed';
        }
        return null;
    }
}