
document.querySelectorAll('.accordeon-el .accordeon-el__head').forEach((item) => {
  item.addEventListener('click', (e) => {
    e.currentTarget.parentElement.querySelector('.accordeon-el__body').classList.toggle('accordeon-el__body_active')
  })
})