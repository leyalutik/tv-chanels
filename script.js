let selectedIndex = -1;

let data = JSON.parse(
    localStorage.getItem("tvData")
)
||
{
    date: "",
    time: "",
    items: []
};

function load() {
    //alert("Версия программы: " + VERSION);
    createButtons();
    showInfo();
    showReport();
}

function createButtons() {
    let box = document.getElementById("channels");
    channels.forEach(channel => {
        let button = document.createElement("button");
        button.innerText = channel;
        button.onclick = function() {
            addChannel(channel);
        };
        box.appendChild(button);
    });
}

function addChannel(channel) {
    // создаем дату только при первом канале
    if (data.items.length === 0) {
        let now = new Date();
        data.items.push({
            text: "Проверка каналов",
            header: true
        });
        data.items.push({
            text: "Дата: " + now.toLocaleDateString("ru-RU") +
                "   Время: " + now.toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit"
                }),
            header: true
        });
        data.items.push({
            text: "",
            header: true
        });
        data.date = now.toLocaleDateString("ru-RU");
        data.time = now.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit"
        });
    }
    data.items.push({
        text: channel
    });
    save();
    showInfo();
    showReport();
}

// ============================================
// ДОБАВИТЬ КОММЕНТАРИЙ
// ============================================

function addComment() {
    resetCommentModal();
    document.getElementById("commentText").value = "";
    document.getElementById("commentModal").style.display = "flex";
}

// ============================================
// СОХРАНИТЬ КОММЕНТАРИЙ
// ============================================

function saveComment() {
    let comment = document.getElementById("commentText").value;

    // Если нет данных — создаем заголовок
    if (data.items.length === 0) {
        let now = new Date();
        data.items.push({
            text: "Проверка каналов",
            header: true
        });
        data.items.push({
            text: "Дата: " + now.toLocaleDateString("ru-RU") +
                "   Время: " + now.toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit"
                }),
            header: true
        });
        data.items.push({
            text: "",
            header: true
        });
    }

    // Если строка выбрана — редактируем
    if (selectedIndex !== -1) {
        data.items[selectedIndex].text = comment;
        selectedIndex = -1;
    } else {
        // Иначе — добавляем новую
        data.items.push({
            text: comment
        });
    }

    save();
    showReport();
    closeModal();
}

function saveEmptyLine() {
    data.items.push({
        text: ""
    });
    save();
    showReport();
    closeModal();
}

function closeModal() {
    document.getElementById("commentModal").style.display = "none";
    resetCommentModal();
}

function showInfo() {
    let box = document.getElementById("checkInfo");
}

function save() {
    localStorage.setItem(
        "tvData",
        JSON.stringify(data)
    );
}

function showReport() {
    let box = document.getElementById("report");
    box.innerHTML = "";

    data.items.forEach((item, index) => {
        let div = document.createElement("div");
        div.onclick = function() {
            if (item.header) {
                selectedIndex = -1;
                showReport();
                return;
            }
            selectedIndex = index;
            showReport();
        };
        div.className = "report-item";
        if (index === selectedIndex) {
            div.classList.add("selected");
        }
        div.innerText = item.text;
        box.appendChild(div);
    });

    // Прокрутить к последней строке
    let last = box.lastElementChild;
    if (last) {
        last.scrollIntoView({
            behavior: "smooth",
            block: "end"
        });
    }

    let btn = document.getElementById("editDeleteBtn");
    btn.disabled = (selectedIndex === -1);
}

// ============================================
// ПОКАЗАТЬ ДИАЛОГ УДАЛЕНИЯ
// ============================================

function showDeleteDialog() {
    if (selectedIndex === -1) {
        alert('Сначала выберите строку в отчете!');
        return;
    }

    if (data.items[selectedIndex].header) {
        alert('Нельзя редактировать заголовок!');
        return;
    }

    document.getElementById("deleteModal").style.display = "flex";
}

// ============================================
// ЗАКРЫТЬ ДИАЛОГ УДАЛЕНИЯ
// ============================================

function closeDeleteModal() {
    document.getElementById("deleteModal").style.display = "none";
}

// ============================================
// РЕДАКТИРОВАТЬ ВЫБРАННУЮ СТРОКУ
// ============================================

function editSelected() {
    // 1. Проверяем, выбрана ли строка
    if (selectedIndex === -1) {
        alert('Сначала выберите строку в отчете!');
        return;
    }

    // 2. Проверяем, не заголовок ли это
    if (data.items[selectedIndex].header) {
        alert('Нельзя редактировать заголовок!');
        return;
    }

    // 3. Подставляем текст в поле
    document.getElementById("commentText").value = data.items[selectedIndex].text;

    // 4. Меняем заголовок окна
    document.querySelector('#commentModal h3').textContent = '✏️ Редактировать строку';

    // 5. Меняем текст и поведение кнопки "Сохранить"
    let saveBtn = document.querySelector('#commentModal button[onclick="saveComment()"]');
    if (saveBtn) {
        saveBtn.textContent = '💾 Сохранить изменения';
        saveBtn.onclick = function() {
            saveEditedComment();
        };
    }

    // 6. Закрываем окно удаления
    closeDeleteModal();

    // 7. Открываем окно редактирования
    document.getElementById("commentModal").style.display = "flex";
}

// ============================================
// СОХРАНИТЬ ОТРЕДАКТИРОВАННУЮ СТРОКУ
// ============================================

function saveEditedComment() {
    let comment = document.getElementById("commentText").value;

    if (!comment.trim()) {
        if (!confirm('Вы хотите оставить пустую строку?')) {
            return;
        }
    }

    // Сохраняем изменения
    data.items[selectedIndex].text = comment;
    selectedIndex = -1;

    save();
    showReport();
    closeModal();

    // Сбрасываем состояние модалки
    resetCommentModal();
}

// ============================================
// СБРОС СОСТОЯНИЯ МОДАЛКИ КОММЕНТАРИЕВ
// ============================================

function resetCommentModal() {
    const modal = document.getElementById('commentModal');
    const title = modal.querySelector('h3');
    const saveBtn = modal.querySelector('button[onclick="saveComment()"]');

    if (title) title.textContent = 'Текст';
    if (saveBtn) {
        saveBtn.textContent = 'Добавить текст';
        saveBtn.onclick = saveComment;
    }
}

// ============================================
// УДАЛИТЬ ВЫБРАННУЮ СТРОКУ
// ============================================

function deleteSelected() {
    if (selectedIndex === -1) {
        return;
    }

    if (confirm("Удалить строку?")) {
        data.items.splice(selectedIndex, 1);
        selectedIndex = -1;
        save();
        showReport();
        showInfo();
    }

    closeDeleteModal();
}

// ============================================
// КОПИРОВАТЬ ОТЧЕТ
// ============================================

function copyReport() {
    let text = data.items.forEach(item => {
        text += item.text + "\n";
    });

    navigator.clipboard.writeText(text);
    alert("Отчет скопирован");
}

// ============================================
// ОЧИСТИТЬ ОТЧЕТ
// ============================================

function clearReport() {
    if (confirm("Очистить список?")) {
        data = {
            date: "",
            time: "",
            items: []
        };
        save();
        showInfo();
        showReport();
    }
}

load();
