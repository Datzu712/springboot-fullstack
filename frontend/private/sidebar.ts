import 'bootstrap/js/dist/dropdown';

const button = document.getElementById('sidebarCollapse')!;
const sidebar = document.getElementById('sidebarMenu')!;

button.addEventListener('click', () => {
    console.log('Toggling sidebar');
    console.log('Toggling sidebar');
    sidebar.classList.toggle('collapse');
});
