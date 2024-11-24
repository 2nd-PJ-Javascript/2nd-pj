const $dropdownButton = document.querySelector(".dropdown-toggle");
const $dropdownMenu = document.querySelector(".dropdown-menu");
const $startDayIsMonday = document.querySelector(".start-day-is-monday");
const $datesOfWeek = document.querySelector(".dates-of-week");
const $datesC = document.querySelector(".datesC");
const $header = document.querySelector(".header");

let year = 2024;
let month = 11;

let lastDateOfTheMonth = new Date(year, month, 0); //2024-11-30: 해당 연월의 마지막 날 출력
//console.log(daysInMonth.toLocaleString('ko-KR',{timeZone: 'Asia/Seoul'}));
let lastDate = lastDateOfTheMonth.getDate(); //마지막 날만 따로 저장
let firstDateOfTheMonth = new Date(year, month - 1, 1).getDay(); //1일 요일 따로 저장
//console.log(firstDateOfTheMonth.toLocaleString('ko-KR',{timeZone: 'Asia/Seoul'})); //5

if (firstDateOfTheMonth === 1) {
  //1일이 월요일이면 빈 디브 1개 생성
  const $emptyDiv = document.createElement("div");
  $emptyDiv.textContent = "";
  $datesC.append($emptyDiv);
} else if (firstDateOfTheMonth === 2) {
  //1일이 화요일이면 빈 디브 2개 생성
  for (let i = 0; i < 2; i++) {
    $emptyDiv = document.createElement("div");
    $emptyDiv.textContent = "";
    $datesC.append($emptyDiv);
  }
} else if (firstDateOfTheMonth === 3) {
  //1일이 수요일이면 빈 디브 3개 생성
  for (let i = 0; i < 3; i++) {
    $emptyDiv = document.createElement("div");
    $emptyDiv.textContent = "";
    $datesC.append($emptyDiv);
  }
} else if (firstDateOfTheMonth === 4) {
  //1일이 목요일이면 빈 디브 4개 생성
  for (let i = 0; i < 4; i++) {
    $emptyDiv = document.createElement("div");
    $emptyDiv.textContent = "";
    $datesC.append($emptyDiv);
  }
} else if (firstDateOfTheMonth === 5) {
  //1일이 금요일이면 빈 디브 5개 생성
  for (let i = 0; i < 5; i++) {
    $emptyDiv = document.createElement("div");
    $emptyDiv.textContent = "";
    $datesC.append($emptyDiv);
  }
} else if (firstDateOfTheMonth === 6) {
  //1일이 토요일이면 빈 디브 6개 생성
  for (let i = 0; i < 6; i++) {
    $emptyDiv = document.createElement("div");
    $emptyDiv.textContent = "";
    $datesC.append($emptyDiv);
  }
}

for (let i = 1; i <= lastDate; i++) {
  //date디브 생성
  const $newDiv = document.createElement("div");
  $newDiv.classList.add("dateC");
  $newDiv.textContent = i;
  $datesC.append($newDiv);
}

//일주일 시작 요일 
$dropdownButton.addEventListener("click", function () {
  $dropdownMenu.classList.toggle("show");
});

$startDayIsMonday.addEventListener("click", function () {
  let temp = "";
  temp = $datesOfWeek.children[0].textContent;
  $datesOfWeek.children[0].textContent = $datesOfWeek.children[1].textContent;
  $datesOfWeek.children[1].textContent = $datesOfWeek.children[2].textContent;
  $datesOfWeek.children[2].textContent = $datesOfWeek.children[3].textContent;
  $datesOfWeek.children[3].textContent = $datesOfWeek.children[4].textContent;
  $datesOfWeek.children[4].textContent = $datesOfWeek.children[5].textContent;
  $datesOfWeek.children[5].textContent = $datesOfWeek.children[6].textContent;
  $datesOfWeek.children[6].textContent = temp;

  $datesC.children[0].remove();
});


//컬러 테마
document.querySelector('.colors').addEventListener('click', function(e){
  const target = e.target.closest('li');
  
})