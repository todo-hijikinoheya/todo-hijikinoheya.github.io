window.addEventListener('DOMContentLoaded', () => {
    const addTaskButtons = document.querySelectorAll('.add-task-button');
  
    // タスク追加ボタンがクリックされたときの処理
    addTaskButtons.forEach(button => {
      button.addEventListener('click', () => {
        const projectId = button.dataset.projectId;
        const taskInput = document.getElementById(`task-input-${projectId}`);
        const taskList = document.getElementById(`task-list-${projectId}`);
        const taskText = taskInput.value;
  
        if (taskText) {
          const taskElement = document.createElement('li');
          taskElement.textContent = taskText;
          taskList.appendChild(taskElement);
          taskInput.value = '';
  
          const deleteButton = document.createElement('button');
          deleteButton.textContent = '削除';
          deleteButton.classList.add('delete-task-button');
          deleteButton.addEventListener('click', () => {
            taskList.removeChild(taskElement);
          });
          taskElement.appendChild(deleteButton);
        }
      });
    });
  
    // ページ読み込み時のデータ読み込み処理
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      Object.keys(savedTasks).forEach(projectId => {
        const taskList = document.getElementById(`task-list-${projectId}`);
        savedTasks[projectId].forEach(taskText => {
          const taskElement = document.createElement('li');
          taskElement.textContent = taskText;
  
          const deleteButton = document.createElement('button');
          deleteButton.textContent = '削除';
          deleteButton.classList.add('delete-task-button');
          deleteButton.addEventListener('click', () => {
            taskList.removeChild(taskElement);
            saveTasks();
          });
          taskElement.appendChild(deleteButton);
  
          taskList.appendChild(taskElement);
        });
      });
    }
  
    // タスクの保存処理
    function saveTasks() {
      const projects = document.querySelectorAll('.project');
      const savedTasks = {};
  
      projects.forEach(project => {
        const projectId = project.querySelector('h2').textContent;
        const taskList = project.querySelector('.task-list');
        const tasks = Array.from(taskList.querySelectorAll('li')).map(task => task.textContent);
        savedTasks[projectId] = tasks;
      });
  
      localStorage.setItem('tasks', JSON.stringify(savedTasks));
    }
  });