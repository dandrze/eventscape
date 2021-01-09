import React, { Component } from "react";

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
import "froala-editor/js/third_party/image_tui.min.js";

import "froala-editor/css/plugins/image.min.css";
import "froala-editor/css/plugins/video.min.css";
import "froala-editor/css/plugins/colors.min.css";
import "froala-editor/css/plugins/emoticons.min.css";
import "froala-editor/css/plugins/file.min.css";
import "froala-editor/css/plugins/code_view.min.css";
import "froala-editor/css/plugins/image.min.css";
import "froala-editor/css/third_party/image_tui.min.css";

class FroalaEmail extends Component {
  constructor(props) {
    super(props);
  }

  render() {
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
          buttonsVisible: 0,
        },
      },
      autofocus: true,
      toolbarInline: true,
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
    };

    return (
      <div>
        <FroalaEditor
          config={config}
          model={this.props.html}
          onModelChange={this.props.handleHtmlChange}
        />
      </div>
    );
  }
}

export default FroalaEmail;
