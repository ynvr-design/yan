
// Функция для создания лоадера
function createLoader() {
  const loader = document.createElement("div");
  loader.className = "image-loader";
  loader.innerHTML = '<span class="loader"></span>';
  return loader;
}

// Обработка загрузки изображений
document.querySelectorAll(".portfolio-item img").forEach((img) => {
  const loader = createLoader();
  img.parentNode.insertBefore(loader, img);

  // Если изображение уже загружено (из кеша)
  if (img.complete) {
    img.classList.add("loaded");
    loader.remove();
  } else {
    img.addEventListener("load", function () {
      this.classList.add("loaded");
      loader.style.opacity = "0";
      setTimeout(() => loader.remove(), 300);
    });

    img.addEventListener("error", function () {
      loader.innerHTML = "Ошибка загрузки";
      setTimeout(() => loader.remove(), 2000);
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // ========== ФИЛЬТРАЦИЯ РАБОТ ==========
  const tabButtons = document.querySelectorAll(".tab-button");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  function filterPortfolio(filter) {
    portfolioItems.forEach((item) => {
      item.style.display = item.classList.contains(filter) ? "block" : "none";
    });
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      filterPortfolio(button.dataset.tab);
    });
  });

  // Активируем первую вкладку
  filterPortfolio("covers");

  // ========== МОДАЛЬНЫЕ ОКНА ==========
  // 1. Стандартное модальное окно
  const standardModal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const modalDescription = document.getElementById("modal-description");

  // 2. Модальное окно слайд-шоу
  const slidesModal = document.getElementById("slides-modal");
  const slidesContainer = document.querySelector(".slides-container");
  const slideCaption = document.querySelector(".slide-caption");
  const prevButton = document.querySelector(".slide-prev");
  const nextButton = document.querySelector(".slide-next");
  const closeSlidesBtn = document.querySelector(".slides-close");
  const currentSlideIndicator = document.querySelector(".current-slide");
  const totalSlidesIndicator = document.querySelector(".total-slides");

  // 3. Модальное окно для кейсов (Behance стиль)
  const caseModal = document.getElementById("case-modal");
  const caseModalContent = document.querySelector(".case-modal-content");
  const caseCaption = document.querySelector(".case-caption");
  const closeCaseBtn = document.querySelector(".case-close");

  let currentSlideIndex = 0;
  let slidesData = [];

  // Обработчики кликов для работ
  document.querySelectorAll(".portfolio-item img").forEach((img) => {
    img.addEventListener("click", function () {
      if (this.parentElement.classList.contains("cases")) {
        openCaseModal(this);
      } else if (this.dataset.slides) {
        openSlideshow(this);
      } else {
        openStandardModal(this);
      }
    });
  });

  // Открытие стандартного модального окна
  function openStandardModal(element) {
    standardModal.style.display = "block";
    modalImg.src = element.src;
    modalDescription.textContent = element.dataset.description || "";
    document.body.style.overflow = "hidden";
  }

  // Открытие слайд-шоу
  function openSlideshow(element) {
    slidesData = JSON.parse(element.dataset.slides);
    currentSlideIndex = 0;

    // Устанавливаем описание
    slideCaption.textContent = element.dataset.description || "";
    totalSlidesIndicator.textContent = slidesData.length;

    // Показываем первый слайд
    showSlide(currentSlideIndex);

    // Открываем модальное окно
    slidesModal.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  // Показ конкретного слайда
  function showSlide(index) {
    if (slidesData.length === 0) return;

    // Корректируем индекс
    if (index >= slidesData.length) index = 0;
    else if (index < 0) index = slidesData.length - 1;

    currentSlideIndex = index;

    // Очищаем и создаем текущий слайд
    slidesContainer.innerHTML = "";
    const slide = document.createElement("div");
    slide.className = "slide active";
    slide.innerHTML = `<img src="${slidesData[index]}" alt="Slide ${
      index + 1
    }">`;
    slidesContainer.appendChild(slide);

    // Обновляем индикатор
    currentSlideIndicator.textContent = currentSlideIndex + 1;
  }

  // Открытие модального окна кейса (Behance стиль)
  function openCaseModal(element) {
    const slides = JSON.parse(element.dataset.slides);
    
    // Очищаем предыдущее содержимое
    caseModalContent.innerHTML = "";
    
    // Добавляем все изображения кейса
    slides.forEach(slide => {
      const slideDiv = document.createElement("div");
      slideDiv.className = "case-slide";
      slideDiv.innerHTML = `<img src="${slide}" alt="Case slide">`;
      caseModalContent.appendChild(slideDiv);
    });
    
    // Устанавливаем описание
    caseCaption.textContent = element.dataset.description || "";
    
    // Открываем модальное окно
    caseModal.style.display = "block";
    document.body.style.overflow = "hidden";
    
    // Прокручиваем в начало
    caseModalContent.scrollTo(0, 0);
  }

  // Навигация по слайдам
  prevButton.addEventListener("click", () => {
    showSlide(currentSlideIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    showSlide(currentSlideIndex + 1);
  });

  // Закрытие модальных окон
  function closeModal(modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  // Стандартное окно
  document.querySelector(".close").addEventListener("click", () => {
    closeModal(standardModal);
  });

  // Слайд-шоу
  closeSlidesBtn.addEventListener("click", () => {
    closeModal(slidesModal);
  });

  // Кейсы
  closeCaseBtn.addEventListener("click", () => {
    closeModal(caseModal);
  });

  // Закрытие по клику вне контента
  window.addEventListener("click", (event) => {
    if (event.target === standardModal) closeModal(standardModal);
    if (event.target === slidesModal) closeModal(slidesModal);
    if (event.target === caseModal) closeModal(caseModal);
  });

  // Навигация клавиатурой
  document.addEventListener("keydown", (event) => {
    // Для стандартного окна
    if (standardModal.style.display === "block" && event.key === "Escape") {
      closeModal(standardModal);
    }

    // Для слайд-шоу
    if (slidesModal.style.display === "block") {
      switch (event.key) {
        case "ArrowLeft":
          showSlide(currentSlideIndex - 1);
          break;
        case "ArrowRight":
          showSlide(currentSlideIndex + 1);
          break;
        case "Escape":
          closeModal(slidesModal);
          break;
      }
    }

    // Для кейсов
    if (caseModal.style.display === "block" && event.key === "Escape") {
      closeModal(caseModal);
    }
  });

  // Свайпы для мобильных
  let touchStartX = 0;
  let touchEndX = 0;

  slidesContainer.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    false
  );

  slidesContainer.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    false
  );

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) showSlide(currentSlideIndex + 1); // Свайп влево
    if (touchEndX > touchStartX + 50) showSlide(currentSlideIndex - 1); // Свайп вправо
  }
});

// Функция для создания лоадера
function createLoader() {
  const loader = document.createElement("div");
  loader.className = "image-loader";
  loader.innerHTML = '<span class="loader"></span>';
  return loader;
}

// Обработка загрузки изображений
document.querySelectorAll(".portfolio-item img").forEach((img) => {
  const loader = createLoader();
  img.parentNode.insertBefore(loader, img);

  // Если изображение уже загружено (из кеша)
  if (img.complete) {
    img.classList.add("loaded");
    loader.remove();
  } else {
    img.addEventListener("load", function () {
      this.classList.add("loaded");
      loader.style.opacity = "0";
      setTimeout(() => loader.remove(), 300);
    });

    img.addEventListener("error", function () {
      loader.innerHTML = "Ошибка загрузки";
      setTimeout(() => loader.remove(), 2000);
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // ========== ФИЛЬТРАЦИЯ РАБОТ ==========
  const tabButtons = document.querySelectorAll(".tab-button");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  function filterPortfolio(filter) {
    portfolioItems.forEach((item) => {
      item.style.display = item.classList.contains(filter) ? "block" : "none";
    });
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      filterPortfolio(button.dataset.tab);
    });
  });

  // Активируем первую вкладку
  filterPortfolio("covers");

  // ========== МОДАЛЬНЫЕ ОКНА ==========
  // 1. Стандартное модальное окно
  const standardModal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const modalDescription = document.getElementById("modal-description");

  // 2. Модальное окно слайд-шоу
  const slidesModal = document.getElementById("slides-modal");
  const slidesContainer = document.querySelector(".slides-container");
  const slideCaption = document.querySelector(".slide-caption");
  const prevButton = document.querySelector(".slide-prev");
  const nextButton = document.querySelector(".slide-next");
  const closeSlidesBtn = document.querySelector(".slides-close");
  const currentSlideIndicator = document.querySelector(".current-slide");
  const totalSlidesIndicator = document.querySelector(".total-slides");

  // 3. Модальное окно для кейсов (Behance стиль)
  const caseModal = document.getElementById("case-modal");
  const caseModalContent = document.querySelector(".case-modal-content");
  const caseCaption = document.querySelector(".case-caption");
  const closeCaseBtn = document.querySelector(".case-close");

  let currentSlideIndex = 0;
  let slidesData = [];

  // Обработчики кликов для работ
  document.querySelectorAll(".portfolio-item img").forEach((img) => {
    img.addEventListener("click", function () {
      if (this.parentElement.classList.contains("cases")) {
        openCaseModal(this);
      } else if (this.dataset.slides) {
        openSlideshow(this);
      } else {
        openStandardModal(this);
      }
    });
  });

  // Открытие стандартного модального окна
  function openStandardModal(element) {
    standardModal.style.display = "block";
    modalImg.src = element.src;
    modalDescription.textContent = element.dataset.description || "";
    document.body.style.overflow = "hidden";
  }

  // Открытие слайд-шоу
  function openSlideshow(element) {
    slidesData = JSON.parse(element.dataset.slides);
    currentSlideIndex = 0;

    // Устанавливаем описание
    slideCaption.textContent = element.dataset.description || "";
    totalSlidesIndicator.textContent = slidesData.length;

    // Показываем первый слайд
    showSlide(currentSlideIndex);

    // Открываем модальное окно
    slidesModal.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  // Показ конкретного слайда
  function showSlide(index) {
    if (slidesData.length === 0) return;

    // Корректируем индекс
    if (index >= slidesData.length) index = 0;
    else if (index < 0) index = slidesData.length - 1;

    currentSlideIndex = index;

    // Очищаем и создаем текущий слайд
    slidesContainer.innerHTML = "";
    const slide = document.createElement("div");
    slide.className = "slide active";
    slide.innerHTML = `<img src="${slidesData[index]}" alt="Slide ${
      index + 1
    }">`;
    slidesContainer.appendChild(slide);

    // Обновляем индикатор
    currentSlideIndicator.textContent = currentSlideIndex + 1;
  }

  // Открытие модального окна кейса (Behance стиль)
  function openCaseModal(element) {
    const slides = JSON.parse(element.dataset.slides);
    
    // Очищаем предыдущее содержимое
    caseModalContent.innerHTML = "";
    
    // Добавляем все изображения кейса
   slides.forEach(slide => {
  const slideDiv = document.createElement("div");
  slideDiv.className = "case-slide";

  if (slide.endsWith(".mp4")) {
    slideDiv.innerHTML = `
      <video controls preload="metadata" width="100%">
        <source src="${slide}" type="video/mp4">
        Ваш браузер не поддерживает видео.
      </video>
    `;
  } else {
    slideDiv.innerHTML = `<img src="${slide}" alt="Case slide">`;
  }

  caseModalContent.appendChild(slideDiv);
});

    
    // Устанавливаем описание
    caseCaption.textContent = element.dataset.description || "";
    
    // Открываем модальное окно
    caseModal.style.display = "block";
    document.body.style.overflow = "hidden";
    
    // Прокручиваем в начало
    caseModalContent.scrollTo(0, 0);
  }

  // Навигация по слайдам
  prevButton.addEventListener("click", () => {
    showSlide(currentSlideIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    showSlide(currentSlideIndex + 1);
  });

  // Закрытие модальных окон
  function closeModal(modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  // Стандартное окно
  document.querySelector(".close").addEventListener("click", () => {
    closeModal(standardModal);
  });

  // Слайд-шоу
  closeSlidesBtn.addEventListener("click", () => {
    closeModal(slidesModal);
  });

  // Кейсы
  closeCaseBtn.addEventListener("click", () => {
    closeModal(caseModal);
  });

  // Закрытие по клику вне контента
  window.addEventListener("click", (event) => {
    if (event.target === standardModal) closeModal(standardModal);
    if (event.target === slidesModal) closeModal(slidesModal);
    if (event.target === caseModal) closeModal(caseModal);
  });

  // Навигация клавиатурой
  document.addEventListener("keydown", (event) => {
    // Для стандартного окна
    if (standardModal.style.display === "block" && event.key === "Escape") {
      closeModal(standardModal);
    }

    // Для слайд-шоу
    if (slidesModal.style.display === "block") {
      switch (event.key) {
        case "ArrowLeft":
          showSlide(currentSlideIndex - 1);
          break;
        case "ArrowRight":
          showSlide(currentSlideIndex + 1);
          break;
        case "Escape":
          closeModal(slidesModal);
          break;
      }
    }

    // Для кейсов
    if (caseModal.style.display === "block" && event.key === "Escape") {
      closeModal(caseModal);
    }
  });

  // Свайпы для мобильных
  let touchStartX = 0;
  let touchEndX = 0;

  slidesContainer.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    false
  );

  slidesContainer.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    false
  );

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) showSlide(currentSlideIndex + 1); // Свайп влево
    if (touchEndX > touchStartX + 50) showSlide(currentSlideIndex - 1); // Свайп вправо
  }
});

function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  fetch(`locales/${lang}.json`)
    .then(res => res.json())
    .then(data => {
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const keys = el.getAttribute("data-i18n").split(".");
        let text = data;
        keys.forEach(k => text = text?.[k]);
        if (text) el.textContent = text;
      });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("lang") || "ru";
  setLanguage(lang);
});


