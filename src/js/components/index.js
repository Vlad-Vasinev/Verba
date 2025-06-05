import { aPixels } from "../functions/aPixels"

window.startFunc = function () {
  console.log('grecaptcha is ready')
}

flowerBannerInit()
miniGallerySliderInit()
doctorCardSliderInit()
mainSliderInit()
mainProgramsSlider()
reviewsSliderInit()

jsInputFocus()

if (isMobile()) {
  galleryGridSliderInit()

  if(document.querySelector('.main__video.main-page')) {
  }
  else if (document.querySelector('.main__video.service-page')) {

  }

  mainVideoMobileSlider()
}
function flowerBannerInit() {
  window.flowerBanner = new Swiper('[js-flower-banner]', {
    wrapperClass: 'swiper-wrapper',
    slideClass: 'swiper-slide',
    autoplay: {
      // delay: 2000,
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 1,
    effect: 'fade',
    runCallbacksOnInit: false,
    fadeEffect: {
      crossFade: true
    },
    // allowTouchMove: false,
    loop: true,
    pagination: {
      el: '.flower-banner .swiper-pagination',
      type: 'bullets',
      clickable: 'true'
    },
    breakpoints: {
      200: {
        allowTouchMove: true
      },
      768: {
        allowTouchMove: false
      },
    },
    on: {
      init: function (sw) {
        this.el.querySelectorAll('.swiper-pagination-bullet').forEach((el) => {
          el.innerHTML = '<div class="progress"></div>'
        });
      },
      afterInit: onChange,
      slideChange: onChange,

    },
  });
  function onChange() {
    this.el.querySelectorAll(`.swiper-pagination-bullet:nth-child(1n+${this.realIndex}) .progress`).forEach((el) => {
      el.classList.remove('playing', 'ended')
    });
    this.el.querySelectorAll(`.swiper-pagination-bullet:nth-child(-n+${this.realIndex}) .progress`).forEach((el) => {
      el.classList.add('ended')
      el.classList.remove('playing')
    });
    this.el.querySelector(`.swiper-pagination-bullet-active .progress`).classList.add('playing')
    this.slides[this.previousIndex].classList.remove('_active');
    this.slides[this.activeIndex].classList.add('_active');
    if (!this.autoplay.running) {
    }

  }
}

function galleryGridSliderInit() {
  new Swiper('[js-gallery-grid-slider]', {
    wrapperClass: 'swiper-wrapper',
    slideClass: 'gallery-grid__item',
    centeredSlides: true,
    slidesPerView: 1.215,
    spaceBetween: 8,
    runCallbacksOnInit: false,
    loop: true,
    pagination: {
      el: '[js-gallery-grid-slider] .navigation-fraction .navigation-fraction__',
      type: 'fraction',
    },
    navigation: {
      nextEl: '[js-gallery-grid-slider] .navigation-fraction .navigation-fraction__next',
      prevEl: '[js-gallery-grid-slider] .navigation-fraction .navigation-fraction__prev',
    },


  });

}

function doctorCardSliderInit() {
  new Swiper('[js-doctor-cards-slider]', {
    wrapperClass: 'doctor-cards-slider__wrapper',
    slideClass: 'doctor-cards-slider__item',
    allowTouchMove: true,
    breakpoints: {
      200: {
        cssMode: false,
        slidesPerView: 1.55,
        spaceBetween: 8,
      },
      768: {
        spaceBetween: 10,
        slidesPerView: 3,
      },
    },
    pagination: {
      el: '[js-doctor-cards-slider] .navigation-fraction .navigation-fraction__pagination',
      type: 'fraction',
    },
    navigation: {
      nextEl: '[js-doctor-cards-slider] .navigation-fraction .navigation-fraction__next',
      prevEl: '[js-doctor-cards-slider] .navigation-fraction .navigation-fraction__prev',
    },
    on: {
      beforeInit: (sw) => {
        const slidesAm = sw.el.querySelectorAll('.' + sw.params.slideClass).length

        if (isMobile()) {
          if (slidesAm <= 1) {

          }
        }
        else {
          if (slidesAm <= 3) {
            try {
              sw.el.querySelector('.navigation-fraction').style.display = 'none'
            } catch (e) {
              console.error(e)
            }
          }

        }

      }
    }
  });
}

function reviewsSliderInit() {
  new Swiper('[js-reviews-cards-slider]', {
    wrapperClass: 'swiper-wrapper',
    slideClass: 'stories-item',
    allowTouchMove: true,
    loopFillGroupBlank: false,
    breakpoints: {
      200: {
        cssMode: false,
        slidesPerView: 2,
        spaceBetween: 8,
      },
      768: {
        spaceBetween: 10,
        slidesPerView: 4,
      },
    },
  });
}

function mainSliderInit() {
  new Swiper('[js-main-slider]', {
    wrapperClass: 'main__slider-wrapper',
    slideClass: 'main__slider-slide',
    //allowTouchMove: true,
    //cssMode: true,
    allowTouchMove: true,
    breakpoints: {
      200: {
        cssMode: false,
        slidesPerView: 1.1,
        spaceBetween: 6,
        //allowTouchMove: true,
        pagination: {
          el: '[js-main-slider] .navigation-fraction .navigation-fraction__pagination',
          type: 'bullets',
          clickable: true
        }
      },
      768: {
        spaceBetween: 10,
        initialSlide: 0,
        slidesPerView: "auto",
      },
    },
    
    pagination: {
      el: '[js-main-slider] .navigation-fraction .navigation-fraction__pagination',
      type: 'fraction',
    },
    navigation: {
      nextEl: '[js-main-slider] .navigation-fraction .navigation-fraction__next',
      prevEl: '[js-main-slider] .navigation-fraction .navigation-fraction__prev',
    },
  });
}

function mainProgramsSlider() {
  new Swiper('[js-programs-slider]', {
    wrapperClass: 'slider-programs__wrapper',
    slideClass: 'slider-programs__el',
    breakpoints: {
      200: {
        cssMode: false,
        slidesPerView: 1,
        spaceBetween: 6,
        // allowTouchMove: true,
        pagination: {
          el: '[js-programs-slider] .navigation-fraction .navigation-fraction__pagination',
          type: 'bullets',
          clickable: true
        }
      },
      768: {
        cssMode: true,
        spaceBetween: 4,
        slidesPerView: 3,
      },
      1300: {
        spaceBetween: aPixels(10),
        slidesPerView: 3,
      },
    },
    pagination: {
      el: '[js-programs-slider] .navigation-fraction .navigation-fraction__pagination',
      type: 'fraction',
    },
    navigation: {
      nextEl: '[js-programs-slider] .navigation-fraction .navigation-fraction__next',
      prevEl: '[js-programs-slider] .navigation-fraction .navigation-fraction__prev',
    },
  });
}

function mainVideoMobileSlider() {
  new Swiper('[js-video-slider]', {
    wrapperClass: 'main__video',
    slideClass: 'main__video-el',
    allowTouchMove: true,
    //cssMode: true,
    breakpoints: {
      200: {
        slidesPerView: 1,
        spaceBetween: 6,
        
        pagination: {
          el: '[js-video-slider] .navigation-fraction .navigation-fraction__pagination',
          type: 'bullets',
          clickable: true
        }
      },
    },
    pagination: {
      el: '[js-video-slider] .navigation-fraction .navigation-fraction__pagination',
      type: 'fraction',
    },
  });
}

function miniGallerySliderInit() {
  const miniGallerySlider = document.querySelector('[js-mini-gallery-slider]')
  let srcArr = undefined
  try {
    srcArr = document.querySelector('[js-mini-gallery-slider]')?.dataset.gallerySrcset.split(',')
  } catch (error) {
    console.log(error)
  }
  if (isMobile()) {
    new Swiper('[js-mini-gallery-slider]', {
      wrapperClass: 'mini-gallery-block__wrapper',
      slideClass: 'mini-gallery-block__item',
      centeredSlides: true,
      slidesPerView: 1.215,
      spaceBetween: 8,
      runCallbacksOnInit: false,
      loop: true,
      preloadImages: false,
      lazy: {
        enabled: true,
        // loadOnTransitionStart: true,
        loadPrevNext: true
      },
      pagination: {
        el: '[js-mini-gallery-slider] .navigation-fraction .navigation-fraction__pagination',
        type: 'fraction',
      },
      navigation: {
        nextEl: '[js-mini-gallery-slider] .navigation-fraction .navigation-fraction__next',
        prevEl: '[js-mini-gallery-slider] .navigation-fraction .navigation-fraction__prev',
      },
      on: {
        beforeInit: function (swiper) {
          if (srcArr.length) {
            srcArr.forEach(
              (item) => {
                const lazyGalleryItem = document.createElement('div');
                lazyGalleryItem.classList.add('mini-gallery-block__item');
                lazyGalleryItem.innerHTML = `<img data-src="${item}" class="swiper-lazy" alt="">`
                swiper.el.querySelector('.mini-gallery-block__wrapper').appendChild(lazyGalleryItem)
              }
            )
          }
          else {
            return
          }
        }
      }
    });
  }
  else {
    if (srcArr) {
      const modalTpl = document.getElementById('modal-template').content.firstElementChild.cloneNode(true)
      const modalBg = document.querySelector('.modal-background')
      const modalEl = modalBg.parentNode.insertBefore(modalTpl, modalBg)
      modalEl.dataset.modalName = 'mini-gallery'

      const modalMiniGallery = document.createElement('div');
      modalMiniGallery.classList.add('modal-mini-gallery');

      miniGallerySlider.querySelectorAll('.mini-gallery-block__wrapper .mini-gallery-block__item img').forEach((el) => {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('modal-mini-gallery__item')
        galleryItem.appendChild(el.cloneNode())
        modalMiniGallery.appendChild(galleryItem)
      })

      srcArr.forEach(
        (item) => {
          const lazyGalleryItem = document.createElement('div');
          lazyGalleryItem.classList.add('modal-mini-gallery__item');
          lazyGalleryItem.innerHTML = `<img data-src="${item}" class="swiper-lazy" alt="">`
          modalMiniGallery.appendChild(lazyGalleryItem)
        }
      )
      modalEl.querySelector('.modal__body').appendChild(modalMiniGallery)
      modalEl.classList.add('_inited')
      miniGallerySlider.querySelector('.mini-gallery-block__badge').addEventListener('click', (e) => {
        modalEl.querySelectorAll('.modal__body .modal-mini-gallery__item img').forEach((el) => {
          if (!el.src) {
            el.src = el.dataset.src
          }
        })
      }, { once: true })

    }
  }
}



function jsInputFocus() {
  const elements = document.querySelectorAll('[js-input-focus]');
  if (elements.length !== 0) {
    elements.forEach((el) => {
      const input = el.querySelector('input, textarea, .textarea[contenteditable]')

      if (input.value) {
        el.classList.add('is-focused');
      }

      input.addEventListener('focus', function () {
        el.classList.add('is-focused');
      });

      input.addEventListener('blur', function () {
        if (input.value?.trim() || input.textContent !== '') {

          el.classList.add('is-focused');
        } else {
          el.classList.remove('is-focused');
        }
      });
    })
  }
}
