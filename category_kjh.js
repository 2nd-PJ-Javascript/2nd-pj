const $dateContainer = document.querySelector('.datesC');

/// 카테고리별 색상 설정 함수
function setCategoryColor(targetDate) {
  
  if (!targetDate.dataset.category) return;

  switch (targetDate.dataset.category) {
    case "family":
      targetDate.style.borderBottom = "10px solid pink";
      break;
    case "study_hobby":
      targetDate.style.borderBottom = "10px solid yellow";
      break;
    case "travel":
      targetDate.style.borderBottom = "10px solid green";
      break;
    default:
      targetDate.style.borderBottom = "none"; // 기본 스타일
  }

  
}

/// 날짜 범위 내 모든 날짜에 색상 설정 함수
function setCategoryColorsInRange(startDate, endDate, category) {
  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    // 현재 날짜를 yyyy-mm-dd 형식으로 변환
    const dateString = currentDate.toISOString().split("T")[0];
    const targetDate = document.querySelector(`.dateC[data-date="${dateString}"]`);

    if (targetDate) {
      // 데이터셋 및 색상 적용
      targetDate.dataset.category = category;
      setCategoryColor(targetDate); // 색상 설정
    }

    // 다음 날짜로 이동
    currentDate.setDate(currentDate.getDate() + 1);
  }
}

// 카테고리 저장 함수
function saveCategory(categoryData) {
  const savedCategories = JSON.parse(localStorage.getItem('Category')) || [];
  savedCategories.push(categoryData);
  localStorage.setItem('Category', JSON.stringify(savedCategories));
}

// 카테고리 로드 함수
function loadCategories() {
  const savedCategories = JSON.parse(localStorage.getItem('Category')) || [];

  savedCategories.forEach((categoryData) => {
    const { title, category, start, end } = categoryData;

    // 날짜 범위 내 색상 및 UI 갱신
    setCategoryColorsInRange(start, end, category);

    // 시작 날짜에만 제목 표시
    const targetDate = document.querySelector(`.dateC[data-date="${start}"]`);
    if (targetDate) {
      targetDate.dataset.category = category;
      targetDate.dataset.title = title;
      targetDate.dataset.startDate = start;
      targetDate.dataset.endDate = end;

      targetDate.innerHTML = `
        <div class="date-label">${targetDate.dataset.date.split("-")[2]}</div>
        <strong>${title}</strong><br>
        <small>${start} ${end && start !== end ? `~ ${end}` : ''}</small>
      `;
    }
  });
}

// 날짜 클릭 시 모달 표시
$dateContainer.addEventListener('click', (e) => {
  if (!e.target.matches('.dateC')) return;

  const $targetDate = e.target; // 클릭된 날짜 버튼 참조
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
      startTargetDate.dataset.category = category;
      startTargetDate.dataset.title = title;
      startTargetDate.dataset.startDate = startDate;
      startTargetDate.dataset.endDate = endDate;

      startTargetDate.innerHTML = `
        <div class="date-label">${startTargetDate.dataset.date.split("-")[2]}</div>
        <strong>${title}</strong><br>
        <small>${startDate} ${endDate && startDate !== endDate ? `~ ${endDate}` : ''}</small>
      `;
    }

    // 새 데이터 로컬스토리지에 저장
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
