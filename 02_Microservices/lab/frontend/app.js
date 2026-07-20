const API = '/api';
const list = document.getElementById('bookmark-list');
const statusText = document.getElementById('status-text');

// Health check
async function checkHealth() {
    try {
        const res = await fetch(`${API}/health`);
        const data = await res.json();
        if (data.status === 'ok') {
            statusText.textContent = `Hệ thống OK | DB: ${data.database}`;
            statusText.className = 'status-ok';
            loadBookmarks();
        }
    } catch {
        statusText.textContent = 'Mất kết nối Backend';
        statusText.className = 'status-error';
    }
}

// Load bookmarks
async function loadBookmarks(tag) {
    try {
        const url = tag ? `${API}/bookmarks?tag=${tag}` : `${API}/bookmarks`;
        const res = await fetch(url);
        const data = await res.json();
        list.innerHTML = '';
        if (data.length === 0) {
            list.innerHTML = '<li style="border:none;color:#94a3b8;justify-content:center">Chưa có bookmark nào</li>';
            return;
        }
        data.forEach(b => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="info">
                    <div class="title">${b.title}</div>
                    <a class="url" href="${b.url}" target="_blank">${b.url}</a>
                    <div><span class="tag">${b.tag}</span></div>
                </div>
                <button class="del-btn" onclick="deleteBookmark(${b.id})">✕</button>
            `;
            list.appendChild(li);
        });
    } catch (err) {
        console.error('Lỗi tải bookmark:', err);
    }
}

// Add bookmark
document.getElementById('add-btn').addEventListener('click', async () => {
    const title = document.getElementById('input-title').value.trim();
    const url = document.getElementById('input-url').value.trim();
    const tag = document.getElementById('input-tag').value;
    if (!title || !url) return;
    try {
        await fetch(`${API}/bookmarks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, url, tag })
        });
        document.getElementById('input-title').value = '';
        document.getElementById('input-url').value = '';
        loadBookmarks();
    } catch (err) {
        console.error('Lỗi thêm bookmark:', err);
    }
});

// Delete bookmark
async function deleteBookmark(id) {
    try {
        await fetch(`${API}/bookmarks/${id}`, { method: 'DELETE' });
        loadBookmarks();
    } catch (err) {
        console.error('Lỗi xóa bookmark:', err);
    }
}

// Enter to add
document.getElementById('input-url').addEventListener('keypress', e => {
    if (e.key === 'Enter') document.getElementById('add-btn').click();
});

checkHealth();
