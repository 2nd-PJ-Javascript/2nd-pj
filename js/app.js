//========= 전역 변수 영역 ========//

// 현재 수정모드에 들어갔는지 여부
let isEnterMode = false;

// 서버와 통신할 데이터
let todos = [
  {
    id: '1',
    text: '장보기',
    done: true,
  },
  {
    id: '2',
    text: '점심 메뉴 정하기',
    done: false,
  },
  {
    id: '3',
    text: '게임하기',
    done: true,
  },
];

//========= DOM 가져오기 영역 ========//
const $todoListUl = document.querySelector('.todo-list');
const $addBtn = document.getElementById('add');
const $todoTextInput = document.getElementById('todo-text');

//========= 함수 정의 영역 ========//

// 로컬 스토리지에 todos배열 저장해두기
function saveTodos() {
  localStorage.setItem('todoList', JSON.stringify(todos));
}

// 로컬 스토리에서 todos 불러와서 렌더링
function loadTodos() {
  const todosJson = localStorage.getItem('todoList');
  if (todosJson) {
    todos = JSON.parse(todosJson);
  }
  renderTodos();
}

// todos배열을 화면에 렌더링해주는 함수
function renderTodos() {
  // 0. 기존 내용 전부 삭제하기
  $todoListUl.innerHTML = '';

  // 1. todos를 반복한다.
  todos.forEach(todo => {
    // 2. li태그를 생성한다.
    const $li = document.createElement('li');
    // 3. li태그에 들어갈 속성들을 설정한다.
    $li.classList.add('todo-list-item');
    $li.dataset.id = todo.id;
    // 4. li태그의 자식 태그들을 한번에 삽입한다.
    $li.innerHTML = `
      <label class="checkbox">
        <input type="checkbox">
        <span class="text">${todo.text}</span>
      </label>
      <div class="modify"><span class="lnr lnr-undo"></span></div>
      <div class="remove"><span class="lnr lnr-cross-circle"></span></div>
      <div class="openModal"><span class="lnr lnr-list"></span></div>

    `;
    // 5. 이미 완료된 할 일은 체크처리하기 
    const $checkbox = $li.querySelector('input[type=checkbox]');
    $checkbox.checked = todo.done;

    // 6. 체크된 체크박스에 스타일 적용하기
    if ($checkbox.checked) {
      $checkbox.parentElement.classList.add('checked');
    }

    // 7. ul에 li 추가하기
    $todoListUl.append($li);

    // 로컬스토리지에 저장
    saveTodos();
  });
}

//========= 이벤트 핸들러(이벤트가 실행될 때 호출되는 함수) 정의 영역 ========//
function todoInsertHandler(e) {
  // form안에 있는 버튼은 기본적으로 서버에 정보를 제출한다.
  // 그래서 자동 새로고침이 일어나기 때문에 이를 방지해야 함
  e.preventDefault();
  // console.log('add clicked!');

  // 1. 입력한 텍스트를 읽어옴
  const inputText = $todoTextInput.value;
  // 2. 해당 텍스트로 todo객체를 생성해야 함
  const newTodo = {
    id: String(Math.random()),
    text: inputText,
    done: false
  };
  // 3. 생성된 객체를 todos배열에 추가
  todos.push(newTodo);
  
  // 4. 배열을 리렌더링
  renderTodos();

  // 5. 후속 처리 (인풋 입력값 비우기)
  $todoTextInput.value = '';
}

// 삭제 클릭 핸들러
function todoRemoveHandler(e) {
  if (!e.target.matches('.remove span')) return;

  // 1. 클릭한 삭제버튼을 감싸고 있는 li태그를 제거해야 함.
  // 삭제버튼을 감싸는 li를 찾아야 함.
  const $targetLi = e.target.closest('.todo-list-item');

  // 2. 배열에서 해당 데이터를 날려야 함
  // - 날릴 데이터를 특정해야 함 : 배열 안을 탐색해서 찾아야 함
  // 인덱스를 찾아야 함. -> 태그에 들어있는 id값을 찾아내야 함
  const dataId = $targetLi.dataset.id;

  todos = todos.filter(todo => dataId !== todo.id);

  // 배열 리렌더링
  renderTodos();
  
}

// 할 일 완료 체크 처리
function todoDoneHandler(e) {
  if (!e.target.matches('.checkbox input[type=checkbox]')) return;

  // 배열에서 클릭한 타겟의 근처 li태그를 찾아서
  const $targetLi = e.target.closest('.todo-list-item');
  // 데이터 아이디를 확보한 후
  const dataId = $targetLi.dataset.id;
  // 그 아이디로 배열에 접근해서 해당 객체를 찾아 
  // done프로퍼티값을 반대로 수정함
  const todo = todos.find(todo => todo.id === dataId);
  todo.done = !todo.done;

  // 리렌더링
  renderTodos();
}

// 수정 모드 진입 이벤트 핸들러
function todoEnterModifyModeHandler(e) {
  if (isEnterMode || !e.target.matches('.modify span.lnr-undo')) return;

  isEnterMode = true;
  /*
    1. span.text를 input.modify-input으로 교체
     - 클릭한 버튼 근처에 있는 span.text를 탐색
     - input태그를 type=text로 생성하여 클래스를 부여
     - 태그를 교체함
    2. 수정 아이콘 교체
  */
  const $textSpan = e.target
    .closest('li.todo-list-item')
    .querySelector('span.text');
  
  const $newInput = document.createElement('input');
  $newInput.setAttribute('type', 'text');
  $newInput.classList.add('modify-input');
  // 기존 텍스트 가져오기
  $newInput.value = $textSpan.textContent;
  
  const $label = $textSpan.parentElement;
  $label.replaceChild($newInput, $textSpan);
  
  // 아이콘 교체 -> span.lnr-undo의 클래스만 교체하면된다.
  setTimeout(() => { 
    e.target.classList.replace('lnr-undo', 'lnr-checkmark-circle');
  }, 0);
}

// 수정 완료 처리
function todoModifyHandler(e) {
  
  if (!e.target.matches('.modify span.lnr-checkmark-circle')) return;
  /*
    1. 배열에 접근해서 text프로퍼티를 새로운 값으로 수정
    - 클릭한 태그 근처에 있는 data-id를 확보
    - data-id로 배열을 탐색하여 id가 일치하는 객체를 가져온다
    - input의 새로운 입력값을 읽어온다
    - 객체의 text프로퍼티를 수정한다.
    2. 배열 리렌더링
  */
  const $li = e.target.closest('.todo-list-item');
  const dataId = $li.dataset.id;
  const foundTodo = todos.find(todo => todo.id === dataId);
  const $textInput = $li.querySelector('.modify-input');
  const newText = $textInput.value;
  
  foundTodo.text = newText;

  renderTodos();

  isEnterMode = false;
  
}

function todoModalHandler(e) {
  // 정확한 셀렉터를 확인하고 수정
  if (!e.target.matches('.openModal span.lnr-list')) return;

  console.log('Modal 버튼 클릭:', e.target);
}


//========= 이벤트 핸들러 등록 영역 ========//

// 할 일 추가 기능
$addBtn.addEventListener('click', todoInsertHandler);
// 할 일 삭제 기능
$todoListUl.addEventListener('click', todoRemoveHandler);
// 할 일 완료 체크 기능
$todoListUl.addEventListener('click', todoDoneHandler);
// 할 일 수정모드 진입 기능
$todoListUl.addEventListener('click', todoEnterModifyModeHandler);
// 수정 완료 기능
$todoListUl.addEventListener('click', todoModifyHandler);
// 모달 날짜 기능
$todoListUl.addEventListener('click', todoModalHandler);
//========= 코드 실행 영역 ========//

/*
  - todos배열에 있는 객체들을 화면에 그려야 함
*/
loadTodos();
const makeCalendar = (date) => {
  // 현재 연도와 월 받아오기
  const currentYear = new Date(date).getFullYear();
  const currentMonth = new Date(date).getMonth() + 1;
  // 첫날 요일 구하기

  const firstDay = new Date(date.setDate(1)).getDay();
  //마지막 날짜 구하기

  const lastDay = new Date(currentYear, currentMonth, 0).getDate();

  const limitDay = firstDay + lastDay;
  const nextDay = Math.ceil(limitDay / 7) * 7;

  let htmlDummy = '';
// 한달 전 날짜 표시하기
  for (let i = 0; i < firstDay; i++) {
    htmlDummy += `<div class="noColor"></div>`;
  }
// 이번 달 날짜 표시하기
  for (let i = 1; i <= lastDay; i++) {    
    htmlDummy += `<div>${i}</div>`;
  }

  for (let i = limitDay; i < nextDay; i++) {
    htmlDummy += `<div class="noColor"></div>`;
  }

  document.querySelector(`.dateBoard`).innerHTML = htmlDummy;
  document.querySelector(`.dateTitle`).innerText = `${currentYear}년 ${currentMonth}월`;
}


const date = new Date();

makeCalendar(date);

// 이전달 이동
document.querySelector(`.prevDay`).onclick = () => {
makeCalendar(new Date(date.setMonth(date.getMonth() - 1)));
}

// 다음달 이동
document.querySelector(`.nextDay`).onclick = () => {
makeCalendar(new Date(date.setMonth(date.getMonth() + 1)));
}

// 날짜 클릭 리스너 이벤트










// 날짜 클릭 리스너 이벤트

