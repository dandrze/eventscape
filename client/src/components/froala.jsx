import React, { Component } from "react";
import { connect } from "react-redux";

import FroalaEditor from "react-froala-wysiwyg";

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
import "froala-editor/js/plugins/image.min.js";
//import "froala-editor/js/third_party/image_tui.min.js";
import "froala-editor/js/plugins/forms.min.js";

import "froala-editor/css/plugins/image.min.css";
import "froala-editor/css/plugins/video.min.css";
import "froala-editor/css/plugins/colors.min.css";
//import "froala-editor/css/plugins/emoticons.min.css";
import "froala-editor/css/plugins/file.min.css";
import "froala-editor/css/plugins/code_view.min.css";
import "froala-editor/css/plugins/image.min.css";
//import "froala-editor/css/third_party/image_tui.min.css";

import * as actions from "../actions";

const Froala = (props) => {
  const handleModelChange = (model) => {
    props.updateSection(props.sectionIndex, model);
  };

  const config = {
    toolbarButtons: {
      moreRich: {
        buttons: [
          "insertImage",
          "insertVideo",
          "insertLink",
          "insertFile",
          "emoticons",
          "html",
          "image",
        ],
        buttonsVisible: 7,
      },
      moreText: {
        buttons: [
          "fontFamily",
          "fontSize",
          "bold",
          "italic",
          "underline",
          "strikeThrough",
          "subscript",
          "superscript",
          "textColor",
          "backgroundColor",
          "inlineClass",
          "inlineStyle",
          "alignLeft",
          "alignCenter",
          "alignRight",
          "alignJustify",
          "formatOLSimple",
          "formatOL",
          "formatUL",
          "paragraphFormat",
          "paragraphStyle",
          "lineHeight",
          "outdent",
          "indent",
          "quote",
          "clearFormatting",
        ],
        buttonsVisible: 0,
      },
    },
    fontFamily: {
      "Alegreya, serif": "Alegreya",
      "Archivo Black, sans-serif": "Archivo Black",
      "Ariel, sans-serif": "Ariel",
      "Cardo, serif": "Cardo",
      "Cinzel, serif": "Cinzel",
      "Enriqueta, serif": "Enriqueta",
      "'Frank Ruhl Libre', serif": "Frank Ruhl Libre",
      "'EB Garamond', serif": "EB Garamond",
      "Georgia, serif": "Georgia",
      "'Julius Sans One', sans-serif": "Julius Sans One",
      "Lato, sans-serif": "Lato",
      "Merriweather, serif": "Merriweather",
      "Montserrat, sans-serif": "Montserrat",
      "Nunito, sans-serif": "Nunito",
      "'Open Sans Condensed',sans-serif": "Open Sans Condensed",
      "Oswald, sans-serif": "Oswald",
      "Pacifico, cursive": "Pacifico",
      "'Playfair Display', serif": "Playfair Display",
      "Poppins, sans-serif": "Poppins",
      "Roboto,sans-serif": "Roboto",
      "Montserrat, sans-serif": "Montserrat",
      "Rubik, sans-serif": "Rubik",
      "Spectral, serif": "Spectral",
      "'Times New Roman', serif": "Times New Roman",
      "Ubuntu, sans-serif": "Ubuntu",
      "Yellowtail, cursive": "Yellowtail",
    },
    fontFamilySelection: true,
    toolbarInline: true,
    toolbarVisibleWithoutSelection: true,
    //heightMin: "568px",
    placeholderText: "Type something \n or click inside me",
    charCounterCount: false,
    keepFormatOnDelete: true,
    attribution: false,
    width: "100%",
    imageEditButtons: [
      "imageReplace",
      "imageAlign",
      //"imageCaption",
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
    key:
      "gVG3C-8D1F1B4D5A3C1ud1BI1IMNBUMRWAi1AYMSTRBUZYB-16D4E3D2B2C3H2C1B10D3B1==",
  };

  return (
    <div>
      <FroalaEditor
        config={config}
        model={props.html}
        onModelChange={handleModelChange}
      />
    </div>
  );
};
const mapStateToProps = (state) => {
  return { model: state.model, settings: state.settings };
};

export default connect(mapStateToProps, actions)(Froala);
