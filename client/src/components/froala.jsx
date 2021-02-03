import React, { useState, useEffect } from "react";
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
//import "froala-editor/js/third_party/image_tui.min.js";
import "froala-editor/js/plugins/forms.min.js";
import "froala-editor/js/plugins/draggable.min.js";
import "froala-editor/js/plugins/table.min.js";
import "froala-editor/js/plugins/word_paste.min.js";

import "froala-editor/css/plugins/image.min.css";
import "froala-editor/css/plugins/video.min.css";
import "froala-editor/css/plugins/colors.min.css";
//import "froala-editor/css/plugins/emoticons.min.css";
import "froala-editor/css/plugins/file.min.css";
import "froala-editor/css/plugins/code_view.min.css";
import "froala-editor/css/plugins/image.min.css";
//import "froala-editor/css/third_party/image_tui.min.css";
import "froala-editor/css/plugins/table.min.css";

import * as actions from "../actions";
import api from "../api/server";

const Froala = (props) => {
  const [userClicked, setUserClicked] = useState(false);
  const handleModelChange = (model) => {
    // if the user clicked into the div, only then do we update the section
    //the purpose of this check is sometimes froala makes small adjustments on loading which we don't need to treat as an "update"
    if (userClicked) props.updateSection(props.sectionIndex, model);
  };

  // The entire useEffect hook below simply resets the user clicked state back to false after the model was updated
  // so if there are no further changes, we can navigate away from the page
  useEffect(() => {
    setUserClicked(false);
  }, [props.model.isUnsaved]);

  const handleUserInput = (event) => {
    // when a user clicks on a froala component, we set the UserClicked value to be true so that any changes from now on prevent navigation away from the screen
    setUserClicked(true);
  };

  const config = {
    toolbarButtons: {
      moreText: {
        buttons: [
          "bold",
          "italic",
          "underline",
          "fontFamily",
          "fontSize",
          "strikeThrough",
          "subscript",
          "superscript",
          "textColor",
          "backgroundColor",
          "inlineClass",
          "inlineStyle",
        ],
        buttonsVisible: 3,
      },
      moreParagraph: {
        buttons: [
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
        buttonsVisible: 3,
      },
      moreRich: {
        buttons: [
          "insertImage",
          "insertLink",
          "insertFile",
          "emoticons",
          "insertVideo",
          //"insertTable", // Not currenlty allowing input into the table
          "html",
        ],
        buttonsVisible: 3,
      },
      moreMisc: {
        buttons: ["undo", "redo"],
        buttonsVisible: 2,
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
    initOnClick: true, // Only the minimum required events are initialized on page load and the rest of them when the user clicks inside the editable area. This is very useful when using multiple editors on the same page because it reduces the page load time.
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
      //"imageTUI", // Not currenlty working
    ],
    key:
      "gVG3C-8D1F1B4D5A3C1ud1BI1IMNBUMRWAi1AYMSTRBUZYB-16D4E3D2B2C3H2C1B10D3B1==",
    imageUploadToS3: props.settings.s3Hash,
    // By default all plugins are enabled
    /*pluginsEnabled: [
      "image", 
      "imageTUI", 
      "imageManager", 
      "video", 
      "link", 
      "draggable", 
      "align", 
      "codeBeautifier", 
      "codeView", 
      "colors", 
      "emoticons", 
      "fontFamily", 
      "fontSize", 
      "lineHeight", 
      "link", 
      "lists", 
      "table", 
      "url", 
      "wordPaste", 
      "file" 
    ],*/
    dragInline: false,

    events: {
      "image.removed": async (img) => {
        const src = img[0].src.toString();
        // if we want to permanently delete the image we can do it here
        //await api.post("/api/froala/delete-image", { src });
      },
    },
  };

  return (
    <div onFocus={handleUserInput}>
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
