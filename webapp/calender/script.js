window.addEventListener('DOMContentLoaded', () => {
    const calendar = document.getElementById('calendar');
  
    // カレンダーの初期表示
    renderCalendar();
  
    function renderCalendar() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
  
      const prevMonthBtn = document.createElement('span');
      prevMonthBtn.classList.add('prev-month');
      prevMonthBtn.textContent = '<<';
  
      const nextMonthBtn = document.createElement('span');
      nextMonthBtn.classList.add('next-month');
      nextMonthBtn.textContent = '>>';
  
      const monthSelect = document.createElement('select');
      for (let i = 0; i < 12; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = getMonthName(i);
        monthSelect.appendChild(option);
      }
      monthSelect.selectedIndex = month;
  
      const yearSelect = document.createElement('select');
      for (let i = year - 10; i <= year + 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        yearSelect.appendChild(option);
      }
      yearSelect.selectedIndex = 10;
  
      const header = document.createElement('div');
      header.classList.add('calendar-header');
      header.appendChild(prevMonthBtn);
      header.appendChild(monthSelect);
      header.appendChild(yearSelect);
      header.appendChild(nextMonthBtn);
  
      const weekdays = document.createElement('div');
      weekdays.classList.add('calendar-weekdays');
      const weekdayNames = ['日', '月', '火', '水', '木', '金', '土'];
      weekdayNames.forEach(name => {
        const weekday = document.createElement('div');
        weekday.classList.add('weekday');
        weekday.textContent = name;
        weekdays.appendChild(weekday);
      });
  
      const days = document.createElement('div');
      days.classList.add('calendar-days');
  
      const calendarElement = document.createElement('div');
      calendarElement.appendChild(header);
      calendarElement.appendChild(weekdays);
      calendarElement.appendChild(days);
  
      calendar.innerHTML = '';
     続きのJavaScriptコード:
  
      calendar.appendChild(calendarElement);
  
      // イベントカレンダーの日付をクリックしたときの処理
      days.addEventListener('click', (event) => {
        if (event.target.classList.contains('day')) {
          const selectedDay = event.target.dataset.day;
          // 選択した日付に関連する処理を行う（例: モーダルを開く、詳細を表示するなど）
          console.log('選択された日付:', selectedDay);
        }
      });
  
      // 前月ボタンをクリックしたときの処理
      prevMonthBtn.addEventListener('click', () => {
        const selectedMonth = parseInt(monthSelect.value);
        const selectedYear = parseInt(yearSelect.value);
        const newDate = new Date(selectedYear, selectedMonth - 1, 1);
        monthSelect.selectedIndex = newDate.getMonth();
        yearSelect.selectedIndex = newDate.getFullYear() - (year - 10);
        renderCalendar();
      });
  
      // 次月ボタンをクリックしたときの処理
      nextMonthBtn.addEventListener('click', () => {
        const selectedMonth = parseInt(monthSelect.value);
        const selectedYear = parseInt(yearSelect.value);
        const newDate = new Date(selectedYear, selectedMonth + 1, 1);
        monthSelect.selectedIndex = newDate.getMonth();
        yearSelect.selectedIndex = newDate.getFullYear() - (year - 10);
        renderCalendar();
      });
  
      // 月または年が変更されたときの処理
      monthSelect.addEventListener('change', renderCalendar);
      yearSelect.addEventListener('change', renderCalendar);
  
      // カレンダーの日付を生成して表示する
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const numDays = lastDay.getDate();
  
      let dayOfWeek = firstDay.getDay(); // 0 (日曜日) から 6 (土曜日) までの数値
      if (dayOfWeek === 0) {
        dayOfWeek = 7; // 月曜日から始まるようにするため、0 を 7 に変換
      }
  
      // 前月の日数を計算
      const prevMonth = new Date(year, month - 1, 1);
      const numDaysPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).getDate();
      const numDaysPrevMonthToShow = dayOfWeek - 1;
      const prevMonthDays = Array.from({ length: numDaysPrevMonthToShow }, (_, i) => numDaysPrevMonth - numDaysPrevMonthToShow + i + 1);
  
      // 当月の日数を計算
      const currentMonthDays = Array.from({ length: numDays }, (_, i) => i + 1);
  
      // 翌月の日数を計算
      const numDaysNextMonthToShow = 42 - (numDaysPrevMonthToShow + numDays);
      const nextMonthDays = Array.from({ length: numDaysNextMonthToShow }, (_, i) => i + 1);
  
      // 日付を表示
      days.innerHTML = '';
      prevMonthDays.forEach(day => createDayElement(day, 'prev-month'));
      currentMonthDays.forEach(day => createDayElement(day, 'current-month'));
      nextMonthDays.forEach(day => createDayElement(day, 'next-month'));
  
      // 日付要素を作成して表示
      function createDayElement(day, className) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.classList.add(className);
        dayElement.textContent = day;
        dayElement.dataset.day = `${year}-${month + 1}-${day}`;
        days.appendChild(dayElement);
      }
    }
  
    // 月の名前を取得
    function getMonthName(month) {
      const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
      return monthNames[month];
    }
  });