/* 날짜-아이콘 클릭 시 모달 창 띄우기
메인으로 버튼 클릭 시 모달 닫기 */
const modalBlogClose = document.querySelector(".back-to-main");
const blogModal = document.querySelector(".wrap");
var dateId = ""; //어떤 날짜인지 체크
// 블로그 모달창 전체 숨김
blogModal.style.display = "none";

const $diaryTitle = document.getElementById("diary-title");
const $diaryTextContent = document.getElementById("diary-text-content");
const $saveBtn = document.querySelector(".save");
const $deleteBtn = document.querySelectorAll(".delete");
const randomSentenseElement = document.querySelector(".good-word-bottom-sc");
const randomWriterElement = document.querySelector(".good-word-bottom-wr");

findData();
// 날짜 요소 처리
document.querySelectorAll(".dateC").forEach((date) => {
  // 기존 .dateC 클릭 이벤트 방지
  date.addEventListener("click", (e) => {
    e.stopPropagation(); // 기본 클릭 이벤트 중단
  });

  // writeIcon 추가
  const writeIcon = document.createElement("i");
  writeIcon.className = "fas fa-edit edit-icon";
  // writeIcon 클릭 이벤트 (0.5초 딜레이 추가)
  writeIcon.addEventListener("click", (e) => {
    e.stopPropagation(); // 부모 요소의 클릭 이벤트 중단
    dateId = date.id;
    loadData();
    // 0.5초 후 모달 열기
    setTimeout(() => {
      blogModal.style.display = "flex"; // 모달창 열기
    }, 500);
  });

  // .dateC 요소에 writeIcon 추가
  date.appendChild(writeIcon);
});

// "메인으로" 버튼 클릭 시 모달 닫기
modalBlogClose.addEventListener("click", (e) => {
  findData();
  blogModal.style.display = "none"; // 모달창 닫기
  location.reload();
  document.querySelectorAll(".edit-icon").forEach((icon) => {
    icon.style.transition = "color 0.3s ease"; // 다시 호버 효과 적용
  });

});

// 명언 배열
const $goodWords = [
  {
    sentense: "어제가 오늘을 너무 많이 차지하게 두지 마라.",
    writer: "윌 로저스",
  },
  {
    sentense: "성공은 작은 노력들이 반복될 때 찾아온다.",
    writer: "로버트 콜리어",
  },
  { sentense: "고통 없이는 얻는 것도 없다.", writer: "벤자민 프랭클린" },
  { sentense: "실패는 곧 배움이다.", writer: "존 맥스웰" },
  {
    sentense: "할 수 있다고 믿는 것이 성공의 첫 번째 비결이다.",
    writer: "노먼 빈센트 필",
  },
  { sentense: "사람은 자신의 생각대로 된다.", writer: "마하트마 간디" },
  { sentense: "가장 빠른 길은 꾸준함이다.", writer: "루이사 메이 올콧" },
  { sentense: "어려움은 기회다.", writer: "윈스턴 처칠" },
  {
    sentense: "큰 목표를 이루고 싶으면 작은 일부터 시작하라.",
    writer: "로버트 슐러",
  },
  {
    sentense: "꿈을 꾼다고 해서 현실이 되지 않는다. 행동해야 한다.",
    writer: "월트 디즈니",
  },
  { sentense: "멈추지 않으면 얼마나 느린지는 중요하지 않다.", writer: "공자" },
  { sentense: "오늘 할 수 있는 일에 최선을 다하라.", writer: "아브라함 링컨" },
  { sentense: "실패는 도전의 또 다른 이름이다.", writer: "알버트 아인슈타인" },
  { sentense: "지금이 가장 중요한 순간이다.", writer: "달라이 라마" },
];

// // 랜덤 명언 생성
function generateRandomQuote() {
  console.log("ㅇㅇㅇ");
  const randomIndex = Math.floor(Math.random() * $goodWords.length);
  const { sentense, writer } = $goodWords[randomIndex];
  console.log(sentense, writer);
  randomSentenseElement.innerHTML = sentense;
  randomWriterElement.innerHTML = writer;
}





//===============블로그 제목/ 글 작성 내용 저장 삭제 및 로드=================//

// 데이터 로드
function loadData() {
  generateRandomQuote();
  const $savedData = localStorage.getItem(`diaryData_${dateId}`); // diaryData 키로 JSON 데이터를 가져옵니다.
  if ($savedData) {
    const { title, content } = JSON.parse($savedData); // JSON 데이터를 객체로 변환
    if (title) $diaryTitle.value = title;
    if (content) $diaryTextContent.value = content;
  }
}
$saveBtn.addEventListener("click", (e) => {
  // 데이터 저장

  const data = {
    title: $diaryTitle.value.trim(),
    content: $diaryTextContent.value.trim(),
  };

  console.log(dateId);
  // localStorage.setItem(`diaryData_${parentId}`, JSON.stringify(data)); // JSON 데이터를 로컬 스토리지에 저장
  localStorage.setItem(`diaryData_${dateId}`, JSON.stringify(data)); // JSON 데이터를 로컬 스토리지에 저장

  alert("블로그가 저장되었습니다.");
  findData();
});


//데이터 삭제
$deleteBtn.forEach((btn) => {
  btn.addEventListener('click', () =>  {
    if (dateId) {
      // 선택된 날짜에 대한 로컬 스토리지 데이터 삭제
      localStorage.removeItem(`diaryData_${dateId}`);

      // 제목 및 내용 초기화
      $diaryTitle.value = "";
      $diaryTextContent.value = "";

      alert("블로그가 삭제되었습니다.");

      location.reload();
    }
  });
});


//localstorge에 데이터 있는지 확인(처음 렌더링 시 되지만 저장버튼 누를 시 변화 X, 새로고침시 생김(체크사항))
function findData() {
  for (let i = 1; i < 31; i++) {
    //전체 데이터 순회
    let data = localStorage.getItem(`diaryData_${i}`);
    if (data !== null) {
      //로컬스토리지에 데이터가 있다면
      let dateNode = document.getElementById(`${i}`); //해당 노드(날짜) 가져오기
      const hasDiv = dateNode.querySelector("div") !== null; //자식노드로 div 있는지 검사 (처음 화면 렌더링 시 실행되고, 저장버튼 누를 시 실행되는데 중복 체크 방지를 위해)
      // console.log(hasDiv);
      if (hasDiv) {
        //div가 있다면 return
        return;
      }
      //없다면
      let divNode = document.createElement("div");
      // let iconNode = document.createElement("i");
      divNode.innerHTML = "✔";
      dateNode.appendChild(divNode);
    }
  }
}

