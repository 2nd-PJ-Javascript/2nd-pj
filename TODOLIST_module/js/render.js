import globalObject from "./global.js";
import { $todoListUl } from "./dom.js";

//========= 함수 정의 영역 ========//

// 로컬 스토리지에 todos배열 저장해두기
function saveTodos() {
  localStorage.setItem('todoList', JSON.stringify(globalObject.todos));
}

// 로컬 스토리에서 todos 불러와서 렌더링
export function loadTodos() {
  const todosJson = localStorage.getItem('todoList');
  if (todosJson) {
    globalObject.todos = JSON.parse(todosJson);
  }
  renderTodos();
}

// todos배열을 화면에 렌더링해주는 함수
export function renderTodos() {
  // 0. 기존 내용 전부 삭제하기
  $todoListUl.innerHTML = '';

  // 1. todos를 반복한다.
  globalObject.todos.forEach((todo) => {
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