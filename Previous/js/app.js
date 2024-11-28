// const calendar = {
//   {year: 2024,
//   'JAN' :{
//     month: 'JAN',
//     day: 31
//   }}
// }


const posts = {
  count: 3,
  postList: [
    {
      id: 1,
      title: '',
      replies: [
        {
          id: 1,
          contemt: ''
        }
      ],
      hashtags: ['a', 'b', 'c'],
      regDate: '2024-01-01',
      author: {
        name: '',
        
      } ,
      
    },
    {
      id: 2,
      title: '',
      replies: [{},{},{}],
      hashtags: ['a', 'b', 'c']
    },
    {
      id: 2,
      title: '',
      replies: [{},{},{}],
      hashtags: ['a', 'b', 'c']
    }
  ]
};

const todos = 
  {
    '20240101': {
      category: 'emergency',
      todoList: [
        {title: '', done:false, id:1},
        {title: '', done:false, id:1},
        {title: '', done:false, id:1},
        {title: '', done:false, id:1},
      ]},
    '20240102':  [
        {title: '', done:false, id:1},
        {title: '', done:false, id:1},
        {title: '', done:false, id:1},
        {title: '', done:false, id:1},
      ],
  }



todos['20240103'] = [];
const firsttodo = {title:'', done:false, id:5};
todos['20240103'].push(firsttodo)

console.log(todos);



initial();
function initial() {
const nowC = new Date();
let yearC = nowC.getFullYear();
let monthC = nowC.getMonth();
let dayC = nowC.getDate();


buttonClick();
function buttonClick() {
const $thisYear = document.getElementById('yearTop');
const $datesC = document.querySelector('.datesC');
const $thisMonth = document.getElementById('monthTop');
const $prev = document.querySelector('.prev');
const $next = document.querySelector('.next');

// const dateC = nowC.getDate();
// 연도 / 월 / 날짜 확인
// console.log(yearC);
// console.log(monthC); // 10
// console.log(dateC);
$thisYear.textContent = yearC

const datesInMonthLeapyear = [31, 29, 31, 30, 31, 30, // 윤년
                              31, 31, 30, 31, 30, 31];

const datesInMonthNormal = [31, 28, 31, 30, 31, 30,  // 평년
                            31, 31, 30, 31, 30, 31];

const month_EN = [
  "Jan", "Feb", "March", "April", "May", "June", 
  "July", "Aug", "Sep", "Oct", "Nov", "Dec"
];

$thisMonth.textContent = month_EN[monthC]
// console.log($thisMonth.textContent); // Nov
let currentMonth = $thisMonth.textContent;
let currentYear;
let currentDate;

if ( currentYear % 4 === 0 && currentYear % 100 !== 0 || currentYear % 400 === 0 ) { // 윤년이면
  const monthsToDaysLeapyear = {};
  month_EN.forEach((month, days) => {
  monthsToDaysLeapyear[month] = datesInMonthLeapyear[days];
});
if (currentMonth in monthsToDaysLeapyear) { // monthsToDaysLeapyear 객체 내 currentMonth인 key가 있다면
  currentDate = monthsToDaysLeapyear[currentMonth]; // monthsToDaysLeapyear 윤년의 date를 가져옴
  }
}

else { // 평년이면
  const monthsToDaysNormal = {};
  month_EN.forEach((month, days) => {
  monthsToDaysNormal[month] = datesInMonthNormal[days];
});
if (currentMonth in monthsToDaysNormal) { // monthsToDaysNormal 객체 내 currentMonth인 key가 있다면
    currentDate = monthsToDaysNormal[currentMonth]; // datesInMonthNormal 평년의 date를 가져옴
  }
}
// console.log(currentDate);


for(let i = 1; i <= currentDate; i++){
  const $div = document.createElement('div');
  $div.innerHTML = `<div class="dateC">${i}</div>`
  $datesC.append($div);
}
const $headerC = document.querySelector('.header');
$headerC.addEventListener('click', e => { 
   if (e.target.tagName !== 'BUTTON') {
    return;
  }
});

let isProcessing = false;

$prev.addEventListener('click', e => {
  if(isProcessing) {
    return;
  }
  isProcessing = true
  monthC--;
  if(monthC === -1)  {
    monthC = 11;
    yearC--;
  }
  $datesC.innerHTML = ``;
  buttonClick();
  console.log(monthC);
  console.log(yearC);
});

$next.addEventListener('click', e => {
  if(isProcessing) {
    return;
  }
  isProcessing = true        
  monthC++;
  if(monthC === 12 ) {
    monthC = 0;    
    yearC++;
  }
  $datesC.innerHTML = '';
  buttonClick();
  // console.log(monthC);
  // console.log(yearC);
});
}
}
const $datesC = document.querySelector('.datesC'); // ul 매월(월 요소)
const $today = document.querySelector('.today-btn-corner')
$today.addEventListener('click', e => {       
  $datesC.innerHTML = ``;
  initial();
//   const dateElements = document.querySelectorAll(".dateC"); // li 매일(요일 요소)
//   dateElements.forEach(el => {
//     // 날짜 텍스트가 오늘 날짜와 같으면 하이라이트 클래스 추가
//     if (parseInt(el.textContent) === dayC) {
//       el.classList.add("highlight");
//       // 1초 후 하이라이트 제거 (애니메이션 효과 종료)
//       setTimeout(() => {
//         el.classList.remove("highlight");
//       }, 1000);
//     }
// })
});