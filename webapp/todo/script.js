window.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
  
    // ページ読み込み時にローカルストレージからデータを取得する
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
    // ローカルストレージから取得したデータをタスクリストに表示する
    savedTasks.forEach(task => {
      const taskItem = createTaskElement(task.text, task.completed);
      taskList.appendChild(taskItem);
    });
  
    addTaskBtn.addEventListener('click', () => {
      const taskText = taskInput.value.trim();
  
      if (taskText) {
        const taskItem = createTaskElement(taskText, false);
  
        // 新しいタスクをローカルストレージに保存する
        savedTasks.push({ text: taskText, completed: false });
        localStorage.setItem('tasks', JSON.stringify(savedTasks));
  
        taskList.appendChild(taskItem);
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
        savedTasks[index].completed = !savedTasks[index].completed;
        localStorage.setItem('tasks', JSON.stringify(savedTasks));
      });
  
      const deleteBtn = taskItem.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', () => {
        taskItem.remove();
  
        // タスクをローカルストレージから削除する
        const index = Array.from(taskList.children).indexOf(taskItem);
        savedTasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(savedTasks));
      });
  
      if (completed) {
        taskItem.classList.add('completed');
      }
  
      return taskItem;
    }
  });