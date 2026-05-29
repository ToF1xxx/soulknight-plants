document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".plant-link");
    const searchInput = document.getElementById("plant-search");
    const plantRows = document.querySelectorAll(".plant-row");

    // ==========================================================================
    // 1. ИСПРАВЛЕННАЯ ЛОГИКА ЖИВОГО ПОИСКА (Энциклопедия не пропадает)
    // ==========================================================================
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const searchText = e.target.value.toLowerCase().trim();

            plantRows.forEach(row => {
                const plantLink = row.querySelector(".plant-link");
                if (!plantLink) return;

                const plantName = plantLink.textContent.toLowerCase();

                if (plantName.includes(searchText)) {
                    row.style.display = "grid"; 
                } else {
                    row.style.display = "none"; 
                }
            });
        });
    }

    // ==========================================================================
    // 2. ПЛАВНЫЙ СКРОЛЛ И ЦВЕТНЫЕ ВСПЫШКИ РЕДКОСТИ КАРТОЧЕК
    // ==========================================================================
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); 
            
            const targetId = link.getAttribute("href");
            if (!targetId || !targetId.startsWith('#')) return;
            
            const targetBlock = document.querySelector(targetId);
            
            if (targetBlock) {
                document.querySelectorAll(".active-highlight").forEach(el => {
                    el.classList.remove("active-highlight");
                });

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            targetBlock.classList.add("active-highlight");
                            setTimeout(() => {
                                targetBlock.classList.remove("active-highlight");
                            }, 1500);
                            observer.disconnect();
                        }
                    });
                }, { root: null, threshold: 0.6 });

                observer.observe(targetBlock);
                targetBlock.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        });
    });

    // ==========================================================================
    // 3. МЯГКИЙ ДОГОНЯЮЩИЙ ПАРАЛЛАКС ДЛЯ ФОНА 14.PNG
    // ==========================================================================
    let currentY = 0; 
    let targetY = 0;  
    const speed = 0.2; 
    const ease = 0.1;  

    window.addEventListener("scroll", () => {
        targetY = window.scrollY * speed;
    });

    function animateBackground() {
        currentY += (targetY - currentY) * ease;
        document.body.style.setProperty('--scroll-y', `${currentY}px`);
        requestAnimationFrame(animateBackground);
    }
    animateBackground();

    // ==========================================================================
    // 4. ИНТЕРАКТИВНЫЙ КВЕСТ СТИХИЙ (Пасхалка с Посланницей)
    // ==========================================================================
    const fragments = document.querySelectorAll(".element-fragment");
    const envoy = document.getElementById("element-envoy");
    const dialogueBox = document.getElementById("dialogue-box");
    const dialogueTextField = document.getElementById("dialogue-text");

    let collectedCount = 0;
    // Список бонусных промокодов для Soul Knight
    const codes = ["SKGIFT", "SUPER5", "SKBACK", "DUOSHOU", "100000", "BYEBYE"];
    let dialogueStep = 0;
    let dialogueLines = [];

    fragments.forEach(f => {
        f.addEventListener("click", () => {
            if (f.classList.contains("collected")) return;
            
            f.classList.add("collected");
            collectedCount++;

            // Если кликнули по всем 4 кристаллам
            if (collectedCount === 4) {
                setTimeout(() => {
                    const randCode = codes[Math.floor(Math.random() * codes.length)];
                    
                    // Формируем реплики диалога под стиль ретро-RPG
                    dialogueLines = [
                        "Вы собрали все четыре скрытых фрагмента стихий...",
                        "Сила камней Огня, Льда, Молнии и Яда пробудила меня от долгого сна.",
                        "В награду за вашу внимательность я передам вам тайное знание.",
                        `Используйте этот промокод в меню игры: [ ${randCode} ]`,
                        "До встречи в подземельях Soul Knight! Да хранят вас стихии."
                    ];

                    // Активируем появление персонажа и окна диалога
                    envoy.classList.remove("hidden");
                    dialogueBox.classList.remove("hidden");
                    
                    // Блюрим задний фон сайта для контраста
                    document.querySelector(".game-container").classList.add("site-blur-active");
                    
                    // ЗАМОРАЖИВАЕМ КАМЕРУ (запрещаем двигать экраном)
                    document.body.classList.add("no-scroll");
                    
                    dialogueStep = 0;
                    showNext();
                }, 1200); // Небольшая пауза, пока исчезает последний кристалл
            }
        });
    });

    function showNext() {
        if (dialogueStep < dialogueLines.length) {
            dialogueTextField.textContent = dialogueLines[dialogueStep];
            dialogueStep++;
        } else {
            // Закрытие диалога и плавный уход Посланницы под экран
            dialogueBox.classList.add("hidden");
            envoy.classList.add("hidden");
            
            // Убираем блюр
            document.querySelector(".game-container").classList.remove("site-blur-active");
            
            // РАЗМОРАЖИВАЕМ КАМЕРУ (снова можно крутить сайт)
            document.body.classList.remove("no-scroll");
        }
    }

    if (dialogueBox) {
        dialogueBox.addEventListener("click", showNext);
    }
}); // Конец всего скрипта и закрытие события DOMContentLoaded
