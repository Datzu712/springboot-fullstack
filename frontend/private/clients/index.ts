import '../main';

import DataTable from 'datatables.net-responsive-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-fixedheader-bs5';
import { createQuestion } from '@components/modals';
import $ from 'jquery';
import { IClient } from '@interfaces/client';

async function fetchAllClients(): Promise<IClient[]> {
    const response = await fetch('/api/clients');
    const data = await response.json();

    return data;
}

document.addEventListener('DOMContentLoaded', async () => {
    const dt = new DataTable('#clients-table', {
        responsive: true,
        fixedHeader: true,
        data: await fetchAllClients(), // todo: move to ajax req
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
    });
});
