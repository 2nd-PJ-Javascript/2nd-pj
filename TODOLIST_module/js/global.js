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

const globalObject = {
  isEnterMode: isEnterMode,
  todos: todos
};

export default globalObject;