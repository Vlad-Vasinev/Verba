if (document.querySelector(".button_small.fill-button")) {
  document
    .querySelector(".button_small.fill-button")
    .addEventListener("click", () => {
      if (document.querySelector(".usluga-offer")) {
        document.querySelector(".usluga-offer").classList.remove("_visible");
      }
    });
}

document.querySelectorAll('.footer-link-block')[1].addEventListener('click', () => {
    if (document.querySelector(".usluga-offer")) {
        document.querySelector(".usluga-offer").classList.remove("_visible");
    }
})