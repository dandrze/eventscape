"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ReactFormGenerator", {
  enumerable: true,
  get: function get() {
    return _form["default"];
  }
});
Object.defineProperty(exports, "ElementStore", {
  enumerable: true,
  get: function get() {
    return _store["default"];
  }
});
exports.ReactFormBuilder = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _reactDnd = require("react-dnd");

var _reactDndHtml5Backend = _interopRequireDefault(require("react-dnd-html5-backend"));

var _preview = _interopRequireDefault(require("./preview"));

var _toolbar = _interopRequireDefault(require("./toolbar"));

var _form = _interopRequireDefault(require("./form"));

var _store = _interopRequireDefault(require("./stores/store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ReactFormBuilder =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ReactFormBuilder, _React$Component);

  function ReactFormBuilder(props) {
    var _this;

    _classCallCheck(this, ReactFormBuilder);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ReactFormBuilder).call(this, props));
    _this.state = {
      editMode: false,
      editElement: null
    };
    return _this;
  }

  _createClass(ReactFormBuilder, [{
    key: "editModeOn",
    value: function editModeOn(data, e) {
      e.preventDefault();
      e.stopPropagation();

      if (this.state.editMode) {
        this.setState({
          editMode: !this.state.editMode,
          editElement: null
        });
      } else {
        this.setState({
          editMode: !this.state.editMode,
          editElement: data
        });
      }
    }
  }, {
    key: "manualEditModeOff",
    value: function manualEditModeOff() {
      if (this.state.editMode) {
        this.setState({
          editMode: false,
          editElement: null
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var toolbarProps = {
        showDescription: this.props.show_description
      };

      if (this.props.toolbarItems) {
        toolbarProps.items = this.props.toolbarItems;
      }

      return _react["default"].createElement(_reactDnd.DndProvider, {
        backend: _reactDndHtml5Backend["default"]
      }, _react["default"].createElement("div", null, _react["default"].createElement("div", {
        className: "react-form-builder clearfix"
      }, _react["default"].createElement("div", null, _react["default"].createElement(_preview["default"], {
        files: this.props.files,
        manualEditModeOff: this.manualEditModeOff.bind(this),
        showCorrectColumn: this.props.showCorrectColumn,
        parent: this,
        data: this.props.data,
        url: this.props.url,
        saveUrl: this.props.saveUrl,
        onLoad: this.props.onLoad,
        onPost: this.props.onPost,
        editModeOn: this.editModeOn,
        editMode: this.state.editMode,
        variables: this.props.variables,
        editElement: this.state.editElement
      }), _react["default"].createElement(_toolbar["default"], toolbarProps)))));
    }
  }]);

  return ReactFormBuilder;
}(_react["default"].Component);

exports.ReactFormBuilder = ReactFormBuilder;
var FormBuilders = {};
FormBuilders.ReactFormBuilder = ReactFormBuilder;
FormBuilders.ReactFormGenerator = _form["default"];
FormBuilders.ElementStore = _store["default"];
var _default = FormBuilders;
exports["default"] = _default;