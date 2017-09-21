(function (w, $) {
    var demo = w.demo = w.demo || {},
        _cache = {};
    demo = {
        updateCache: function () {
            _cache.$links = $(".js-nav-item");
            _cache.$all = $(".js-demos");
            _cache.$home = $(".js-home-section");
            _cache.$demo1 = $(".js-demo-1");
            _cache.$demo2 = $(".js-demo-2");
            _cache.$demo3 = $(".js-demo-3");
        },
        bindEvents: function () {
            _cache.$home.route("/", function () {
                _cache.$all.addClass("d-none");
                $(this).removeClass("d-none");
            });
            _cache.$demo1.route("/demos/demo1", function () {
                _cache.$all.addClass("d-none");
                $(this).removeClass("d-none");
            });
            _cache.$demo2.route("/demos/demo2", function () {
                _cache.$all.addClass("d-none");
                $(this).removeClass("d-none");
            });
            _cache.$demo3.route("/demos/demo3", function () {
                _cache.$all.addClass("d-none");
                $(this).removeClass("d-none");
            });
            _cache.$links.on("click", function () {
                $.router.set($(this).data("route"));
                _cache.$links.removeClass("active");
                $(this).addClass("active");
            });
        },
        init: function () {
            this.updateCache();
            this.bindEvents();
            console.log("Demo initialized");
        }
    };
    demo.init();
})(
    window,
    window.jQuery
    );