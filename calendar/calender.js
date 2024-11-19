class Schedule {

}

const Calendar = {
  
  // currentYear: new Date().getFullYear(),
  // currentMonth: new Date().getMonth(),

  init() {
    this.$calendar = document.getElementById('calendar-grid');
    const today = new Date();
    this.showDates(today.getFullYear(), today.getMonth() + 1);
  },

  showDates(y, m) {
    // $calendar이 null인지 확인
    if (!this.$calendar) {
      console.error('Calendar grid element is not initialized.');
      return;
    }

    // 이전 날짜들 삭제
    const before = document.querySelectorAll('.date');
    before.forEach((v) => v.remove());

    const firstDay = this.getFirstDay(y, m);
    const lastDate = this.getLastDate(y, m);
    const prevLastDate = this.getLastDate(y, m - 1); // 이전 달의 마지막 날짜 계산

    for (let i = -firstDay + 1; i <= lastDate; i++) {
      const day =
        i < 1 
          ? prevLastDate + i // 이전 달 날짜
          : i; // 현재 달 날짜

      const isHidden = i < 1 ? "hidden-date" : "";
      this.$calendar.innerHTML += `
      <div class="date ${isHidden}">
        <p>${day}</p>
      </div>`;
    }
  },
  

  getFirstDay(y, m) {
    const date = new Date(`${y}-${m}-01`);
    return date.getDay(); // 요일을 반환 (0: 일요일, 6: 토요일)
  },

  getLastDate(y, m) {
    const date = new Date(y, m, 0);
    return date.getDate(); // 해당 월의 마지막 날짜를 반환
  },

};

document.addEventListener('DOMContentLoaded', () => Calendar.init());

// // 월 표시
    // const currentMonth = document.getElementById('current-month');
    // currentMonth.textContent = `${y}.${m}`;

    // // 날짜 그리기
    // const firstDay = this.getFirstDay(y, m);
    // const lastDate = this.getLastDate(y, m);
    
    // 첫 번째 주의 공백을 맞추기 위한 반복문
    // let dayCount = 1;
    //   for (let i = 0; i < 6; i++) {
    //     for (let j = 0; j < 7; j++) {
    //       const dateElement = document.createElement('div');
    //       dateElement.classList.add('date');
        
    //       if (i === 0 && j < firstDay) {
    //         dateElement.classList.add('empty');
    //       } else if (dayCount <= lastDate) {
    //         dateElement.innerHTML = `<p>${dayCount}</p>`;
    //         dateElement.addEventListener('click', () => this.handleDateClick(dayCount));
    //         dayCount++;
    //       }
    //       Calendar.$calendar.appendChild(dateElement);
    //     }
    //   }
    // },
