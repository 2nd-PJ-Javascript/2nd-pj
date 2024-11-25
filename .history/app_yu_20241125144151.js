const $dropdownButton = document.querySelector(".dropdown-toggle");
const $dropdownMenu = document.querySelector(".dropdown-menu");
const $startDayIsMonday = document.querySelector(".start-day-is-monday");
const $startDayIsSunday = document.querySelector(".start-day-is-sunday");
const $datesOfWeek = document.querySelector(".dates-of-week");
const $datesC = document.querySelector(".datesC");
const $header = document.querySelector(".header");
const $themeColor1 = document.querySelector(".theme-color1");
const $themeColor2 = document.querySelector(".theme-color2");
const $themeColor3 = document.querySelector(".theme-color3");
const $themeColor4 = document.querySelector(".theme-color4");

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
  temp = $datesOfWeek.children[0].textContent; //일요일을 임시 변수에 담아 놓고
  $datesOfWeek.children[0].textContent = $datesOfWeek.children[1].textContent; //일요알 자리에 월요일 오고
  $datesOfWeek.children[1].textContent = $datesOfWeek.children[2].textContent; //월요일 자리에 화요일 오고
  $datesOfWeek.children[2].textContent = $datesOfWeek.children[3].textContent; //화요일 자리에 수요일 오고
  $datesOfWeek.children[3].textContent = $datesOfWeek.children[4].textContent; //수요일 자리에 목요일 오고
  $datesOfWeek.children[4].textContent = $datesOfWeek.children[5].textContent; //목요일 자리에 금요일 오고
  $datesOfWeek.children[5].textContent = $datesOfWeek.children[6].textContent; //금요일 자리에 토요일 오고
  $datesOfWeek.children[6].textContent = temp; //토요일 자리에 일요일 오고

  $datesC.children[0].remove(); //빈 디브 하나 삭제
},{once:true}); //이벤트 한 번만 실행


$startDayIsSunday.addEventListener("click", function(){
  let temp='';
  temp = $datesOfWeek.children[0].textContent; //일요일을 임시 변수에 담아 놓고
  $datesOfWeek.children[0].textContent = $datesOfWeek.children[6].textContent; //일요일 자리에 토요일 오고
  $datesOfWeek.children[6].textContent = $datesOfWeek.children[5].textContent; //토요일 자리에 금요일 오고
  $datesOfWeek.children[5].textContent = $datesOfWeek.children[4].textContent; //금요일 자리에 목요일 오고
  $datesOfWeek.children[4].textContent = $datesOfWeek.children[3].textContent; //목요일 자리에 수요일 오고
  $datesOfWeek.children[3].textContent = $datesOfWeek.children[2].textContent; //수요일 자리에 화요일 오고
  $datesOfWeek.children[2].textContent = $datesOfWeek.children[1].textContent; //화요일 자리에 월요일 오고
  $datesOfWeek.children[1].textContent = temp; //월요일 자리에 일요일 오고

  $emptyDiv = document.createElement("div");
    $emptyDiv.textContent = "";
    $datesC.append($emptyDiv);
},{once: true})



//컬러 테마
document.querySelector('.colors').addEventListener('click', function(e){
  const target = e.target.closest('li');
  if(target === $themeColor1){ //첫번째 테마 클릭 시 
    $header.setAttribute("style", "background: pink;"); //헤더 배경색 핑크색으로 변경
    document.body.setAttribute("style","background: white;"); //바디 배경색 흰색으로 변경
  } else if(target === $themeColor2) { //두번째 테마 클릭 시
    $header.setAttribute("style", "background: beige;"); //헤더 배경색 베이지색으로 변경
    document.body.setAttribute("style","background: rgba(77, 55, 15, 0.747);"); //바디 배경색 갈색으로 변경
  } else if(target === $themeColor3) {
    $header.setAttribute("style", "background: rgb(231, 231, 195);"); //헤더 배경색 레몬색으로 변경
    document.body.setAttribute("style","background: rgb(219, 218, 218);"); //바디 배경색 밝은 회색으로 변경
  } else{
    $header.setAttribute("style", "background: rgb(127, 221, 170);"); //헤더 배경색 민트색으로 변경
    document.body.setAttribute("style","background: rgb(79, 88, 88);"); //바디 배경색 다크 녹색으로 변경
  }
})