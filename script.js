document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-button");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  // Функция для фильтрации работ
  function filterPortfolio(filter) {
    portfolioItems.forEach((item) => {
      if (item.classList.contains(filter)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  // Обработчик клика для кнопок
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Убираем активный класс у всех кнопок
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      // Добавляем активный класс текущей кнопке
      button.classList.add("active");

      // Фильтрация работ
      const filter = button.getAttribute("data-tab");
      filterPortfolio(filter);
    });
  });

  // Активируем первую вкладку при загрузке страницы
  const firstTab = document.querySelector(".tab-button.active");
  if (firstTab) {
    const filter = firstTab.getAttribute("data-tab");
    filterPortfolio(filter);
  }
});


document.addEventListener("DOMContentLoaded", function () {
    const portfolioItems = document.querySelectorAll(".portfolio-item img");
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modal-img");
    const modalDescription = document.getElementById("modal-description"); // Новый элемент для описания
    const closeBtn = document.querySelector(".close");
  
    portfolioItems.forEach((img) => {
      img.addEventListener("click", () => {
        modal.style.display = "block";
        modalImg.src = img.src;
        modalDescription.textContent = img.getAttribute("data-description"); // Устанавливаем описание
      });
    });
  
    // Закрытие модального окна
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  
    // Закрытие модального окна при клике вне изображения
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });
