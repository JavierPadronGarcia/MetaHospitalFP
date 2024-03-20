"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/* eslint-disable max-classes-per-file */
var BaseXform = require('../../base-xform');

var CompositeXform = require('../../composite-xform');

var X14IdXform = /*#__PURE__*/function (_BaseXform) {
  _inherits(X14IdXform, _BaseXform);

  var _super = _createSuper(X14IdXform);

  function X14IdXform() {
    _classCallCheck(this, X14IdXform);

    return _super.apply(this, arguments);
  }

  _createClass(X14IdXform, [{
    key: "tag",
    get: function get() {
      return 'x14:id';
    }
  }, {
    key: "render",
    value: function render(xmlStream, model) {
      xmlStream.leafNode(this.tag, null, model);
    }
  }, {
    key: "parseOpen",
    value: function parseOpen() {
      this.model = '';
    }
  }, {
    key: "parseText",
    value: function parseText(text) {
      this.model += text;
    }
  }, {
    key: "parseClose",
    value: function parseClose(name) {
      return name !== this.tag;
    }
  }]);

  return X14IdXform;
}(BaseXform);

var ExtXform = /*#__PURE__*/function (_CompositeXform) {
  _inherits(ExtXform, _CompositeXform);

  var _super2 = _createSuper(ExtXform);

  function ExtXform() {
    var _this;

    _classCallCheck(this, ExtXform);

    _this = _super2.call(this);
    _this.map = {
      'x14:id': _this.idXform = new X14IdXform()
    };
    return _this;
  }

  _createClass(ExtXform, [{
    key: "tag",
    get: function get() {
      return 'ext';
    }
  }, {
    key: "render",
    value: function render(xmlStream, model) {
      xmlStream.openNode(this.tag, {
        uri: '{B025F937-C7B1-47D3-B67F-A62EFF666E3E}',
        'xmlns:x14': 'http://schemas.microsoft.com/office/spreadsheetml/2009/9/main'
      });
      this.idXform.render(xmlStream, model.x14Id);
      xmlStream.closeNode();
    }
  }, {
    key: "createNewModel",
    value: function createNewModel() {
      return {};
    }
  }, {
    key: "onParserClose",
    value: function onParserClose(name, parser) {
      this.model.x14Id = parser.model;
    }
  }]);

  return ExtXform;
}(CompositeXform);

var ExtLstRefXform = /*#__PURE__*/function (_CompositeXform2) {
  _inherits(ExtLstRefXform, _CompositeXform2);

  var _super3 = _createSuper(ExtLstRefXform);

  function ExtLstRefXform() {
    var _this2;

    _classCallCheck(this, ExtLstRefXform);

    _this2 = _super3.call(this);
    _this2.map = {
      ext: new ExtXform()
    };
    return _this2;
  }

  _createClass(ExtLstRefXform, [{
    key: "tag",
    get: function get() {
      return 'extLst';
    }
  }, {
    key: "render",
    value: function render(xmlStream, model) {
      xmlStream.openNode(this.tag);
      this.map.ext.render(xmlStream, model);
      xmlStream.closeNode();
    }
  }, {
    key: "createNewModel",
    value: function createNewModel() {
      return {};
    }
  }, {
    key: "onParserClose",
    value: function onParserClose(name, parser) {
      Object.assign(this.model, parser.model);
    }
  }]);

  return ExtLstRefXform;
}(CompositeXform);

module.exports = ExtLstRefXform;
//# sourceMappingURL=ext-lst-ref-xform.js.map
