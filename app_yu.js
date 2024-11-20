const $dropdownBtn = document.querySelector('.dropdown-toggle');
const $dropdownMenu = document.querySelector('.dropdown-menu');

//클릭 시 드롭다운 메뉴 열고 닫는 이벤트
$dropdownBtn.addEventListener('click', function () {
    $dropdownMenu.classList.toggle('show');
});


