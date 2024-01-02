window.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskList = document.getElementById('task-list');
  const tabList = document.querySelector('.tab-list');
  const addTabBtn = document.getElementById('add-tab-btn');
  const exportBtn = document.getElementById('export-btn');
  const importBtn = document.getElementById('import-btn');

  let tabCount = 0;
  let activeTab = null;

  // ページ読み込み時にローカルストレージからタブデータを取得する
  const savedTabsData = JSON.parse(localStorage.getItem('tabs')) || [];

  // ローカルストレージから取得したタブデータをタブに表示する
  savedTabsData.forEach(tabData => {
    const tab = createTab(tabData.tabNumber);
    tabList.appendChild(tab);

    // タブがアクティブであればそのタブのタスクリストを表示する
    if (tabData.isActive) {
      activeTab = tab;
      activateTab(activeTab);
    }
  });

  // アクティブタブが存在しない場合は最初のタブをアクティブにする
  if (!activeTab && savedTabsData.length > 0) {
    activeTab = tabList.firstChild;
    activateTab(activeTab);
  }

  // アクティブタブが存在する場合、そのタブをアクティブにする
  if (activeTab) {
    activeTab.classList.add('active');
  }

  addTabBtn.addEventListener('click', () => {
    const newTab = createTab(++tabCount);
    tabList.appendChild(newTab);
    activateTab(newTab);
  });

  exportBtn.addEventListener('click', () => {
    const tasks = Array.from(document.querySelectorAll('.task-item')).map(task => {
      return { text: task.querySelector('.task-text').innerText, completed: task.classList.contains('completed') };
    });
    const exportData = JSON.stringify(tasks);
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `exported_tasks_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  importBtn.addEventListener('change', (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const importedTasks = JSON.parse(e.target.result);
        taskList.innerHTML = '';
        importedTasks.forEach(task => {
          const taskItem = createTaskElement(task.text, task.completed);
          taskList.appendChild(taskItem);
        });
      };
      reader.readAsText(file);
    }
  });

  function createTab(tabNumber) {
    const tab = document.createElement('div');
    tab.classList.add('tab');
    tab.dataset.tab = tabNumber;
    tab.innerHTML = `<span>タブ ${tabNumber}</span>`;

    tab.addEventListener('click', () => activateTab(tab));

    const closeTabBtn = document.createElement('button');
    closeTabBtn.classList.add('close-tab-btn');
    closeTabBtn.innerText = 'x';
    closeTabBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // タブのクリックイベント伝播を防ぐ
      tabList.removeChild(tab);

      // タブをローカルストレージから削除する
      const tabDataIndex = savedTabsData.findIndex(data => data.tabNumber === tabNumber);
      if (tabDataIndex !== -1) {
        savedTabsData.splice(tabDataIndex, 1);
        localStorage.setItem('tabs', JSON.stringify(savedTabsData));
      }

      // タブのタスクリストをローカルストレージから削除する
      localStorage.removeItem(`tasks_${tabNumber}`);

      if (activeTab === tab) {
        const newActiveTab = tabList.firstChild;
        if (newActiveTab) {
          activateTab(newActiveTab);
        }
      }
    });

    tab.appendChild(closeTabBtn);
    return tab;
  }

  function activateTab(tab) {
    if (activeTab) {
      activeTab.classList.remove('active');
    }
    activeTab = tab;
    activeTab.classList.add('active');

    // アクティブなタブをローカルストレージに保存する
    localStorage.setItem('activeTab', JSON.stringify({
      tabNumber: parseInt(activeTab.dataset.tab),
    }));

    // アクティブなタブのタスクリストを表示する
    const savedTasks = JSON.parse(localStorage.getItem(`tasks_${activeTab.dataset.tab}`)) || [];
    taskList.innerHTML = '';
    savedTasks.forEach(task => {
      const taskItem = createTaskElement(task.text, task.completed);
      taskList.appendChild(taskItem);
    });
  }

  addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();

    if (taskText) {
      const taskItem = createTaskElement(taskText, false);
      taskList.appendChild(taskItem);

      // アクティブなタブのタスクリストをローカルストレージに保存する
      const savedTasks = JSON.parse(localStorage.getItem(`tasks_${activeTab.dataset.tab}`)) || [];
      savedTasks.push({ text: taskText, completed: false });
      localStorage.setItem(`tasks_${activeTab.dataset.tab}`, JSON.stringify(savedTasks));

      taskInput.value = '';
    }
  });

  function createTaskElement(text, completed) {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');
    taskItem.innerHTML = `
      <div class="task-text">${text}</div>
      <div class="task-actions">
        <button class="complete-btn">完了</button>
        <button class="delete-btn">削除</button>
      </div>
    `;

    const completeBtn = taskItem.querySelector('.complete-btn');
    completeBtn.addEventListener('click', () => {
      taskItem.classList.toggle('completed');

      // タスクの完了状態をローカルストレージに保存する
      const index = Array.from(taskList.children).indexOf(taskItem);
      const savedTasks = JSON.parse(localStorage.getItem(`tasks_${activeTab.dataset.tab}`)) || [];
      savedTasks[index].completed = !savedTasks[index].completed;
      localStorage.setItem(`tasks_${activeTab.dataset.tab}`, JSON.stringify(savedTasks));
    });

    const deleteBtn = taskItem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      taskItem.remove();

      // タスクをローカルストレージから削除する
      const index = Array.from(taskList.children).indexOf(taskItem);
      const savedTasks = JSON.parse(localStorage.getItem(`tasks_${activeTab.dataset.tab}`)) || [];
      savedTasks.splice(index, 1);
      localStorage.setItem(`tasks_${activeTab.dataset.tab}`, JSON.stringify(savedTasks));
    });

    if (completed) {
      taskItem.classList.add('completed');
    }

    return taskItem;
  }
});
