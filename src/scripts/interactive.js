export function flipButtons() {
  const flipBtn = document.querySelectorAll(".info_btn");
  console.log(flipBtn);
  flipBtn.forEach((btn) =>
    btn.addEventListener("click", () => {
      const wordCard = btn.closest(".card");
      wordCard.classList.add("flip");
      btn.classList.add("hidden");
      const backCard = wordCard.querySelector(".card_back");
      console.log(backCard);
      backCard.addEventListener("mouseleave", () => {
        wordCard.classList.remove("flip");
        btn.classList.remove("hidden");
      });
    })
  );
}

export function playSound() {
    const soundBtn = document.querySelectorAll('.sound_btn');
    console.log(soundBtn);
    soundBtn.forEach(btn => {
        btn.addEventListener('click', function() {
            let soundPath = btn.firstChild.getAttribute('data-sound')
            let audio = new Audio(soundPath);
            audio.play()
        })
    })
}

const changeMode = document.getElementById("app_mode_input");

export function playMode() {
  console.log(changeMode);
  const cards = document.querySelectorAll(".card_face > .card_info");
  console.log(cards);
  changeMode.addEventListener("change", () => {
    cards.forEach((card) => card.classList.toggle("play-mode"));
  });
}

export function playPanelOn() {
  const playPanel = document.querySelector(".play-panel");
  changeMode.addEventListener("change", () => {
    playPanel.classList.toggle("game");
  });
}