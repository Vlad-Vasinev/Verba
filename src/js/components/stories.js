import { disableScroll } from ".././functions/disable-scroll";
import { enableScroll } from ".././functions/enable-scroll";

let parentContainer;

class storiesOptions {
  reverse = false;
  swiper = "true";
}

document.querySelectorAll(".stories-block_reviews").forEach((el) => {
  initStories(el, {
    reverse: el.dataset.storiesReverse || false,
    swiper:
      el.dataset.storiesSwiper == undefined ? el.dataset.storiesSwiper : true,
  });
});

function initStories(storiesBlock, options = {}) {
  var fullScreenSlider;
  let currentTimeout;

  const muteButtons = [];
  if (storiesBlock) {
    if (options.swiper == "true") {
      new Swiper("[js-stories-img-slider]", {
        wrapperClass: "swiper-wrapper",
        slideClass: "swiper-slide",
        allowTouchMove: true,
        navigation: {
          nextEl: "[js-stories-img-slider] .swiper-button-next",
          prevEl: "[js-stories-img-slider] .swiper-button-prev",
        },
        pagination: {
          el: ".stories-container .swiper-pagination",
          type: "fraction",
        },
        breakpoints: {
          200: {
            cssMode: false,
            spaceBetween: 6,
            slidesPerView: 2,
            pagination: {
              el: ".stories-bg .navigation-fraction .navigation-fraction__pagination",
              type: "bullets",
              clickable: true,
            },
          },
          769: {
            cssMode: true,
            spaceBetween: 10,
            slidesPerView: 4,
          },
          1022: {
            spaceBetween: 10,
            slidesPerView: 4,
          },
        },
        on: {
          init: function () {
            if (this.slides.length <= this.params.slidesPerView) {
              this.$el.find(".swiper-navigation").css("display", "none");
            }
          },
        },
      });
    }

    const storiesItems = storiesBlock.querySelectorAll(".stories-item");

    if (options.reverse) {
      Array.from(storiesItems)
        .reverse()
        .forEach((el, index, array) => {
          el.addEventListener("click", (e) => storiesOpen(e, index));
        });
    } else {
      storiesItems.forEach((el, index, array) => {
        el.addEventListener("click", (e) => storiesOpen(e, index));
      });
    }

    if (!isMobile()) {
      document
        .querySelector(".stories-container .stories-bg")
        .addEventListener("click", closeSlider);
    }
    document
      .querySelector(".stories-container .close-btn")
      .addEventListener("click", closeSlider);

    document.querySelector('.stories-container .stories-container-inner .orange-button').addEventListener('click', (e) => {
      if(document.querySelector('.usluga-offer')) {
        document.querySelector('.usluga-offer').classList.remove('_visible')
      }
      closeSlider()
    })

    function closeSlider() {
      document
        .querySelector(".stories-container")
        .classList.remove("is-active");
      document
        .querySelectorAll(".fullscreen-stories.swiper-wrapper video")
        .forEach((el) => el.pause());
      document.querySelector(".fullscreen-stories.swiper-wrapper").innerHTML =
        "";

      enableScroll();
      // document.querySelectorAll('.stories-container video').forEach((item) => {
      //   item.remove()
      // })
      fullScreenSlider?.destroy();
    }
    function storiesOpen(e, index = 0) {
      console.log(e.target.parentElement.parentElement.parentElement);
      parentContainer = e.target.parentElement.parentElement.parentElement; //.parentElement.parentElement.parentElement
      console.log(e.currentTarget.dataset.slideIndex);
      console.log("stories open");
      fullscreenSliderInit(index); //e.currentTarget.dataset.slideIndex

      document.querySelector(".stories-container").classList.add("is-active");
      disableScroll();
      const videoContainer = fullScreenSlider.slides[
        fullScreenSlider.activeIndex
      ].querySelectorAll(".fullscreen-stories-item-video");
      console.log(videoContainer);
      const bullet = fullScreenSlider.slides[
        fullScreenSlider.activeIndex
      ].querySelector(".fullscreen-stories-item-pagination .progress");
    }
    function fullscreenSliderInit(clickedIndex) {
      const previewsArr = parentContainer.querySelectorAll(".stories-item");
      previewsArr.forEach(function (item, index, array) {
        item.dataset.slideIndex = index;
        const imgSrc = item.dataset.previewSrc;

        const slide = document.createElement("div");
        slide.className = "fullscreen-stories-item swiper-slide";
        slide.innerHTML = `

          <div data-video-src="${
            item.dataset.videoSrc
          }" data-slide-index=${index} class="fullscreen-stories-item-video">
          <div class='preview-img' style='background-image: url(${imgSrc})'></div>
            ${
              isMobile()
                ? "<button class='mute-button button_small'>Включить звук</button>"
                : ""
            }
          </div>
          <div class="fullscreen-stories-item-description">
            <p class="ph5">${
              item.querySelector(".stories-item-desc > *").textContent
            }</p>
          </div>`;
        const mounted = document
          .querySelector(".fullscreen-stories.swiper-wrapper")
          .appendChild(slide);
        if (isMobile() && mounted) {
          const muteButton = mounted?.querySelector(".mute-button");
          if (!muteButton) {
            return;
          }
          muteButtons.push(muteButton);
          muteButton?.addEventListener("click", (e) => {
            window.videoWasUnmute
              ? (window.videoWasUnmute = false)
              : (window.videoWasUnmute = true);
            const vid = e.currentTarget.parentNode.querySelector("video");
            if (vid) {
              vid.muted = false;
            }
            muteButtons.forEach((el) => {
              el.remove();
            });
            // if (vid) {
            //   if (vid.muted) {
            //     vid.muted = false
            //     // e.currentTarget.innerText = 'Выключить звук'
            //   }
            //   else {
            //     vid.muted = true
            //     // e.currentTarget.innerText = 'Включить звук'
            //   }
            // }
          });
        }
      });

      fullScreenSlider = new Swiper(".stories-container-inner", {
        wrapperClass: "swiper-wrapper",
        slideClass: "swiper-slide",
        slidesPerView: 3.5,
        spaceBetween: 0,
        centeredSlides: true,
        navigation: {
          nextEl: ".stories-container-inner .swiper-button-next",
          prevEl: ".stories-container-inner .swiper-button-prev",
        },
        // pagination: {
        //   el: '.stories-container-inner pagination-container',
        //   type: 'fraction',
        // },
        allowTouchMove: false,
        runCallbacksOnInit: true,
        breakpoints: {
          200: {
            spaceBetween: 0,
            slidesPerView: 1,
            allowTouchMove: true,
            pagination: {
              el: ".stories-container-inner .navigation-fraction .navigation-fraction__pagination",
              type: "bullets",
              clickable: true,
            },
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
          // afterInit: onChange
        },
      });
      console.log("index", clickedIndex);
      clickedIndex == 0 || clickedIndex == undefined
        ? onChange(fullScreenSlider)
        : fullScreenSlider.slideTo(clickedIndex, 0);

      function onChange(swiper) {
        console.log("onChange");

        clearTimeout(currentTimeout);

        console.log(swiper.activeIndex);
        console.log(swiper.previousIndex);
        const activeSlide = swiper.slides[swiper.activeIndex];
        const prevSlide = swiper.slides[swiper.previousIndex];
        console.log(prevSlide);

        if (prevSlide) {
          console.log(prevSlide?.querySelector("video"));
          // vlad-comment
          //prevSlide.querySelector('.fullscreen-stories-item-pagination .progress')?.classList.remove('playing', 'ended')
          prevSlide.querySelector("video")?.pause();
          prevSlide.querySelector("video")?.remove();
        }

        const videoContainer = activeSlide.querySelector(
          ".fullscreen-stories-item-video"
        );
        // vlad-comment
        //const bullet = activeSlide.querySelector('.fullscreen-stories-item-pagination .progress')

        const video = document.createElement("video");

        video.setAttribute("playsinline", "");
        video.setAttribute("autoplay", "autoplay");
        video.autoplay = true;
        if (!window.videoWasUnmute) {
          //video.setAttribute('muted', "")
          //video.muted = true
        }
        // video.setAttribute('controls', "true  ")
        // video.setAttribute('loop', "loop")
        video.setAttribute("preload", "auto");

        video.setAttribute("src", videoContainer.dataset.videoSrc);
        videoContainer.appendChild(video);

        const videoEl = videoContainer.querySelector("video");
        if (videoEl.readyState === 4) {
          playSliderVideo(videoEl, bullet, swiper);
        } else {
          videoEl.addEventListener(
            "loadeddata",
            function () {
              playSliderVideo(videoEl, bullet, swiper);
            },
            { once: true }
          );
        }
      }

      function playSliderVideo(videoEl, bullet, swiper) {
        // videoEl.classList.add('loading')
        if (videoEl.paused) {
          console.log("play", videoEl);
          let playProm = videoEl.play();
          playProm.then(
            function () {
              // videoEl.closest('.swiper-slide-inner.loading')?.classList.remove('loading')
              // swiper.el.querySelector('.slider-background')?.classList.add('hidden')
            },
            function (error) {
              console.log("play error");
              console.log(error);
              videoEl.controls = true;
              // videoEl.addEventListener('click', (e) => {
              //   videoEl.play()
              // }, { once: true })
              // videoEl.setAttribute()
              // добавить сюда чтобы показывало кнопку плей
            }
          );
        }
        const duration = videoEl.duration.toFixed(2);
        bullet.style.setProperty("--duration", `${videoEl.duration}s`);
        bullet.classList.add("playing");
        currentTimeout = setTimeout(function () {
          swiper?.slideNext();
        }, duration * 1000 + 50);
      }
    }
  }
}

// document.querySelector('.stories-container .stories-container-inner .orange-button').addEventListener('click', (e) => {
//   if(document.querySelector('.usluga-offer')) {
//     document.querySelector('.usluga-offer').classList.remove('_visible')
//   }
//   closeSlider()
// })