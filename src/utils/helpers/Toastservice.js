/**
 * Toast Notification Service
 * For displaying success/error/warning messages
 * 
 * SETUP INSTRUCTIONS:
 * ====================
 * 1. Install your preferred toast library:
 *    npm install react-toastify
 * 
 * 2. Import and configure in your main app:
 *    import { ToastContainer } from 'react-toastify';
 *    import 'react-toastify/dist/ReactToastify.css';
 *    
 *    // In your App.jsx
 *    <ToastContainer position="top-left" autoClose={3000} rtl />
 * 
 * 3. Uncomment the import below and comment out the fallback
 */

// ============================================
// OPTION 1: react-toastify (Recommended)
// ============================================
// Uncomment these lines after installing react-toastify:

// import { toast } from 'react-toastify';
// 
// export const toastService = {
//     success: (message) => toast.success(message),
//     error: (message) => toast.error(message),
//     warning: (message) => toast.warning(message),
//     info: (message) => toast.info(message)
// };

// ============================================
// OPTION 2: Ant Design
// ============================================
// import { message } from 'antd';
// 
// export const toastService = {
//     success: (msg) => message.success(msg),
//     error: (msg) => message.error(msg),
//     warning: (msg) => message.warning(msg),
//     info: (msg) => message.info(msg)
// };

// ============================================
// OPTION 3: Material-UI (with notistack)
// ============================================
// import { useSnackbar } from 'notistack';
// 
// export const toastService = {
//     success: (msg) => enqueueSnackbar(msg, { variant: 'success' }),
//     error: (msg) => enqueueSnackbar(msg, { variant: 'error' }),
//     warning: (msg) => enqueueSnackbar(msg, { variant: 'warning' }),
//     info: (msg) => enqueueSnackbar(msg, { variant: 'info' })
// };

// ============================================
// FALLBACK: Console + Browser Alert (Development Only)
// ============================================
// This is a temporary fallback that works without any library
// Replace with one of the options above for production

export const toastService = {
    /**
     * Show success message
     * @param {string} message - Message to display
     */
    success: (message) => {
        console.log('✅ SUCCESS:', message);
        // Temporary visual feedback
        showBrowserToast(message, 'success');
    },

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    error: (message) => {
        console.error('❌ ERROR:', message);
        showBrowserToast(message, 'error');
    },

    /**
     * Show warning message
     * @param {string} message - Warning message to display
     */
    warning: (message) => {
        console.warn('⚠️ WARNING:', message);
        showBrowserToast(message, 'warning');
    },

    /**
     * Show info message
     * @param {string} message - Info message to display
     */
    info: (message) => {
        console.log('ℹ️ INFO:', message);
        showBrowserToast(message, 'info');
    }
};

/**
 * Simple browser toast implementation (fallback only)
 * This creates a temporary toast notification using pure JS
 * Replace with a proper toast library for production!
 */
function showBrowserToast(message, type = 'info') {
    // Create toast container if it doesn't exist
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

    // Create toast element
    const toast = document.createElement('div');
    
    // Colors based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
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
    
    // Add animation
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
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            toast.remove();
            // Remove container if empty
            if (container.children.length === 0) {
                container.remove();
            }
        }, 300);
    }, 3000);
}

export default toastService;