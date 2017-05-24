(function() {
    var __extends = (this && this.__extends) || (function() {
        var extendStatics = Object.setPrototypeOf ||
            ({
                    __proto__: []
                }
                instanceof Array && function(d, b) {
                    d.__proto__ = b;
                }) ||
            function(d, b) {
                for (var p in b)
                    if (b.hasOwnProperty(p)) d[p] = b[p];
            };
        return function(d, b) {
            extendStatics(d, b);

            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var View = (function() {
        function View(request) {
            this.Element = request.Element;
        }
        return View;
    }());
    var ProjectsView = (function(_super) {
        __extends(ProjectsView, _super);

        function ProjectsView(request) {
            return _super.call(this, request) || this;
        }
        return ProjectsView;
    }(View));
    var WindowView = (function(_super) {
        __extends(WindowView, _super);

        function WindowView(request) {
            return _super.call(this, request) || this;
        }
        return WindowView;
    }(View));
    var ConsoleView = (function(_super) {
        __extends(ConsoleView, _super);

        function ConsoleView(request) {
            return _super.call(this, request) || this;
        }
        return ConsoleView;
    }(View));
    var Editor = (function() {
        function Editor() {}
        return Editor;
    }());
    //# sourceMappingURL=editor.js.map
    window.Editor = new Editor;
})();