import Toast from 'bootstrap/js/dist/toast';

interface ToastConfig {
    message: string;
    title?: string;
    type?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
    position?: string;
    icon?: string;
    imageUrl?: string;
    autohide?: boolean;
    delay?: number;
    transparent?: boolean;
    customContainerId?: string;
}

// Function to create and show a toast
export function showToast(config: ToastConfig) {
    const {
        message,
        title = 'Notification',
        type,
        position = 'bottom-0 end-0',
        icon,
        imageUrl,
        autohide = true,
        delay = 5000,
        transparent = true,
        customContainerId = `toastContainer`,
    } = config;
    const bgType = type ? `text-bg-${type}` : '';

    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById(customContainerId);
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = customContainerId;
        toastContainer.className = `toast-container position-fixed ${position} p-3`;
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${bgType} border-0 z-index: 99`;
    if (!transparent) {
        toast.classList.add('bg-body');
    }
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    toast.innerHTML = `
        <div class="toast-header">
            ${imageUrl ? `<img src="${imageUrl}" class="rounded me-2" alt="...">` : ''}
            ${icon ? `<i class="${icon} me-2"></i>` : ''}
            <strong class="me-auto">${title}</strong>
            <small class="text-body-secondary">Just now</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;

    // Append toast to container
    toastContainer.appendChild(toast);

    // Initialize and show the toast using Bootstrap's JavaScript API
    const bootstrapToast = new Toast(toast, {
        autohide: autohide,
        delay: delay,
    });
    bootstrapToast.show();
}
