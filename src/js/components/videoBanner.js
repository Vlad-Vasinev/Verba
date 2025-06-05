import { disableScroll } from '.././functions/disable-scroll';
import { enableScroll } from '.././functions/enable-scroll';

videoBannerInit()

function videoBannerInit() {

  const modal = document.querySelector('.modal[data-modal-name="video-banner"]')
  modal.classList.add('_inited')

  new Swiper('[js-video-banner]', {
    wrapperClass: 'swiper-wrapper',
    slideClass: 'video-banner-slider__slide',
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 1,
    effect: 'fade',
    runCallbacksOnInit: false,
    fadeEffect: {
      crossFade: false
    },
    
    pagination: {
      el: '.video-banner-slider .swiper-pagination',
      clickable: 'true'
    },
    on: {
      slideChangeTransitionEnd: function () {
        const prevSlide = this.slides[this.previousIndex]
        prevSlide.querySelector('.fullscreen-stories-item-pagination .progress')?.classList.remove('playing', 'ended')
        prevSlide.querySelector('video')?.remove()
      },
      init: function () {
        this.el.querySelectorAll('.swiper-pagination-bullet').forEach((el) => {
          el.innerHTML = '<div class="progress"></div>'
        });
      },
      afterInit: onChange,
      slideChange: onChange,
      click: function (sw) {
        modal.querySelector('.modal__body').innerHTML = ''
        let videoCode
        try {
          let url = new URL(sw.slides[sw.realIndex].dataset.videoBannerHref)
          url.href.includes('embed')
            ? videoCode = url.pathname.replace('/embed/', '')
            : videoCode = url.searchParams.get('v')

        } catch (err) {

          console.log(err)
          return
        }
        if (videoCode) {
          modal.querySelector('.modal__body').innerHTML = `
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/${videoCode}"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
        `
          disableScroll()
          modal.classList.add('opened')
        }

      }
    },
  });
  
  function onChange(sw) {
    const prevSlide = this.slides[this.previousIndex]
    if(prevSlide){
      prevSlide.querySelector('.fullscreen-stories-item-pagination .progress')?.classList.remove('playing', 'ended')
      prevSlide.querySelector('video')?.remove()
    }
    const activeSlide = this.slides[this.activeIndex]
    const videoContainer = activeSlide.querySelector('.video-banner-slider__video')
    
    const video = document.createElement('video');
    video.setAttribute('playsinline', "")
    video.setAttribute('muted', "")
    video.muted = true
    video.setAttribute('autoplay', "autoplay")
    video.setAttribute('preload', "auto" )
    video.setAttribute('src', activeSlide.dataset.previewVideo )
    
    videoContainer.appendChild(video)
    
    videoContainer.querySelector('video').addEventListener('loadeddata', function (e) {
      e.target.classList.add('_loaded')
    }, { once: true })

    sw.el.querySelectorAll(`.swiper-pagination-bullet:nth-child(1n+${sw.realIndex}) .progress`).forEach((el) => {
      el.classList.remove('playing', 'ended')
    });
    sw.el.querySelectorAll(`.swiper-pagination-bullet:nth-child(-n+${sw.realIndex}) .progress`).forEach((el) => {
      el.classList.add('ended')
      el.classList.remove('playing')
    });
    sw.el.querySelector(`.swiper-pagination-bullet-active .progress`).classList.add('playing')
  }
}