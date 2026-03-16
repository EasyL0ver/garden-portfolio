// jQuery – expose as global (Bootstrap and legacy code depend on window.$)
import $ from 'jquery';
window.$ = window.jQuery = $;

// Bootstrap (requires @popperjs/core, resolved via npm)
import 'bootstrap';

// Flickity + plugins
import Flickity from 'flickity';
import 'flickity-as-nav-for';
import 'flickity-imagesloaded';
window.Flickity = Flickity;
