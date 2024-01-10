const cardElements = document.querySelectorAll(".card");
const iconElements = document.querySelectorAll(".icon");
const flipElement = document.getElementById("flip");
const timeElement = document.getElementById("time");
const modal = document.getElementById("modal");

const ICON_INDEXES = ["1", "2", "3", "4", "5", "6", "7", "8", "1", "2", "3", "4", "5", "6", "7", "8"];
const TIME = 60;
const FLIP = 0;

let cards = [];
let flip;
let time;

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const showModal = (content, innerHtml = false) => {
  if (innerHtml) {
    modal.querySelector("p").innerHTML = content;
  } else {
    modal.querySelector("p").textContent = content;
  }
  modal.classList.add("show-modal");
};

const setTime = () => {
  const interval = setInterval(() => {
    time--;
    if (time >= 0) {
      timeElement.textContent = time;
    } else {
      clearInterval(interval);

      if (!isWin()) {
        resetCards();
        showModal("game over!");
      }
    }
  }, 1000);
};

const isWin = () => {
  for (const card of cards) {
    if (!card.matched) return false;
  }
  return true;
};

const setFlip = () => {
  flipElement.textContent = flip;
};

const resetCards = () => {
  const visibleCardsElements = document.querySelectorAll(".card-visible");
  visibleCardsElements.forEach((visibleCardElement) => visibleCardElement.classList.remove("card-visible"));
  const dancerElements = document.querySelectorAll(".dance-animation");
  dancerElements.forEach((dancerElement) => dancerElement.classList.remove("dance-animation"));
};

const reset = () => {
  flip = FLIP;
  time = TIME;
  cards = [];
};

const startGame = () => {
  reset();
  setFlip();
  setTime();

  const shuffledIndexes = shuffle(ICON_INDEXES);
  for (let i = 0; i < shuffledIndexes.length; i++) {
    iconElements[i].setAttribute("src", `./images/icon-${shuffledIndexes[i]}.png`);
    cards.push({ shuffledIndex: shuffledIndexes[i], visible: false, matched: false, element: cardElements[i] });
  }
};

cardElements.forEach((cardElement) =>
  cardElement.addEventListener("click", () => {
    cardElement.classList.add("card-visible");

    const index = +cardElement.getAttribute("index");
    const targetCard = cards[index];

    if (targetCard.visible) return;

    flip++;
    setFlip();

    const previousTargetCard = cards.find((card) => card.visible && !card.matched);

    if (previousTargetCard) {
      if (targetCard.shuffledIndex === previousTargetCard.shuffledIndex) {
        targetCard.matched = true;
        previousTargetCard.matched = true;

        setTimeout(() => {
          targetCard.element.querySelector(".icon").classList.add("dance-animation");
          previousTargetCard.element.querySelector(".icon").classList.add("dance-animation");

          if (isWin()) {
            resetCards();
            showModal(
              `You won with <span style="color: #ffc341">${flip}</span> flips and <span style="color: #ffc341">${time}</span> seconds left!`,
              true
            );
          }
        }, 1000);
      } else {
        targetCard.visible = false;
        previousTargetCard.visible = false;

        setTimeout(() => {
          targetCard.element.classList.remove("card-visible");
          previousTargetCard.element.classList.remove("card-visible");
        }, 1000);
      }
    } else {
      targetCard.visible = true;
    }
  })
);

modal.addEventListener("click", () => {
  modal.classList.remove("show-modal");
  startGame();
});

timeElement.textContent = TIME;
flipElement.textContent = FLIP;

showModal("tap to start!");
