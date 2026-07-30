const mesasData = [
    { id: 1, cap: 2, status: 'vago', img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400' },
    { id: 2, cap: 4, status: 'vago', img: 'https://images.unsplash.com/photo-1550966842-28aa2497676d?w=400' },
    { id: 3, cap: 2, status: 'cheio', img: '' },
    { id: 4, cap: 6, status: 'vago', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400' },
    { id: 5, cap: 2, status: 'vago', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400' },
    { id: 6, cap: 4, status: 'vago', img: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400' },
];

let usuarioLogado = JSON.parse(localStorage.getItem('sessao_ativa')) || null;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();
    checkUser();
    renderMap();

    // Menu Mobile
    document.getElementById('mobile-menu').onclick = () => document.getElementById('nav-links').classList.toggle('active');

    // Tabs do Menu
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.tab-btn, .tab-panel').forEach(el => el.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        };
    });

    // Modal
    const modal = document.getElementById('auth-modal');
    document.getElementById('user-display').onclick = () => {
        if (usuarioLogado) {
            if (confirm("Sair da conta?")) { localStorage.removeItem('sessao_ativa'); location.reload(); }
        } else { modal.classList.add('active'); }
    };
    document.getElementById('close-modal').onclick = () => modal.classList.remove('active');

    // Trocar abas Auth
    document.getElementById('tab-login-btn').onclick = () => alternarAuth('login');
    document.getElementById('tab-reg-btn').onclick = () => alternarAuth('reg');

    // Cadastro
    document.getElementById('form-reg-exec').onsubmit = (e) => {
        e.preventDefault();
        const nome = document.getElementById('r-name').value;
        const email = document.getElementById('r-email').value;
        const senha = document.getElementById('r-pass').value;

        let usuarios = JSON.parse(localStorage.getItem('db_usuarios')) || [];
        if (usuarios.find(u => u.email === email)) return alert("E-mail já cadastrado!");

        usuarios.push({ nome, email, senha });
        localStorage.setItem('db_usuarios', JSON.stringify(usuarios));
        alert("Conta criada! Faça login.");
        alternarAuth('login');
    };

    // Login
    document.getElementById('form-login-exec').onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('l-email').value;
        const senha = document.getElementById('l-pass').value;

        let usuarios = JSON.parse(localStorage.getItem('db_usuarios')) || [];
        const user = usuarios.find(u => u.email === email && u.senha === senha);

        if (user) {
            localStorage.setItem('sessao_ativa', JSON.stringify(user));
            location.reload();
        } else { alert("Usuário ou senha incorretos!"); }
    };
});

function alternarAuth(tipo) {
    document.getElementById('tab-login-btn').classList.toggle('active', tipo === 'login');
    document.getElementById('tab-reg-btn').classList.toggle('active', tipo === 'reg');
    document.getElementById('login-box').classList.toggle('active', tipo === 'login');
    document.getElementById('reg-box').classList.toggle('active', tipo === 'reg');
}

function checkUser() {
    if (usuarioLogado) document.getElementById('user-display').innerHTML = `Olá, ${usuarioLogado.nome.split(' ')[0]}`;
}

function renderMap() {
    const map = document.getElementById('restaurant-map');
    mesasData.forEach(m => {
        const div = document.createElement('div');
        div.className = `mesa ${m.status === 'cheio' ? 'full' : ''}`;
        div.innerHTML = `<strong>Mesa ${m.id}</strong><small>${m.cap} Lugares</small>`;
        if (m.status === 'vago') div.onclick = () => {
            document.querySelectorAll('.mesa').forEach(el => el.classList.remove('active'));
            div.classList.add('active');
            document.getElementById('table-image').style.backgroundImage = `url('${m.img}')`;
            document.getElementById('table-title').textContent = `Mesa 0${m.id}`;
            document.getElementById('booking-form').classList.remove('hidden');
        };
        map.appendChild(div);
    });
}

document.getElementById('booking-form').onsubmit = (e) => {
    e.preventDefault();
    if (!usuarioLogado) return document.getElementById('auth-modal').classList.add('active');
    alert(`Reserva confirmada para ${usuarioLogado.nome}!`);
    location.reload();
};
