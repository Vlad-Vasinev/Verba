import { disableScroll } from '.././functions/disable-scroll';
import { enableScroll } from '.././functions/enable-scroll';



uslugaOfferInit()

if (isMobile()) {
  stickyHeader()
  sidebarOpenInit()
  sidebarNavigationInit()

  document.querySelector('.header-sidebar__back').addEventListener('click', () => {
    document.querySelectorAll('.header-sidebar__step').forEach((item) => {
      if(item.getAttribute('data-step-name') === "servicses") {
        backOnStep()
      }
    })
  })

}
else {
  swapHeaderMenuColor()
  slideEffectButton()
  switchStickyOfferOnFooter()
}
document.querySelector('header').classList.add('_inited')

function slideEffectButton() {
  document.querySelectorAll('.slide-button').forEach(
    (el) => {
      const container = document.createElement('div')
      const innerSpan = el.querySelector('span')
      
      
      
      container.className = 'slide-button-inner'
      container.appendChild(innerSpan.cloneNode(true))
      container.appendChild(innerSpan.cloneNode(true))
      innerSpan.remove()
      el.insertBefore(container, el.firstChild);
    }
  )

}

function addHeaderExtraPadding() {
  const blocksSelector = "[js-header-extra-padding]"
  if (document.querySelectorAll(blocksSelector).length) {
    document.querySelector('.header').classList.add('_extra-padding')
  }
}

function swapHeaderMenuColor() {
  const headerBox = document.querySelector('.header__inner').getBoundingClientRect()
  const headerHeight = headerBox.height + headerBox.top
  const observerMarginBottom = window.innerHeight - headerHeight

  const blocksSelector = "[js-header-theme-swap]"


  const observer = new IntersectionObserver(
    ([e]) => {

      e.intersectionRatio > 0
        ? document.querySelector('.header').classList.add("_white")
        : document.querySelector('.header').classList.remove("_white")
    },
    {
      root: null,
      rootMargin: "0px 0px " + -observerMarginBottom + "px 0px",
      // rootMargin: "0px",
      threshold: [0]
    }
  );
  document.querySelectorAll(blocksSelector).forEach((el) => {
    observer.observe(el);
  })
}

function stickyHeader() {
  const observer = new IntersectionObserver(
    ([e]) => {
      e.target.classList.toggle("_sticked", e.intersectionRatio < 1)

    },
    {
      root: null,
      rootMargin: "0px",
      threshold: [1]
    }
  );

  observer.observe(document.querySelector("header"));
}

function sidebarOpenInit() {

  const header = document.querySelector('header')
  const sidebar = document.querySelector('.header-sidebar')
  document.querySelectorAll('[js-sidebar]').forEach(el => {
    el.addEventListener('click', (e) => {

      if (sidebar.classList.contains('_opened')) {
        // closeSidebar(header, sidebar)
        console.log('header is closed')
        if(document.querySelector('.usluga-offer')) {
          document.querySelector('.usluga-offer').classList.add('_visible')
        }
        enableScroll()
        //document.querySelector('.header-sidebar').classList.remove('header-sidebar_active')
        document.querySelector('.modal-background').classList.remove('opened')
        document.querySelector('.modal-background').style.zIndex = "192"
        closeSidebar(header, sidebar)
      }
      else {
        openSidebar(header, sidebar)
        console.log('header is opened')

        if(document.querySelector('.usluga-offer')) {
          document.querySelector('.usluga-offer').classList.remove('_visible')
        }

        document.querySelectorAll('.burger-item').forEach((el) => {
          el.classList.add('burger-item_active')
        })

       //document.querySelector('.header-sidebar').classList.add('header-sidebar_active')
        document.querySelector('.modal-background').classList.add('opened')
        
        document.querySelector('.modal-background').style.zIndex = "190"
      }

    })
  })
  header.querySelector('.header__sidebar-back')?.addEventListener('click', (e) => {
    backOnStep()
  })

}

function sidebarNavigationInit() {
  const sidebar = document.querySelector('.header-sidebar')
  sidebar.querySelectorAll('[js-open-step]').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (el?.dataset?.stepName) {
        openSidebarStep(el?.dataset?.stepName)
      }
    })
  })

}

function openSidebar(header, sidebar) {
  disableScroll()
  const topHeight = document.querySelector('.header-top').getBoundingClientRect().height
  if (!header.classList.contains('_sticked')) {
    header.style = `--translate: ${-(topHeight - window.scrollY + 1)}px`
    header.classList.add('_is-fixed')
  }

  header.querySelector('.header__burger').classList.add('_active')
  sidebar.style = `--header-bottom: ${header.getBoundingClientRect().bottom}px`
  sidebar.classList.add('_opened')
  
  header.querySelector('.header__menu').classList.add('_sidebar-active')
  openSidebarStep('first')
}
function closeSidebar(header, sidebar) {

  document.querySelectorAll('.burger-item').forEach((el) => {
    el.classList.remove('burger-item_active')
  })

  sidebar.classList.remove('_opened')
  sidebar.style = ''
  header.querySelector('.header__burger').classList.remove('_active')
  header.classList.remove('_is-fixed')
  //enableScroll()
  header.querySelector('.header__menu').classList.remove('_sidebar-active')
  document.querySelectorAll(`.header-sidebar .header-sidebar__step[data-step-order]`).forEach((el) => {
    el.removeAttribute('data-step-order')
    el.classList.remove('_active')
  })
  switchBackButton(false)
}

function openSidebarStep(name) {
  const step = document.querySelector(`.header-sidebar .header-sidebar__step[data-step-name='${name}']`)
  const prevSteps = document.querySelectorAll(`.header-sidebar .header-sidebar__step[data-step-order]`)

  if (prevSteps.length) {
    const prevStep = prevSteps[prevSteps.length - 1]
    step.dataset.stepOrder = +prevStep.dataset.stepOrder + 1
    switchBackButton(true)
    prevStep?.classList.remove('_active')
    step?.classList.add('_active')
  }
  else if (!prevSteps.length) {
    step.dataset.stepOrder = 0
    step?.classList.add('_active')
  }

}
function backOnStep() {
  const curStep = document.querySelector(`.header-sidebar .header-sidebar__step._active`)

  if (curStep.dataset.stepOrder > 0) {
    const prevStep = document.querySelector(`.header-sidebar .header-sidebar__step[data-step-order='${curStep.dataset.stepOrder - 1}']`)
    curStep.removeAttribute('data-step-order')
    curStep?.classList.remove('_active')
    prevStep?.classList.add('_active')
    if (prevStep.dataset.stepOrder == 0) {
      switchBackButton(false)
    }
  }

}
function switchBackButton(way = true) {
  const backButton = document.querySelector('header .header__sidebar-back')
  if (way) {
    backButton?.classList.add('_active')
  }
  else {
    backButton?.classList.remove('_active')
  }
}

function uslugaOfferInit() {
  const offerTpl = document.getElementById('usluga-offer-template')
  if (offerTpl) {
    const offerClone = offerTpl.content.firstElementChild.cloneNode(true)
    let offerEl
    if (!isMobile()) {
      offerEl = document.querySelector('.header').appendChild(offerClone)

      let parentElement = document.body
      let theFirstChild = parentElement.firstChild
      offerEl = parentElement.insertBefore(offerClone, theFirstChild);

    }
    else {
      document.querySelector('footer').classList.add('footer_prorgam')
      offerEl = document.body.appendChild(offerClone)
    }
    setTimeout(() => {
      offerEl.classList.add('_visible')
    }, 200)

  }
}

function switchStickyOfferOnFooter() {
  const offer = document.querySelector('.usluga-offer')
  if (offer) {
    const offerInner = document.querySelector('.usluga-offer__inner')
    offerInner.addEventListener('transitionend', handler, { once: true })
    function handler() {

      const offerInnerBottom = offerInner.getBoundingClientRect().bottom
      offer.style.setProperty('--top',
        Math.round(document.body.getBoundingClientRect().height - document.querySelector('footer').getBoundingClientRect().height) + 'px'
      )

      const observerMarginBottom = window.innerHeight - offerInnerBottom

      const observer = new IntersectionObserver(
        ([e]) => {

          e.intersectionRatio > 0
            ? document.querySelector('.usluga-offer').classList.add("_footer-relative")
            : document.querySelector('.usluga-offer').classList.remove("_footer-relative")
        },
        {
          root: null,
          rootMargin: "0px 0px " + -observerMarginBottom + "px 0px",
          // rootMargin: "0px",
          threshold: [0]
        }
      );
      document.querySelectorAll('footer').forEach((el) => {
        observer.observe(el);
      })
    }
  }
}

document.querySelector('.header-top__order').addEventListener('click', () => {
  if(document.querySelector('.header-sidebar').classList.contains('_opened')) {

    document.querySelector('.modal-background').style.zIndex = "192"

    document.querySelector('.header-sidebar__step').classList.remove('_active')
    
    closeSidebar(document.querySelector('header'), document.querySelector('.header-sidebar'))
    document.querySelector('.header-sidebar').classList.remove('header-sidebar_active')
    document.querySelector('.modal-background').classList.remove('opened')
    console.log('appoint-form')
    document.querySelector('.usluga-offer').classList.remove('_visible')
  }
})