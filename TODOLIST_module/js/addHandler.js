import { $todoListUl, $addBtn } from "./dom.js";
import {
  todoInsertHandler,
  todoDoneHandler,
  todoModifyHandler,
  todoRemoveHandler,
  todoEnterModifyModeHandler
} from "./eventHandler.js";
//========= 이벤트 핸들러 등록 영역 ========//


export function addAllHandler() {
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
}