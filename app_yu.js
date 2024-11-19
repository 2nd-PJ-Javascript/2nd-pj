
// const $days = document.querySelector('.days')


// $days.forEach(day => {
//     const $newDiv = document.createElement('div');
//     $newDiv.classList.add('day');
//     $newDiv.textContent = day[i+1];
// });

const year = 2024;
const month = 11;
const daysInMonth = new Date(year, month, 0).getDate();
const startDay = new Date(year, month-1 , 1).getDay();

const $days = document.querySelector('.days');

for (let i = 0; i< startDay; i++){
    const $emptyDiv = document.createElement('div');
    $emptyDiv.classList.add('day', 'empty'); 
    $days.appendChild($emptyDiv);
}

for (let day = 1; day <= daysInMonth; day++){
    const $newDiv = document.createElement('div');
    $newDiv.classList.add('day');
    $newDiv.textContent = day;
    $days.appendChild($newDiv);
}