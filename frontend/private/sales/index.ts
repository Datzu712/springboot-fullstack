import '../main';
import 'datatables.net-buttons-bs5';
import 'datatables.net-fixedheader-bs5';

import Modal from 'bootstrap/js/dist/modal';
import $ from 'jquery';
import DataTable from 'datatables.net-responsive-bs5';

import { createQuestion } from '@components/modals';
import { ISale } from '@interfaces/sale';
import { IProduct } from '@interfaces/product';
import { IClient } from '@interfaces/client';
import { FormManager } from '@utils/formManager';
import { showToast } from '@components/toast';
import TomSelect from 'tom-select';

async function fetchAllSales(): Promise<ISale[]> {
    const response = await fetch('/api/sales');
    const data = await response.json();

    return data;
}

async function fetchAllProducts(): Promise<IProduct[]> {
    const response = await fetch('/api/products');
    const data = await response.json();

    return data;
}

async function fetchAllClients(): Promise<IClient[]> {
    const response = await fetch('/api/clients');
    const data = await response.json();

    return data;
}

document.addEventListener('DOMContentLoaded', async () => {
    const modalElement = document.getElementById('saleModal')!;
    const modal = new Modal(modalElement);
    const form = new FormManager('#saleForm');
    let editingSale: ISale | null = null;

    const products = await fetchAllProducts();
    const clients = await fetchAllClients();

    new TomSelect('#productId', {
        options: products.map((product) => ({ value: product.id, text: product.name })),
        create: false,
        hideSelected: true,
        placeholder: 'Select a product',
        plugins: {
            clear_button: {
                title: 'Remove all selected options',
            },
        },
        maxItems: 1,
    });
    new TomSelect('#clientId', {
        options: clients.map((client) => ({ value: client.id, text: client.name })),
        create: false,
        hideSelected: true,
        placeholder: 'Select a client',
        plugins: {
            clear_button: {
                title: 'Remove all selected options',
            },
        },
        maxItems: 1,
    });

    const dt = new DataTable('#sales-dt', {
        responsive: true,
        fixedHeader: true,
        data: await fetchAllSales(),
        columns: [
            {
                title: 'Product',
                data: 'productId',
                render: function (data) {
                    const product = products.find((p) => p.id === data);
                    return product ? product.name : '404';
                },
            },
            {
                title: 'Client',
                data: 'clientId',
                render: function (data) {
                    const client = clients.find((c) => c.id === data);
                    return client ? client.name : '404';
                },
            },
            {
                title: 'Amount',
                data: 'amount',
            },
            {
                title: 'Purchase Date',
                data: 'purchaseDate',
                render: function (data) {
                    return new Date(data).toLocaleDateString();
                },
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
                                editingSale = data;
                                form.loadForm(data);
                                modal.show();
                                break;
                            }
                            case 'deleteButton': {
                                createQuestion({
                                    text: `Are you sure you want to delete this sale?`,
                                    title: 'Eliminar venta',
                                    afterConfirm: () => {
                                        fetch(`/api/sales/${data.id}`, {
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
                            <i class="fas fa-plus"></i> Nueva Venta
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
        editingSale = null;
    });
    form.formElement.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!form.formElement.checkValidity()) {
            e.stopPropagation();

            form.formElement.classList.add('was-validated');
            return;
        }
        const data = form.toObj();
        console.log(data);

        try {
            const res = await fetch('/api/sales' + (editingSale ? `/${editingSale.id}` : ''), {
                method: editingSale ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            console.log(res);
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            dt.clear()
                .rows.add(await fetchAllSales())
                .draw();
        } catch (error) {
            console.error(error);

            showToast({
                title: 'Error',
                message: 'An error occurred while saving the sale',
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
