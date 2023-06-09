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
            var soundPath = btn.firstChild.getAttribute('data-sound')
            var audio = new Audio(soundPath);
            audio.play()
        })
    })
}