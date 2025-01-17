document.getElementById('createConference').onclick = function() {
    const backgroundInput = document.getElementById('background').files[0];
    const videoCount = parseInt(document.getElementById('videoCount').value);
    const videoInputs = document.getElementById('videos').files;
    const stopButton = document.getElementById('stoppingConference');


    if(videoCount > 3){
        alert("Вводить видео можно до 3 видео включительно.");
        return;
    }


    if (!backgroundInput || videoCount < 1 || videoInputs.length < videoCount) {
        alert("Пожалуйста, выберите фон и достаточное количество видео.");
        return;
    }

    const videoContainer = document.getElementById('videoContainer');
    const backgroundURL = URL.createObjectURL(backgroundInput);
    videoContainer.style.backgroundImage = `url(${backgroundURL})`;
    videoContainer.innerHTML = ''; // Очистить контейнер

    // Получаем высоту изображения
    const img = new Image();
    img.src = backgroundURL;
    img.onload = function() {
        const aspectRatio = img.width / img.height; // Получаем соотношение сторон
        const containerWidth = videoContainer.clientWidth; // Ширина контейнера
        const containerHeight = containerWidth / aspectRatio; // Высота по соотношению сторон

        videoContainer.style.height = `${containerHeight}px`; // Устанавливаем высоту контейнера

        for (let i = 0; i < videoCount; i++) {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(videoInputs[i]);
            video.autoplay = true;
            video.loop = true;
            video.style.position = 'absolute';
            video.style.top = '10%';
            video.style.left = `${i * 30 + 5}%`; // Уменьшаем видео по горизонтали
            video.controls = false; // Отключаем элементы управления

            //устанавливаем плашку текста
            const textBox = document.createElement('input');
            textBox.type = 'text';
            textBox.placeholder = `спикер ${i + 1}`;
            textBox.style.position = 'absolute';
            textBox.style.width = '25%';
            textBox.style.left = `${i * 30 + 5}%`;
            textBox.style.top = `${videoCount === 1 ? '60%' : `${10 + (i * 10)}%`}`;
            videoContainer.appendChild(textBox);

            //Устанавливаем позицию видео в зависимости от количества
            if(videoCount === 1) {
                video.style.top = '50%';
                video.style.left = '50%';
                video.style.transform = 'translate(-50%, -50%)';
                textBox.style.top = '70%';
                textBox.style.left = '50%';
                textBox.style.transform = 'translate(-50%, -50%)';
            }else if(videoCount === 2){
                video.style.top = '50%'; // Центрируем по вертикали
                video.style.left = `${i * 50 + 24}%`; // Располагаем по горизонтали с равными промежутками
                video.style.transform = 'translate(-50%, -50%)'; // Центрируем каждое видео
                textBox.style.top = '70%';
                textBox.style.left = `${i * 50 + 24}%`;
                textBox.style.transform = 'translate(-50%, -50%)';
            }else if (videoCount === 3){
                video.style.top = '50%'; // Центрируем по вертикали
                video.style.left = `${i * 33 + 16}%`; // Располагаем по горизонтали с равными промежутками
                video.style.transform = 'translate(-50%, -50%)'; // Центрируем каждое видео
                textBox.style.top = '70%';
                textBox.style.left = `${i * 33 + 16}%`;
                textBox.style.transform = 'translate(-50%, -50%)';
            }

            videoContainer.appendChild(video);

            //добавляем возможность двигать видео
            makeDraggable(video, videoContainer, textBox);
        }
    }

    // Добавляем обработчик события на кнопку
    stopButton.addEventListener("click", function() {
        // Скрываем все видео
        const videos = videoContainer.getElementsByTagName('video');
        for (let video of videos) {
            video.pause(); // Остановить воспроизведение
            video.style.display = 'none'; // Скрыть видео
        }
        
        // Создаем текст "Конференция завершена"
        const endMessage = document.createElement('div');
        endMessage.innerText = 'Конференция завершена';
        endMessage.style.position = 'absolute';
        endMessage.style.top = '50%';
        endMessage.style.left = '50%';
        endMessage.style.transform = 'translate(-50%, -50%)';
        endMessage.style.color = 'white';
        endMessage.style.backgroundColor = 'black';
        endMessage.style.padding = '20px';
        endMessage.style.borderRadius = '5px';
        endMessage.style.zIndex = '1000'; // Убедитесь, что текст будет сверху

        // Обнуляем размеры контейнера
        videoContainer.style.width = '90%';
        videoContainer.innerHTML = ''; // Очистить контейнер от видео и текстовых полей

        // Добавляем сообщение в контейнер
        videoContainer.appendChild(endMessage);
    });

};

//алгоритм Drag'n'Dropт(для перетаскивания)
function makeDraggable(element, container, textBox) {
    let isDragging = false;
    let offsetX, offsetY;

    element.onmousedown = function(e) {
        isDragging = true;
        const coords = getCoords(element);
        
        // Вычисляем смещение курсора относительно элемента
        offsetX = coords.left / 7; // Расстояние от левого края элемента
        offsetY = coords.top/ 2.5;   // Расстояние от верхнего края элемента

        // Устанавливаем начальные стили для элемента
        element.style.position = 'absolute';
        element.style.zIndex = 1000;

        function moveAt(e) {
            let newLeft = e.clientX - offsetX; // Новая позиция по X с учетом смещения
            let newTop = e.clientY - offsetY;   // Новая позиция по Y с учетом смещения

            const containerRect = container.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            // Вычисляем границы
            const leftBoundary = containerRect.left + elementRect.width/2.89;
            const rightBoundary = containerRect.right - elementRect.width/1.4; //право 
            const topBoundary = containerRect.top + elementRect.height / 8; // верх
            const bottomBoundary = containerRect.bottom - elementRect.height * 1.09; //нижняя граница

            // Проверка, чтобы новые координаты были внутри контейнера
            if (newLeft < leftBoundary) { // Левый край
                newLeft = leftBoundary;
            }
            if (newLeft > rightBoundary) { // Правый край
                newLeft = rightBoundary;
            }
            if (newTop < topBoundary) { // Верхний край
                newTop = topBoundary;
            }
            if (newTop > bottomBoundary) { // Нижний край
                newTop = bottomBoundary;
            }

            element.style.left = newLeft + 'px';
            element.style.top = newTop + 'px';

            if (textBox) {
                textBox.style.left = (newLeft - 4) + 'px';
                textBox.style.top = (newTop + elementRect.height/1.7) + 'px';
            }
        }

        document.onmousemove = function(e) {
            if (isDragging) {
                moveAt(e); // Перемещаем элемент
            }
        };

        document.onmouseup = function() {
            isDragging = false; // Завершаем перетаскивание
            document.onmousemove = null; // Убираем обработчик движения
            document.onmouseup = null; // Убираем обработчик отпускания кнопки
        };
    };

    function getCoords(elem) { //получеам координаты
        const box = elem.getBoundingClientRect();
        return {
            top: box.top + window.scrollY,
            left: box.left + window.scrollX
        };
    }
}