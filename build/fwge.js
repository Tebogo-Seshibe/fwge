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
    var BufferedArray = (function() {
        function BufferedArray(args) {
            this.Buffer = new Array(args);
        }
        return BufferedArray;
    }());
    var KeyFrame = (function() {
        function KeyFrame(request) {
            this.Before = request.Before;
            this.After = request.After;
            this.Length = request.Length;
        }
        return KeyFrame;
    }());
    var Converter = (function() {
        function Converter() {}
        Converter.prototype.Read = function(path) {
            var xml = new XMLHttpRequest();
            xml.open('GET', path, false);
            xml.send(null);
            return xml.responseText;
        };
        Converter.prototype.Parse = function() {
            var files = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                files[_i] = arguments[_i];
            }
            return;
        };;
        Converter.prototype.GameObject = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return;
        };;
        Converter.prototype.Mesh = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return;
        };;
        Converter.prototype.RenderMaterial = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return;
        };;
        return Converter;
    }());
    var Item = (function() {
        function Item(name) {
            this.Name = name;
            this.ID = Item.hashcode(Item.ID_COUNTER++);
        }
        Item.hashcode = function(number) {
            var i = 0;
            var hash = 0;
            var chr = 0;
            var string = number + "";
            for (i = 0; i < string.length; i++) {
                chr = string.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0;
            }
            return hash;
        };
        return Item;
    }());
    Item.ID_COUNTER = 0;
    var GameItem = (function(_super) {
        __extends(GameItem, _super);

        function GameItem(name, gameObject) {
            var _this = _super.call(this, name) || this;
            _this.GameObject = gameObject;
            return _this;
        }
        return GameItem;
    }(Item));
    var ITransform = (function() {
        function ITransform() {
            this.Position = [0, 0, 0];
            this.Rotation = [0, 0, 0];
            this.Scale = [1, 1, 1];
            this.Shear = [0, 0, 0];
        }
        return ITransform;
    }());
    var Transform = (function() {
        function Transform(request) {
            this.UP = new Vector3(0, 1, 0);
            this.FORWARD = new Vector3(0, 0, 1);
            this.RIGHT = new Vector3(1, 0, 0);
            if (!request)
                request = new ITransform();
            this.Position = new Vector3(request.Position);
            this.Rotation = new Vector3(request.Rotation);
            this.Scale = new Vector3(request.Scale);
            this.Shear = new Vector3(request.Shear);
        }
        Transform.prototype.Update = function() {};
        return Transform;
    }());
    var Input = (function() {
        function Input(canvas) {
            for (var i = 0; i < Input.PRESS_K; ++i)
                Input.Keys.push(true);
            for (var i = Input.PRESS_K; i < Input.END_K; ++i)
                Input.Keys.push(false);
            for (var i = 0; i < Input.CLICK_M; ++i)
                Input.Mouse.push(true);
            for (var i = Input.CLICK_M; i < Input.END_M; ++i)
                Input.Mouse.push(false);
            for (var i = 0; i < Input.END_A; ++i)
                Input.Axis.push(undefined);
            canvas.onkeyup = function onkeyup(e) {
                var key = Input.handle_event(e);
                Input.Keys[key + Input.UP_K] = true;
                Input.Keys[key + Input.PRESS_K] = false;
                Input.Keys[key + Input.DOWN_K] = false;
            };
            canvas.onkeydown = function onkeydown(e) {
                var key = Input.handle_event(e);
                Input.Keys[key + Input.UP_K] = false;
                Input.Keys[key + Input.PRESS_K] = true;
                Input.Keys[key + Input.DOWN_K] = true;
            };
            canvas.oncontextmenu = function oncontextmenu(e) {
                Input.handle_event(e);
                return false;
            };
            canvas.onmouseenter = function onmouseenter(e) {
                Input.Axis[Input._X + Input.PREV_A] = e.clientX;
                Input.Axis[Input._Y + Input.PREV_A] = e.clientY;
                Input.Axis[Input._X + Input.CURR_A] = e.clientX;
                Input.Axis[Input._Y + Input.CURR_A] = e.clientY;
                Input.Axis[Input._X + Input.DELTA_A] = 0;
                Input.Axis[Input._Y + Input.DELTA_A] = 0;
            };
            canvas.onmousemove = function onmousemove(e) {
                if (!Input.Axis[Input._X + Input.CURR_A] || !Input.Axis[Input._Y + Input.CURR_A]) {
                    Input.Axis[Input._X + Input.CURR_A] = e.clientX;
                    Input.Axis[Input._Y + Input.CURR_A] = e.clientY;
                }
                Input.Axis[Input._X + Input.PREV_A] = Input.Axis[Input._X + Input.CURR_A];
                Input.Axis[Input._Y + Input.PREV_A] = Input.Axis[Input._Y + Input.CURR_A];
                Input.Axis[Input._X + Input.CURR_A] = e.clientX;
                Input.Axis[Input._Y + Input.CURR_A] = e.clientY;
                Input.Axis[Input._X + Input.DELTA_A] = Input.Axis[Input._X + Input.CURR_A] - Input.Axis[Input._X + Input.PREV_A];
                Input.Axis[Input._Y + Input.DELTA_A] = Input.Axis[Input._Y + Input.CURR_A] - Input.Axis[Input._Y + Input.PREV_A];
            };
            canvas.onmouseleave = function onmouseleave(e) {
                Input.Axis[Input._X + Input.PREV_A] = undefined;
                Input.Axis[Input._Y + Input.PREV_A] = undefined;
                Input.Axis[Input._X + Input.CURR_A] = undefined;
                Input.Axis[Input._Y + Input.CURR_A] = undefined;
                Input.Axis[Input._X + Input.DELTA_A] = 0;
                Input.Axis[Input._Y + Input.DELTA_A] = 0;
            };
            canvas.onmouseup = function onmouseup(e) {
                var key = Input.handle_event(e);
                Input.Mouse[key + Input.UP_M] = true;
                Input.Mouse[key + Input.CLICK_M] = false;
                Input.Mouse[key + Input.DOWN_M] = false;
            };
            canvas.onmousedown = function onmousedown(e) {
                var key = Input.handle_event(e);
                Input.Mouse[key + Input.UP_M] = false;
                Input.Mouse[key + Input.CLICK_M] = true;
                Input.Mouse[key + Input.DOWN_M] = true;
            };
            canvas.onmousewheel = function onmousewheel(e) {
                Input.Mouse[e.deltaY < 0 ? Input.WHEEL_U : Input.WHEEL_D] = true;
            };
        }
        Input.handle_event = function(e) {
            var key = e instanceof MouseEvent ? e.button : e.which || 0;
            e.preventDefault();
            e.stopPropagation();
            e.cancelBubble = true;
            return key;
        };
        Object.defineProperty(Input.prototype, "KeyF1Up", {
            get: function() {
                return Input.Keys[112 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF1Press", {
            get: function() {
                return Input.Keys[112 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF1Down", {
            get: function() {
                return Input.Keys[112 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF2Up", {
            get: function() {
                return Input.Keys[113 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF2Press", {
            get: function() {
                return Input.Keys[113 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF2Down", {
            get: function() {
                return Input.Keys[113 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF3Up", {
            get: function() {
                return Input.Keys[114 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF3Press", {
            get: function() {
                return Input.Keys[114 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF3Down", {
            get: function() {
                return Input.Keys[114 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF4Up", {
            get: function() {
                return Input.Keys[115 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF4Press", {
            get: function() {
                return Input.Keys[115 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF4Down", {
            get: function() {
                return Input.Keys[115 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF5Up", {
            get: function() {
                return Input.Keys[116 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF5Press", {
            get: function() {
                return Input.Keys[116 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF5Down", {
            get: function() {
                return Input.Keys[116 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF6Up", {
            get: function() {
                return Input.Keys[117 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF6Press", {
            get: function() {
                return Input.Keys[117 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF6Down", {
            get: function() {
                return Input.Keys[117 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF7Up", {
            get: function() {
                return Input.Keys[118 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF7Press", {
            get: function() {
                return Input.Keys[118 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF7Down", {
            get: function() {
                return Input.Keys[118 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF8Up", {
            get: function() {
                return Input.Keys[119 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF8Press", {
            get: function() {
                return Input.Keys[119 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF8Down", {
            get: function() {
                return Input.Keys[119 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF9Up", {
            get: function() {
                return Input.Keys[120 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF9Press", {
            get: function() {
                return Input.Keys[120 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF9Down", {
            get: function() {
                return Input.Keys[120 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF10Up", {
            get: function() {
                return Input.Keys[121 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF10Press", {
            get: function() {
                return Input.Keys[121 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF10Down", {
            get: function() {
                return Input.Keys[121 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF11Up", {
            get: function() {
                return Input.Keys[122 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF11Press", {
            get: function() {
                return Input.Keys[122 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF11Down", {
            get: function() {
                return Input.Keys[122 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF12Up", {
            get: function() {
                return Input.Keys[123 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF12Press", {
            get: function() {
                return Input.Keys[123 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyF12Down", {
            get: function() {
                return Input.Keys[123 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key0Up", {
            get: function() {
                return Input.Keys[48 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key0Press", {
            get: function() {
                return Input.Keys[48 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key0Down", {
            get: function() {
                return Input.Keys[48 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key1Up", {
            get: function() {
                return Input.Keys[49 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key1Press", {
            get: function() {
                return Input.Keys[49 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key1Down", {
            get: function() {
                return Input.Keys[49 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key2Up", {
            get: function() {
                return Input.Keys[50 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key2Press", {
            get: function() {
                return Input.Keys[50 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key2Down", {
            get: function() {
                return Input.Keys[50 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key3Up", {
            get: function() {
                return Input.Keys[51 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key3Press", {
            get: function() {
                return Input.Keys[51 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key3Down", {
            get: function() {
                return Input.Keys[51 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key4Up", {
            get: function() {
                return Input.Keys[52 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key4Press", {
            get: function() {
                return Input.Keys[52 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key4Down", {
            get: function() {
                return Input.Keys[52 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key5Up", {
            get: function() {
                return Input.Keys[53 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key5Press", {
            get: function() {
                return Input.Keys[53 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key5Down", {
            get: function() {
                return Input.Keys[53 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key6Up", {
            get: function() {
                return Input.Keys[54 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key6Press", {
            get: function() {
                return Input.Keys[54 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key6Down", {
            get: function() {
                return Input.Keys[54 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key7Up", {
            get: function() {
                return Input.Keys[55 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key7Press", {
            get: function() {
                return Input.Keys[55 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key7Down", {
            get: function() {
                return Input.Keys[55 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key8Up", {
            get: function() {
                return Input.Keys[56 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key8Press", {
            get: function() {
                return Input.Keys[56 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key8Down", {
            get: function() {
                return Input.Keys[56 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key9Up", {
            get: function() {
                return Input.Keys[57 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key9Press", {
            get: function() {
                return Input.Keys[57 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Key9Down", {
            get: function() {
                return Input.Keys[57 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad0Up", {
            get: function() {
                return Input.Keys[96 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad0Press", {
            get: function() {
                return Input.Keys[96 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad0Down", {
            get: function() {
                return Input.Keys[96 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad1Up", {
            get: function() {
                return Input.Keys[97 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad1Press", {
            get: function() {
                return Input.Keys[97 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad1Down", {
            get: function() {
                return Input.Keys[97 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad2Up", {
            get: function() {
                return Input.Keys[98 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad2Press", {
            get: function() {
                return Input.Keys[98 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad2Down", {
            get: function() {
                return Input.Keys[98 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad3Up", {
            get: function() {
                return Input.Keys[99 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad3Press", {
            get: function() {
                return Input.Keys[99 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad3Down", {
            get: function() {
                return Input.Keys[99 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad4Up", {
            get: function() {
                return Input.Keys[100 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad4Press", {
            get: function() {
                return Input.Keys[100 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad4Down", {
            get: function() {
                return Input.Keys[100 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad5Up", {
            get: function() {
                return Input.Keys[101 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad5Press", {
            get: function() {
                return Input.Keys[101 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad5Down", {
            get: function() {
                return Input.Keys[101 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad6Up", {
            get: function() {
                return Input.Keys[102 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad6Press", {
            get: function() {
                return Input.Keys[102 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad6Down", {
            get: function() {
                return Input.Keys[102 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad7Up", {
            get: function() {
                return Input.Keys[103 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad7Press", {
            get: function() {
                return Input.Keys[103 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad7Down", {
            get: function() {
                return Input.Keys[103 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad8Up", {
            get: function() {
                return Input.Keys[104 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad8Press", {
            get: function() {
                return Input.Keys[104 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad8Down", {
            get: function() {
                return Input.Keys[104 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad9Up", {
            get: function() {
                return Input.Keys[105 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad9Press", {
            get: function() {
                return Input.Keys[105 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "Numpad9Down", {
            get: function() {
                return Input.Keys[105 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyDivideUp", {
            get: function() {
                return Input.Keys[111 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyDividePress", {
            get: function() {
                return Input.Keys[111 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyDivideDown", {
            get: function() {
                return Input.Keys[111 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyMultiplyUp", {
            get: function() {
                return Input.Keys[106 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyMultiplyPress", {
            get: function() {
                return Input.Keys[106 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyMultiplyDown", {
            get: function() {
                return Input.Keys[106 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeySubtractUp", {
            get: function() {
                return Input.Keys[109 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeySubtractPress", {
            get: function() {
                return Input.Keys[109 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeySubtractDown", {
            get: function() {
                return Input.Keys[109 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyAddUp", {
            get: function() {
                return Input.Keys[107 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyAddPress", {
            get: function() {
                return Input.Keys[107 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyAddDown", {
            get: function() {
                return Input.Keys[107 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyTabUp", {
            get: function() {
                return Input.Keys[9 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyTabPress", {
            get: function() {
                return Input.Keys[9 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyTabDown", {
            get: function() {
                return Input.Keys[9 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyCapsUp", {
            get: function() {
                return Input.Keys[20 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyCapsPress", {
            get: function() {
                return Input.Keys[20 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyCapsDown", {
            get: function() {
                return Input.Keys[20 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyShiftUp", {
            get: function() {
                return Input.Keys[16 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyShiftPress", {
            get: function() {
                return Input.Keys[16 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyShiftDown", {
            get: function() {
                return Input.Keys[16 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyCtrlUp", {
            get: function() {
                return Input.Keys[17 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyCtrlPress", {
            get: function() {
                return Input.Keys[17 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyCtrlDown", {
            get: function() {
                return Input.Keys[17 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyAltUp", {
            get: function() {
                return Input.Keys[18 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyAltPress", {
            get: function() {
                return Input.Keys[18 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyAltDown", {
            get: function() {
                return Input.Keys[18 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyBackspaceUp", {
            get: function() {
                return Input.Keys[8 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyBackspacePress", {
            get: function() {
                return Input.Keys[8 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyBackspaceDown", {
            get: function() {
                return Input.Keys[8 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyEnterUp", {
            get: function() {
                return Input.Keys[13 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyEnterPress", {
            get: function() {
                return Input.Keys[13 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyEnterDown", {
            get: function() {
                return Input.Keys[13 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyUpUp", {
            get: function() {
                return Input.Keys[38 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyUpPress", {
            get: function() {
                return Input.Keys[38 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyUpDown", {
            get: function() {
                return Input.Keys[38 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyLeftUp", {
            get: function() {
                return Input.Keys[37 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyLeftPress", {
            get: function() {
                return Input.Keys[37 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyLeftDown", {
            get: function() {
                return Input.Keys[37 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyRightUp", {
            get: function() {
                return Input.Keys[39 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyRightPress", {
            get: function() {
                return Input.Keys[39 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyRightDown", {
            get: function() {
                return Input.Keys[39 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyDownUp", {
            get: function() {
                return Input.Keys[40 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyDownPress", {
            get: function() {
                return Input.Keys[40 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyDownDown", {
            get: function() {
                return Input.Keys[40 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyAUp", {
            get: function() {
                return Input.Keys[65 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyAPress", {
            get: function() {
                return Input.Keys[65 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyADown", {
            get: function() {
                return Input.Keys[65 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyBUp", {
            get: function() {
                return Input.Keys[66 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyBPress", {
            get: function() {
                return Input.Keys[66 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyBDown", {
            get: function() {
                return Input.Keys[66 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyCUp", {
            get: function() {
                return Input.Keys[67 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyCPress", {
            get: function() {
                return Input.Keys[67 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyCDown", {
            get: function() {
                return Input.Keys[67 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyDUp", {
            get: function() {
                return Input.Keys[68 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyDPress", {
            get: function() {
                return Input.Keys[68 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyDDown", {
            get: function() {
                return Input.Keys[68 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyEUp", {
            get: function() {
                return Input.Keys[69 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyEPress", {
            get: function() {
                return Input.Keys[69 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyEDown", {
            get: function() {
                return Input.Keys[69 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyFUp", {
            get: function() {
                return Input.Keys[70 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyFPress", {
            get: function() {
                return Input.Keys[70 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyFDown", {
            get: function() {
                return Input.Keys[70 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyGUp", {
            get: function() {
                return Input.Keys[71 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyGPress", {
            get: function() {
                return Input.Keys[71 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyGDown", {
            get: function() {
                return Input.Keys[71 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyHUp", {
            get: function() {
                return Input.Keys[72 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyHPress", {
            get: function() {
                return Input.Keys[72 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyHDown", {
            get: function() {
                return Input.Keys[72 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyIUp", {
            get: function() {
                return Input.Keys[73 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyIPress", {
            get: function() {
                return Input.Keys[73 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyIDown", {
            get: function() {
                return Input.Keys[73 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyJUp", {
            get: function() {
                return Input.Keys[74 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyJPress", {
            get: function() {
                return Input.Keys[74 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyJDown", {
            get: function() {
                return Input.Keys[74 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyKUp", {
            get: function() {
                return Input.Keys[75 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyKPress", {
            get: function() {
                return Input.Keys[75 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyKDown", {
            get: function() {
                return Input.Keys[75 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyLUp", {
            get: function() {
                return Input.Keys[76 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyLPress", {
            get: function() {
                return Input.Keys[76 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyLDown", {
            get: function() {
                return Input.Keys[76 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyMUp", {
            get: function() {
                return Input.Keys[77 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyMPress", {
            get: function() {
                return Input.Keys[77 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyMDown", {
            get: function() {
                return Input.Keys[77 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyNUp", {
            get: function() {
                return Input.Keys[78 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyNPress", {
            get: function() {
                return Input.Keys[78 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyNDown", {
            get: function() {
                return Input.Keys[78 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyOUp", {
            get: function() {
                return Input.Keys[79 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyOPress", {
            get: function() {
                return Input.Keys[79 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyODown", {
            get: function() {
                return Input.Keys[79 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyPUp", {
            get: function() {
                return Input.Keys[80 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyPPress", {
            get: function() {
                return Input.Keys[80 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyPDown", {
            get: function() {
                return Input.Keys[80 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyQUp", {
            get: function() {
                return Input.Keys[81 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyQPress", {
            get: function() {
                return Input.Keys[81 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyQDown", {
            get: function() {
                return Input.Keys[81 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyRUp", {
            get: function() {
                return Input.Keys[82 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyRPress", {
            get: function() {
                return Input.Keys[82 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyRDown", {
            get: function() {
                return Input.Keys[82 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeySUp", {
            get: function() {
                return Input.Keys[83 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeySPress", {
            get: function() {
                return Input.Keys[83 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeySDown", {
            get: function() {
                return Input.Keys[83 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyTUp", {
            get: function() {
                return Input.Keys[84 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyTPress", {
            get: function() {
                return Input.Keys[84 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyTDown", {
            get: function() {
                return Input.Keys[84 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyUUp", {
            get: function() {
                return Input.Keys[85 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyUPress", {
            get: function() {
                return Input.Keys[85 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyUDown", {
            get: function() {
                return Input.Keys[85 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyVUp", {
            get: function() {
                return Input.Keys[86 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyVPress", {
            get: function() {
                return Input.Keys[86 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyVDown", {
            get: function() {
                return Input.Keys[86 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyWUp", {
            get: function() {
                return Input.Keys[87 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyWPress", {
            get: function() {
                return Input.Keys[87 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyWDown", {
            get: function() {
                return Input.Keys[87 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyXUp", {
            get: function() {
                return Input.Keys[88 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyXPress", {
            get: function() {
                return Input.Keys[88 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyXDown", {
            get: function() {
                return Input.Keys[88 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyYUp", {
            get: function() {
                return Input.Keys[89 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyYPress", {
            get: function() {
                return Input.Keys[89 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyYDown", {
            get: function() {
                return Input.Keys[89 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyZUp", {
            get: function() {
                return Input.Keys[90 + Input.UP_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyZPress", {
            get: function() {
                return Input.Keys[90 + Input.PRESS_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "KeyZDown", {
            get: function() {
                return Input.Keys[90 + Input.DOWN_K];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "MouseLeftUp", {
            get: function() {
                return Input.Mouse[0 + Input.UP_M];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "MouseLeftClick", {
            get: function() {
                return Input.Mouse[0 + Input.CLICK_M];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "MouseLeftDown", {
            get: function() {
                return Input.Mouse[0 + Input.DOWN_M];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "MouseMiddleUp", {
            get: function() {
                return Input.Mouse[1 + Input.UP_M];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "MouseMiddleClick", {
            get: function() {
                return Input.Mouse[1 + Input.CLICK_M];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "MouseMiddleDown", {
            get: function() {
                return Input.Mouse[1 + Input.DOWN_M];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "MouseRightUp", {
            get: function() {
                return Input.Mouse[2 + Input.UP_M];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "MouseRightClick", {
            get: function() {
                return Input.Mouse[2 + Input.CLICK_M];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "MouseRightDown", {
            get: function() {
                return Input.Mouse[2 + Input.DOWN_M];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "MouseX", {
            get: function() {
                return Input.Axis[Input._X + Input.CURR_A];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "MouseY", {
            get: function() {
                return Input.Axis[Input._Y + Input.CURR_A];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "MouseDeltaX", {
            get: function() {
                return Input.Axis[Input._X + Input.DELTA_A];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "MouseDeltaY", {
            get: function() {
                return Input.Axis[Input._Y + Input.DELTA_A];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "MouseWheelUp", {
            get: function() {
                return Input.Mouse[Input.WHEEL_U];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Input.prototype, "MouseWheelDown", {
            get: function() {
                return Input.Mouse[Input.WHEEL_D];
            },
            enumerable: true,
            configurable: true
        });
        Input.prototype.InputUpdate = function() {
            for (var i = Input.PRESS_K; i < Input.DOWN_K; ++i)
                if (Input.Keys[i])
                    Input.Keys[i] = false;
            for (var i = Input.CLICK_M; i < Input.DOWN_M; ++i)
                if (Input.Mouse[i])
                    Input.Mouse[i] = false;
            Input.Axis[Input._X + Input.DELTA_A] = 0;
            Input.Axis[Input._Y + Input.DELTA_A] = 0;
            Input.Mouse[Input.WHEEL_U] = false;
            Input.Mouse[Input.WHEEL_D] = false;
        };
        return Input;
    }());
    Input.UP_K = 0;
    Input.PRESS_K = 128;
    Input.DOWN_K = 256;
    Input.END_K = 384;
    Input.Keys = new Array();
    Input.UP_M = 0;
    Input.CLICK_M = 3;
    Input.DOWN_M = 6;
    Input.WHEEL_U = 9;
    Input.WHEEL_D = 10;
    Input.END_M = 11;
    Input.Mouse = new Array();
    Input._X = 0;
    Input._Y = 1;
    Input.CURR_A = 0;
    Input.PREV_A = 2;
    Input.DELTA_A = 4;
    Input.END_A = 8;
    Input.Axis = new Array();
    var Time = (function() {
        function Time() {}
        Object.defineProperty(Time.prototype, "Delta", {
            get: function() {
                if (this.now && this.then)
                    return (this.now - this.then) / 60;
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Time.prototype, "DeltaTime", {
            get: function() {
                if (this.now && this.then)
                    return this.now - this.then;
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Time.prototype, "Now", {
            get: function() {
                return new Date(Date.now());
            },
            enumerable: true,
            configurable: true
        });
        Time.prototype.Update = function() {
            if (!this.now && !this.then)
                this.now = this.then = Date.now();
            else {
                this.then = this.now;
                this.now = Date.now();
            }
        };
        Time.prototype.Reset = function() {
            this.now = this.then = undefined;
        };
        return Time;
    }());
    var AnimationFrame = (function(_super) {
        __extends(AnimationFrame, _super);

        function AnimationFrame(request) {
            return _super.call(this, request) || this;
        }
        return AnimationFrame;
    }(KeyFrame));
    var ColourAnimationFrame = (function(_super) {
        __extends(ColourAnimationFrame, _super);

        function ColourAnimationFrame(request) {
            return _super.call(this, request) || this;
        }
        return ColourAnimationFrame;
    }(AnimationFrame));
    var TransformAnimationFrame = (function(_super) {
        __extends(TransformAnimationFrame, _super);

        function TransformAnimationFrame(request) {
            return _super.call(this, request) || this;
        }
        return TransformAnimationFrame;
    }(AnimationFrame));
    var IAnimation = (function() {
        function IAnimation() {}
        return IAnimation;
    }());
    var Animation = (function(_super) {
        __extends(Animation, _super);

        function Animation(_a) {
            var _b = _a.Name,
                Name = _b === void 0 ? "Animation" : _b,
                _c = _a.GameObject,
                GameObject = _c === void 0 ? null : _c;
            return _super.call(this, Name, GameObject) || this;
        }
        Animation.prototype.Update = function() {};
        return Animation;
    }(GameItem));
    var CameraMode;
    (function(CameraMode) {
        CameraMode[CameraMode["PERSPECTIVE"] = 0] = "PERSPECTIVE";
        CameraMode[CameraMode["ORTHOGRAPHIC"] = 1] = "ORTHOGRAPHIC";
    })(CameraMode || (CameraMode = {}));
    var Camera = (function() {
        function Camera() {
            this.Mode = CameraMode.PERSPECTIVE;
            this.FOV = 35;
            this.Aspect = 16 / 9;
            this.Near = 0.1;
            this.Far = 900;
            this.Left = -10;
            this.Right = 10;
            this.Top = 10;
            this.Bottom = 10;
            this.Theta = 90;
            this.Phi = 90;
        }
        Camera.prototype.Update = function() {
            if (FWGE.GL.canvas.width != FWGE.GL.canvas.clientWidth || FWGE.GL.canvas.height != FWGE.GL.canvas.clientHeight) {
                FWGE.GL.canvas.width = FWGE.GL.canvas.clientWidth;
                FWGE.GL.canvas.height = FWGE.GL.canvas.clientHeight;
            }
            this.Aspect = FWGE.GL.drawingBufferWidth / FWGE.GL.drawingBufferHeight;
        };
        return Camera;
    }());
    var Viewer = (function() {
        function Viewer(_a) {
            var _b = _a.Position,
                Position = _b === void 0 ? Vector3.Zero : _b,
                _c = _a.Target,
                Target = _c === void 0 ? Vector3.Zero : _c;
            this.Position = Vector3.Zero;
            this.Target = Vector3.Zero;
            this.Matrix = Matrix4.Identity;
            this.Direction = Vector3.Zero;
            this.Up = Vector3.Zero;
            this.Right = Vector3.Zero;
            this.Position = Position;
            this.Target = Target;
        }
        Viewer.prototype.Update = function() {
            this.Direction.Set(this.Position).Diff(this.Target).Unit();
            this.Right.Set(this.Up).Cross(this.Direction).Unit();
            this.Up.Set(this.Direction).Cross(this.Right).Unit();
            this.Matrix.Set([
                this.Right.X, this.Right.Y, this.Right.Z, 0,
                this.Up.X, this.Up.Y, this.Up.Z, 0,
                this.Direction.X, this.Direction.Y, this.Direction.Z, 0,
                0, 0, 0, 1
            ]).Mult([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                this.Position.X, this.Position.Y, this.Position.Z, 1
            ]);
        };
        return Viewer;
    }());
    var LightItem = (function(_super) {
        __extends(LightItem, _super);

        function LightItem(_a) {
            var _b = _a.Name,
                Name = _b === void 0 ? "Light Item" : _b,
                _c = _a.Parent,
                Parent = _c === void 0 ? new GameObject() : _c,
                _d = _a.Paint,
                Paint = _d === void 0 ? [1, 1, 1, 1] : _d,
                _e = _a.Intensity,
                Intensity = _e === void 0 ? 1.0 : _e;
            var _this = _super.call(this, Name, Parent) || this;
            _this.Colour = new Colour(Paint);
            _this.Intensity = Intensity;
            return _this;
        }
        return LightItem;
    }(GameItem));
    var AmbientLight = (function(_super) {
        __extends(AmbientLight, _super);

        function AmbientLight(_a) {
            var _b = _a.Name,
                Name = _b === void 0 ? "Ambient Light" : _b,
                Parent = _a.Parent,
                Paint = _a.Paint,
                Intensity = _a.Intensity;
            return _super.call(this, {
                Name: Name,
                Parent: Parent,
                Paint: Paint,
                Intensity: Intensity
            }) || this;
        }
        return AmbientLight;
    }(LightItem));
    var DirectionalLight = (function(_super) {
        __extends(DirectionalLight, _super);

        function DirectionalLight(_a) {
            var _b = _a.Direction,
                Direction = _b === void 0 ? Vector3.One : _b,
                Paint = _a.Paint,
                Intensity = _a.Intensity,
                Name = _a.Name,
                Parent = _a.Parent;
            var _this = _super.call(this, {
                Name: Name,
                Parent: Parent,
                Paint: Paint,
                Intensity: Intensity
            }) || this;
            _this.Direction = Direction;
            return _this;
        }
        return DirectionalLight;
    }(LightItem));
    var PointLight = (function(_super) {
        __extends(PointLight, _super);

        function PointLight(_a) {
            var Name = _a.Name,
                Parent = _a.Parent,
                Paint = _a.Paint,
                Intensity = _a.Intensity,
                _b = _a.Radius,
                Radius = _b === void 0 ? 5 : _b,
                _c = _a.Angle,
                Angle = _c === void 0 ? 180 : _c,
                _d = _a.Shininess,
                Shininess = _d === void 0 ? 255 : _d;
            var _this = _super.call(this, {
                Name: Name,
                Parent: Parent,
                Paint: Paint,
                Intensity: Intensity
            }) || this;
            _this.Radius = Radius;
            _this.Angle = Angle;
            _this.Shininess = Shininess;
            return _this;
        }
        return PointLight;
    }(LightItem));
    var Light = (function() {
        function Light() {
            this.AmbientCount = 0;
            this.DirectionalCount = 0;
            this.PointCount = 0;
            this.MAX_AMBIENT = 1;
            this.MAX_DIRECTIONAL = 3;
            this.MAX_POINT = 8;
            this.MAX_LIGHTS = 12;
            for (var i = 0; i < this.MAX_LIGHTS; ++i)
                Light.Lights.push(null);
        }
        Light.prototype.Ambient = function(request) {
            var light = null;
            if (this.AmbientCount < this.MAX_AMBIENT) {
                light = new AmbientLight(request);
                light.GameObject.Light = light;
                this.AmbientCount++;
                Light.Lights[0] = light;
            }
            return light;
        };
        Light.prototype.Directional = function(request) {
            var light = null;
            if (this.DirectionalCount < this.MAX_DIRECTIONAL) {
                for (var i = this.MAX_AMBIENT; i < this.MAX_DIRECTIONAL; ++i) {
                    if (!Light.Lights[i]) {
                        light = new DirectionalLight(request);
                        light.GameObject.Light = light;
                        this.DirectionalCount++;
                        Light.Lights[i] = light;
                        break;
                    }
                }
            }
            return light;
        };
        Light.prototype.Point = function(request) {
            var light = null;
            if (this.PointCount < this.MAX_POINT) {
                for (var i = this.MAX_DIRECTIONAL; i < this.MAX_LIGHTS; ++i) {
                    if (!Light.Lights[i]) {
                        light = new PointLight(request);
                        light.GameObject.Light = light;
                        this.PointCount++;
                        Light.Lights[i] = light;
                        break;
                    }
                }
            }
            return light;
        };
        Light.prototype.Remove = function(light) {
            for (var i in Light.Lights)
                if (!!Light.Lights[i] && light.ID === Light.Lights[i].ID)
                    Light.Lights[i] = null;
        };
        return Light;
    }());
    Light.Lights = new Array();
    var Matrix2 = (function() {
        function Matrix2() {
            this.Buffer = new Float32Array(4);
        }
        Object.defineProperty(Matrix2.prototype, "M11", {
            get: function() {
                return this.Buffer[0];
            },
            set: function(m11) {
                this.Buffer[0] = m11;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix2.prototype, "M12", {
            get: function() {
                return this.Buffer[1];
            },
            set: function(m12) {
                this.Buffer[1] = m12;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix2.prototype, "M21", {
            get: function() {
                return this.Buffer[2];
            },
            set: function(m21) {
                this.Buffer[2] = m21;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix2.prototype, "M22", {
            get: function() {
                return this.Buffer[3];
            },
            set: function(m22) {
                this.Buffer[3] = m22;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix2, "Identity", {
            get: function() {
                return new Matrix2().Identity();
            },
            enumerable: true,
            configurable: true
        });
        Matrix2.GetArgs = function(args) {
            if (!args)
                return [0, 0,
                    0, 0
                ];
            if (args instanceof Matrix2)
                return [args.M11, args.M12,
                    args.M21, args.M22
                ];
            else if ((args instanceof Float32Array && args.length >= 4) ||
                (typeof args[0] === "number" && typeof args[1] === "number" && typeof args[2] === "number" && typeof args[3] === "number"))
                return args;
            return Matrix2.GetArgs(args[0]);
        };
        Matrix2.prototype.Set = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = Matrix2.GetArgs(args),
                m11 = _a[0],
                m12 = _a[1],
                m21 = _a[2],
                m22 = _a[3];
            this.M11 = m11;
            this.M12 = m12;
            this.M21 = m21;
            this.M22 = m22;
            return this;
        };
        Matrix2.prototype.Transpose = function() {
            return this.Set(this.M11, this.M21, this.M12, this.M22);
        };
        Matrix2.prototype.Identity = function() {
            return this.Set(1, 0, 0, 1);
        };
        Object.defineProperty(Matrix2.prototype, "Determinant", {
            get: function() {
                return this.M11 * this.M22 - this.M21 * this.M12;
            },
            enumerable: true,
            configurable: true
        });
        Matrix2.prototype.Inverse = function() {
            var det = this.Determinant;
            if (det !== 0)
                this.Set(this.M22 / det, -this.M12 / det, -this.M21 / det, this.M11 / det);
            return this;
        };
        Matrix2.prototype.Sum = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = Matrix2.GetArgs(args),
                m11 = _a[0],
                m12 = _a[1],
                m21 = _a[2],
                m22 = _a[3];
            return this.Set(this.M11 + m11, this.M12 + m12, this.M21 + m21, this.M22 + m22);
        };
        Matrix2.prototype.Mult = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = Matrix2.GetArgs(args),
                m11 = _a[0],
                m12 = _a[1],
                m21 = _a[2],
                m22 = _a[3];
            return this.Set(this.M11 * m11 + this.M12 * m21, this.M11 * m12 + this.M12 * m22, this.M21 * m11 + this.M22 * m21, this.M21 * m12 + this.M22 * m22);
        };
        Matrix2.prototype.Scale = function(scaler) {
            return this.Set(this.M11 * scaler, this.M12 * scaler, this.M21 * scaler, this.M22 * scaler);
        };
        return Matrix2;
    }());
    var Matrix3 = (function() {
        function Matrix3() {
            this.Buffer = new Float32Array(9);
        }
        Object.defineProperty(Matrix3.prototype, "M11", {
            get: function() {
                return this.Buffer[0];
            },
            set: function(m11) {
                this.Buffer[0] = m11;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix3.prototype, "M12", {
            get: function() {
                return this.Buffer[1];
            },
            set: function(m12) {
                this.Buffer[1] = m12;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix3.prototype, "M13", {
            get: function() {
                return this.Buffer[2];
            },
            set: function(m13) {
                this.Buffer[2] = m13;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix3.prototype, "M21", {
            get: function() {
                return this.Buffer[3];
            },
            set: function(m21) {
                this.Buffer[3] = m21;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix3.prototype, "M22", {
            get: function() {
                return this.Buffer[4];
            },
            set: function(m22) {
                this.Buffer[4] = m22;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix3.prototype, "M23", {
            get: function() {
                return this.Buffer[5];
            },
            set: function(m23) {
                this.Buffer[5] = m23;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix3.prototype, "M31", {
            get: function() {
                return this.Buffer[6];
            },
            set: function(m31) {
                this.Buffer[6] = m31;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix3.prototype, "M32", {
            get: function() {
                return this.Buffer[7];
            },
            set: function(m32) {
                this.Buffer[7] = m32;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix3.prototype, "M33", {
            get: function() {
                return this.Buffer[8];
            },
            set: function(m33) {
                this.Buffer[8] = m33;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix3, "Identity", {
            get: function() {
                return new Matrix3().Identity();
            },
            enumerable: true,
            configurable: true
        });
        Matrix3.GetArgs = function(args) {
            if (!args)
                return [0, 0, 0,
                    0, 0, 0,
                    0, 0, 0
                ];
            if (args instanceof Matrix3)
                return [args.M11, args.M12, args.M13,
                    args.M21, args.M22, args.M23,
                    args.M31, args.M32, args.M33
                ];
            else if ((args instanceof Float32Array && args.length >= 9) ||
                (typeof args[0] === "number" && typeof args[1] === "number" && typeof args[2] === "number" &&
                    typeof args[3] === "number" && typeof args[4] === "number" && typeof args[5] === "number" &&
                    typeof args[6] === "number" && typeof args[7] === "number" && typeof args[8] === "number"))
                return args;
            return Matrix3.GetArgs(args[0]);
        };
        Matrix3.prototype.Set = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = Matrix3.GetArgs(args),
                m11 = _a[0],
                m12 = _a[1],
                m13 = _a[2],
                m21 = _a[3],
                m22 = _a[4],
                m23 = _a[5],
                m31 = _a[6],
                m32 = _a[7],
                m33 = _a[8];
            this.M11 = m11;
            this.M12 = m12;
            this.M13 = m13;
            this.M21 = m21;
            this.M22 = m22;
            this.M23 = m23;
            this.M31 = m31;
            this.M32 = m32;
            this.M33 = m33;
            return this;
        };
        Matrix3.prototype.Transpose = function() {
            return this.Set(this.M11, this.M21, this.M31, this.M12, this.M22, this.M32, this.M13, this.M23, this.M33);
        };
        Matrix3.prototype.Identity = function() {
            return this.Set(1, 0, 0, 0, 1, 0, 0, 0, 1);
        };
        Object.defineProperty(Matrix3.prototype, "Determinant", {
            get: function() {
                return this.M11 * (this.M22 * this.M33 - this.M23 * this.M32) -
                    this.M12 * (this.M21 * this.M33 - this.M23 * this.M31) +
                    this.M13 * (this.M21 * this.M32 - this.M22 * this.M31);
            },
            enumerable: true,
            configurable: true
        });
        Matrix3.prototype.Inverse = function() {
            var det = this.Determinant;
            if (det !== 0)
                this.Set((this.M22 * this.M33 - this.M32 * this.M23) / det, -(this.M12 * this.M33 - this.M32 * this.M13) / det, (this.M12 * this.M23 - this.M22 * this.M13) / det, -(this.M21 * this.M33 - this.M31 * this.M23) / det, (this.M11 * this.M33 - this.M31 * this.M13) / det, -(this.M11 * this.M23 - this.M21 * this.M13) / det, (this.M21 * this.M32 - this.M31 * this.M22) / det, -(this.M11 * this.M32 - this.M31 * this.M12) / det, (this.M11 * this.M22 - this.M21 * this.M12) / det);
            return this;
        };
        Matrix3.prototype.Sum = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = Matrix3.GetArgs(args),
                m11 = _a[0],
                m12 = _a[1],
                m13 = _a[2],
                m21 = _a[3],
                m22 = _a[4],
                m23 = _a[5],
                m31 = _a[6],
                m32 = _a[7],
                m33 = _a[8];
            return this.Set(this.M11 + m11, this.M12 + m12, this.M13 + m13, this.M21 + m21, this.M22 + m22, this.M23 + m23, this.M31 + m31, this.M32 + m32, this.M33 + m33);
        };
        Matrix3.prototype.Mult = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = Matrix3.GetArgs(args),
                m11 = _a[0],
                m12 = _a[1],
                m13 = _a[2],
                m21 = _a[3],
                m22 = _a[4],
                m23 = _a[5],
                m31 = _a[6],
                m32 = _a[7],
                m33 = _a[8];
            return this.Set(this.M11 * m11 + this.M12 * m21 + this.M13 * m31, this.M11 * m12 + this.M12 * m22 + this.M13 * m32, this.M11 * m13 + this.M12 * m23 + this.M13 * m33, this.M21 * m11 + this.M22 * m21 + this.M23 * m31, this.M21 * m12 + this.M22 * m22 + this.M23 * m32, this.M21 * m13 + this.M22 * m23 + this.M23 * m33, this.M31 * m11 + this.M32 * m21 + this.M33 * m31, this.M31 * m12 + this.M32 * m22 + this.M33 * m32, this.M31 * m13 + this.M32 * m23 + this.M33 * m33);
        };
        Matrix3.prototype.Scale = function(scaler) {
            return this.Set(this.M11 * scaler, this.M12 * scaler, this.M13 * scaler, this.M21 * scaler, this.M22 * scaler, this.M23 * scaler, this.M31 * scaler, this.M32 * scaler, this.M33 * scaler);
        };
        return Matrix3;
    }());
    var Matrix4 = (function() {
        function Matrix4() {
            this.Buffer = new Float32Array(16);
        }
        Object.defineProperty(Matrix4.prototype, "M11", {
            get: function() {
                return this.Buffer[0];
            },
            set: function(m11) {
                this.Buffer[0] = m11;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix4.prototype, "M12", {
            get: function() {
                return this.Buffer[1];
            },
            set: function(m12) {
                this.Buffer[1] = m12;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix4.prototype, "M13", {
            get: function() {
                return this.Buffer[2];
            },
            set: function(m13) {
                this.Buffer[2] = m13;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix4.prototype, "M14", {
            get: function() {
                return this.Buffer[3];
            },
            set: function(m14) {
                this.Buffer[3] = m14;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix4.prototype, "M21", {
            get: function() {
                return this.Buffer[4];
            },
            set: function(m21) {
                this.Buffer[4] = m21;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix4.prototype, "M22", {
            get: function() {
                return this.Buffer[5];
            },
            set: function(m22) {
                this.Buffer[5] = m22;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix4.prototype, "M23", {
            get: function() {
                return this.Buffer[6];
            },
            set: function(m23) {
                this.Buffer[6] = m23;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix4.prototype, "M24", {
            get: function() {
                return this.Buffer[7];
            },
            set: function(m24) {
                this.Buffer[7] = m24;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix4.prototype, "M31", {
            get: function() {
                return this.Buffer[8];
            },
            set: function(m31) {
                this.Buffer[8] = m31;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix4.prototype, "M32", {
            get: function() {
                return this.Buffer[9];
            },
            set: function(m32) {
                this.Buffer[9] = m32;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix4.prototype, "M33", {
            get: function() {
                return this.Buffer[10];
            },
            set: function(m33) {
                this.Buffer[10] = m33;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix4.prototype, "M34", {
            get: function() {
                return this.Buffer[11];
            },
            set: function(m34) {
                this.Buffer[11] = m34;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix4.prototype, "M41", {
            get: function() {
                return this.Buffer[12];
            },
            set: function(m41) {
                this.Buffer[12] = m41;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix4.prototype, "M42", {
            get: function() {
                return this.Buffer[13];
            },
            set: function(m42) {
                this.Buffer[13] = m42;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix4.prototype, "M43", {
            get: function() {
                return this.Buffer[14];
            },
            set: function(m43) {
                this.Buffer[14] = m43;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix4.prototype, "M44", {
            get: function() {
                return this.Buffer[15];
            },
            set: function(m44) {
                this.Buffer[15] = m44;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix4, "Identity", {
            get: function() {
                return (new Matrix4()).Identity();
            },
            enumerable: true,
            configurable: true
        });
        Matrix4.GetArgs = function(args) {
            if (!args)
                return [0, 0, 0, 0,
                    0, 0, 0, 0,
                    0, 0, 0, 0,
                    0, 0, 0, 0
                ];
            if (args instanceof Matrix4)
                return [args.M11, args.M12, args.M13, args.M14,
                    args.M21, args.M22, args.M23, args.M24,
                    args.M31, args.M32, args.M33, args.M34,
                    args.M41, args.M42, args.M43, args.M44
                ];
            else if ((args instanceof Float32Array && args.length >= 16) ||
                (typeof args[0] === "number" && typeof args[1] === "number" && typeof args[2] === "number" && typeof args[3] === "number" &&
                    typeof args[4] === "number" && typeof args[5] === "number" && typeof args[6] === "number" && typeof args[7] === "number" &&
                    typeof args[8] === "number" && typeof args[9] === "number" && typeof args[10] === "number" && typeof args[11] === "number" &&
                    typeof args[12] === "number" && typeof args[13] === "number" && typeof args[14] === "number" && typeof args[15] === "number"))
                return args;
            return Matrix4.GetArgs(args[0]);
        };
        Matrix4.prototype.Set = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = Matrix4.GetArgs(args),
                m11 = _a[0],
                m12 = _a[1],
                m13 = _a[2],
                m14 = _a[3],
                m21 = _a[4],
                m22 = _a[5],
                m23 = _a[6],
                m24 = _a[7],
                m31 = _a[8],
                m32 = _a[9],
                m33 = _a[10],
                m34 = _a[11],
                m41 = _a[12],
                m42 = _a[13],
                m43 = _a[14],
                m44 = _a[15];
            this.M11 = m11;
            this.M12 = m12;
            this.M13 = m13;
            this.M14 = m14;
            this.M21 = m21;
            this.M22 = m22;
            this.M23 = m23;
            this.M24 = m24;
            this.M31 = m31;
            this.M32 = m32;
            this.M33 = m33;
            this.M34 = m34;
            this.M41 = m41;
            this.M42 = m42;
            this.M43 = m43;
            this.M44 = m44;
            return this;
        };
        Matrix4.prototype.Transpose = function() {
            return this.Set(this.M11, this.M21, this.M31, this.M41, this.M12, this.M22, this.M32, this.M42, this.M13, this.M23, this.M33, this.M43, this.M14, this.M24, this.M34, this.M44);
        };
        Matrix4.prototype.Identity = function() {
            return this.Set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        };
        Object.defineProperty(Matrix4.prototype, "Determinant", {
            get: function() {
                return this.M11 * this.M22 * this.M33 * this.M44 +
                    this.M11 * this.M23 * this.M34 * this.M42 +
                    this.M11 * this.M24 * this.M32 * this.M43 +
                    this.M12 * this.M21 * this.M34 * this.M43 +
                    this.M12 * this.M23 * this.M31 * this.M44 +
                    this.M12 * this.M24 * this.M33 * this.M41 +
                    this.M13 * this.M21 * this.M32 * this.M44 +
                    this.M13 * this.M22 * this.M34 * this.M41 +
                    this.M13 * this.M24 * this.M31 * this.M42 +
                    this.M14 * this.M21 * this.M33 * this.M42 +
                    this.M14 * this.M22 * this.M31 * this.M43 +
                    this.M14 * this.M23 * this.M32 * this.M41 -
                    this.M11 * this.M22 * this.M34 * this.M43 -
                    this.M11 * this.M23 * this.M32 * this.M44 -
                    this.M11 * this.M24 * this.M33 * this.M42 -
                    this.M12 * this.M21 * this.M33 * this.M44 -
                    this.M12 * this.M23 * this.M34 * this.M41 -
                    this.M12 * this.M24 * this.M31 * this.M43 -
                    this.M13 * this.M21 * this.M34 * this.M42 -
                    this.M13 * this.M22 * this.M31 * this.M44 -
                    this.M13 * this.M24 * this.M32 * this.M41 -
                    this.M14 * this.M21 * this.M32 * this.M43 -
                    this.M14 * this.M22 * this.M33 * this.M41 -
                    this.M14 * this.M23 * this.M31 * this.M42;
            },
            enumerable: true,
            configurable: true
        });
        Matrix4.prototype.Inverse = function() {
            var det = this.Determinant;
            if (det !== 0)
                return this.Set((this.M22 * this.M33 * this.M44 +
                    this.M23 * this.M34 * this.M42 +
                    this.M24 * this.M32 * this.M43 -
                    this.M22 * this.M34 * this.M43 -
                    this.M23 * this.M32 * this.M44 -
                    this.M24 * this.M33 * this.M42) / det, (this.M12 * this.M34 * this.M43 +
                    this.M13 * this.M32 * this.M44 +
                    this.M14 * this.M33 * this.M42 -
                    this.M12 * this.M33 * this.M44 -
                    this.M13 * this.M34 * this.M42 -
                    this.M14 * this.M32 * this.M43) / det, (this.M12 * this.M23 * this.M44 +
                    this.M13 * this.M24 * this.M42 +
                    this.M14 * this.M22 * this.M43 -
                    this.M12 * this.M24 * this.M43 -
                    this.M13 * this.M22 * this.M44 -
                    this.M14 * this.M23 * this.M42) / det, (this.M12 * this.M24 * this.M33 +
                    this.M13 * this.M22 * this.M34 +
                    this.M14 * this.M23 * this.M32 -
                    this.M12 * this.M23 * this.M34 -
                    this.M13 * this.M24 * this.M32 -
                    this.M14 * this.M22 * this.M33) / det, (this.M21 * this.M34 * this.M43 +
                    this.M23 * this.M31 * this.M44 +
                    this.M24 * this.M33 * this.M41 -
                    this.M21 * this.M33 * this.M44 -
                    this.M23 * this.M34 * this.M41 -
                    this.M24 * this.M31 * this.M43) / det, (this.M11 * this.M33 * this.M44 +
                    this.M13 * this.M34 * this.M41 +
                    this.M14 * this.M31 * this.M43 -
                    this.M11 * this.M34 * this.M43 -
                    this.M13 * this.M31 * this.M44 -
                    this.M14 * this.M33 * this.M41) / det, (this.M11 * this.M24 * this.M43 +
                    this.M13 * this.M21 * this.M44 +
                    this.M14 * this.M23 * this.M41 -
                    this.M11 * this.M23 * this.M44 -
                    this.M13 * this.M24 * this.M41 -
                    this.M14 * this.M21 * this.M43) / det, (this.M11 * this.M23 * this.M34 +
                    this.M13 * this.M24 * this.M31 +
                    this.M14 * this.M21 * this.M33 -
                    this.M11 * this.M24 * this.M33 -
                    this.M13 * this.M21 * this.M34 -
                    this.M14 * this.M23 * this.M31) / det, (this.M21 * this.M32 * this.M44 +
                    this.M22 * this.M34 * this.M41 +
                    this.M24 * this.M31 * this.M42 -
                    this.M21 * this.M34 * this.M42 -
                    this.M22 * this.M31 * this.M44 -
                    this.M24 * this.M32 * this.M41) / det, (this.M11 * this.M34 * this.M42 +
                    this.M12 * this.M31 * this.M44 +
                    this.M14 * this.M32 * this.M41 -
                    this.M11 * this.M32 * this.M44 -
                    this.M12 * this.M34 * this.M41 -
                    this.M14 * this.M31 * this.M42) / det, (this.M11 * this.M22 * this.M44 +
                    this.M12 * this.M24 * this.M41 +
                    this.M14 * this.M21 * this.M42 -
                    this.M11 * this.M24 * this.M42 -
                    this.M12 * this.M21 * this.M44 -
                    this.M14 * this.M22 * this.M41) / det, (this.M11 * this.M24 * this.M32 +
                    this.M12 * this.M21 * this.M34 +
                    this.M14 * this.M22 * this.M31 -
                    this.M11 * this.M22 * this.M34 -
                    this.M12 * this.M24 * this.M31 -
                    this.M14 * this.M21 * this.M32) / det, (this.M21 * this.M33 * this.M42 +
                    this.M22 * this.M31 * this.M43 +
                    this.M23 * this.M32 * this.M41 -
                    this.M21 * this.M32 * this.M43 -
                    this.M22 * this.M33 * this.M41 -
                    this.M23 * this.M31 * this.M42) / det, (this.M11 * this.M32 * this.M43 +
                    this.M12 * this.M33 * this.M41 +
                    this.M13 * this.M31 * this.M42 -
                    this.M11 * this.M33 * this.M42 -
                    this.M12 * this.M31 * this.M43 -
                    this.M13 * this.M32 * this.M41) / det, (this.M11 * this.M23 * this.M42 +
                    this.M12 * this.M21 * this.M43 +
                    this.M13 * this.M22 * this.M41 -
                    this.M11 * this.M22 * this.M43 -
                    this.M12 * this.M23 * this.M41 -
                    this.M13 * this.M21 * this.M42) / det, (this.M11 * this.M22 * this.M33 +
                    this.M12 * this.M23 * this.M31 +
                    this.M13 * this.M21 * this.M32 -
                    this.M11 * this.M23 * this.M32 -
                    this.M12 * this.M21 * this.M33 -
                    this.M13 * this.M22 * this.M31) / det);
            return this;
        };
        Matrix4.prototype.Sum = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = Matrix4.GetArgs(args),
                m11 = _a[0],
                m12 = _a[1],
                m13 = _a[2],
                m14 = _a[3],
                m21 = _a[4],
                m22 = _a[5],
                m23 = _a[6],
                m24 = _a[7],
                m31 = _a[8],
                m32 = _a[9],
                m33 = _a[10],
                m34 = _a[11],
                m41 = _a[12],
                m42 = _a[13],
                m43 = _a[14],
                m44 = _a[15];
            return this.Set(this.M11 + m11, this.M12 + m12, this.M13 + m13, this.M14 + m14, this.M21 + m21, this.M22 + m22, this.M23 + m23, this.M24 + m24, this.M31 + m31, this.M32 + m32, this.M33 + m33, this.M34 + m34, this.M41 + m41, this.M42 + m42, this.M43 + m43, this.M44 + m44);
        };
        Matrix4.prototype.Mult = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = Matrix4.GetArgs(args),
                m11 = _a[0],
                m12 = _a[1],
                m13 = _a[2],
                m14 = _a[3],
                m21 = _a[4],
                m22 = _a[5],
                m23 = _a[6],
                m24 = _a[7],
                m31 = _a[8],
                m32 = _a[9],
                m33 = _a[10],
                m34 = _a[11],
                m41 = _a[12],
                m42 = _a[13],
                m43 = _a[14],
                m44 = _a[15];
            return this.Set(this.M11 * m11 + this.M12 * m21 + this.M13 * m31 + this.M14 * m41, this.M11 * m12 + this.M12 * m22 + this.M13 * m32 + this.M14 * m42, this.M11 * m13 + this.M12 * m23 + this.M13 * m33 + this.M14 * m43, this.M11 * m14 + this.M12 * m24 + this.M13 * m34 + this.M14 * m44, this.M21 * m11 + this.M22 * m21 + this.M23 * m31 + this.M24 * m41, this.M21 * m12 + this.M22 * m22 + this.M23 * m32 + this.M24 * m42, this.M21 * m13 + this.M22 * m23 + this.M23 * m33 + this.M24 * m43, this.M21 * m14 + this.M22 * m24 + this.M23 * m34 + this.M24 * m44, this.M31 * m11 + this.M32 * m21 + this.M33 * m31 + this.M34 * m41, this.M31 * m12 + this.M32 * m22 + this.M33 * m32 + this.M34 * m42, this.M31 * m13 + this.M32 * m23 + this.M33 * m33 + this.M34 * m43, this.M31 * m14 + this.M32 * m24 + this.M33 * m34 + this.M34 * m44, this.M41 * m11 + this.M42 * m21 + this.M43 * m31 + this.M44 * m41, this.M41 * m12 + this.M42 * m22 + this.M43 * m32 + this.M44 * m42, this.M41 * m13 + this.M42 * m23 + this.M43 * m33 + this.M44 * m43, this.M41 * m14 + this.M42 * m24 + this.M43 * m34 + this.M44 * m44);
        };
        Matrix4.prototype.Scale = function(scaler) {
            return this.Set(this.M11 * scaler, this.M12 * scaler, this.M13 * scaler, this.M14 * scaler, this.M21 * scaler, this.M22 * scaler, this.M23 * scaler, this.M24 * scaler, this.M31 * scaler, this.M32 * scaler, this.M33 * scaler, this.M34 * scaler, this.M41 * scaler, this.M42 * scaler, this.M43 * scaler, this.M44 * scaler);
        };
        return Matrix4;
    }());
    var Vector2 = (function() {
        function Vector2() {
            this.Buffer = new Float32Array(3);
        }
        Object.defineProperty(Vector2.prototype, "X", {
            get: function() {
                return this.Buffer[0];
            },
            set: function(x) {
                this.Buffer[0] = x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector2.prototype, "Y", {
            get: function() {
                return this.Buffer[1];
            },
            set: function(y) {
                this.Buffer[1] = y;
            },
            enumerable: true,
            configurable: true
        });
        Vector2.GetArgs = function(args) {
            if (!args)
                return [0, 0];
            if (args instanceof Vector2)
                return [args.X, args.Y];
            else if ((args instanceof Float32Array && args.length >= 2) ||
                (typeof args[0] === "number" && typeof args[1] === "number"))
                return args;
            return Vector2.GetArgs(args[0]);
        };
        Object.defineProperty(Vector2, "Zero", {
            get: function() {
                return (new Vector2).Set(0, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector2, "One", {
            get: function() {
                return (new Vector2).Set(1, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector2, "Unit", {
            get: function() {
                return (new Vector2).Set(Math.sqrt(1 / 2), Math.sqrt(1 / 2));
            },
            enumerable: true,
            configurable: true
        });
        Vector2.prototype.Set = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = Vector2.GetArgs(args),
                x = _a[0],
                y = _a[1];
            this.X = x;
            this.Y = y;
            return this;
        };
        Object.defineProperty(Vector2.prototype, "Length", {
            get: function() {
                return Math.sqrt(this.X * this.X + this.Y * this.Y);
            },
            enumerable: true,
            configurable: true
        });
        Vector2.prototype.Sum = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = Vector2.GetArgs(args),
                x = _a[0],
                y = _a[1];
            return this.Set(this.X + x, this.Y + y);
        };
        Vector2.prototype.Diff = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = Vector2.GetArgs(args),
                x = _a[0],
                y = _a[1];
            return this.Set(x - this.X, y - this.Y);
        };
        Vector2.prototype.Mult = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = Vector2.GetArgs(args),
                x = _a[0],
                y = _a[1];
            return this.Set(this.X * x, this.Y * y);
        };
        Vector2.prototype.Scale = function(scaler) {
            return this.Set(this.X * scaler, this.Y * scaler);
        };
        Vector2.prototype.Dot = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = Vector2.GetArgs(args),
                x = _a[0],
                y = _a[1];
            return this.X * x + this.Y * y;
        };
        Vector2.prototype.Unit = function() {
            var length = this.Length;
            if (length !== 0)
                this.Scale(1 / length);
            return this;
        };
        Vector2.prototype.Cross = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = Vector2.GetArgs(args),
                x = _a[0],
                y = _a[1];
            return this.Set(x, y);
        };
        return Vector2;
    }());
    var Vector3 = (function(_super) {
        __extends(Vector3, _super);

        function Vector3() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.call(this, 3) || this;
            _this.Set(args);
            return _this;
        }
        Object.defineProperty(Vector3.prototype, "X", {
            get: function() {
                return this.Buffer[0];
            },
            set: function(x) {
                this.Buffer[0] = x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "Y", {
            get: function() {
                return this.Buffer[1];
            },
            set: function(y) {
                this.Buffer[1] = y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "Z", {
            get: function() {
                return this.Buffer[2];
            },
            set: function(z) {
                this.Buffer[2] = z;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "Length", {
            get: function() {
                return Vector3.Length(this);
            },
            enumerable: true,
            configurable: true
        });
        Vector3.prototype.Set = function(args) {
            return Vector3.Set(this, args);
        };
        Vector3.prototype.Sum = function(args) {
            var _a = Vector3.GetArgs(args),
                x = _a[0],
                y = _a[1],
                z = _a[2];
            return this.Set(this.X + x, this.Y + y, this.Z + z);
        };
        Vector3.prototype.Diff = function(args) {
            var _a = Vector3.GetArgs(args),
                x = _a[0],
                y = _a[1],
                z = _a[2];
            return this.Set(x - this.X, y - this.Y, z - this.Z);
        };
        Vector3.prototype.Mult = function(args) {
            var _a = Vector3.GetArgs(args),
                x = _a[0],
                y = _a[1],
                z = _a[2];
            return this.Set(this.X * x, this.Y * y, this.Z * z);
        };
        Vector3.prototype.Dot = function(args) {
            var _a = Vector3.GetArgs(args),
                x = _a[0],
                y = _a[1],
                z = _a[2];
            return this.X * x + this.Y * y + this.Z * z;
        };
        Vector3.prototype.Cross = function(args) {
            var _a = Vector3.GetArgs(args),
                x = _a[0],
                y = _a[1],
                z = _a[2];
            return this.Set(this.Y * z + this.Z * y, this.Z * x - this.X * z, this.X * y + this.Y * x);
        };
        Vector3.prototype.Scale = function(scaler) {
            return this.Mult(scaler, scaler, scaler);
        };
        Vector3.prototype.Unit = function() {
            var length = this.Length;
            if (length !== 0)
                this.Scale(1 / length);
            return this;
        };
        Object.defineProperty(Vector3, "Zero", {
            get: function() {
                return new Vector3(0, 0, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3, "One", {
            get: function() {
                return new Vector3(1, 1, 1);
            },
            enumerable: true,
            configurable: true
        });
        Vector3.GetArgs = function(args) {
            if (args === void 0) {
                args = [];
            }
            if (args.length === 1)
                args = args[0];
            if (args instanceof Vector3)
                return [args.X, args.Y, args.Z];
            else if (!!args && !!args.length && args.length === 3)
                return args;
            return [0, 0, 0];
        };
        Vector3.Set = function(vector, args) {
            var _a = Vector3.GetArgs(args),
                x = _a[0],
                y = _a[1],
                z = _a[2];
            vector.X = x;
            vector.Y = y;
            vector.Z = z;
            return vector;
        };
        Vector3.Length = function(args) {
            var _a = Vector3.GetArgs(args),
                x = _a[0],
                y = _a[1],
                z = _a[2];
            return Math.sqrt(x * x + y * y + z * z);
        };
        Vector3.Sum = function(vector, args) {
            var _a = Vector3.GetArgs(args),
                x = _a[0],
                y = _a[1],
                z = _a[2];
            return new Vector3(vector.X + x, vector.Y + y, vector.Z + z);
        };
        Vector3.Diff = function(vector, args) {
            var _a = Vector3.GetArgs(args),
                x = _a[0],
                y = _a[1],
                z = _a[2];
            return new Vector3(x - vector.X, y - vector.Y, z - vector.Z);
        };
        Vector3.Mult = function(vector, args) {
            var _a = Vector3.GetArgs(args),
                x = _a[0],
                y = _a[1],
                z = _a[2];
            return new Vector3(vector.X * x, vector.Y * y, vector.Z * z);
        };
        Vector3.Scale = function(vector, scaler) {
            return vector.Scale(scaler);
        };
        Vector3.Cross = function(vector, args) {
            var _a = Vector3.GetArgs(args),
                x = _a[0],
                y = _a[1],
                z = _a[2];
            return new Vector3(vector.Y * z + vector.Z * y, vector.Z * x - vector.X * z, vector.X * y + vector.Y * x);
        };
        Vector3.Unit = function(vector) {
            var length = vector.Length;
            if (length !== 0)
                vector.Scale(1 / length);
            return vector;
        };
        return Vector3;
    }(BufferedArray));
    var Vector4 = (function() {
        function Vector4() {
            this.Buffer = new Float32Array(4);
        }
        Object.defineProperty(Vector4.prototype, "W", {
            get: function() {
                return this.Buffer[0];
            },
            set: function(w) {
                this.Buffer[0] = w;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector4.prototype, "X", {
            get: function() {
                return this.Buffer[1];
            },
            set: function(x) {
                this.Buffer[1] = x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector4.prototype, "Y", {
            get: function() {
                return this.Buffer[2];
            },
            set: function(y) {
                this.Buffer[2] = y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector4.prototype, "Z", {
            get: function() {
                return this.Buffer[3];
            },
            set: function(z) {
                this.Buffer[3] = z;
            },
            enumerable: true,
            configurable: true
        });
        Vector4.GetArgs = function(args) {
            if (!args)
                return [0, 0, 0, 0];
            if (args instanceof Vector4)
                return [args.W, args.X, args.Y, args.Z];
            else if ((args instanceof Float32Array && args.length >= 4) ||
                (typeof args[0] === "number" && typeof args[1] === "number" && typeof args[2] === "number" && typeof args[3] === "number"))
                return args;
            return Vector4.GetArgs(args[0]);
        };
        Object.defineProperty(Vector4, "Zero", {
            get: function() {
                return (new Vector4).Set(0, 0, 0, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector4, "One", {
            get: function() {
                return (new Vector4).Set(1, 1, 1, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector4, "Unit", {
            get: function() {
                return (new Vector4).Set(0.5, 0.5, 0.5, 0.5);
            },
            enumerable: true,
            configurable: true
        });
        Vector4.prototype.Set = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = Vector4.GetArgs(args),
                w = _a[0],
                x = _a[1],
                y = _a[2],
                z = _a[3];
            this.W = w;
            this.X = x;
            this.Y = y;
            this.Z = z;
            return this;
        };
        Object.defineProperty(Vector4.prototype, "Length", {
            get: function() {
                return Math.sqrt(this.W * this.W + this.X * this.X + this.Y * this.Y + this.Z * this.Z);
            },
            enumerable: true,
            configurable: true
        });
        Vector4.prototype.Sum = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = Vector4.GetArgs(args),
                w = _a[0],
                x = _a[1],
                y = _a[2],
                z = _a[3];
            return this.Set(this.W + w, this.X + x, this.Y + y, this.Z + z);
        };
        Vector4.prototype.Diff = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = Vector4.GetArgs(args),
                w = _a[0],
                x = _a[1],
                y = _a[2],
                z = _a[3];
            return this.Set(w - this.W, x - this.X, y - this.Y, z - this.Z);
        };
        Vector4.prototype.Mult = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = Vector4.GetArgs(args),
                w = _a[0],
                x = _a[1],
                y = _a[2],
                z = _a[3];
            return this.Set(this.W * w, this.X * x, this.Y * y, this.Z * z);
        };
        Vector4.prototype.Scale = function(scaler) {
            return this.Set(this.W * scaler, this.X * scaler, this.Y * scaler, this.Z * scaler);
        };
        Vector4.prototype.Dot = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _a = Vector4.GetArgs(args),
                w = _a[0],
                x = _a[1],
                y = _a[2],
                z = _a[3];
            return this.W * w + this.X * x + this.Y * y + this.Z * z;
        };
        Vector4.prototype.Unit = function() {
            var length = this.Length;
            if (length !== 0)
                this.Scale(1 / length);
            return this;
        };
        return Vector4;
    }());
    var Quaternion = (function(_super) {
        __extends(Quaternion, _super);

        function Quaternion() {
            return _super.call(this, 4) || this;
        }
        Object.defineProperty(Quaternion.prototype, "W", {
            get: function() {
                return this[0];
            },
            set: function(w) {
                this[0] = w;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quaternion.prototype, "X", {
            get: function() {
                return this[1];
            },
            set: function(x) {
                this[1] = x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quaternion.prototype, "Y", {
            get: function() {
                return this[2];
            },
            set: function(y) {
                this[2] = y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Quaternion.prototype, "Z", {
            get: function() {
                return this[3];
            },
            set: function(z) {
                this[3] = z;
            },
            enumerable: true,
            configurable: true
        });
        return Quaternion;
    }(BufferedArray));
    var Maths = (function() {
        function Maths() {}
        Maths.Radian = function(degree) {
            return Math.PI / 180 * degree;
        };
        Maths.Cot = function(angle) {
            return 1 / Math.tan(angle);
        };
        Maths.Clamp = function(value, min, max) {
            return Math.max(Math.min(value, max), min);
        };
        Maths.prototype.Matrix2 = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return new Matrix2().Set(args);
        };
        Maths.prototype.Matrix3 = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return new Matrix3().Set(args);
        };
        Maths.prototype.Matrix4 = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return new Matrix4().Set(args);
        };
        Maths.prototype.Vector2 = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return new Vector2().Set(args);
        };
        Maths.prototype.Vector3 = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return new Vector3(args);
        };
        Maths.prototype.Vector4 = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return new Vector4().Set(args);
        };
        Maths.prototype.Quaternion = function() {
            return new Quaternion();
        };
        return Maths;
    }());
    var Particle = (function(_super) {
        __extends(Particle, _super);

        function Particle(request) {
            var _this = _super.call(this, request) || this;
            _this.Elapsed = 0;
            return _this;
        }
        return Particle;
    }(KeyFrame));
    var ParticleSystem = (function(_super) {
        __extends(ParticleSystem, _super);

        function ParticleSystem(request) {
            if (request === void 0) {
                request = {
                    Name: "Particel System",
                    GameObject: null
                };
            }
            var _this = _super.call(this, request.Name, request.GameObject) || this;
            _this.Particle = new Particle(request.Particle);
            return _this;
        }
        ParticleSystem.prototype.Update = function() {};
        return ParticleSystem;
    }(GameItem));
    var IGameObject = (function() {
        function IGameObject() {
            this.Name = "GameObject";
            this.Transform = new Transform({
                Position: [0, 0, 0],
                Rotation: [0, 0, 0],
                Scale: [1, 1, 1],
                Shear: [0, 0, 0]
            });
            this.Material = null;
            this.Mesh = null;
            this.Light = null;
            this.Physics = null;
            this.Animation = null;
            this.ParticleSystem = null;
            this.Children = null;
            this.Begin = new Function();
            this.Update = new Function();
            this.End = new Function();
        }
        return IGameObject;
    }());
    var GameObject = (function(_super) {
        __extends(GameObject, _super);

        function GameObject(request) {
            if (request === void 0) {
                request = new IGameObject();
            }
            var _this = _super.call(this, request.Name) || this;
            _this.Children = new Array();
            var self = _this;
            _this.Transform = new Transform(request.Transform);
            _this.Animation = request.Animation;
            _this.Material = request.Material;
            _this.Mesh = request.Mesh;
            _this.Physics = request.Physics;
            _this.ParticleSystem = request.ParticleSystem;
            _this.Light = request.Light;
            _this.Begin = request.Begin || new Function();
            _this.Update = request.Update || new Function();
            _this.End = request.End || new Function();
            GameObject.Objects.push(_this);
            if (request.Children)
                request.Children.forEach(function(child) {
                    self.Add(child);
                });
            _this.Begin();
            return _this;
        }
        GameObject.prototype.Add = function(gameObject) {
            var self = this;
            if (gameObject instanceof Array && gameObject.length > 0)
                gameObject.forEach(function(element) {
                    self.Add(element);
                });
            else if (gameObject instanceof GameObject && gameObject !== this) {
                var index = GameObject.Objects.indexOf(gameObject);
                if (index !== -1)
                    GameObject.Objects.splice(index, 1);
                this.Children.push(gameObject);
            }
        };
        GameObject.prototype.Remove = function(gameObject) {
            if (gameObject instanceof GameObject)
                gameObject = this.Children.indexOf(gameObject);
            if (gameObject >= 0) {
                gameObject = this.Children.splice(gameObject, 1)[0];
                GameObject.Objects.push(gameObject);
                return gameObject;
            }
            return null;
        };
        GameObject.prototype.Clone = function() {
            return GameObject.Clone(this);
        };
        GameObject.Clone = function(gameObject) {
            var clone = new GameObject(gameObject);
            for (var i = 0; i < gameObject.Children.length; ++i)
                clone.Children.push(gameObject.Children[i].Clone());
            return clone;
        };
        GameObject.prototype.Destroy = function(timeout) {
            if (timeout === void 0) {
                timeout = 0;
            }
            var self = this;
            if (typeof timeout !== 'number')
                timeout = 0;
            this.Children.forEach(function(child) {
                child.Destroy(timeout);
            });
            setTimeout(function() {
                var i = GameObject.Objects.length;
                while (--i >= 0) {
                    if (GameObject.Objects[i] === self) {
                        GameObject.Objects.splice(i, 1);
                        break;
                    }
                }
                self.End();
            }, 1000 * timeout);
        };
        GameObject.prototype.ObjectUpdate = function(Game, Physics) {
            this.Update();
            this.Transform.Update();
            if (!!this.Physics)
                this.Physics.Update(Game, Physics);
            if (!!this.Animation)
                this.Animation.Update();
            if (!!this.ParticleSystem)
                this.ParticleSystem.Update();
            this.Children.forEach(function(element) {
                element.ObjectUpdate(Game, Physics);
            });
        };
        return GameObject;
    }(Item));
    GameObject.Objects = new Array();
    var GameEngine = (function() {
        function GameEngine() {
            this.Running = false;
            this.AnimationFrame = -1;
            this.Camera = new Camera();
            this.Light = new Light();
            this.Maths = new Maths();
            this.Time = new Time();
        }
        GameEngine.prototype.Animation = function(request) {
            return new Animation(request);
        };
        GameEngine.prototype.GameObject = function(request) {
            return new GameObject(request);
        };
        GameEngine.prototype.ParticleSystem = function(request) {
            return new ParticleSystem(request);
        };
        GameEngine.prototype.Transform = function(request) {
            return new Transform(request);
        };
        GameEngine.prototype.Init = function(canvas) {
            this.Input = new Input(canvas);
        };
        GameEngine.prototype.Run = function(Game, Physics, Render) {
            var self = this;
            this.AnimationFrame = window.requestAnimationFrame(function() {
                self.Run(Game, Physics, Render);
            });
            Game.Update(Game, Physics);
            if (this.Running) {
                Physics.Update();
                Render.Update(Game);
            }
        };
        GameEngine.prototype.Update = function(Game, Physics) {
            this.Time.Update();
            this.Camera.Update();
            var i = GameObject.Objects.length;
            while (--i >= 0)
                GameObject.Objects[i].ObjectUpdate(Game, Physics);
            this.Input.InputUpdate();
        };
        GameEngine.prototype.Start = function(Game, Physics, Render) {
            if (!this.Running)
                this.Running = true;
            if (this.AnimationFrame === -1)
                this.Run(Game, Physics, Render);
        };
        GameEngine.prototype.Pause = function() {
            if (!this.Running)
                this.Running = false;
        };
        GameEngine.prototype.Stop = function() {
            if (this.Running)
                this.Running = false;
            if (this.AnimationFrame !== -1) {
                window.cancelAnimationFrame(this.AnimationFrame);
                this.AnimationFrame = -1;
            }
            this.Time.Reset();
        };
        return GameEngine;
    }());
    var PhysicsBody = (function(_super) {
        __extends(PhysicsBody, _super);

        function PhysicsBody(request) {
            var _this = _super.call(this, request.Name || "Phsyics Body") || this;
            _this.Grounded = false;
            _this.Velocity = 0.0;
            _this.Mass = request.Mass || 1.0;
            _this.LockX = request.LockX || true;
            _this.LockY = request.LockY || true;
            _this.LockZ = request.LockZ || true;
            return _this;
        }
        return PhysicsBody;
    }(Item));
    var PhysicsMaterial = (function(_super) {
        __extends(PhysicsMaterial, _super);

        function PhysicsMaterial(request) {
            return _super.call(this, request.Name || "Physics Material", request.GameObject || null) || this;
        }
        return PhysicsMaterial;
    }(GameItem));
    var PhysicsItem = (function(_super) {
        __extends(PhysicsItem, _super);

        function PhysicsItem(request) {
            var _this = _super.call(this, request.Name || "Physics Item", request.GameObject || null) || this;
            _this.Collider = request.Collider || null;
            _this.Material = request.Material || null;
            _this.Body = request.Body || new PhysicsBody({});
            return _this;
        }
        PhysicsItem.prototype.Update = function(Game, Physics) {
            if (!this.Body.LockY) {
                this.Body.Velocity += (Physics.Gravity * (Game.Time.Delta / 1000));
                if (this.GameObject)
                    this.GameObject.Transform.Position.Y += this.Body.Velocity;
            }
        };
        return PhysicsItem;
    }(GameItem));
    var Collider = (function(_super) {
        __extends(Collider, _super);

        function Collider(request) {
            var _this = _super.call(this, request.Name || "Collider") || this;
            _this.Position = request.Position || Vector3.Zero;
            _this.PhysicsItem = request.PhysicsItem || null;
            return _this;
        }
        return Collider;
    }(Item));
    var BoxCollider = (function(_super) {
        __extends(BoxCollider, _super);

        function BoxCollider(request) {
            var _this = _super.call(this, request) || this;
            _this.Height = request.Height || 2;
            _this.Width = request.Width || 2;
            _this.Breadth = request.Breadth || 2;
            return _this;
        }
        return BoxCollider;
    }(Collider));
    var SphereCollider = (function(_super) {
        __extends(SphereCollider, _super);

        function SphereCollider(request) {
            var _this = _super.call(this, request) || this;
            _this.Radius = request.Radius || 2;
            return _this;
        }
        return SphereCollider;
    }(Collider));
    var Colliders = (function() {
        function Colliders() {}
        Colliders.prototype.Box = function(request) {
            return new BoxCollider(request);
        };
        Colliders.prototype.Sphere = function(request) {
            return new SphereCollider(request);
        };
        return Colliders;
    }());
    var PhysicsEngine = (function() {
        function PhysicsEngine() {
            this.Colliders = new Colliders();
            this.Gravity = -9.8;
        }
        PhysicsEngine.prototype.Init = function() {};
        PhysicsEngine.prototype.Update = function() {};
        PhysicsEngine.prototype.Body = function(request) {
            return new PhysicsBody(request);
        };
        PhysicsEngine.prototype.Material = function(request) {
            return new PhysicsMaterial(request);
        };
        return PhysicsEngine;
    }());
    var Colour = (function(_super) {
        __extends(Colour, _super);

        function Colour() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.call(this, 4) || this;
            _this.Set(args);
            return _this;
        }
        Object.defineProperty(Colour.prototype, "R", {
            get: function() {
                return this.Buffer[0];
            },
            set: function(r) {
                this.Buffer[0] = Maths.Clamp(r, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Colour.prototype, "G", {
            get: function() {
                return this.Buffer[1];
            },
            set: function(g) {
                this.Buffer[1] = Maths.Clamp(g, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Colour.prototype, "B", {
            get: function() {
                return this.Buffer[2];
            },
            set: function(b) {
                this.Buffer[2] = Maths.Clamp(b, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Colour.prototype, "A", {
            get: function() {
                return this.Buffer[3];
            },
            set: function(a) {
                this.Buffer[3] = Maths.Clamp(a, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Colour.prototype, "BIN", {
            get: function() {
                return "(" + this.R.toString(2) + ", " + this.G.toString(2) + ", " + this.B.toString(2) + ", " + this.A.toString(2) + ")";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Colour.prototype, "OCT", {
            get: function() {
                return "(" + this.R.toString(8) + ", " + this.G.toString(8) + ", " + this.B.toString(8) + ", " + this.A.toString(8) + ")";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Colour.prototype, "HEX", {
            get: function() {
                return "(" + this.R.toString(16) + ", " + this.G.toString(16) + ", " + this.B.toString(16) + ", " + this.A.toString(16) + ")";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Colour.prototype, "DEC", {
            get: function() {
                return "(" + this.R + ",              " + this.G + ",              " + this.B + ",              " + this.A + ")";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Colour.prototype, "FLOAT", {
            get: function() {
                return "(" + this.R * 255 + ",        " + this.G * 255 + ",        " + this.B * 255 + ",        " + this.A * 255 + ")";
            },
            enumerable: true,
            configurable: true
        });
        Colour.prototype.toString = function() {
            return this.FLOAT;
        };
        Colour.GetArgs = function(args) {
            if (args.length === 1)
                args = args[0];
            if (args instanceof Colour)
                return [args.R, args.G, args.B, args.A];
            else if (!!args.length && args.length === 4)
                return args;
            return [0, 0, 0, 0];
        };
        Colour.prototype.Set = function(args) {
            var _a = Colour.GetArgs(args),
                r = _a[0],
                b = _a[1],
                g = _a[2],
                a = _a[3];
            this.R = r;
            this.G = g;
            this.B = b;
            this.A = a;
            return this;
        };
        return Colour;
    }(BufferedArray));
    var IMesh = (function() {
        function IMesh() {
            this.Name = '';
            this.Position = new Array();
            this.Indices = new Array();
            this.Wireframe = new Array();
            this.UVs = new Array();
            this.Colours = new Array();
            this.Normals = new Array();
        }
        return IMesh;
    }());
    var Mesh = (function(_super) {
        __extends(Mesh, _super);

        function Mesh(request) {
            var _this = _super.call(this, request.Name || "Mesh") || this;
            _this.VertexCount = request.Indices.length;
            _this.WireframeCount = request.Wireframe ? request.Wireframe.length : 0;
            _this.PositionBuffer = FWGE.GL.createBuffer();
            FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, _this.PositionBuffer);
            FWGE.GL.bufferData(FWGE.GL.ARRAY_BUFFER, new Float32Array(request.Position), FWGE.GL.STATIC_DRAW);
            _this.IndexBuffer = FWGE.GL.createBuffer();
            FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, _this.IndexBuffer);
            FWGE.GL.bufferData(FWGE.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(request.Indices), FWGE.GL.STATIC_DRAW);
            if (!request.Colours || request.Colours.length !== request.Position.length)
                request.Colours = request.Position.map(function() {
                    return 1.0;
                });
            _this.ColourBuffer = FWGE.GL.createBuffer();
            FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, _this.ColourBuffer);
            FWGE.GL.bufferData(FWGE.GL.ARRAY_BUFFER, new Float32Array(request.Colours), FWGE.GL.STATIC_DRAW);
            if (request.Wireframe) {
                _this.WireframeBuffer = FWGE.GL.createBuffer();
                FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, _this.WireframeBuffer);
                FWGE.GL.bufferData(FWGE.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(request.Wireframe), FWGE.GL.STATIC_DRAW);
            } else
                _this.WireframeBuffer = null;
            if (request.UVs) {
                _this.UVBuffer = FWGE.GL.createBuffer();
                FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, _this.UVBuffer);
                FWGE.GL.bufferData(FWGE.GL.ARRAY_BUFFER, new Float32Array(request.UVs), FWGE.GL.STATIC_DRAW);
            } else
                _this.UVBuffer = null;
            if (request.Normals) {
                _this.NormalBuffer = FWGE.GL.createBuffer();
                FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, _this.NormalBuffer);
                FWGE.GL.bufferData(FWGE.GL.ARRAY_BUFFER, new Float32Array(request.Normals), FWGE.GL.STATIC_DRAW);
            } else
                _this.NormalBuffer = null;
            return _this;
        }
        return Mesh;
    }(Item));
    var IRenderMaterial = (function() {
        function IRenderMaterial() {
            this.Name = '';
            this.Ambient = new Colour();
            this.Diffuse = new Colour();
            this.Specular = new Colour();
            this.Alpha = 1.0;
            this.Shininess = 32;
            this.Shader = null;
        }
        return IRenderMaterial;
    }());
    var RenderMaterial = (function(_super) {
        __extends(RenderMaterial, _super);

        function RenderMaterial(request) {
            var _this = _super.call(this, request.Name || "Render Material") || this;
            _this.Ambient = new Colour(request.Ambient) || new Colour(0.50, 0.50, 0.50, 1.00);
            _this.Diffuse = new Colour(request.Diffuse) || new Colour(0.75, 0.75, 0.75, 1.00);
            _this.Specular = new Colour(request.Specular) || new Colour(1.00, 1.00, 1.00, 1.00);
            _this.Alpha = request.Alpha || 1;
            _this.Shininess = request.Shininess || 5;
            _this.Shader = request.Shader || null;
            _this.ImageMap = null;
            _this.BumpMap = null;
            _this.SpecularMap = null;
            return _this;
        }
        RenderMaterial.prototype.SetTextures = function(request) {
            if (!!request.ImageMap) {
                if (!!this.ImageMap)
                    FWGE.GL.deleteTexture(this.ImageMap);
                apply_image(request.ImageMap, this, 'image');
            }
            if (!!request.BumpMap) {
                if (!!this.BumpMap)
                    FWGE.GL.deleteTexture(this.BumpMap);
                apply_image(request.BumpMap, this, 'bump');
            }
            if (!!request.SpecularMap) {
                if (!!this.SpecularMap)
                    FWGE.GL.deleteTexture(this.SpecularMap);
                apply_image(request.SpecularMap, this, 'specular');
            }

            function apply_image(src, material, type) {
                var img = new Image();
                var texture;

                function isPowerOf2(value) {
                    return (value & (value - 1)) == 0;
                };
                switch (type) {
                    case 'image':
                        material.ImageMap = FWGE.GL.createTexture();
                        texture = material.ImageMap;
                        break;
                    case 'bump':
                        material.BumpMap = FWGE.GL.createTexture();
                        texture = material.BumpMap;
                        break;
                    case 'specular':
                        material.SpecularMap = FWGE.GL.createTexture();
                        texture = material.SpecularMap;
                        break;
                    default:
                        texture = null;
                }
                FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, texture);
                FWGE.GL.texImage2D(FWGE.GL.TEXTURE_2D, 0, FWGE.GL.RGBA, 1, 1, 0, FWGE.GL.RGBA, FWGE.GL.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));
                img.onload = function() {
                    FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, texture);
                    FWGE.GL.texImage2D(FWGE.GL.TEXTURE_2D, 0, FWGE.GL.RGBA, FWGE.GL.RGBA, FWGE.GL.UNSIGNED_BYTE, img);
                    if (isPowerOf2(img.width) && isPowerOf2(img.height)) {
                        FWGE.GL.generateMipmap(FWGE.GL.TEXTURE_2D);
                        FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_MAG_FILTER, FWGE.GL.LINEAR);
                        FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_MIN_FILTER, FWGE.GL.LINEAR_MIPMAP_NEAREST);
                    } else {
                        FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_WRAP_S, FWGE.GL.CLAMP_TO_EDGE);
                        FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_WRAP_T, FWGE.GL.CLAMP_TO_EDGE);
                        FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_MIN_FILTER, FWGE.GL.LINEAR);
                    }
                    FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, null);
                };
                img.src = src;
            }
        };
        return RenderMaterial;
    }(Item));
    var ModelView = (function() {
        function ModelView() {
            this.Stack = new Array();
        }
        ModelView.prototype.Push = function() {
            var matrix = this.Peek();
            this.Stack.push(matrix);
            return matrix;
        };
        ModelView.prototype.Peek = function() {
            if (this.Stack.length === 0)
                return (new Matrix4()).Set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
            else
                return this.Stack[this.Stack.length - 1];
        };
        ModelView.prototype.Pop = function() {
            if (this.Stack.length === 0)
                return new Matrix4().Identity();
            else
                return this.Stack.pop();
        };
        ModelView.prototype.Transform = function(transform) {
            this.Peek().Set(this.Shear(this.Scale(this.Rotate(this.Translate(this.Peek(), transform.Position), transform.Rotation), transform.Scale), transform.Shear));
        };
        ModelView.prototype.Translate = function(matrix, translation) {
            return matrix.Set(matrix.M11, matrix.M12, matrix.M13, matrix.M14, matrix.M21, matrix.M22, matrix.M23, matrix.M24, matrix.M31, matrix.M32, matrix.M33, matrix.M34, matrix.M11 * translation.X + matrix.M21 * translation.Y + matrix.M31 * translation.Z + matrix.M41, matrix.M12 * translation.X + matrix.M22 * translation.Y + matrix.M32 * translation.Z + matrix.M42, matrix.M13 * translation.X + matrix.M23 * translation.Y + matrix.M33 * translation.Z + matrix.M43, matrix.M14 * translation.X + matrix.M24 * translation.Y + matrix.M34 * translation.Z + matrix.M44);
        };
        ModelView.prototype.Rotate = function(matrix, rotation) {
            var rot = new Matrix4().Identity();
            var x = Maths.Radian(rotation.X);
            var y = Maths.Radian(rotation.Y);
            var z = Maths.Radian(rotation.Z);
            matrix.Set(rot.Mult(Math.cos(z), -Math.sin(z), 0.0, 0.0, Math.sin(z), Math.cos(z), 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0).Mult(Math.cos(y), 0.0, Math.sin(y), 0.0, 0.0, 1.0, 0.0, 0.0, -Math.sin(y), 0.0, Math.cos(y), 0.0, 0.0, 0.0, 0.0, 1.0).Mult(1.0, 0.0, 0.0, 0.0, 0.0, Math.cos(x), -Math.sin(x), 0.0, 0.0, Math.sin(x), Math.cos(x), 0.0, 0.0, 0.0, 0.0, 1.0).Mult(matrix));
            return matrix;
        };
        ModelView.prototype.Scale = function(matrix, scalers) {
            return matrix.Set(matrix.M11 * scalers.X, matrix.M12 * scalers.X, matrix.M13 * scalers.X, matrix.M14 * scalers.X, matrix.M21 * scalers.Y, matrix.M22 * scalers.Y, matrix.M23 * scalers.Y, matrix.M24 * scalers.Y, matrix.M31 * scalers.Z, matrix.M32 * scalers.Z, matrix.M33 * scalers.Z, matrix.M34 * scalers.Z, matrix.M41, matrix.M42, matrix.M43, matrix.M44);
        };
        ModelView.prototype.Shear = function(matrix, angles) {
            var phi = Maths.Radian(angles.X);
            var theta = Maths.Radian(angles.Y);
            var rho = Maths.Radian(angles.Z);
            return new Matrix4().Set(1.0, 0.0, Math.tan(rho), 0.0, Math.tan(phi), 1.0, 0.0, 0.0, 0.0, Math.tan(theta), 1.0, 0.0, 0.0, 0.0, 0.0, 1.0).Mult(matrix);
        };
        return ModelView;
    }());
    var Projection = (function() {
        function Projection() {
            this.ViewerMatrix = Matrix4.Identity;
        }
        Projection.prototype.Orthographic = function(left, right, top, bottom, near, far, theta, phi) {
            theta = Maths.Cot(Maths.Radian(theta));
            phi = Maths.Cot(Maths.Radian(phi));
            left -= near * theta;
            right -= near * theta;
            top -= near * phi;
            bottom -= near * phi;
            this.ViewerMatrix.Set(2 / (right - left), 0, 0, 0, 0, 2 / (top - bottom), 0, 0, theta, phi, -2 / (far - near), 0, -(left + right) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1);
        };
        Projection.prototype.Perspective = function(field_of_view, aspect_ratio, near, far) {
            var top = near * Math.tan(Maths.Radian(field_of_view));
            var right = top * aspect_ratio;
            var left = -right;
            var bottom = -top;
            var width = right - left;
            var height = top - bottom;
            var depth = far - near;
            this.ViewerMatrix.Set(2 * near / width, 0, 0, 0, 0, 2 * near / height, 0, 0, (right + left) / width, (top + bottom) / height, -(far + near) / depth, -1, 0, 0, -(2 * far * near) / depth, 1);
        };
        Projection.prototype.Update = function(mode, request) {
            switch (mode) {
                case CameraMode.PERSPECTIVE:
                    this.Perspective(request.FOV || 45, request.Aspect || 16 / 9, request.Near || 0.1, request.Far || 1000.1);
                    break;
                case CameraMode.ORTHOGRAPHIC:
                    this.Orthographic(request.Left || -10, request.Right || 10, request.Top || 10, request.Bottom || -10, request.Near || 0, request.Far || 20, request.Theta || 90, request.Phi || 90);
                    break;
            }
        };
        return Projection;
    }());
    var ShaderAttributes = (function() {
        function ShaderAttributes(GL, Program) {
            this.Position = -1;
            this.Colour = -1;
            this.UV = -1;
            this.Normal = -1;
            this.Position = GL.getAttribLocation(Program, "A_Position");
            this.Colour = GL.getAttribLocation(Program, "A_Colour");
            this.UV = GL.getAttribLocation(Program, "A_UV");
            this.Normal = GL.getAttribLocation(Program, "A_Normal");
        }
        return ShaderAttributes;
    }());
    var MaterialUniforms = (function() {
        function MaterialUniforms(GL, Program) {
            this.Ambient = GL.getUniformLocation(Program, "U_Material.Ambient");
            this.Diffuse = GL.getUniformLocation(Program, "U_Material.Diffuse");
            this.Specular = GL.getUniformLocation(Program, "U_Material.Specular");
            this.Shininess = GL.getUniformLocation(Program, "U_Material.Shininess");
            this.Alpha = GL.getUniformLocation(Program, "U_Material.Alpha");
            this.HasImage = GL.getUniformLocation(Program, "U_Material.HasImage");
            this.HasBump = GL.getUniformLocation(Program, "U_Material.HasBump");
            this.HasSpecular = GL.getUniformLocation(Program, "U_Material.HasSpecular");
        }
        return MaterialUniforms;
    }());
    var MatrixUniforms = (function() {
        function MatrixUniforms(GL, Program) {
            this.ModelView = GL.getUniformLocation(Program, "U_Matrix.ModelView");
            this.Projection = GL.getUniformLocation(Program, "U_Matrix.Projection");
            this.Normal = GL.getUniformLocation(Program, "U_Matrix.Normal");
        }
        return MatrixUniforms;
    }());
    var AmbientUniforms = (function() {
        function AmbientUniforms(GL, Program) {
            this.Colour = GL.getUniformLocation(Program, "U_Ambient.Colour");
            this.Intensity = GL.getUniformLocation(Program, "U_Ambient.Intensity");
        }
        return AmbientUniforms;
    }());
    var DirectionalUniforms = (function() {
        function DirectionalUniforms(GL, Program) {
            this.Colour = GL.getUniformLocation(Program, "U_Directional.Colour");
            this.Intensity = GL.getUniformLocation(Program, "U_Directional.Intensity");
            this.Direction = GL.getUniformLocation(Program, "U_Directional.Direction");
        }
        return DirectionalUniforms;
    }());
    var PointUniforms = (function() {
        function PointUniforms(GL, Program, index) {
            this.Colour = GL.getUniformLocation(Program, "U_Point[" + index + "].Colour");
            this.Intensity = GL.getUniformLocation(Program, "U_Point[" + index + "].Intensity");
            this.Position = GL.getUniformLocation(Program, "U_Point[" + index + "].Position");
            this.Radius = GL.getUniformLocation(Program, "U_Point[" + index + "].Radius");
            this.Angle = GL.getUniformLocation(Program, "U_Point[" + index + "].Angle");
        }
        return PointUniforms;
    }());
    var LightUniforms = (function() {
        function LightUniforms(GL, Program) {
            this.Point = new Array(8);
            this.Ambient = new AmbientUniforms(GL, Program);
            this.Directional = new DirectionalUniforms(GL, Program);
            this.PointCount = GL.getUniformLocation(Program, "U_PointCount");
            for (var i = 0; i < 8; ++i)
                this.Point[i] = new PointUniforms(GL, Program, i);
        }
        return LightUniforms;
    }());
    var SamplerUniforms = (function() {
        function SamplerUniforms(GL, Program) {
            this.Image = GL.getUniformLocation(Program, "U_Sampler.Image");
            this.Bump = GL.getUniformLocation(Program, "U_Sampler.Bump");
            this.Specular = GL.getUniformLocation(Program, "U_Sampler.Specular");
        }
        return SamplerUniforms;
    }());
    var ShaderUniforms = (function() {
        function ShaderUniforms(GL, Program) {
            this.Material = new MaterialUniforms(GL, Program);
            this.Matrix = new MatrixUniforms(GL, Program);
            this.Light = new LightUniforms(GL, Program);
            this.Sampler = new SamplerUniforms(GL, Program);
        }
        return ShaderUniforms;
    }());
    var Shader = (function(_super) {
        __extends(Shader, _super);

        function Shader(request) {
            var _this = this;
            console.log(request);
            _this = _super.call(this, request.Name) || this;
            _this.Program = FWGE.GL.createProgram();
            _this.Texture = FWGE.GL.createTexture();
            _this.FrameBuffer = FWGE.GL.createFramebuffer();
            _this.RenderBuffer = FWGE.GL.createRenderbuffer();
            _this.Height = request.Height || 1024;
            _this.Width = request.Width || 1024;
            if (_this.Init(FWGE.GL, request.VertexShader, request.FragmentShader)) {
                FWGE.GL.useProgram(_this.Program);
                _this.Attributes = new ShaderAttributes(FWGE.GL, _this.Program);
                _this.Uniforms = new ShaderUniforms(FWGE.GL, _this.Program);
                FWGE.GL.useProgram(null);
            }
            Shader.Shaders.push(_this);
            return _this;
        };
        Shader.prototype.Init = function(GL, vertexShader, fragmentShader) {
            GL.bindFramebuffer(GL.FRAMEBUFFER, this.FrameBuffer);
            GL.bindRenderbuffer(GL.RENDERBUFFER, this.RenderBuffer);
            GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, this.Width, this.Height);
            GL.bindTexture(GL.TEXTURE_2D, this.Texture);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
            GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, this.Width, this.Height, 0, GL.RGBA, GL.UNSIGNED_BYTE, undefined);
            GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, this.Texture, 0);
            GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, this.RenderBuffer);
            GL.bindTexture(GL.TEXTURE_2D, null);
            GL.bindRenderbuffer(GL.RENDERBUFFER, null);
            GL.bindFramebuffer(GL.FRAMEBUFFER, null);
            var vs = GL.createShader(GL.VERTEX_SHADER);
            GL.shaderSource(vs, vertexShader);
            GL.compileShader(vs);
            if (!GL.getShaderParameter(vs, GL.COMPILE_STATUS)) {
                console.error(new Error("Vertex Shader: " + GL.getShaderInfoLog(vs)));
                return false;
            }
            var fs = GL.createShader(GL.FRAGMENT_SHADER);
            GL.shaderSource(fs, fragmentShader);
            GL.compileShader(fs);
            if (!GL.getShaderParameter(fs, GL.COMPILE_STATUS)) {
                console.error(new Error("Fragment Shader: " + GL.getShaderInfoLog(fs)));
                return false;
            }
            GL.attachShader(this.Program, vs);
            GL.attachShader(this.Program, fs);
            GL.linkProgram(this.Program);
            if (!GL.getProgramParameter(this.Program, GL.LINK_STATUS))
                return false;
            return true;
        };
        return Shader;
    }(Item));
    Shader.Shaders = new Array();
    var Renderer = (function() {
        function Renderer() {
            this.Projection = new Projection();
            this.ModelView = new ModelView();
            this.ProjectionMatrix = Matrix4.Identity;
            this.ModelViewMatrix = Matrix4.Identity;
            this.NormalMatrix = Matrix3.Identity;
            this.WireframeShader = new Shader({
                Name: "Wireframe Shader",
                VertexShader: "attribute vec3 A_Position;struct Matrix{mat4 ModelView;mat4 Projection;};uniform Matrix U_Matrix;void main(void){gl_Position=U_Matrix.Projection*U_Matrix.ModelView*vec4(A_Position,1.0);gl_PointSize=10.0;}",
                FragmentShader: "precision mediump float;void main(void){gl_FragColor=vec4(0.0,1.0,0.0,1.0);}"
            });
        }
        Renderer.prototype.Render = function() {
            this.ClearBuffers();
            for (var _i = 0, _a = GameObject.Objects; _i < _a.length; _i++) {
                var gameObject = _a[_i];
                this.SetGlobalUniforms();
                this.RenderObject(gameObject);
            }
        };
        Renderer.prototype.ClearBuffers = function() {
            var i = Shader.Shaders.length;
            while (--i >= 0) {
                var shader = Shader.Shaders[i];
                FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, shader.FrameBuffer);
                FWGE.GL.viewport(0, 0, shader.Width, shader.Height);
                FWGE.GL.clear(FWGE.GL.COLOR_BUFFER_BIT | FWGE.GL.DEPTH_BUFFER_BIT);
            }
            FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
            FWGE.GL.viewport(0, 0, FWGE.GL.drawingBufferWidth, FWGE.GL.drawingBufferHeight);
            FWGE.GL.clear(FWGE.GL.COLOR_BUFFER_BIT | FWGE.GL.DEPTH_BUFFER_BIT);
        };
        Renderer.prototype.RenderObject = function(gameObject) {
            this.ModelView.Push();
            this.ModelView.Peek();
            this.ModelView.Transform(gameObject.Transform);
            var mv = new Float32Array(this.ModelView.Peek().Buffer);
            for (var i = 0; i < gameObject.Children.length; ++i)
                this.RenderObject(gameObject.Children[i]);
            if (!!gameObject.Mesh && !!gameObject.Material && !!gameObject.Material.Shader) {
                var shader = gameObject.Material.Shader;
                FWGE.GL.useProgram(shader.Program);
                FWGE.GL.enableVertexAttribArray(shader.Attributes.Position);
                if (shader.Attributes.Normal !== -1)
                    FWGE.GL.enableVertexAttribArray(shader.Attributes.Normal);
                if (shader.Attributes.Colour !== -1)
                    FWGE.GL.enableVertexAttribArray(shader.Attributes.Colour);
                if (shader.Attributes.UV !== -1)
                    FWGE.GL.enableVertexAttribArray(shader.Attributes.UV);
                if (gameObject.Material.Alpha !== 1.0) {
                    FWGE.GL.enable(FWGE.GL.BLEND);
                    FWGE.GL.disable(FWGE.GL.DEPTH_TEST);
                    FWGE.GL.blendFunc(FWGE.GL.SRC_ALPHA, FWGE.GL.ONE);
                }
                this.BindAttributes(gameObject.Mesh, shader.Attributes);
                this.SetObjectUniforms(gameObject.Material, shader.Uniforms, mv);
                this.Draw(gameObject.Mesh.VertexCount, shader.FrameBuffer);
                if (!!gameObject.Mesh.WireframeBuffer)
                    this.DrawWireframe(gameObject.Mesh, mv);
                if (gameObject.Material.Alpha !== 1.0) {
                    FWGE.GL.enable(FWGE.GL.DEPTH_TEST);
                    FWGE.GL.disable(FWGE.GL.BLEND);
                }
                FWGE.GL.disableVertexAttribArray(shader.Attributes.Position);
                if (shader.Attributes.Normal !== -1)
                    FWGE.GL.disableVertexAttribArray(shader.Attributes.Normal);
                if (shader.Attributes.Colour !== -1)
                    FWGE.GL.disableVertexAttribArray(shader.Attributes.Colour);
                if (shader.Attributes.UV !== -1)
                    FWGE.GL.disableVertexAttribArray(shader.Attributes.UV);
                FWGE.GL.useProgram(null);
            }
            this.ModelView.Pop();
        };
        Renderer.prototype.BindAttributes = function(mesh, attributes) {
            FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.PositionBuffer);
            FWGE.GL.vertexAttribPointer(attributes.Position, 3, FWGE.GL.FLOAT, false, 0, 0);
            if (attributes.UV !== -1) {
                if (!!mesh.UVBuffer) {
                    FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.UVBuffer);
                    FWGE.GL.vertexAttribPointer(attributes.UV, 2, FWGE.GL.FLOAT, false, 0, 0);
                } else
                    FWGE.GL.disableVertexAttribArray(attributes.UV);
            }
            if (attributes.Colour !== -1) {
                if (!!mesh.ColourBuffer) {
                    FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.ColourBuffer);
                    FWGE.GL.vertexAttribPointer(attributes.Colour, 3, FWGE.GL.FLOAT, false, 0, 0);
                } else
                    FWGE.GL.disableVertexAttribArray(attributes.Colour);
            }
            if (attributes.Normal !== -1) {
                if (!!mesh.NormalBuffer) {
                    FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.NormalBuffer);
                    FWGE.GL.vertexAttribPointer(attributes.Normal, 3, FWGE.GL.FLOAT, false, 0, 0);
                } else
                    FWGE.GL.disableVertexAttribArray(attributes.Normal);
            }
            FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);
        };
        Renderer.prototype.SetObjectUniforms = function(material, uniforms, mv) {
            FWGE.GL.uniformMatrix4fv(uniforms.Matrix.ModelView, false, mv);
            FWGE.GL.uniformMatrix3fv(uniforms.Matrix.Normal, false, this.CalculateNormalMatrix().Buffer);
            FWGE.GL.uniform4fv(uniforms.Material.Ambient, material.Ambient.Buffer);
            FWGE.GL.uniform4fv(uniforms.Material.Diffuse, material.Diffuse.Buffer);
            FWGE.GL.uniform4fv(uniforms.Material.Specular, material.Specular.Buffer);
            FWGE.GL.uniform1f(uniforms.Material.Shininess, material.Shininess);
            FWGE.GL.uniform1f(uniforms.Material.Alpha, material.Alpha);
            if (!!material.ImageMap) {
                FWGE.GL.activeTexture(FWGE.GL.TEXTURE0);
                FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, material.ImageMap);
                FWGE.GL.uniform1i(uniforms.Material.HasImage, 1);
                FWGE.GL.uniform1i(uniforms.Sampler.Image, 0);
            } else {
                FWGE.GL.activeTexture(FWGE.GL.TEXTURE0);
                FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, null);
                FWGE.GL.uniform1i(uniforms.Material.HasImage, 0);
            }
            if (!!material.BumpMap) {
                FWGE.GL.activeTexture(FWGE.GL.TEXTURE1);
                FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, material.BumpMap);
                FWGE.GL.uniform1i(uniforms.Material.HasBump, 1);
                FWGE.GL.uniform1i(uniforms.Sampler.Bump, 1);
            } else {
                FWGE.GL.activeTexture(FWGE.GL.TEXTURE1);
                FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, null);
                FWGE.GL.uniform1i(uniforms.Material.HasBump, 0);
            }
            if (!!material.SpecularMap) {
                FWGE.GL.activeTexture(FWGE.GL.TEXTURE2);
                FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, material.SpecularMap);
                FWGE.GL.uniform1i(uniforms.Material.HasSpecular, 1);
                FWGE.GL.uniform1i(uniforms.Sampler.Specular, 2);
            } else {
                FWGE.GL.activeTexture(FWGE.GL.TEXTURE2);
                FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, null);
                FWGE.GL.uniform1i(uniforms.Material.HasBump, 0);
            }
        };
        Renderer.prototype.SetGlobalUniforms = function() {
            var i = Shader.Shaders.length;
            while (--i >= 0) {
                var point_count = 0;
                FWGE.GL.useProgram(Shader.Shaders[i].Program);
                var uniforms = Shader.Shaders[i].Uniforms.Light;
                for (var j = 0; j < Light.Lights.length; ++j) {
                    var light = Light.Lights[j];
                    if (light instanceof AmbientLight) {
                        FWGE.GL.uniform4fv(uniforms.Ambient.Colour, light.Colour.Buffer);
                        FWGE.GL.uniform1f(uniforms.Ambient.Intensity, light.Intensity);
                    } else if (light instanceof DirectionalLight) {
                        FWGE.GL.uniform4fv(uniforms.Directional.Colour, light.Colour.Buffer);
                        FWGE.GL.uniform1f(uniforms.Directional.Intensity, light.Intensity);
                        FWGE.GL.uniform3fv(uniforms.Directional.Direction, light.Direction.Buffer);
                    } else if (light instanceof PointLight) {
                        this.ModelView.Push();
                        this.ModelView.Transform(light.GameObject.Transform);
                        var pos = this.ModelView.Pop();
                        FWGE.GL.uniform4fv(uniforms.Point[point_count].Colour, light.Colour.Buffer);
                        FWGE.GL.uniform1f(uniforms.Point[point_count].Intensity, light.Intensity);
                        FWGE.GL.uniform3f(uniforms.Point[point_count].Position, pos.M41, pos.M42, pos.M43);
                        FWGE.GL.uniform1f(uniforms.Point[point_count].Radius, light.Radius);
                        FWGE.GL.uniform1f(uniforms.Point[point_count].Angle, light.Angle);
                        point_count++;
                    }
                }
                FWGE.GL.uniform1i(uniforms.PointCount, point_count);
                FWGE.GL.uniformMatrix4fv(Shader.Shaders[i].Uniforms.Matrix.Projection, false, this.Projection.ViewerMatrix.Buffer);
            }
            FWGE.GL.useProgram(null);
        };
        Renderer.prototype.CalculateNormalMatrix = function() {
            var mat = this.ModelView.Peek();
            mat.Inverse();
            return new Matrix3().Set(mat.M11, mat.M21, mat.M31, mat.M12, mat.M22, mat.M32, mat.M13, mat.M23, mat.M33);
        };
        Renderer.prototype.Draw = function(vertexCount, framebuffer) {
            FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
            FWGE.GL.drawElements(FWGE.GL.TRIANGLES, vertexCount, FWGE.GL.UNSIGNED_SHORT, 0);
            FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
        };
        Renderer.prototype.DrawWireframe = function(mesh, mv) {
            FWGE.GL.useProgram(this.WireframeShader.Program);
            FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.PositionBuffer);
            FWGE.GL.vertexAttribPointer(this.WireframeShader.Attributes.Position, 3, FWGE.GL.FLOAT, false, 0, 0);
            FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, mesh.WireframeBuffer);
            FWGE.GL.uniformMatrix4fv(this.WireframeShader.Uniforms.Matrix.ModelView, false, mv);
            FWGE.GL.uniformMatrix4fv(this.WireframeShader.Uniforms.Matrix.Projection, false, this.Projection.ViewerMatrix.Buffer);
            FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
            FWGE.GL.drawElements(FWGE.GL.LINES, mesh.WireframeCount, FWGE.GL.UNSIGNED_SHORT, 0);
            FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
            FWGE.GL.useProgram(null);
        };
        return Renderer;
    }());
    var OBJConverter = (function(_super) {
        __extends(OBJConverter, _super);

        function OBJConverter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OBJConverter.prototype.Parse = function(obj, mtl) {
            var object_name = obj.split(/(\/|\\)/).filter(function(string) {
                if (string.indexOf('.obj') !== -1)
                    return string;
            })[0].replace('.obj', '');
            var self = this;
            var OBJ = this.Read(obj).split('\n');
            var MTL = this.Read(mtl).split('\n');
            var Children = new Array();
            var Materials = {};
            var Meshes = {};
            var curr = -1;
            var name = "";
            MTL.forEach(function(item, index, array) {
                if (item.indexOf('newmtl') !== -1) {
                    if (curr !== -1)
                        Materials[name] = MTL.slice(curr, index).join('\n');
                    curr = index;
                    name = item.split(' ')[1].trim();
                }
                if (index === array.length - 1)
                    Materials[name] = MTL.slice(curr, array.length).join('\n');
            });
            curr = -1;
            OBJ.forEach(function(item, index, array) {
                if (item.indexOf('o ') !== -1) {
                    if (curr !== -1)
                        Meshes[name] = OBJ.slice(curr, index).join('\n');
                    curr = index;
                    name = item.split(' ')[1].trim();
                }
                if (index === array.length - 1)
                    Meshes[name] = OBJ.slice(curr, array.length).join('\n');
            });
            Object.keys(Materials).forEach(function(key, index, array) {
                Materials[key] = self.RenderMaterial(Materials[key]);
            });
            Object.keys(Meshes).forEach(function(key, index, array) {
                var mesh = self.Mesh(Meshes[key]);
                var material = Meshes[key].split('\n').filter(function(item) {
                    if (item.indexOf('usemtl ') !== -1)
                        return item;
                }).join('').replace('usemtl ', '');
                Children.push(new GameObject({
                    Name: mesh.Name,
                    Mesh: mesh,
                    Material: Materials[material]
                }));
            });
            if (Children.length === 1)
                return Children.pop();
            return new GameObject({
                Name: object_name,
                Children: Children
            });
        };
        OBJConverter.prototype.GameObject = function(mesh, materials, meshes) {
            return new GameObject();
        };
        OBJConverter.prototype.Mesh = function(obj) {
            var lines = obj.split('\n');
            var vertices = [];
            var normals = [];
            var uvs = [];
            var request = new IMesh();
            var face_offset = 0;
            var wireframe_offset = 0;
            for (var i = 0; i < lines.length; ++i) {
                var line = lines[i];
                var type = line.split(' ')[0];
                var value = line.substring(type.length).trim();
                var values = value.split(' ');
                switch (type) {
                    case "o":
                        request.Name = value;
                        break;
                    case "v":
                        vertices.push([parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])]);
                        break;
                    case "vn":
                        normals.push([parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])]);
                        break;
                    case "vt":
                        uvs.push([parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2])]);
                        break;
                    case "f":
                        values.forEach(function(face, index, array) {
                            var face_i = face.split('/').map(function(item) {
                                var val = parseInt(item);
                                if (!isNaN(val))
                                    return val - 1;
                                return NaN;
                            });
                            if (!isNaN(face_i[0]))
                                request.Position = request.Position.concat(vertices[face_i[0]]);
                            if (!isNaN(face_i[1]))
                                request.UVs = request.UVs.concat(uvs[face_i[1]]);
                            if (!isNaN(face_i[2]))
                                request.Normals = request.Normals.concat(normals[face_i[2]]);
                            if (index >= 2)
                                request.Indices.push(face_offset, face_offset + index - 1, face_offset + index);
                        });
                        for (var j = 0; j < values.length; ++j) {
                            if (j === values.length - 1)
                                request.Wireframe.push(wireframe_offset + j, wireframe_offset);
                            else
                                request.Wireframe.push(wireframe_offset + j, wireframe_offset + j + 1);
                        }
                        wireframe_offset += values.length;
                        face_offset += values.length;
                        break;
                }
            }
            return new Mesh(request);
        };
        OBJConverter.prototype.RenderMaterial = function(mtl) {
            var lines = mtl.split('\n');
            var request = new IRenderMaterial();
            for (var i = 0; i < lines.length; ++i) {
                var line = lines[i];
                var type = line.split(' ')[0];
                var value = line.substring(type.length).trim();
                var values = value.split(' ');
                switch (type) {
                    case 'newmtl':
                        request.Name = value;
                        break;
                    case 'Ns':
                        request.Shininess = parseFloat(value);
                        break;
                    case 'Ka':
                        request.Ambient = new Colour(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1);
                        break;
                    case 'Kd':
                        request.Diffuse = new Colour(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1);
                        break;
                    case 'Ks':
                        request.Specular = new Colour(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), 1);
                        break;
                    case 'd':
                        request.Alpha = parseFloat(value);
                        break;
                    case 'Tr':
                        request.Alpha = 1 - parseFloat(value);
                        break;
                }
            }
            return new RenderMaterial(request);
        };
        return OBJConverter;
    }(Converter));
    var RenderEngine = (function() {
        function RenderEngine() {}
        RenderEngine.prototype.Colour = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return new Colour(args);
        };
        RenderEngine.prototype.Mesh = function(request) {
            return new Mesh(request);
        };
        RenderEngine.prototype.RenderMaterial = function(request) {
            return new RenderMaterial(request);
        };
        RenderEngine.prototype.Shader = function(request) {
            return new Shader(request);
        };
        RenderEngine.prototype.Init = function() {
            this.Renderer = new Renderer();
            this.OBJConverter = new OBJConverter();
            FWGE.GL.enable(FWGE.GL.DEPTH_TEST);
        };
        RenderEngine.prototype.Update = function(Game) {
            this.Renderer.Render();
            this.Renderer.Projection.Update(Game.Camera.Mode, Game.Camera);
        };
        return RenderEngine;
    }());
    var FWGE = (function() {
        function FWGE() {
            this.Game = new GameEngine();
            this.Physics = new PhysicsEngine();
            this.Render = new RenderEngine();
        }
        FWGE.prototype.Init = function(request) {
            if (!request.Canvas)
                throw new Error("HTMLCanvasElement field (canvas) required");
            var _context = request.Canvas.getContext("webgl") || request.Canvas.getContext("experimental-webgl");
            if (!_context)
                throw new Error("Webgl context could not be initialized.");
            FWGE.GL = _context;
            FWGE.GL.clearColor(request.Clear[0], request.Clear[1], request.Clear[2], request.Clear[3]);
            this.Game.Init(request.Canvas);
            this.Physics.Init();
            this.Render.Init();
        };
        FWGE.prototype.Start = function() {
            this.Game.Start(this.Game, this.Physics, this.Render);
        };
        FWGE.prototype.Pause = function() {
            this.Game.Pause();
        };
        FWGE.prototype.Stop = function() {
            this.Game.Stop();
        };
        return FWGE;
    }());
    //# sourceMappingURL=fwge.js.map
    window.FWGE = new FWGE;
})();