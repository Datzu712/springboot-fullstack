import '../main';
import 'datatables.net-buttons-bs5';
import 'datatables.net-fixedheader-bs5';

import Modal from 'bootstrap/js/dist/modal';
import $ from 'jquery';
import DataTable from 'datatables.net-responsive-bs5';

import { createQuestion } from '@components/modals';
import { IProduct } from '@interfaces/product';
import { FormManager } from '@utils/formManager';
import { showToast } from '@components/toast';

async function fetchAllProducts(): Promise<IProduct[]> {
    const response = await fetch('/api/products');
    const data = await response.json();

    return data;
}

document.addEventListener('DOMContentLoaded', async () => {
    const modalElement = document.getElementById('productModal')!;
    const modal = new Modal(modalElement);
    const form = new FormManager('#productForm');
    let editingProduct: IProduct | null = null;

    const dt = new DataTable('#products-table', {
        responsive: true,
        fixedHeader: true,
        data: await fetchAllProducts(),
        columns: [
            {
                title: 'Nombre',
                data: 'name',
            },
            {
                title: 'Precio',
                data: 'price',
                render: (data) => {
                    return `$${data.toFixed(2)}`;
                },
            },
            {
                title: 'Descripción',
                data: 'description',
            },
            {
                orderable: false,
                data: null,
                render: function () {
                    const div = document.createElement('div');

                    div.innerHTML = `
                        <div class="btn-group">
                            <button class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fas fa-list"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><button id="editButton" class="dropdown-item">Edit</button></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><button id="deleteButton" class="dropdown-item">Delete</button></li>
                            </ul>
                        </div>
                    `;
                    $(div).on('click', '.dropdown-menu button', function (e) {
                        const data = dt.row($(this).closest('tr')).data();

                        switch (e.target.id) {
                            case 'editButton': {
                                editingProduct = data;
                                form.loadForm(data);
                                modal.show();
                                break;
                            }
                            case 'deleteButton': {
                                createQuestion({
                                    text: `Are you sure you want to delete the product "${data.name}"?`,
                                    title: 'Eliminar producto',
                                    afterConfirm: () => {
                                        fetch(`/api/products/${data.id}`, {
                                            method: 'DELETE',
                                        }).then(() => {
                                            const row = $(this).closest('tr');
                                            row.addClass('fade-out hide');
                                            setTimeout(() => {
                                                dt.row(row).remove().draw();
                                            }, 500);
                                        });
                                    },
                                });
                                break;
                            }
                        }
                    });
                    return div;
                },
                width: '1%',
            },
        ],
        layout: {
            // @ts-expect-error idk why it's not working
            topStart: function () {
                const div = document.createElement('div');
                div.className = 'd-flex justify-content-end';
                div.innerHTML = `
                        <button type="button" class="btn btn-rounded btn-primary mb-3">
                            <i class="fas fa-plus"></i> Nuevo Producto
                        </button>
                `;
                div.onclick = () => {
                    modal.show();
                };
                return div;
            },
        },
    });

    modalElement.addEventListener('hidden.bs.modal', () => {
        form.clear();
        editingProduct = null;
    });
    form.formElement.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!form.formElement.checkValidity()) {
            e.stopPropagation();

            form.formElement.classList.add('was-validated');
            return;
        }
        const data = form.toObj();

        try {
            const res = await fetch('/api/products' + (editingProduct ? `/${editingProduct.id}` : ''), {
                method: editingProduct ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            dt.clear()
                .rows.add(await fetchAllProducts())
                .draw();
        } catch (error) {
            console.error(error);

            showToast({
                title: 'Error',
                message: 'An error occurred while saving the product',
                position: 'top-0 end-0',
                icon: 'fa-solid fa-exclamation-triangle',
                transparent: false,
                delay: 10000,
            });
        } finally {
            modal.hide();
        }
    });
});
