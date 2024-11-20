const $date = document.querySelector('.datesC');
const overlay = document.getElementById('modal-overlay');

// 날짜 클릭 시 모달 표시
$date.addEventListener('click', (e) => {
  if (!e.target.matches('.dateC')) return; // 날짜가 아닌 곳 클릭 시 무시
  
  // 모달 동적으로 생성
  const $modal = document.createElement('div');
  $modal.classList.add('schedule-manager');
  $modal.innerHTML = `
    <h1>일정 관리</h1>
    <form>
      <!-- 카테고리 선택 -->
      <div class="form-group">
        <label>카테고리</label>
        <div class="category-options">
          <label>
            <input type="radio" name="category" value="family" required> 가족 행사
          </label>
          <label>
            <input type="radio" name="category" value="study_hobby"> 공부 및 취미
          </label>
          <label>
            <input type="radio" name="category" value="travel"> 여행
          </label>
        </div>
      </div>
      <!-- 일정 제목 -->
      <div class="form-group">
        <label for="title">일정 제목</label>
        <input type="text" id="title" name="title" placeholder="일정 제목을 입력하세요" required>
      </div>
      <!-- 날짜 선택 -->
      <div class="form-group">
        <label for="date">날짜</label>
        <input type="date" id="date" name="date" required>
      </div>
      <!-- 저장 버튼 -->
      <button type="submit">저장</button>
    </form>
  `;

  // body에 추가
  document.body.appendChild($modal);

  // 모달 표시
  $modal.style.display = 'block';
  document.body.classList.add('modal-open'); // 스크롤 비활성화
});

// 모달 닫기 함수
function closeModal() {
  const modal = document.querySelector('.schedule-manager');
  if (modal) {
    modal.style.display = 'none';
    overlay.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
}


