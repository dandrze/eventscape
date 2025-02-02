import React, { Component } from "react";
import { connect } from "react-redux";

import FroalaEditorComponent from "react-froala-wysiwyg";
import FroalaEditor from "froala-editor";

import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";

import "froala-editor/js/plugins/image.min.js";
import "froala-editor/js/plugins/video.min.js";
import "froala-editor/js/plugins/colors.min.js";
import "froala-editor/js/plugins/emoticons.min.js";
import "froala-editor/js/plugins/font_family.min.js";
import "froala-editor/js/plugins/font_size.min.js";
import "froala-editor/js/plugins/line_height.min.js";
import "froala-editor/js/plugins/lists.min.js";
import "froala-editor/js/plugins/align.min.js";
import "froala-editor/js/plugins/link.min.js";
import "froala-editor/js/plugins/file.min.js";
import "froala-editor/js/plugins/code_view.min.js";
import "froala-editor/js/plugins/code_beautifier.min.js";
import "froala-editor/js/third_party/image_tui.min.js";
import "froala-editor/js/plugins/draggable.min.js";
import "froala-editor/js/plugins/quick_insert.min.js";

import "froala-editor/css/plugins/image.min.css";
import "froala-editor/css/plugins/video.min.css";
import "froala-editor/css/plugins/colors.min.css";
import "froala-editor/css/plugins/emoticons.min.css";
import "froala-editor/css/plugins/file.min.css";
import "froala-editor/css/plugins/code_view.min.css";
import "froala-editor/css/plugins/image.min.css";
import "froala-editor/css/third_party/image_tui.min.css";
import "froala-editor/css/plugins/quick_insert.min.css";

const FroalaEmail = ({ html, handleHtmlChange, settings }) => {
  const config = {
    enter: FroalaEditor.ENTER_DIV,
    toolbarButtons: {
      moreText: {
        buttons: [
          "bold",
          "italic",
          "underline",
          "strikeThrough",
          "subscript",
          "superscript",
          "fontFamily",
          "fontSize",
          "textColor",
          "backgroundColor",
          "inlineClass",
          "inlineStyle",
          "clearFormatting",
        ],
      },
      moreParagraph: {
        buttons: [
          "alignLeft",
          "alignCenter",
          "formatOLSimple",
          "alignRight",
          "alignJustify",
          "formatOL",
          "formatUL",
          "paragraphFormat",
          "paragraphStyle",
          "lineHeight",
          "outdent",
          "indent",
          "quote",
        ],
      },
      moreRich: {
        buttons: [
          "insertLink",
          "insertImage",
          "insertTable",
          "emoticons",
          "specialCharacters",
          "insertHR",
        ],
      },
      moreMisc: {
        buttons: ["undo", "redo", "html"],
      },
    },
    // Change buttons for XS screen.
    toolbarButtonsXS: [
      ["undo", "redo"],
      ["bold", "italic", "underline"],
    ],
    autofocus: true,
    toolbarVisibleWithoutSelection: true,
    heightMin: "568px",
    placeholderText: "Type email body here",
    charCounterCount: true,
    attribution: false,
    width: "100%",
    imageEditButtons: [
      "imageReplace",
      "imageAlign",
      "imageCaption",
      "imageRemove",
      "",
      "|",
      "imageLink",
      "linkOpen",
      "linkEdit",
      "linkRemove",
      "-",
      "imageDisplay",
      "imageStyle",
      "imageAlt",
      "imageSize",
    ],
    key: "gVG3C-8D1F1B4D5A3C1ud1BI1IMNBUMRWAi1AYMSTRBUZYB-16D4E3D2B2C3H2C1B10D3B1==",
    imageUploadToS3: settings.s3Hash,
    //pluginsEnabled: ["image", "link", "draggable", ""],
    dragInline: false,
    fontFamily: {
      "Roboto, Verdana, sans-serif": "Roboto",
      "Ariel, sans-serif": "Ariel",
      "'Courier New', monospace": "Courier New",
      "Verdana, sans-serif": "Verdana",
      "Helvetica, Ariel, sans-serif": "Helvetica",
      "Times, 'Times New Roman', serif": "Times",
      "Georgia, serif": "Georgia",
      "Tahoma, Geneva, sans-serif": "Tahoma",
      "Lucida, sans-serif": "Lucida",
      "Trebuchet, sans-serif": "Trebuchet",
    },
  };

  return (
    <div>
      <FroalaEditorComponent
        config={config}
        model={html}
        onModelChange={handleHtmlChange}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { settings: state.settings };
};

export default connect(mapStateToProps)(FroalaEmail);
