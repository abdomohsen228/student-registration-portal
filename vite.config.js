import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/js/lang-switch.js',
                'resources/js/ajax.js',
                'resources/js/validation.js',
                'resources/js/WA_Number.js',
                'resources/css/footer.css',
                'resources/css/header.css',
                'resources/css/style.css'
            ],
            refresh: true,
        }),
        tailwindcss(),
    ],
});
