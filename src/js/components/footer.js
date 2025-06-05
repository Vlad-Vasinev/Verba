document.querySelector('footer .home-button')?.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: "instant"
  })
})
if (!isMobile()) {
  document.querySelectorAll('footer .footer-link-block')?.forEach((el) => {
    el.clientWidth / el.clientHeight >= 1
      ? el.classList.add('_horizontal')
      : el.classList.add('_vertical')
    el.addEventListener(
      'mouseenter',
      (e) => {
        const target = e.currentTarget
        target.classList.add('hovered')
      }
    )
    el.addEventListener(
      'mouseleave',
      (e) => {
        const target = e.currentTarget
        target.classList.remove('hovered')
      }
    )
  })
}