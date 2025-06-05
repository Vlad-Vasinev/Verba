import "./functions/ymaps"

import { isMobile, isTablet, isDesktop } from './functions/check-viewport';
window.isMobile = isMobile

import Swiper, { Navigation, Pagination, EffectFade, Autoplay, Lazy } from 'swiper';
Swiper.use([Navigation, Pagination, EffectFade, Autoplay, Lazy]);
window.Swiper = Swiper
