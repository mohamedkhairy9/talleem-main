import { localizeMessage } from './localizedMessages';

/**
 * Toast Notification Service
 * For displaying success/error/warning messages
 */
export const toastService = {
    success: message => {
        const localizedMessage = localizeMessage(message, 'api.success.generic');
        console.log('SUCCESS:', localizedMessage);
        showBrowserToast(localizedMessage, 'success');
    },

    error: message => {
        const localizedMessage = localizeMessage(message, 'api.errors.generic', {
            preferFallbackForEnglish: true
        });
        console.error('ERROR:', localizedMessage);
        showBrowserToast(localizedMessage, 'error');
    },

    warning: message => {
        const localizedMessage = localizeMessage(message, 'api.errors.generic', {
            preferFallbackForEnglish: true
        });
        console.warn('WARNING:', localizedMessage);
        showBrowserToast(localizedMessage, 'warning');
    },

    info: message => {
        const localizedMessage = localizeMessage(message, 'api.success.generic');
        console.log('INFO:', localizedMessage);
        showBrowserToast(localizedMessage, 'info');
    }
};

function showBrowserToast(message, type = 'info') {
    let container = document.getElementById('temp-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'temp-toast-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            direction: rtl;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };

    const icons = {
        success: '✓',
        error: '✕',
        warning: '!',
        info: 'i'
    };

    toast.style.cssText = `
        background: white;
        color: #1f2937;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-left: 4px solid ${colors[type]};
        min-width: 300px;
        max-width: 500px;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    `;

    toast.innerHTML = `
        <span style="font-size: 18px;">${icons[type]}</span>
        <span style="flex: 1; font-size: 14px;">${message}</span>
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(-100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(-100%);
                opacity: 0;
            }
        }
    `;

    if (!document.getElementById('toast-animations')) {
        style.id = 'toast-animations';
        document.head.appendChild(style);
    }

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            toast.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        }, 300);
    }, 3000);
}

export default toastService;
