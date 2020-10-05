let $game = document.querySelector('.game')
let $start = document.querySelector('#start');


function show($el) {
    $el.classList.remove('hide');
}

function hide($el) {
    $el.classList.add('hide');
}


// создание элементов внутри обертки
for (let i = 1; i < 101; i++) {
    let excel = document.createElement('div');
    $game.appendChild(excel);
    excel.classList.add('excel');
}
let excel = document.querySelectorAll('.excel');
let x = 1;
let y = 10;
// присвоение элементам координат
for (let i = 0; i < excel.length; i++) {
    if (x > 10) {
        x = 1;
        y--;
    }
    excel[i].setAttribute('posX', x);
    excel[i].setAttribute('posY', y);
    x++;
}


// генерация начальных координат змейки
function generateSnakeHeader() {
    let posX = Math.round(Math.random() * (10 - 3) + 3);
    let posY = Math.round(Math.random() * (10 - 1) + 1);
    return [posX, posY]
}

let coordinates = generateSnakeHeader(); // массив с координатами головы

// начальная змейка
let snakeBody;

function generateSnakeStart() {
    snakeBody = [document.querySelector(`[posX = '${coordinates[0]}'][posY = '${coordinates[1]}']`),
        document.querySelector(`[posX = '${coordinates[0] - 1}'][posY = '${coordinates[1]}']`),
        document.querySelector(`[posX = '${coordinates[0] - 2}'][posY = '${coordinates[1]}']`)];

    for (let i = 0; i < snakeBody.length; i++) {
        snakeBody[i].classList.add('snakeBody')
    }

    snakeBody[0].classList.add('head');
}


let mouse;

function createMouse() {
    function generateMouse() {
        let posX = Math.round(Math.random() * (10 - 1) + 1);
        let posY = Math.round(Math.random() * (10 - 1) + 1);
        return [posX, posY]
    }

    let mouseCoordinates = generateMouse();
    mouse = document.querySelector(`[posX = '${mouseCoordinates[0]}'][posY = '${mouseCoordinates[1]}']`);


    while (mouse.classList.contains('snakeBody')) {
        let mouseCoordinates = generateMouse();
        mouse = document.querySelector(`[posX = '${mouseCoordinates[0]}'][posY = '${mouseCoordinates[1]}']`);
    }

    mouse.classList.add('mouse');
}


let direction = 'right';
let steps = false;


let score = 0;
let result = document.querySelector('#result');
let result_game = document.querySelector('#result-g');
result.textContent = `${score}`;
result_game.textContent = `${score}`;


function move() {
    // координаты головы змейки
    let snakeCoordinates = [snakeBody[0].getAttribute('posX'), snakeBody[0].getAttribute('posY')];
    // удаляем класс головы
    snakeBody[0].classList.remove('head');
    // удаляем класс змейки у хвоста
    snakeBody[snakeBody.length - 1].classList.remove('snakeBody');
    // удаляем хвост у массива
    snakeBody.pop();
    // добавляем в массив на первое место ячейку в зависимости от направления движения
    if (direction === 'right') {
        if (snakeCoordinates[0] < 10) {
            snakeBody.unshift(document.querySelector(`[posX = '${+snakeCoordinates[0] + 1}'][posY = '${snakeCoordinates[1]}']`));
        } else {
            snakeBody.unshift(document.querySelector(`[posX = '1'][posY = '${snakeCoordinates[1]}']`));
        }
    } else if (direction === 'left') {
        if (snakeCoordinates[0] > 1) {
            snakeBody.unshift(document.querySelector(`[posX = '${+snakeCoordinates[0] - 1}'][posY = '${snakeCoordinates[1]}']`));
        } else {
            snakeBody.unshift(document.querySelector(`[posX = '10'][posY = '${snakeCoordinates[1]}']`));
        }
    } else if (direction === 'up') {
        if (snakeCoordinates[1] < 10) {
            snakeBody.unshift(document.querySelector(`[posX = '${+snakeCoordinates[0]}'][posY = '${+snakeCoordinates[1] + 1}']`));
        } else {
            snakeBody.unshift(document.querySelector(`[posX = '${+snakeCoordinates[0]}'][posY = '1']`));
        }
    } else if (direction === 'down') {
        if (snakeCoordinates[1] > 1) {
            snakeBody.unshift(document.querySelector(`[posX = '${+snakeCoordinates[0]}'][posY = '${+snakeCoordinates[1] - 1}']`));
        } else {
            snakeBody.unshift(document.querySelector(`[posX = '${+snakeCoordinates[0]}'][posY = '10']`));
        }
    }
    // добавляем класс головы первому элементу
    snakeBody[0].classList.add('head');

    // если координаты головы и координаты еды совпали
    if (snakeBody[0].getAttribute('posX') === mouse.getAttribute('posX') &&
        snakeBody[0].getAttribute('posY') === mouse.getAttribute('posY')) {
        // удаляем класс мыши (еды)
        mouse.classList.remove('mouse');
        // находим координаты хвоста
        let a = snakeBody[snakeBody.length - 1].getAttribute('posX');
        let b = snakeBody[snakeBody.length - 1].getAttribute('posY');
        // добавляем в конец массива элемент который дублирует хвост
        snakeBody.push(document.querySelector(`[posX = '${a}'][posY = '${b}']`));
        setTimeout(() => {
            createMouse()
        },0);
        score++;
        result.textContent = `${score}`;
        result_game.textContent = `${score}`;
    }

    if (snakeBody.length > 30) {
        clearInterval(interval);
        interval = setInterval(move, 100);
    } else if (snakeBody.length > 25){
        clearInterval(interval);
        interval = setInterval(move, 130);
    } else if (snakeBody.length > 20){
        clearInterval(interval);
        interval = setInterval(move, 170);
    } else if (snakeBody.length > 15){
        clearInterval(interval);
        interval = setInterval(move, 200);
    } else if (snakeBody.length > 10){
        clearInterval(interval);
        interval = setInterval(move, 240);
    } else if (snakeBody.length > 5){
        clearInterval(interval);
        interval = setInterval(move, 270);
    }

    // СТОЛКНОВЕНИЕ
    if (snakeBody[0].classList.contains('snakeBody')) {
        clearInterval(interval);
        snakeBody[0].classList.add('dead');
        direction = 'right';
        setTimeout(() => {
            for (let i = 0; i < excel.length; i++) {
                excel[i].classList.remove('snakeBody')
                excel[i].classList.remove('mouse')
                excel[i].classList.remove('head')
                excel[i].classList.remove('dead')
            }
            show($start);
            hide(document.querySelector('#result-header'));
            show(document.querySelector('#result-game'));
        }, 1000);
    }
    // добавляем всем элементам массива класс змеи
    for (let i = 0; i < snakeBody.length; i++) {
        snakeBody[i].classList.add('snakeBody')
    }

    steps = true

}

let interval;


window.addEventListener('keydown', function (e) {
    if (steps === true) {
        if (e.keyCode === 37 && direction !== 'right') {
            if (direction === 'left') {
                move()
            }
            direction = 'left';
            steps = false;
        } else if (e.keyCode === 38 && direction !== 'down') {
            if (direction === 'up') {
                move()
            }
            direction = 'up';
            steps = false;
        } else if (e.keyCode === 39 && direction !== 'left') {
            if (direction === 'right') {
                move()
            }
            direction = 'right';
            steps = false;
        } else if (e.keyCode === 40 && direction !== 'up') {
            if (direction === 'down') {
                move()
            }
            direction = 'down';
            steps = false;
        }
    }
});


$start.addEventListener('click', function () {
    score = 0;
    result.textContent = `${score}`;
    hide($start);
    show(document.querySelector('#result-header'));
    hide(document.querySelector('#result-game'));
    generateSnakeStart();
    createMouse();
    interval = setInterval(move, 300);
});








