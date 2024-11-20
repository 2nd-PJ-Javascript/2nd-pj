const $date = document.querySelector('.datesC');
const $submit =document.querySelector('.submit');


// 날짜 클릭 시 모달 표시
$date.addEventListener('click', (e) => {
  if (!e.target.matches('.dateC')) return; // 날짜가 아닌 곳 클릭 시 무시
  
  // 모달 동적으로 생성
  const $modalWrapper = document.createElement('div');
  
  // 오버레이 생성
  const $overlay = document.createElement('div');
  $overlay.id = 'modal-overlay';
  
  // 모달과 오버레이를 함께 추가
  $modalWrapper.classList.add('modal-wrapper');
  $modalWrapper.innerHTML = `
    <div class="schedule-manager">
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
        <!-- 시작 종료 선택 -->
     <div class="date-select">
    <label for='start'>시작일</label>
    <input type="date" id='start'>
  </div>

  <div class="date-select">
    <label for='end'>종료일</label>
    <input type="date" id='end'>
  </div>
        <!-- 저장 버튼 -->
        <button type="submit" class="submit">저장</button>
      </form>
    </div>
  `;
  
  // body에 모달과 오버레이를 추가
  document.body.appendChild($overlay); // 오버레이 추가
  document.body.appendChild($modalWrapper); // 모달 추가

  // 모달 표시
  $overlay.style.display = 'block';
  $modalWrapper.querySelector('.schedule-manager').style.display = 'block';
  document.body.classList.add('modal-open'); // 스크롤 비활성화

  // 오버레이 클릭 시 모달 닫기
  $overlay.addEventListener('click', () => {
    closeModal($modalWrapper, $overlay);
  });
});  //$date이벤트 리스너 종료




// 모달 닫기 함수
function closeModal($modalWrapper, $overlay) {
  if ($modalWrapper) {
    $modalWrapper.remove(); // 모달 제거
    $overlay.remove(); // 오버레이 제거
    document.body.classList.remove('modal-open'); // 스크롤 활성화
  }
}


