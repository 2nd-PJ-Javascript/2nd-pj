 // 전역 변수
 let currentDate = new Date();
 let currentYear = currentDate.getFullYear(); // 현재 연도
 let currentMonth = currentDate.getMonth(); // 현재 월 (0부터 시작)
 const datesContainer = document.querySelector(".datesC");
 const yearText = document.getElementById("yearText");
 const monthText = document.getElementById("monthText");
 const modal = document.getElementById("modal");
 const titleInput = document.getElementById("titleInput");
 const contentInput = document.getElementById("contentInput");
 const saveBtn = document.getElementById("saveBtn");
 const colorOptions = document.querySelectorAll(".color-option");
 let selectedDate = null;
 let selectedColor = "#ff6b6b";
 const mouseFollowX = document.getElementById("mouseFollowX");
 let tempSelectedDate = null; // 임시로 선택된 날짜
 // 오버레이 동적 생성
 const modalOverlay = document.createElement("div");
 modalOverlay.classList.add("modal-overlay");
 document.body.appendChild(modalOverlay);
 modalOverlay.addEventListener("click", () => {
   // modal.style.display = "none"; // 모달 닫기
   // modalOverlay.classList.remove("active"); // 오버레이 비활성화
   closeModal();
 });

 function openModal() {
   modal.style.display = "flex"; // 모달 열기
   modalOverlay.classList.add("active"); // 오버레이 활성화
   mouseFollowX.classList.remove("hidden"); // X 활성화
 }
 // 모달 닫기 함수 수정
 function closeModal() {
   modal.style.display = "none"; // 모달 닫기
   modalOverlay.classList.remove("active"); // 오버레이 비활성화
   mouseFollowX.classList.remove("active"); // X의 애니메이션 클래스 제거
   mouseFollowX.classList.add("hidden"); // X 숨기기
   console.log("모달 닫힘!");
 }

 // 슬라이더 요소 및 뷰포트 왼쪽 10% 영역 생성
 const slider = document.getElementById("slider");
 const viewportZone = document.createElement("div");
 viewportZone.className = "viewport-zone";
 document.body.appendChild(viewportZone);

 // 마우스가 뷰포트 왼쪽 15% 영역에 들어가면 슬라이더 표시
 viewportZone.addEventListener("mouseenter", () => {
   slider.classList.add("active");
 });

 // 슬라이더 클릭 시 모달 닫기
 slider.addEventListener("click", () => {
   if (modal.style.display === "flex") {
     closeModal(); // 모달 닫기
   }
 });

 // 마우스가 슬라이더를 떠나면 슬라이더 숨김
 slider.addEventListener("mouseleave", () => {
   slider.classList.remove("active");
 });

 // 로컬 스토리지에서 데이터 로드
 function loadEvents() {
   return JSON.parse(localStorage.getItem("calendarEvents")) || {};
 }

 // 로컬 스토리지에 데이터 저장
 function saveEvents(events) {
   localStorage.setItem("calendarEvents", JSON.stringify(events));
 }

 function saveTheme(theme) {
   localStorage.setItem("theme", JSON.stringify(theme));
 }
 function loadTheme() {
   const storedTheme = localStorage.getItem("theme");
   return storedTheme
     ? JSON.parse(storedTheme)
     : { primary: "#007bff", secondary: "#00d4ff" }; // 기본 색상
 }

 // 달력 생성
 function generateCalendar(year, month) {
   const events = loadEvents();
   const theme = loadTheme(); // 저장된 테마 불러오기
   const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
   const daysInMonth = new Date(year, month + 1, 0).getDate();
   const firstDay = new Date(year, month, 1).getDay();

   datesContainer.innerHTML = "";

   for (let i = 0; i < firstDay; i++) {
     datesContainer.appendChild(document.createElement("div"));
   }

   for (let day = 1; day <= daysInMonth; day++) {
     const dateDiv = document.createElement("div");
     dateDiv.classList.add("dateC");
     dateDiv.textContent = day;

     const currentDay = new Date(year, month, day).getDay(); // 0: 일요일, 6: 토요일

     // 일요일 빨간색, 토요일 파란색
     if (currentDay === 0) {
       dateDiv.style.color = "red";
     } else if (currentDay === 6) {
       dateDiv.style.color = "blue";
     }

     // 이벤트가 있을 경우 처리
     if (events[monthKey] && events[monthKey][day]) {
       const { title, color } = events[monthKey][day];
       const eventDiv = document.createElement("div");
       eventDiv.textContent = title;
       eventDiv.style.background = color || theme.primary;

       eventDiv.style.color = "#fff";
       eventDiv.style.padding = "5px";
       eventDiv.style.borderRadius = "5px";
       dateDiv.appendChild(eventDiv);
     }

     dateDiv.addEventListener("click", () => {
       tempSelectedDate = { year, month, day }; // 선택된 날짜를 임시 저장
       const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

       // 기존 제목과 내용을 입력 필드에 표시
       titleInput.value = events[monthKey]?.[day]?.title || "";
       contentInput.value = events[monthKey]?.[day]?.content || "";
       selectedColor = events[monthKey]?.[day]?.color || "#ff6b6b"; // 기본 색상

       openModal(); // 모달 열기
     });

     datesContainer.appendChild(dateDiv);
   }

   // 새롭게 렌더링된 날짜 요소들에 hover 색상 적용
   setHoverColor(theme.primary);
 }
 // 색상 선택 이벤트 리스너 수정
 colorOptions.forEach((option) => {
   option.addEventListener("click", (e) => {
     selectedColor = e.target.dataset.color;

     const events = loadEvents();

     // 선택된 날짜가 있을 경우, 해당 날짜에 색상 저장
     if (selectedDate) {
       const { year, month, day } = selectedDate;
       const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

       if (!events[monthKey]) events[monthKey] = {};
       if (!events[monthKey][day]) events[monthKey][day] = {};

       events[monthKey][day].color = selectedColor;

       saveEvents(events);
     }
     updateSlider(); // 슬라이더 업데이트
     generateCalendar(currentYear, currentMonth); // 캘린더 다시 생성
   });
 });

 let tempSelectedColor = null; // 임시 저장된 색상

 // 저장 버튼 클릭
 saveBtn.addEventListener("click", () => {
   if (!tempSelectedDate) {
     alert("날짜를 선택해주세요.");
     return;
   }

   const events = loadEvents(); // 기존 이벤트 로드
   selectedDate = { ...tempSelectedDate }; // 임시 선택된 날짜를 실제로 저장

   const { year, month, day } = selectedDate; // 선택된 날짜
   const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`; // 키 생성

   if (!events[monthKey]) events[monthKey] = {}; // 월 데이터 초기화
   events[monthKey][day] = {
     title: titleInput.value,
     content: contentInput.value,
     color: selectedColor, // 저장 시 선택된 색상 적용
   };

   saveEvents(events); // 로컬 스토리지에 저장
   closeModal(); // 모달 닫기
   generateCalendar(currentYear, currentMonth); // 캘린더 다시 생성
   updateSlider(); // 슬라이더 즉시 업데이트
 });

 function updateSlider() {
   const events = loadEvents(); // 로컬 스토리지 데이터 로드
   const eventList = document.getElementById("eventList");

   eventList.innerHTML = ""; // 초기화

   // 날짜별 이벤트만 추가
   const sortedDateEvents = Object.entries(events)
     .flatMap(([monthKey, days]) =>
       Object.entries(days).map(([day, event]) => ({
         date: new Date(`${monthKey}-${day.padStart(2, "0")}`),
         monthKey,
         day,
         ...event,
       }))
     )
     .sort((a, b) => a.date - b.date);

   // 정렬된 이벤트로 슬라이더 항목 생성
   sortedDateEvents.forEach(({ monthKey, day, title, content, color }) => {
     createSliderItem(monthKey, day, title, content, color);
   });
 }

 // 슬라이더 아이템 생성 함수
 function createSliderItem(
   monthKey,
   day,
   title,
   content,
   color,
   isColorOnly = false
 ) {
   const eventList = document.getElementById("eventList");

   // 리스트 아이템 생성
   const listItem = document.createElement("li");
   listItem.style.display = "flex";
   listItem.style.alignItems = "center";
   listItem.style.padding = "10px";
   listItem.style.borderBottom = "1px solid #ddd";

   // 색상 점
   const colorDot = document.createElement("span");
   colorDot.style.width = "10px";
   colorDot.style.height = "10px";
   colorDot.style.borderRadius = "50%";
   colorDot.style.backgroundColor = color || "#000";
   colorDot.style.marginRight = "10px";

   // 텍스트 콘텐츠
   const textContent = document.createElement("div");
   textContent.style.display = "flex";
   textContent.style.flexDirection = "column";
   textContent.innerHTML = `
     <span>${
       isColorOnly
         ? monthKey
         : `${monthKey}-${String(day).padStart(2, "0")}`
     } | ${title || ""}</span>
     <span>
       <strong>내용:</strong> ${content || ""}
     </span>
   `;

   // 삭제 버튼
   const deleteButton = document.createElement("button");
   deleteButton.textContent = "삭제";
   deleteButton.style.marginLeft = "auto";
   deleteButton.style.padding = "5px 10px";
   deleteButton.style.backgroundColor = "#ff6b6b";
   deleteButton.style.border = "none";
   deleteButton.style.color = "#fff";
   deleteButton.style.borderRadius = "5px";
   deleteButton.style.cursor = "pointer";
   deleteButton.addEventListener("click", (e) => {
     e.stopPropagation();
     if (isColorOnly) {
       deleteColorEvent(day - 1); // 색상만 저장된 이벤트 삭제
     } else {
       deleteEvent(monthKey, day); // 날짜 이벤트 삭제
     }
   });

   // 텍스트 클릭 이벤트: 해당 날짜로 이동
   listItem.addEventListener("click", () => {
     const [year, month] = monthKey.split("-");
     currentYear = parseInt(year, 10); // 연도 갱신
     currentMonth = parseInt(month, 10) - 1; // 월 갱신 (0부터 시작)
     yearText.textContent = currentYear;
     monthText.textContent = currentMonth + 1;
     generateCalendar(currentYear, currentMonth);

     // 해당 날짜를 찾아 깜빡이는 애니메이션 적용
     setTimeout(() => {
       let targetDate = document.querySelector(
         `.datesC > .dateC:nth-child(${
           parseInt(day) + new Date(currentYear, currentMonth, 1).getDay()
         })`
       );
       if (targetDate) {
         // 동적으로 CSS 변수 설정
         targetDate.style.setProperty(
           "--blink-color",
           color || selectedColor
         );

         // 애니메이션 적용
         targetDate.classList.add("blink");

         // 일정 시간 후 클래스 제거
         setTimeout(() => targetDate.classList.remove("blink"), 1150);
       }
     }, 0);
   });

   // 리스트 구성
   listItem.appendChild(colorDot);
   listItem.appendChild(textContent);
   listItem.appendChild(deleteButton);

   eventList.appendChild(listItem);
 }

 // 색상만 저장된 이벤트 삭제 함수
 function deleteColorEvent(index) {
   const events = loadEvents();
   if (events.generalColorEvents && events.generalColorEvents[index]) {
     events.generalColorEvents.splice(index, 1); // 해당 색상 이벤트 삭제
     if (events.generalColorEvents.length === 0) {
       delete events.generalColorEvents; // 색상 이벤트가 모두 삭제되면 키 제거
     }
     saveEvents(events); // 업데이트된 데이터 저장
     updateSlider(); // 슬라이더 업데이트
   }
 }

 // 이벤트 삭제 함수
 function deleteEvent(monthKey, day) {
   const events = loadEvents();

   if (events[monthKey] && events[monthKey][day]) {
     delete events[monthKey][day]; // 해당 날짜 데이터 삭제
     if (Object.keys(events[monthKey]).length === 0) {
       delete events[monthKey]; // 월 데이터가 비었다면 삭제ㄴ
     }
     saveEvents(events); // 업데이트된 데이터를 저장

     updateSlider(); // 슬라이더 업데이트
     generateCalendar(currentYear, currentMonth); // 달력 즉시 업데이트
   }
 }

 function applyThemeToFocus() {
   // 테마를 다시 로드
   const theme = loadTheme();
   const primaryColor = theme.primary || "#007bff"; // 기본 primary 색상

   // 모든 입력 필드와 텍스트 영역에 대해 focus와 blur 이벤트 추가
   const inputs = document.querySelectorAll(
     ".modal input, .modal textarea"
   );

   inputs.forEach((input) => {
     // 기존 이벤트 제거 후 다시 추가
     input.removeEventListener("focus", handleFocus); // 기존 이벤트 제거
     input.removeEventListener("blur", handleBlur);

     // focus 이벤트
     input.addEventListener("focus", handleFocus);
     // blur 이벤트
     input.addEventListener("blur", handleBlur);
   });

   // Focus 이벤트 핸들러
   function handleFocus(event) {
     event.target.style.borderColor = primaryColor; // 테마 색상으로 테두리 설정
     event.target.style.boxShadow = `0 0 5px ${primaryColor}`; // 테마 색상으로 그림자 설정
   }

   // Blur 이벤트 핸들러
   function handleBlur(event) {
     event.target.style.borderColor = ""; // 초기화
     event.target.style.boxShadow = ""; // 초기화
   }
 }

 document.addEventListener("keydown", e => {
   console.log(e);
 });
 document.addEventListener("DOMContentLoaded", () => {
   applyThemeToFocus(); // 초기 테마 적용
   updateSlider(); // 슬라이더 초기화
   const colorButton = document.querySelector(".color-btn-corner");
   const colorContainer = document.getElementById("colorButtonContainer");
   const todayButton = document.querySelector(".today-btn-corner");
   const header = document.querySelector(".header");
   const body = document.body;
   const modalHeader = document.querySelector(".modal-header");
   const todayBtnCorner = document.querySelector(".today-btn-corner");
   selectedColor = getComputedStyle(todayButton).backgroundColor;

   // 마우스 이동 이벤트 수정
   document.addEventListener("mousemove", (e) => {
     const modalBounds = modal.getBoundingClientRect();
     const isOutsideModal =
       modal.style.display === "flex" &&
       (e.clientX < modalBounds.left ||
         e.clientX > modalBounds.right ||
         e.clientY < modalBounds.top ||
         e.clientY > modalBounds.bottom);

     const isInIgnoredArea =
       e.clientX > modalBounds.left + 20 && // 가로 조건 추가
       e.clientX < modalBounds.right - 20 &&
       e.clientY > modalBounds.bottom + 100; // 특정 하단 영역 제외

     if (isOutsideModal && !isInIgnoredArea) {
       mouseFollowX.style.left = `${e.pageX - 25}px`;
       mouseFollowX.style.top = `${e.pageY - 25}px`;
       mouseFollowX.classList.add("active");
     } else {
       mouseFollowX.classList.remove("active");
     }
   });
   // 로컬스토리지에서 테마 불러오기
   const theme = loadTheme();

   if (theme) {
     modalHeader.style.background = `linear-gradient(${theme.secondary}, ${theme.primary})`;
   }

   // 저장된 테마를 배경에 적용
   header.style.background = `linear-gradient(${theme.primary}, ${theme.secondary})`;
   body.style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
   todayButton.style.backgroundColor = theme.secondary;
   colorButton.style.backgroundColor = theme.primary;

   // 색상 배열 및 대응 쌍
   const colors = [
     { primary: "#ff7fbf", secondary: "#ffcce4" },
     { primary: "#c9366e", secondary: "#f4a6bc" },
     { primary: "#007bff", secondary: "#00d4ff" },
     { primary: "#36c991", secondary: "#a8e5d4" },
     { primary: "#a46ac8", secondary: "#d8bfee" },
   ];

   let isMouseInside = false; // 마우스가 내부에 있는지 확인

   // 색상 원 생성 함수
   function createColorCircles(button) {
     const rect = button.getBoundingClientRect(); // 버튼 위치 계산
     const centerX = rect.left + rect.width / 2 + window.scrollX - 360; // 버튼 중심 X
     const centerY = rect.top + rect.height / 2 + window.scrollY - 20; // 버튼 중심 Y
     colorContainer.style.pointerEvents = "auto"; // 클릭 가능하도록 설정

     // 기존 원 초기화
     colorContainer.innerHTML = "";

     colors.forEach((color, index) => {
       const colorCircle = document.createElement("button");
       colorCircle.className = "color-circle";
       colorCircle.style.backgroundColor = color.primary;

       // 각도를 00시~03시로 분배
       const angle = 90 - (index * 90) / (colors.length - 1); // 각도를 역순으로 설정
       const radians = (angle * Math.PI) / 180; // 각도를 라디안으로 변환
       const distance = 80; // 원의 거리

       // 초기 위치 버튼 중앙에 설정
       colorCircle.style.left = `${centerX}px`;
       colorCircle.style.top = `${centerY}px`;

       // 퍼질 위치 계산
       const targetX = centerX + distance * Math.cos(radians) - 35;
       const targetY = centerY - distance * Math.sin(radians) + 10; // Y는 위로 이동이므로 음수

       // 애니메이션 시작 시 위치 설정
       colorCircle.dataset.targetX = targetX - centerX;
       colorCircle.dataset.targetY = targetY - centerY;

       // 색상 버튼 클릭 이벤트
       colorCircle.addEventListener("click", () => {
         // 헤더 및 바디 배경 변경
         header.style.background = `linear-gradient(${color.primary}, ${color.secondary})`;
         modalHeader.style.background = `linear-gradient(${color.secondary}, ${color.primary})`;
         body.style.background = `linear-gradient(135deg, ${color.primary}, ${color.secondary})`;
         todayBtnCorner.style.background = `${color.secondary}`;
         colorButton.style.background = `${color.primary}`;
         saveTheme({ primary: color.primary, secondary: color.secondary }); // 저장된 테마 변경
         applyThemeToFocus(); // 테마 변경 후 focus 이벤트 재설정

         document.querySelectorAll(".dateC").forEach((dateC) => {
           dateC.addEventListener("mouseenter", () => {
             dateC.style.backgroundColor = `${color.primary}`; // 호버 시 색상 변경
             dateC.style.color = "white"; // 텍스트 색상 변경
             dateC.style.transform = "scale(1.05)"; // 크기 변경
           });

           dateC.addEventListener("mouseleave", () => {
             dateC.style.backgroundColor = "#f9f9f9"; // 기본 배경색 복원
             dateC.style.color = "black"; // 기본 텍스트 색상 복원
             dateC.style.transform = "scale(1)"; // 크기 복원
           });
         });

         colorButton.addEventListener("mouseenter", () => {
           colorButton.style.backgroundColor = `${color.secondary}`; // 호버 시 색상 변경
           colorButton.style.transform = "scale(1.2)"; // 크기 변경
         });

         colorButton.addEventListener("mouseleave", () => {
           colorButton.style.backgroundColor = `${color.primary}`; // 기본 색상 복원
           colorButton.style.transform = "scale(1)"; // 크기 복원
         });
         // 리스트 구성
         todayBtnCorner.addEventListener("mouseenter", () => {
           todayBtnCorner.style.backgroundColor = `${color.primary}`; // 호버 시 색상 변경
           todayBtnCorner.style.transform = "scale(1.2)"; // 크기 변경
         });

         todayBtnCorner.addEventListener("mouseleave", () => {
           todayBtnCorner.style.backgroundColor = `${color.secondary}`; // 기본 색상 복원
           todayBtnCorner.style.transform = "scale(1)"; // 크기 복원
         });

         // 색상만 저장하기 위한 로직
         const events = loadEvents();

         saveEvents(events); // 로컬스토리지에 저장
         updateSlider(); // 슬라이더 업데이트

         // 버튼 제거 효과
         gatherCircles();
       });

       colorContainer.appendChild(colorCircle);
     });
   }

   // 원을 퍼지면서 나타나게 하는 효과
   function spreadCircles() {
     const circles = colorContainer.querySelectorAll(".color-circle");
     circles.forEach((circle) => {
       circle.style.transform = `translate(${circle.dataset.targetX}px, ${circle.dataset.targetY}px) scale(1)`; // 퍼지기
       circle.style.opacity = "1"; // 투명도 조정
     });
   }

   // 원을 모으면서 사라지게 하는 효과
   function gatherCircles() {
     const circles = colorContainer.querySelectorAll(".color-circle");
     circles.forEach((circle) => {
       circle.style.transform = "translate(0, 0) scale(0)"; // 모이기
       circle.style.opacity = "0"; // 투명도 조정

       // 애니메이션 후 제거
       circle.addEventListener("transitionend", () => {
         circle.remove();
       });
     });
     colorContainer.style.pointerEvents = "none"; // 다시 클릭 방지
   }

   // 마우스 이벤트 처리
   function handleMouseEnter() {
     isMouseInside = true;
     createColorCircles(colorButton);
     setTimeout(() => spreadCircles(), 0);
   }

   function handleMouseLeave() {
     setTimeout(() => {
       if (!isMouseInside) gatherCircles();
     }, 100);
   }

   colorButton.addEventListener("mouseenter", handleMouseEnter);
   colorContainer.addEventListener(
     "mouseenter",
     () => (isMouseInside = true)
   );
   colorButton.addEventListener("mouseleave", handleMouseLeave);
   colorContainer.addEventListener("mouseleave", () => {
     isMouseInside = false;
     handleMouseLeave();
   });
 });

 function blinkDate(year, month, day, color = null, isToday = false) {
   setTimeout(() => {
     const firstDayOfWeek = new Date(year, month, 1).getDay();
     const targetDateIndex = day + firstDayOfWeek - 1;

     const targetDate = document.querySelector(
       `.datesC > .dateC:nth-child(${targetDateIndex + 1})`
     );

     if (targetDate) {
       // color가 없으면 selectedColor 또는 초기 Today 버튼 색상 사용
       const todayButton = document.querySelector(".today-btn-corner");
       const defaultColor = getComputedStyle(todayButton).backgroundColor;
       const blinkColor = color || selectedColor || defaultColor;

       // 깜빡임 색상 설정
       targetDate.style.setProperty("--blink-color", blinkColor);

       // hover 색상도 동기화
       setHoverColor(blinkColor);

       targetDate.classList.add("blink");

       // 일정 시간 후 깜빡임 클래스 제거
       setTimeout(() => {
         targetDate.classList.remove("blink");
       }, 1300);
     }
   }, 0);
 }
 function setHoverColor(color) {
   document.querySelectorAll(".dateC").forEach((dateC) => {
     dateC.style.setProperty("--hover-color", color);
   });
 }

 document
   .querySelector(".today-btn-corner")
   .addEventListener("click", () => {
     const today = new Date();
     currentYear = today.getFullYear();
     currentMonth = today.getMonth();
     const todayDate = today.getDate();

     yearText.textContent = currentYear;
     monthText.textContent = currentMonth + 1;

     updateCalendar();

     const todayButton = document.querySelector(".today-btn-corner");
     const defaultColor = getComputedStyle(todayButton).backgroundColor;

     // 깜빡임과 hover 색상 동기화
     blinkDate(currentYear, currentMonth, todayDate, defaultColor, true);
   });

 document
   .querySelector(".today-btn-corner")
   .addEventListener("click", () => {
     const today = new Date();
     currentYear = today.getFullYear();
     currentMonth = today.getMonth();
     const todayDate = today.getDate();

     yearText.textContent = currentYear;
     monthText.textContent = currentMonth + 1;

     updateCalendar();

     // 기본 색상 처리
     const todayButton = document.querySelector(".today-btn-corner");
     const defaultColor = getComputedStyle(todayButton).backgroundColor;

     blinkDate(currentYear, currentMonth, todayDate, defaultColor, true);
   });

 // 캘린더 업데이트
 function updateCalendar() {
   currentYear = parseInt(yearText.textContent, 10);
   currentMonth = parseInt(monthText.textContent, 10) - 1;
   generateCalendar(currentYear, currentMonth);
 }

 // 초기화
 updateCalendar();

 document
   .querySelector(".today-btn-corner")
   .addEventListener("click", () => {
     const today = new Date();
     currentYear = today.getFullYear();
     currentMonth = today.getMonth();
     yearText.textContent = currentYear;
     monthText.textContent = currentMonth + 1;
     updateCalendar();
   });
 generateCalendar(currentYear, currentMonth);

 // 연도/월 텍스트 변경 이벤트
 yearText.addEventListener("blur", updateCalendar);
 monthText.addEventListener("blur", updateCalendar);

 yearText.addEventListener("keydown", (e) => {
   if (e.key === "Enter") {
     e.preventDefault();
     yearText.blur();
     monthText.focus();
   }
 });

 monthText.addEventListener("keydown", (e) => {
   if (e.key === "Enter") {
     e.preventDefault();
     monthText.blur();
   }
 });

 // 유효성 검증
 function validateYear() {
   if (
     !currentYear ||
     isNaN(currentYear) ||
     currentYear < 1 ||
     currentYear > 9999
   ) {
     yearText.textContent = "2024"; // 기본값 복원
     currentYear = 2024;
   }
   generateCalendar(currentYear, currentMonth); // 달력 갱신
 }

 function validateMonth() {
   if (
     !currentMonth ||
     isNaN(currentMonth) ||
     currentMonth < 0 ||
     currentMonth > 12
   ) {
     monthText.textContent = "11"; // 기본값 복원
     currentMonth = 10;
   }
   generateCalendar(currentYear, currentMonth); // 달력 갱신
 }

 // yearText 클릭 시 기본값을 없앰
 yearText.addEventListener("focus", () => {
   yearText.textContent = ""; // 빈칸으로 설정
 });

 // monthText 클릭 시 기본값을 없앰
 monthText.addEventListener("focus", () => {
   monthText.textContent = ""; // 빈칸으로 설정
 });

 // yearText: 숫자만 허용 및 최대 4자 제한
 yearText.addEventListener("input", () => {
   yearText.textContent = yearText.textContent.replace(/[^0-9]/g, ""); // 숫자만 허용
   if (yearText.textContent.length > 4) {
     yearText.textContent = yearText.textContent.slice(0, 4); // 최대 4자 제한
   }
 });

 // monthText: 숫자만 허용 및 최대 2자 제한
 monthText.addEventListener("input", () => {
   monthText.textContent = monthText.textContent.replace(/[^0-9]/g, ""); // 숫자만 허용
   if (monthText.textContent.length > 2) {
     monthText.textContent = monthText.textContent.slice(0, 2); // 최대 2자 제한
   }
 });

 // focus 해제 시 유효성 검증 및 달력 갱신
 yearText.addEventListener("blur", () => {
   currentYear = parseInt(yearText.textContent, 10); // 현재 값을 숫자로 변환
   validateYear(); // 유효성 검증 및 달력 갱신
 });

 monthText.addEventListener("blur", () => {
   currentMonth = parseInt(monthText.textContent, 10); // 현재 값을 숫자로 변환
   validateMonth(); // 유효성 검증 및 달력 갱신
 });

 // 이전/다음 버튼
 document.getElementById("prev").addEventListener("click", () => {
   currentMonth--;
   if (currentMonth < 0) {
     currentMonth = 11;
     currentYear--;
   }
   yearText.textContent = currentYear;
   monthText.textContent = currentMonth + 1; // padStart 제거
   updateCalendar();
 });

 document.getElementById("next").addEventListener("click", () => {
   currentMonth++;
   if (currentMonth > 11) {
     currentMonth = 0;
     currentYear++;
   }
   yearText.textContent = currentYear;
   monthText.textContent = currentMonth + 1; // padStart 제거
   updateCalendar();
 });

 // Today 버튼 기능
 document
   .querySelector(".today-btn-corner")
   .addEventListener("click", () => {
     const today = new Date();
     currentYear = today.getFullYear();
     currentMonth = today.getMonth(); // 현재 월 (0부터 시작)

     yearText.textContent = currentYear; // 연도 업데이트
     monthText.textContent = currentMonth + 1; // 월 업데이트 (0부터 시작하므로 +1)

     updateCalendar(); // 캘린더 업데이트
   });

 // 초기화
 updateCalendar();