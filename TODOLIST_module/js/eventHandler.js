import globalObject from "./global.js";
import { renderTodos } from "./render.js";
import { $todoTextInput } from "./dom.js";

const { isEnterMode } = globalObject;

//========= 이벤트 핸들러(이벤트가 실행될 때 호출되는 함수) 정의 영역 ========//
export function todoInsertHandler(e) {
  // form안에 있는 버튼은 기본적으로 서버에 정보를 제출한다.
  // 그래서 자동 새로고침이 일어나기 때문에 이를 방지해야 함
  e.preventDefault();
  console.log('add clicked!');

  // 1. 입력한 텍스트를 읽어옴
  const inputText = $todoTextInput.value;
  // 2. 해당 텍스트로 todo객체를 생성해야 함
  const newTodo = {
    id: String(Math.random()),
    text: inputText,
    done: false,
  };
  // 3. 생성된 객체를 todos배열에 추가
  globalObject.todos.push(newTodo);

  // 4. 배열을 리렌더링
  renderTodos();

  // 5. 후속 처리 (인풋 입력값 비우기)
  $todoTextInput.value = '';
}

// 삭제 클릭 핸들러
export function todoRemoveHandler(e) {
  console.log(e.target);
  
  if (!e.target.matches('.remove span')) return;

  // 1. 클릭한 삭제버튼을 감싸고 있는 li태그를 제거해야 함.
  // 삭제버튼을 감싸는 li를 찾아야 함.
  const $targetLi = e.target.closest('.todo-list-item');

  // 2. 배열에서 해당 데이터를 날려야 함
  // - 날릴 데이터를 특정해야 함 : 배열 안을 탐색해서 찾아야 함
  // 인덱스를 찾아야 함. -> 태그에 들어있는 id값을 찾아내야 함
  const dataId = $targetLi.dataset.id;

  globalObject.todos = globalObject.todos.filter((todo) => dataId !== todo.id);

  // 배열 리렌더링
  renderTodos();
}

// 할 일 완료 체크 처리
export function todoDoneHandler(e) {
  if (!e.target.matches('.checkbox input[type=checkbox]')) return;

  // 배열에서 클릭한 타겟의 근처 li태그를 찾아서
  const $targetLi = e.target.closest('.todo-list-item');
  // 데이터 아이디를 확보한 후
  const dataId = $targetLi.dataset.id;
  // 그 아이디로 배열에 접근해서 해당 객체를 찾아
  // done프로퍼티값을 반대로 수정함
  const todo = globalObject.todos.find((todo) => todo.id === dataId);
  todo.done = !todo.done;

  // 리렌더링
  renderTodos();
}

// 수정 모드 진입 이벤트 핸들러
export function todoEnterModifyModeHandler(e) {
  if (isEnterMode || !e.target.matches('.modify span.lnr-undo')) return;

  globalObject.isEnterMode = true;
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
export function todoModifyHandler(e) {
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
  const foundTodo = globalObject.todos.find((todo) => todo.id === dataId);
  const $textInput = $li.querySelector('.modify-input');
  const newText = $textInput.value;

  foundTodo.text = newText;

  renderTodos();

  globalObject.isEnterMode = false;
}