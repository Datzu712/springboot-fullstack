import '../main';
import 'datatables.net-buttons-bs5';
import 'datatables.net-fixedheader-bs5';

import Modal from 'bootstrap/js/dist/modal';
import $ from 'jquery';
import DataTable from 'datatables.net-responsive-bs5';

import { createQuestion } from '@components/modals';
import { IClient } from '@interfaces/client';
import { FormManager } from '@utils/formManager';
import { showToast } from '@components/toast';

async function fetchAllClients(): Promise<IClient[]> {
    const response = await fetch('/api/clients');
    const data = await response.json();

    return data;
}

document.addEventListener('DOMContentLoaded', async () => {
    const modalElement = document.getElementById('clientModal')!;
    const modal = new Modal(modalElement);
    const form = new FormManager('#clientForm');

    const dt = new DataTable('#clients-table', {
        responsive: true,
        fixedHeader: true,
        data: await fetchAllClients(),
        columns: [
            {
                title: 'Name',
                data: null,
                render: (data) => {
                    return data.name;
                },
            },
            {
                title: 'Email',
                data: null,
                render: (data) => {
                    return `<a href="mailto:${data.email}">${data.email}</a>`;
                },
            },
            {
                title: 'Phone',
                data: null,
                render: (data) => {
                    return data.phone;
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
                                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-list"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l11 0" /><path d="M9 12l11 0" /><path d="M9 18l11 0" /><path d="M5 6l0 .01" /><path d="M5 12l0 .01" /><path d="M5 18l0 .01" /></svg>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><button id="editButton" class="dropdown-item">Editar</button></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><button id="deleteButton" class="dropdown-item">Eliminar</button></li>
                            </ul>
                        </div>
                    `;
                    $(div).on('click', '.dropdown-menu button', function (e) {
                        const data = dt.row($(this).closest('tr')).data();

                        switch (e.target.id) {
                            case 'editButton': {
                                form.loadForm(data);
                                modal.show();
                                break;
                            }
                            case 'deleteButton': {
                                createQuestion({
                                    text: `Esta seguro que desea eliminar el cliente ${data.name}?`,
                                    title: 'Eliminar cliente',
                                    afterConfirm: () => {
                                        fetch(`/api/clients/${data.id}`, {
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
                            <i class="fas fa-plus"></i> New Client
                        </button>
                `;
                div.onclick = () => {
                    modal.show();
                };
                return div;
            },
        },
    });

    modalElement.addEventListener('hidden.bs.modal', () => form.clear());
    form.formElement.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!form.formElement.checkValidity()) {
            e.stopPropagation();

            form.formElement.classList.add('was-validated');
            return;
        }
        const data = form.toObj();

        try {
            const res = await fetch('/api/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                throw new Error('Error saving client');
            }
            dt.clear()
                .rows.add(await fetchAllClients())
                .draw();
        } catch (error) {
            console.error(error);

            showToast({
                title: 'Error',
                message: 'An error occurred while saving the client. Please try again later.',
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
