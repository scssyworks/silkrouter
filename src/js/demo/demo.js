import $ from 'jquery';
import 'bootstrap';
import { router, route, unroute, routeIgnoreCase, param, deparam } from "../silkrouter";
import 'bootstrap/dist/css/bootstrap.css';
import './demo.css';

const _cache = {};
const demo = {
    updateCache() {
        _cache.homeLinks = $('.js-nav-item');
        _cache.demoPages = $('.js-demos');
        _cache.accordionBtns = $('.js-acc-btn-link');
        _cache.accordionSections = $('.js-collapsed-section');
        _cache.modalBtn = $('.js-wizard-btn');
        _cache.modalNextBtn = $('.js-proceed-step');
        _cache.modalWindow = $('.modal');
        _cache.wizardSections = $('.wizard-sections');
    },
    bindEvents() {
        route((e) => {
            if (!e.hash) {
                _cache.homeLinks.removeClass('active');
                let rootRoute = e.route;
                if ((/modalroute/).test(rootRoute)) {
                    rootRoute = rootRoute.substring(0, rootRoute.indexOf('/modalroute/'));
                } else {
                    _cache.modalWindow.modal('hide');
                }
                const target = _cache.homeLinks.filter(`[data-route="${rootRoute}"]`)
                    .addClass('active')
                    .data('target');
                _cache.demoPages.addClass('d-none');
                $(target).removeClass('d-none');
                if (
                    e.route === '/demos/demo1'
                    && !window.location.hash.trim()
                ) {
                    router.set('#/accordion1', true);
                }
            }
            if (e.hash) {
                if ((/accordion/).test(e.route)) {
                    _cache.accordionBtns.attr('aria-expanded', false);
                    _cache.accordionBtns.filter(`[data-route="${e.route}"]`).attr('aria-expanded', true);
                    _cache.accordionSections.removeClass('show');
                    _cache.accordionSections.filter(`[data-route="${e.route}"]`).addClass('show');
                }
            }
        });
        route('/demos/demo2/modalroute/:progress', function (config) {
            const { params } = config;
            let progress = +params.progress;
            // If modal is not already open then open the modal
            if (!_cache.modalWindow.hasClass('bs-visible')) {
                _cache.modalWindow.modal('show');
            }
            _cache.modalNextBtn.text((progress === _cache.wizardSections.length) ? 'Close this window' : 'Go to next step');
            // Activate wizard section based on current progress
            _cache.wizardSections
                .addClass('d-none').removeClass('active')
                .filter(`[data-step="${progress}"]`)
                .removeClass('d-none').addClass('active');
        });
        route('/demos/demo3', function (config) {
            const { data, query } = config;
            if (!$.isEmptyObject(query)) {
                $('.js-query-data').text(JSON.stringify(query, null, 2));
            } else {
                $('.js-query-data').text('No data!');
            }
            $('.js-storage-data').text(JSON.stringify(data, null, 2));
        });
        route(['/test/route', '#/test/route'], function (e) {
            console.log(e.route, e.hash);
        });
        _cache.homeLinks.find('.nav-link').on('click', function () {
            if ($(this).parent().data('route') === '/demos/demo3') {
                router.set({
                    route: $(this).parent().data('route'),
                    data: {
                        sample: 'Hello World!'
                    }
                });
            } else {
                router.set($(this).parent().data('route'));
            }
        });
        _cache.accordionBtns.on('click', function (e) {
            const self = $(this);
            if (self.attr('aria-expanded') === 'true') {
                e.stopPropagation();
            } else {
                router.set(self.data('route'), false, true);
            }
        });
        _cache.modalBtn.on('click', function () {
            router.set('/demos/demo2/modalroute/1'); // Go to first step
        });
        _cache.modalWindow
            .on('shown.bs.modal', function () {
                $(this).addClass('bs-visible');
            })
            .on('hide.bs.modal', function () {
                $(this).removeClass('bs-visible');
            });
        _cache.modalNextBtn.on('click', function () {
            const totalSteps = _cache.wizardSections.length;
            let activeStep = +_cache.wizardSections.filter('.active').data('step');
            if (activeStep === totalSteps) {
                // We are already on last page. Close the modal
                _cache.modalWindow.modal('hide');
                router.set('/demos/demo2');
            } else {
                router.set(`/demos/demo2/modalroute/${++activeStep}`);
            }
        });
        $('.js-query').on('click', function () {
            router.set({
                route: '/demos/demo3',
                queryString: 'q=value&r=othervalue'
            });
        });
    },
    init() {
        this.updateCache();
        this.bindEvents();
        console.log("Demo initialized");
        window.router = router;
        window.route = route;
        window.unroute = unroute;
        window.routeIgnoreCase = routeIgnoreCase;
        window.param = param;
        window.deparam = deparam;
    }
};
demo.init();