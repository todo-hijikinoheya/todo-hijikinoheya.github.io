window.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskList = document.getElementById('task-list');

  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

  savedTasks.forEach((task, index) => {
    const taskItem = createTaskElement(task.text, task.completed, index);
    taskList.appendChild(taskItem);
  });

  addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();

    if (taskText) {
      const taskItem = createTaskElement(taskText, false, savedTasks.length);

      savedTasks.push({ text: taskText, completed: false });
      localStorage.setItem('tasks', JSON.stringify(savedTasks));

      taskList.appendChild(taskItem);
      taskInput.value = '';
    }
  });

  function createTaskElement(text, completed, index) {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');
    taskItem.innerHTML = `
      <div class="task-text">${text}</div>
      <div class="task-actions">
        <button class="complete-btn">完了</button>
        <button class="edit-btn">編集</button>
        <button class="delete-btn">削除</button>
      </div>
    `;

    const completeBtn = taskItem.querySelector('.complete-btn');
    completeBtn.addEventListener('click', () => {
      taskItem.classList.toggle('completed');
      savedTasks[index].completed = !savedTasks[index].completed;
      localStorage.setItem('tasks', JSON.stringify(savedTasks));
    });

    const editBtn = taskItem.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
      const newTaskText = prompt('新しいタスクを入力してください', text);
      if (newTaskText !== null) {
        taskItem.querySelector('.task-text').textContent = newTaskText;
        savedTasks[index].text = newTaskText;
        localStorage.setItem('tasks', JSON.stringify(savedTasks));
      }
    });

    const deleteBtn = taskItem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      taskItem.remove();
      savedTasks.splice(index, 1);
      localStorage.setItem('tasks', JSON.stringify(savedTasks));
    });

    if (completed) {
      taskItem.classList.add('completed');
    }

    return taskItem;
  }
});
