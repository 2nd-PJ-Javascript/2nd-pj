const $dateContainer = document.querySelector('.datesC');

/// 카테고리별 색상 반환 함수
function getCategoryColor(category) {
  switch (category) {
    case "family":
      return "pink";
    case "study_hobby":
      return "yellow";
    case "travel":
      return "green";
    default:
      return "gray"; // 기본 색상
  }
}

/// 날짜 범위 내 모든 날짜에 색상 설정 함수
function setCategoryColorsInRange(startDate, endDate, category) {
  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const dateString = currentDate.toISOString().split("T")[0];
    const targetDate = document.querySelector(`.dateC[data-date="${dateString}"]`);

    if (targetDate) {
      // 색상 추가
      let colorContainer = targetDate.querySelector('.color-container');
      if (!colorContainer) {
        colorContainer = document.createElement('div');
        colorContainer.classList.add('color-container');
        targetDate.appendChild(colorContainer);
        targetDate.style.position = 'relative';
      }

      const existingColorBar = colorContainer.querySelector(`.color-bar[data-category="${category}"]`);
      if (!existingColorBar) {
        const colorBar = document.createElement('div');
        colorBar.classList.add('color-bar');
        colorBar.dataset.category = category;
        colorBar.style.backgroundColor = getCategoryColor(category);
        colorBar.style.height = '5px';
        colorBar.style.width = '100%';
        colorBar.style.marginTop = '2px';
        colorContainer.appendChild(colorBar);
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }
}

/// 카테고리 저장 함수
function saveCategory(categoryData) {
  const savedCategories = JSON.parse(localStorage.getItem('Category')) || [];
  savedCategories.push(categoryData);
  localStorage.setItem('Category', JSON.stringify(savedCategories));
}

/// 카테고리 로드 함수
function loadCategories() {
  const savedCategories = JSON.parse(localStorage.getItem('Category')) || [];

  savedCategories.forEach((categoryData) => {
    const { title, category, start, end } = categoryData;

    // 날짜 범위 내 색상 및 UI 갱신
    setCategoryColorsInRange(start, end, category);

    // 시작 날짜에 제목 및 일정 추가
    const startTargetDate = document.querySelector(`.dateC[data-date="${start}"]`);
    if (startTargetDate) {
      let scheduleList = startTargetDate.querySelector('.schedule-list');
      if (!scheduleList) {
        scheduleList = document.createElement('ul');
        scheduleList.classList.add('schedule-list');
        startTargetDate.appendChild(scheduleList);
      }

      const scheduleItem = document.createElement('li');
      scheduleItem.classList.add('schedule-item');
      scheduleItem.style.borderLeft = `5px solid ${getCategoryColor(category)}`;
      scheduleItem.textContent = title;
      scheduleList.appendChild(scheduleItem);
    }
  });
}

// 날짜 클릭 시 모달 표시
$dateContainer.addEventListener('click', (e) => {
  if (!e.target.matches('.dateC')) return;

  const $targetDate = e.target;
  const $clickedDate = $targetDate.dataset.date;

  const $modalWrapper = document.createElement('div');
  const $overlay = document.createElement('div');
  $overlay.id = 'modal-overlay';

  $modalWrapper.classList.add('modal-wrapper');
  $modalWrapper.innerHTML = `
    <div class="schedule-manager">
      <h1>일정 관리</h1>
      <form>
        <div class="form-group">
          <label>카테고리</label>
          <div class="category-options">
            <label>
              <input type="radio" name="category" value="family" required> 가족 행사<p class="festival">(분홍줄)</p>
            </label>
            <label>
              <input type="radio" name="category" value="study_hobby"> 공부 및 취미<p class="study">(노란줄)</p>
            </label>
            <label>
              <input type="radio" name="category" value="travel"> 여행<p class="travel">(초록줄)</p>
            </label>
          </div>
        </div>
        <div class="form-group">
          <label for="title">일정 제목</label>
          <input type="text" id="title" name="title" placeholder="일정 제목을 입력하세요" required>
        </div>
        <div class="date-select">
          <label for="start">시작일</label>
          <input type="date" value="${$clickedDate}" id="start" required readonly>
        </div>
        <div class="date-select">
          <label for="end">종료일</label>
          <input type="date" id="end" required>
        </div>
        <button type="submit" class="submit">저장</button>
      </form>
    </div>
  `;

  document.body.appendChild($overlay);
  document.body.appendChild($modalWrapper);

  $overlay.style.display = 'block';
  $modalWrapper.querySelector('.schedule-manager').style.display = 'block';
  document.body.classList.add('modal-open');

  const $form = $modalWrapper.querySelector('form');
  $form.addEventListener('submit', (e) => {
    e.preventDefault();

    const category = $form.category.value;
    const title = $form.title.value;
    const startDate = $form.start.value;
    const endDate = $form.end.value;

    if (startDate > endDate) {
      alert('종료일은 시작일보다 빠를 수 없습니다');
      return;
    }

    // 날짜 범위 내 모든 날짜를 업데이트
    setCategoryColorsInRange(startDate, endDate, category);

    // 시작일 데이터 및 UI 업데이트
    const startTargetDate = document.querySelector(`.dateC[data-date="${startDate}"]`);
    if (startTargetDate) {
      let scheduleList = startTargetDate.querySelector('.schedule-list');
      if (!scheduleList) {
        scheduleList = document.createElement('ul');
        scheduleList.classList.add('schedule-list');
        startTargetDate.appendChild(scheduleList);
      }

      const scheduleItem = document.createElement('li');
      scheduleItem.classList.add('schedule-item');
      scheduleItem.style.borderLeft = `5px solid ${getCategoryColor(category)}`;
      scheduleItem.textContent = title;
      scheduleList.appendChild(scheduleItem);
    }

    const newCategory = {
      id: String(Math.random()),
      title,
      category,
      start: startDate,
      end: endDate,
    };

    saveCategory(newCategory);

    closeModal($modalWrapper, $overlay);
  });

  $overlay.addEventListener('click', () => {
    closeModal($modalWrapper, $overlay);
  });
});

// 모달 닫기 함수
function closeModal($modalWrapper, $overlay) {
  if ($modalWrapper) {
    $modalWrapper.remove();
    $overlay.remove();
    document.body.classList.remove('modal-open');
  }
}

// 페이지 로드 시 데이터 초기화
window.addEventListener('DOMContentLoaded', () => {
  loadCategories();
});
