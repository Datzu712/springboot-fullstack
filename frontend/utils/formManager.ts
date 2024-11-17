import TomSelect from 'tom-select';

export interface TomSelectElement extends HTMLSelectElement {
    tomselect?: TomSelect;
}

export class FormManager<IFormContents = { [x: string]: string | boolean }> {
    public readonly formElement: HTMLFormElement;

    constructor(formElementOrSelector: string | HTMLFormElement) {
        this.formElement =
            typeof formElementOrSelector === 'string'
                ? (document.querySelector(formElementOrSelector) as HTMLFormElement)
                : formElementOrSelector;
    }

    public toObj(): IFormContents {
        const elements = Array.from(this.formElement.elements) as (
            | HTMLInputElement
            | HTMLSelectElement
            | HTMLTextAreaElement
        )[];
        const obj: { [key: string]: string | number } = {};

        for (const element of elements) {
            if (!element.value) continue;

            if (
                element instanceof HTMLInputElement ||
                element instanceof HTMLSelectElement ||
                element instanceof HTMLTextAreaElement
            ) {
                obj[element.id] = element.type === 'number' ? parseInt(element.value) : element.value;
            }
        }
        return obj as IFormContents;
    }
    /**
     * Loads form data from local storage and populates the form fields.
     *
     * This method retrieves the form data stored in local storage and assigns the values
     * to the corresponding form elements. If the form element is a select element, it also
     * triggers a change event to ensure any dependent logic is executed.
     *
     * If no form data is found in local storage, a debug message is logged. In case of an
     * error during the loading process, an error message is logged and the local storage is cleared.
     */
    public loadForm(data: IFormContents) {
        this.clear();

        try {
            for (const key in data) {
                const el = document.getElementById(key) as HTMLInputElement | TomSelectElement;
                if (!el) continue;

                if (el instanceof HTMLSelectElement && el.tomselect) {
                    el.tomselect.setValue([data[key] as string]);
                } else {
                    el.value = data[key] as string;
                }
            }
        } catch (error) {
            console.error(`Error loading form: ${error}`);
        }
    }

    public clear() {
        this.formElement.classList.remove('was-validated');
        this.formElement.reset();
        this.formElement.querySelectorAll('select').forEach((select) => {
            const el = select as TomSelectElement;
            if (el.tomselect) {
                el.tomselect.clear();
            }
        });
    }
}
