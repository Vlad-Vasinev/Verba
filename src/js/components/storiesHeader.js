function indexInParent(node) {
  var children = node.parentNode.childNodes;
  var num = 0;
  for (var i = 0; i < children.length; i++) {
    if (children[i] == node) return num;
    if (children[i].nodeType == 1) num++;
  }
  return -1;
}
function storiesHandler(e) {
  const storiesParentNode = e.currentTarget.closest('.stories').parentNode
  const storiesItems = storiesParentNode.querySelectorAll('.stories-item')
  const isMobile = window.innerWidth < 1023

  let videoMuteButton = document.querySelector('.stories-container .mute-button')

  let currentTimeout

  const storiesTpl = document.querySelector('[stories-full]').content.firstElementChild.cloneNode(true)
  const storyTpl = document.querySelector('[story-full]').content.firstElementChild.cloneNode(true)





  let currentIndex = indexInParent(e.currentTarget)
  const allSources = [];

  function fillChildSlider(el) {
    if (el.dataset.srcset) {
      let i = indexInParent(el)
      allSources[i] = [];
      const currentStory = storyTpl.cloneNode(true)
      const currentWrapper = currentStory.querySelector('.swiper-wrapper-inner')
      const previews = el.dataset.previews.split(',')


      el.dataset.srcset.split(',').forEach((source, sourceI) => {
        allSources[i].push(source);

        let slideB

        slideB = document.createElement('div');
        slideB.classList.add('swiper-slide-inner', 'child-slider-slide');


        slideB.dataset.innerType = source.toLowerCase().includes('mp4') || source.toLowerCase().includes('webm') ? 'video' : 'img'
        slideB.dataset.contentSrc = source
        slideB.dataset.bgImg = `url(${previews[sourceI]})`

        currentWrapper.appendChild(slideB)
      })
      let title = el.querySelector('h6').innerText
      let preview = el.querySelector('img').src

      let desc = document.createElement('div');
      desc.classList.add('description');
      desc.innerHTML = `<img src="${preview}"><h6>${title}</h6>`;

      currentStory.appendChild(desc);
      // let slide = $('<div class="swiper-slide"></div>').append(currentStory);
      let slide = document.createElement('div');
      slide.classList.add('swiper-slide');

      const sliderBackground = document.createElement('div')
      sliderBackground.classList.add('slider-background')
      sliderBackground.style.backgroundImg = `url(${previews[0]})`
      sliderBackground.setAttribute('style', `background-image: url(${previews[0]});`)
      currentStory.appendChild(sliderBackground);

      slide.appendChild(currentStory)


      storiesTpl.querySelector('.swiper-wrapper').appendChild(slide)
    }
  }
  function closeStories(e) {
    clearTimeout(currentTimeout)
    APP.Components.Stories.videoCounter = 0
    document.querySelector('.stories-full-story.swiper-container-initialized')?.swiper?.destroy();
    document.querySelector('.stories-full-bigSlider')?.swiper?.destroy();
    document.querySelector('.stories-container').classList.remove('active');
    document.querySelector('.stories-full-bigSlider').remove();
  }

  storiesItems.forEach(fillChildSlider)



  storiesParentNode.querySelector('.stories-container-inner').appendChild(storiesTpl)
  storiesParentNode.querySelector('.stories-container').classList.add('active')



  const storiesBigSlider = document.querySelector('.stories-full-bigSlider')

  const navigationEl = document.createElement('div')
  navigationEl.classList.add('swiper-navigation')
  navigationEl.innerHTML = '<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>'
  storiesBigSlider.appendChild(navigationEl)

  if (isMobile && !videoMuteButton) {
    const muteButton = document.createElement('button')
    muteButton.classList.add('mute-button', 'button_small')
    muteButton.innerText = 'Включить звук'

    window.videoWasUnmute = false
    videoMuteButton = document.querySelector('.stories-container').appendChild(muteButton)
    videoMuteButton?.addEventListener('click', (e) => {

      window.videoWasUnmute = !window.videoWasUnmute


      storiesBigSlider.querySelectorAll('video').forEach(function (vid) {
        vid.muted = !window.videoWasUnmute
      })

      videoMuteButton.classList.add('_hidden')

    })
  }

  const bigSliderObj = new Swiper('.stories-full-bigSlider', {
    initialSlide: currentIndex,
    wrapperClass: 'swiper-wrapper',
    slideClass: 'swiper-slide',
    centeredSlides: true,
    shortSwipes: false,
    // loop: true,
    spaceBetween: 0,
    runCallbacksOnInit: true,
    navigation: {
      nextEl: '.swiper-navigation .swiper-button-next',
      prevEl: '.swiper-navigation .swiper-button-prev',
    },
    breakpoints: {
      300: {
        slidesPerView: 1,
        shortSwipes: true
      },
      1024: {
        slidesPerView: 3,
        shortSwipes: false
      },
    },
    on: {
      init: function () {
        createChildSlider(this.slides[this.activeIndex].querySelectorAll('.stories-full-story')[0])
      },
      slideChangeTransitionStart: function () { clearTimeout(currentTimeout); },
      slideChange: function () {
        const prevSlide = this.slides[this.previousIndex]
        const nextSlide = this.slides[this.activeIndex + 1]


        prevSlide.querySelectorAll('video').forEach(
          (el) => {
            el.pause();
            el.currentTime = 0;
          }
        );

        createChildSlider(this.slides[this.activeIndex].querySelectorAll('.stories-full-story')[0]);
        prevSlide.querySelector('.stories-full-story')?.swiper?.el.swiper.el.querySelector('.slider-background')?.classList.remove('hidden')
        prevSlide.querySelector('.stories-full-story')?.swiper?.destroy();

      },
    },
  });



  function createChildSlider(el) {

    function onBeforeInit() {

      this.el.querySelectorAll('.swiper-wrapper-inner .child-slider-slide').forEach((el, sourceI) => {
        const type = el.dataset.innerType
        const source = el.dataset.contentSrc
        el.classList.add('loading')



        if (type == 'video') {
          const video = document.createElement('video');
          video.style.maxWidth = '100%'
          video.playsInline = true
          video.setAttribute('type', "video/mp4")
          video.setAttribute('preload', "auto")
          video.setAttribute('playsinline', "true")
          video.setAttribute('webkit-playsinline', "webkit-playsinline")
          // video.setAttribute('controls', "true")
          video.setAttribute('disablepictureinpicture', "true")
          
          if(isMobile){
            video.autoplay = true
          }
          if (window.videoWasUnmute || !isMobile) {
            video.muted = false
          }
          else {
            video.muted = true
            video.setAttribute('muted', 'true')
          }

          video.src = source
          el.appendChild(video)



        }
        else {
          el.innerHTML = `<img data-src="${source}">`
        }
        if (!(sourceI === 0)) {
          el?.firstChild?.classList.add('loading')
        }

      })

      // const videoSlides = 

    }

    function onInit() {
      this.buttonNextClickHandler = function (e) {
        clearTimeout(currentTimeout)
        if (this.slides.length > 1 && this.slides.length != (this.activeIndex + 1)) {
          this.slideNext();
        }
        else {
          bigSliderObj.slideNext();
        }
      }.bind(this)

      this.buttonPrevClickHandler = function (e) {
        clearTimeout(currentTimeout)
        if (this?.activeIndex != 0) {
          this.slidePrev();
        }
        else {
          bigSliderObj.slidePrev();
        }
      }.bind(this)

      this.el.querySelector('.swiper-button-next-in').addEventListener('click', this.buttonNextClickHandler)
      this.el.querySelector('.swiper-button-prev-in').addEventListener('click', this.buttonPrevClickHandler)

      this.el.querySelectorAll('.swiper-pagination-bullet').forEach((el) => {
        el.innerHTML = '<div class="progress"></div>'
      });
    }
    function onChange() {

      const activeSlide = this.slides[this.activeIndex]

      const prevSlide = this.slides[this.previousIndex]

      clearTimeout(currentTimeout)
      if (prevSlide) {
        prevSlide.querySelectorAll('video').forEach(
          (el) => {
            el.pause();
            el.currentTime = 0;
          }
        );
      }

      this.el.querySelectorAll(`.swiper-pagination-bullet:nth-child(1n+${this.activeIndex}) .progress`).forEach((el) => {
        el.classList.remove('playing', 'ended')
      });
      this.el.querySelectorAll(`.swiper-pagination-bullet:nth-child(-n+${this.activeIndex}) .progress`).forEach((el) => {
        el.classList.add('ended')
        el.classList.remove('playing')
      });

      playSlideMedia(activeSlide.querySelector('video, img'), this)

      function playSlideMedia(el, swiper) {
        const bullet = swiper.el.querySelector('.swiper-pagination-bullet-active .progress')


        switch (el?.tagName.toLowerCase()) {
          case 'img': {
            if(isMobile) videoMuteButton.classList.add('_hidden');
            if (!el.src) {
              el.src = el.dataset.src
            }
            if (el.complete) {
              playSliderImg(el, bullet, swiper)
            }
            else {
              el.addEventListener('load', function () {
                playSliderImg(el, bullet, swiper)
              }, { once: true })
            }
            break;

          }
          case 'video': {
            if(isMobile) !window.videoWasUnmute ? videoMuteButton.classList.remove('_hidden') : videoMuteButton.classList.add('_hidden');

            if (!el.src) {
              el.src = el.dataset.src
            }
            if (el.readyState === 4) {
              playSliderVideo(el, bullet, swiper)
            }
            else {
              el.addEventListener('loadeddata', function () {
                playSliderVideo(el, bullet, swiper)
                setTimeout(() => { if(!el.paused) el.closest('.swiper-slide-inner.loading')?.classList.remove('loading')  }, 100)
              }, { once: true })
            }
            break;
          }
          default: { break; }
        }
      }
      function playSliderVideo(videoEl, bullet, swiper) {

        // videoEl.classList.add('loading')
        if (videoEl.paused) {
          let playProm = videoEl.play();
          playProm.then(function () {
            videoEl.closest('.swiper-slide-inner.loading')?.classList.remove('loading')
            swiper.el.querySelector('.slider-background')?.classList.add('hidden')

          }, function (error) {
            console.log('play error');
            videoEl.controls = true

          });
        }
        const duration = videoEl.duration.toFixed(2)

        bullet.style.setProperty('--duration', `${videoEl.duration}s`);

        bullet.classList.add('playing')

        currentTimeout = setTimeout(function () {

          if (swiper?.slides?.length > 1 && !(swiper?.activeIndex + 1 >= swiper?.slides.length)) {
            swiper?.el?.swiper?.slideNext();
          }
          else {
            bigSliderObj.slideNext();
          }
        }, duration * 1000 + 50);

      }
      function playSliderImg(imgEl, bullet, swiper) {
        // $(imgEl).removeClass('loading');
        imgEl.closest('.swiper-slide-inner.loading')?.classList.remove('loading');
        swiper.el.querySelector('.slider-background')?.classList.add('hidden')

        bullet.style.setProperty('--duration', `${7.050}s`);
        bullet.classList.add('playing')

        currentTimeout = setTimeout(function () {

          if (swiper?.slides?.length > 1 && !(swiper?.activeIndex + 1 >= swiper?.slides.length)) {

            swiper?.el?.swiper?.slideNext();
          }
          else {

            bigSliderObj.slideNext();
          }
        }, 7000);
      }
    }

    new Swiper(el, {
      wrapperClass: 'swiper-wrapper-inner',
      slideClass: 'swiper-slide-inner',
      slidesPerView: 1,
      spaceBetween: 0,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      speed: 300,
      allowTouchMove: false,
      runCallbacksOnInit: false,
      pagination: {
        el: '.swiper-pagination',
      },
      pagination: {
        el: '.swiper-pagination',
      },
      on: {
        beforeInit: onBeforeInit,
        init: onInit,
        afterInit: onChange,
        slideChange: onChange,

        destroy: function () {
          clearTimeout(currentTimeout)
          this.el.querySelector('.swiper-button-next-in').removeEventListener('click', this.buttonNextClickHandler)
          this.el.querySelector('.swiper-button-prev-in').removeEventListener('click', this.buttonPrevClickHandler)
          this.el.querySelectorAll('.swiper-slide-inner video, .swiper-slide-inner img').forEach((el) => el.remove())
        },
      },
    });
  }

  document.querySelector('.stories-container .close-btn').addEventListener(
    'click',
    closeStories
    ,
    { once: true }
  );
}


(function ($, APP) {
  APP.Components.Stories = {
    videoCounter: 0,
    init: () => {
      if (document.querySelector('.stories')) {
        document.querySelectorAll('[js-story]').forEach(el => {
          el.addEventListener('click', storiesHandler)
        })
      }
    }
  }
})(jQuery, window.APP);

console.log('stories header')