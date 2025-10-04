import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import config from './constants/config';

const appName = config.app_name || 'Seed IQ';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
                    <Toaster />
                    <App {...props} />
                </div>
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
