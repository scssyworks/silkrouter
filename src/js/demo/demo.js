
import { router, route } from "../jquery.router";
import { select as $ } from '../helpers/select';

$.router = $.fn.route = route;
$.router = router;

const _cache = {};
const demo = {
    updateCache: function () {
        _cache.homeLinks = $('.js-nav-item');
    },
    bindEvents: function () {
        _cache.homeLinks.find('.nav-link').on('click', function () {
            $.router.set($(this).data('route'));
        });

    },
    init: function () {
        this.updateCache();
        this.bindEvents();
        console.log("Demo initialized");
        $.router.init();
    }
};
demo.init();