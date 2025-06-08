
export class AjaxValidator {
    static async checkUsernameAvailability(username) {
        try {
            // Validate format first (client-side)
            const formatError = this.validateUsernameFormat(username);
            if (formatError) 
                return ;

            // Check availability via AJAX
            const response = await fetch(`/ajax/check-username`, {
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

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Error checking username:', error);
            return { 
                available: true, // Assume available if check fails
                error: 'Could not verify username availability'
            };
        }
    }

    static validateUsernameFormat(username) {
        const minLength = 3;
        const maxLength = 20;
        const regex = /^[a-zA-Z0-9_-]+$/;

        if (username.length < minLength) {
            return `Username must be at least ${minLength} characters`;
        }
        if (username.length > maxLength) {
            return `Username must be no more than ${maxLength} characters`;
        }
        if (!regex.test(username)) {
            return 'Only letters, numbers, _ and - allowed';
        }
        return null;
    }
}