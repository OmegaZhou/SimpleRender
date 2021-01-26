"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Matrix = /** @class */ (function () {
    function Matrix(r, c) {
        this.m = [];
        if (!c) {
            c = r;
        }
        this.r = r;
        this.c = c;
        for (var i = 0; i < r; ++i) {
            this.m[i] = [];
            for (var j = 0; j < c; ++j) {
                this.m[i][j] = 0;
            }
        }
    }
    Matrix.prototype.val = function (x, y, value) {
        if (value) {
            this.m[x][y] = value;
        }
        return this.m[x][y];
    };
    Matrix.prototype.resize = function (r, c) {
        if (this.r > r) {
            this.m.splice(r, this.r - r);
        }
        else if (this.r < r) {
            for (var i = this.r; i < r; ++i) {
                this.m[i] = [];
            }
        }
        this.r = r;
        if (this.c > c) {
            for (var i = 0; i < this.r; ++i) {
                this.m[i].splice(c, this.c - c);
            }
        }
        else if (this.c < c) {
            for (var i = 0; i < this.r; ++i) {
                for (var j = this.c; j < c; ++j) {
                    this.m[i][j] = 0;
                }
            }
        }
    };
    return Matrix;
}());
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.v = new Matrix(2, 1);
        this.v.val(0, 0, x);
        this.v.val(1, 0, y);
    }
    Vector2.prototype.x = function (val) {
        return this.v.val(0, 0, val);
    };
    Vector2.prototype.y = function (val) {
        return this.v.val(1, 0, val);
    };
    return Vector2;
}());
var Vector3 = /** @class */ (function (_super) {
    __extends(Vector3, _super);
    function Vector3(x, y, z) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        var _this = _super.call(this, x, y) || this;
        _this.v.resize(3, 1);
        _this.v.val(2, 0, z);
        return _this;
    }
    Vector3.prototype.z = function (val) {
        return this.v.val(2, 0, val);
    };
    return Vector3;
}(Vector2));
var Vector4 = /** @class */ (function (_super) {
    __extends(Vector4, _super);
    function Vector4(x, y, z, w) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        if (w === void 0) { w = 0; }
        var _this = _super.call(this, x, y, z) || this;
        _this.v.resize(4, 1);
        _this.v.val(3, 0, w);
        return _this;
    }
    Vector4.prototype.w = function (val) {
        return this.v.val(3, 0, val);
    };
    return Vector4;
}(Vector3));
