import { disableScroll } from '.././functions/disable-scroll';
import { enableScroll } from '.././functions/enable-scroll';

function storiesOpen(e, index=0) {
  fullscreenSliderInit()
  const slider = APP.Components.Stories.data.fullscreenSlider
  slider.slideTo(e.currentTarget.dataset.slideIndex, index)
  document.querySelector('.stories-container').classList.add('is-active')
  disableScroll()
  const videoContainer = slider.slides[slider.activeIndex].querySelector('.fullscreen-stories-item-video')
  const bullet = slider.slides[slider.activeIndex].querySelector('.fullscreen-stories-item-pagination .progress')
}

function fullscreenSliderInit() {
  const previewsArr = document.querySelectorAll('.swiper-wrapper .stories-item.swiper-slide')
  previewsArr.forEach(function (item, index, array) {
    item.dataset.slideIndex = index
    const imgSrc = item.querySelector('img').src

    const slide = document.createElement('div')
    slide.className = "fullscreen-stories-item swiper-slide"
    // console.log(item.dataset.videosrc)

    slide.innerHTML =
      `
      
      <div class="fullscreen-stories-item-pagination">
      <span class="pagination-bullet">
        <div class="progress"></div>
      </span>
      </div>
      <div data-video-src="${item.dataset.videoSrc}" data-slide-index=${index} class="fullscreen-stories-item-video">
        <div class='preview-img' style='background-image: url(${imgSrc})'></div>
      </div>
      <div class="fullscreen-stories-item-description">
        <p class="ph5">${item.querySelector('.stories-item-desc > *').textContent}</p>
      </div>`
    document.querySelector('.fullscreen-stories.swiper-wrapper').append(slide)
  });

  this.data.fullscreenSlider = new Swiper('.stories-container-inner', {
    wrapperClass: 'swiper-wrapper',
    slideClass: 'swiper-slide',
    slidesPerView: 3.5,
    spaceBetween: 0,
    centeredSlides: true,
    navigation: {
      nextEl: '.stories-container-inner .swiper-button-next',
      prevEl: '.stories-container-inner .swiper-button-prev',
    },
    allowTouchMove: false,
    runCallbacksOnInit: true,
    breakpoints: {
      200: {
        spaceBetween: 0,
        slidesPerView: 1,
        allowTouchMove: true,

      },
      // 768: {
      //   spaceBetween: 10,
      //   slidesPerView: 2.5,
      // },
      1024: {
        slidesPerView: 3.5,
        allowTouchMove: false,
      },
    },
    on: {
      slideChange: onChange,
      afterInit: onChange
    },
  });
  function onChange(swiper) {
    clearTimeout(currentTimeout)

    const activeSlide = this.slides[this.activeIndex]
    const prevSlide = this.slides[this.previousIndex]

    prevSlide?.querySelector('video')?.pause()

    prevSlide?.querySelector('.fullscreen-stories-item-pagination .progress')?.classList.remove('playing', 'ended')
    prevSlide?.querySelector('video')?.remove()
    const videoContainer = activeSlide.querySelector('.fullscreen-stories-item-video')
    const bullet = activeSlide.querySelector('.fullscreen-stories-item-pagination .progress')

    const video = document.createElement('video');
    video.autoplay = false
    video.muted = false
    video.setAttribute('playsinline', "true")
    video.setAttribute('webkit-playsinline', "webkit-playsinline")
    video.setAttribute('disablepictureinpicture', "true")
    video.src = videoContainer.dataset.videoSrc
    videoContainer.appendChild(video)
    const videoEl = videoContainer.querySelector('video')
    if (videoEl.readyState === 4) {
      playSliderVideo(videoEl, bullet, swiper)
    }
    else {
      videoEl.addEventListener('loadeddata', function () {
        playSliderVideo(videoEl, bullet, swiper)
      }, { once: true })
    }
  }
  function playSliderVideo(videoEl, bullet, swiper) {

    // videoEl.classList.add('loading')
    if (videoEl.paused) {
      let playProm = videoEl.play();
      playProm.then(function () {
      }, function (error) {
        console.log('play error');
        console.log(error);
        videoEl.controls = true
      });
    }
    const duration = videoEl.duration.toFixed(2)
    bullet.style.setProperty('--duration', `${videoEl.duration}s`);
    bullet.classList.add('playing')
    currentTimeout = setTimeout(function () {
      console.log(swiper)
      swiper?.slideNext();
    }, duration * 1000 + 50);
  }

}

var APP = window.APP || {};
APP.Dev = APP.Dev || {};
APP.Browser = APP.Browser || {};
APP.Plugins = APP.Plugins || {};
APP.Components = APP.Components || {};


(function (APP) {
  APP.Components.Stories = {
    data: {
      fullscreenSlider: undefined,
      bars: []
    },
    init: function () {
      let currentTimeout
      new Swiper('[js-stories-img-slider]', {
        wrapperClass: 'swiper-wrapper',
        slideClass: 'swiper-slide',
        slidesPerView: 6,
        spaceBetween: 20,
        navigation: {
          nextEl: '[js-stories-img-slider] .swiper-button-next',
          prevEl: '[js-stories-img-slider] .swiper-button-prev',
        },
        pagination: {
          el: '.stories-container .swiper-pagination',
          type: 'fraction',
        },
        breakpoints: {
          200: {
            allowTouchMove: true,
            spaceBetween: 6,
            slidesPerView: 1.55,
          },
          769: {
            spaceBetween: 10,
            slidesPerView: 6,
          }
        },
        on: {
          init: function () {
            if (this.slides.length <= this.params.slidesPerView) {
              this.$el.find('.swiper-navigation').css('display', 'none');
            }
          },


        },
      });
      if (document.querySelector('.stories-block, .stories-block_reviews')) {
        



        document.querySelectorAll('.stories-block .stories-item, .stories-block_reviews .stories-item').forEach((el, index) => {el.addEventListener('click', (e) => storiesOpen(e, index))})
        document.querySelectorAll('.fullscreen-stories-item-video').forEach(el => el.addEventListener('click',
          (e) => {
            if (e.currentTarget.closest('.swiper-slide').classList.contains('swiper-slide-active')) {
              const video = e.currentTarget.querySelector('video')
              if (video.paused) {
                video.play()
              }
              else {
                video.pause()
              }
            }
          }))


        function closeSlider() {
          document.querySelectorAll('.stories-container video').forEach((item) => {
            item.remove()
          })
          enableScroll()
          document.querySelector('.stories-container').classList.remove('is-active')
        }
        if (!isMobile()) {
          document.querySelector('.stories-container .stories-bg').addEventListener('click', closeSlider)
        }
        document.querySelector('.stories-container .close-btn').addEventListener('click', closeSlider)
      }
    }
  }
})(APP);

APP.Components.Stories.init()