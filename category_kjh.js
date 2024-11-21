const $dateContainer = document.querySelector('.datesC');

// 카테고리 저장 함수
function saveCategory(categoryData) {
  const savedCategories = JSON.parse(localStorage.getItem('Category'))|| [];
  savedCategories.push(categoryData);
  localStorage.setItem('Category', JSON.stringify(savedCategories));
}

// 카테고리 로드 함수
function loadCategories() {
  const savedCategories = JSON.parse(localStorage.getItem('Category'));

  savedCategories.forEach((categoryData) => {
    const { title, category, start, end } = categoryData;

    // 시작일 기준으로 해당 날짜를 찾음
    const targetDate = document.querySelector(`.dateC[data-date="${start}"]`);
    if (targetDate) {
      // 데이터셋에 값 설정
      targetDate.dataset.category = category;
      targetDate.dataset.title = title;
      targetDate.dataset.startDate = start;
      targetDate.dataset.endDate = end;

      if(targetDate.dataset.category==="family"){
        targetDate.style.borderBottom ="10px solid pink";
      }else if(targetDate.dataset.category === "study_hobby"){
        targetDate.style.borderBottom ="10px solid yellow";
      }else if(targetDate.dataset.category === "travel"){
        targetDate.style.borderBottom ="10px solid green";
      }
    
      // UI 업데이트
      targetDate.innerHTML = `
        <strong>${title}</strong><br>
        <small>${start}${end ? ` ~ ${end}` : ''}</small>
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

    if(startDate > endDate){
      alert('종료일은 시작일보다 빠를 수 없습니다') 
      return;
    }
   
  
    $targetDate.dataset.category = category;
    $targetDate.dataset.title = title;
    $targetDate.dataset.startDate = startDate;
    $targetDate.dataset.endDate = endDate;
    if(startDate === endDate){
      $targetDate.innerHTML = `
      <strong>${title}</strong><br>
      <small>${startDate}</small>
    `;
    }else{
      $targetDate.innerHTML = `
      <strong>${title}</strong><br>
      <small>${startDate}${endDate ? ` ~ ${endDate}` : ''}</small>
    `;
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
