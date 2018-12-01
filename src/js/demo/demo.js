
import { router, route } from "../../../dist/js/jquery.router";
import { select as $ } from '../helpers/select';

const _cache = {};
const demo = {
    updateCache: function () {
        _cache.$links = $(".js-nav-item");
        _cache.$all = $(".js-demos");
        _cache.$home = $(".js-home-section");
        _cache.$homeLink = $(".js-home-link");
        _cache.$demo1 = $(".js-demo-1");
        _cache.$demoLink1 = $(".js-demo-link-1");
        _cache.$demo2 = $(".js-demo-2");
        _cache.$demoLink2 = $(".js-demo-link-2");
        _cache.$demo3 = $(".js-demo-3");
        _cache.$demoLink3 = $(".js-demo-link-3");
        _cache.$accordionLinks = $(".js-card-reader a");
        _cache.$modal = $("#myModal");
        _cache.$modalOpen = $(".js-modal-open");
        _cache.$modalClose = $(".js-modal-close");
        _cache.$setData = $(".js-set-data");
        _cache.$paramData = $(".js-route-data");
        _cache.$queryData = $(".js-queryparam-data");
    },
    bindEvents: function () {
        _cache.$home.route("/", function () {
            _cache.$all.addClass("d-none");
            $(this).removeClass("d-none");
            _cache.$links.removeClass("active");
            _cache.$homeLink.addClass("active");
        });
        _cache.$demo1.route("/demos/demo1", function () {
            _cache.$all.addClass("d-none");
            $(this).removeClass("d-none");
            _cache.$links.removeClass("active");
            _cache.$demoLink1.addClass("active");
        });
        _cache.$demo2.route("/demos/demo2", function () {
            _cache.$all.addClass("d-none");
            $(this).removeClass("d-none");
            _cache.$links.removeClass("active");
            _cache.$demoLink2.addClass("active");
            _cache.$modal.modal("hide");
        });
        _cache.$demo3.route("/demos/demo3/:firstname/:lastname", function (data, param, query) {
            _cache.$all.addClass("d-none");
            $(this).removeClass("d-none");
            _cache.$links.removeClass("active");
            _cache.$demoLink3.addClass("active");
            _cache.$setData.text(JSON.stringify(data, null, 4));
            _cache.$paramData.find(".first-name").text(param.firstname);
            _cache.$paramData.find(".last-name").text(param.lastname);
            _cache.$queryData.text(JSON.stringify(query, null, 4));
        });
        $.route("/tab1", function (r) {
            if (r.hash) {
                _cache.$accordionLinks.filter("[data-route='/tab1']").trigger("click");
            }
        });
        $.route("/tab2", function (r) {
            if (r.hash) {
                _cache.$accordionLinks.filter("[data-route='/tab2']").trigger("click");
            }
        });
        $.route("/tab3", function (r) {
            if (r.hash) {
                _cache.$accordionLinks.filter("[data-route='/tab3']").trigger("click");
            }
        });
        $.route("/modalRoute", function () {
            _cache.$modal.modal("show");
        });
        _cache.$links.on("click", function () {
            $.router.set({
                route: $(this).data("route"),
                queryString: $(this).data("queryString")
            });
        });
        _cache.$accordionLinks.on("click", function (e) {
            if ($(this).attr("aria-expanded") === "true") {
                e.preventDefault();
                e.stopPropagation();
            }
            $.router.set(("#" + $(this).data("route")));
            console.log("Tab activated");
        });
        _cache.$modalOpen.on("click", function () {
            $.router.set(("#" + $(this).data("route")));
        });
        _cache.$modalClose.on("click", function () {
            history.back();
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