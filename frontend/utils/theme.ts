import { LocalStorageManager } from './localStorage';

export enum ThemeType {
    LIGHT = 'light',
    DARK = 'dark',
    AUTO = 'auto',
}

export interface IThemeOptions {
    toggleButton: boolean;
}

export class Theme {
    static readonly DEFAULT_THEME = ThemeType.LIGHT;
    static readonly DEFAULT_STORAGE_KEY = 'theme';

    private static _instance: Theme;
    private _theme: ThemeType = Theme.DEFAULT_THEME;
    private storage = new LocalStorageManager<ThemeType>(Theme.DEFAULT_STORAGE_KEY);

    private constructor(options?: IThemeOptions) {
        const storedTheme = this.storage.getItem();
        if (storedTheme && Object.values(ThemeType).includes(storedTheme)) {
            this._theme = storedTheme;
        }

        if (options?.toggleButton) {
            this.buttonInitializer();
        }

        this.applyTheme();
    }

    static getInstance(options?: IThemeOptions): Theme {
        if (!Theme._instance) {
            Theme._instance = new Theme(options);
        }
        return Theme._instance;
    }

    get theme(): ThemeType {
        return this._theme;
    }

    set theme(value: ThemeType) {
        if (Object.values(ThemeType).includes(value)) {
            this._theme = value;
            this.storage.setItem(value);
            this.applyTheme();
        }
    }

    private applyTheme(): void {
        const html = document.documentElement;
        if (this._theme === ThemeType.AUTO) {
            html.removeAttribute('data-bs-theme');
        } else {
            html.setAttribute('data-bs-theme', this._theme);
        }
    }

    public toggleTheme(): void {
        if (this._theme === ThemeType.LIGHT) {
            this.theme = ThemeType.DARK;
        } else if (this._theme === ThemeType.DARK) {
            this.theme = ThemeType.AUTO;
        } else {
            this.theme = ThemeType.LIGHT;
        }

        const button = document.getElementById('themeToggleButton');
        this.updateButtonIcon(button);
    }

    private updateButtonIcon(button: HTMLElement | null): void {
        const icon = button?.querySelector('#themeIcon');
        if (icon) {
            if (this._theme === ThemeType.LIGHT) {
                icon.className = 'fas fa-sun';
            } else if (this._theme === ThemeType.DARK) {
                icon.className = 'fas fa-moon';
            } else {
                icon.className = 'fas fa-adjust';
            }
        }
    }

    private buttonInitializer() {
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach((item) => {
            item.addEventListener('click', () => {
                const target = item.getAttribute('data-target') as ThemeType;
                this.theme = target;
            });
        });
    }
}
