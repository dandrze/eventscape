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

		this.handleModelChange = this.handleModelChange.bind(this);

		this.state = {
			model: contentModel,
		};
	}

	handleModelChange(model) {
		this.setState({
			model: model,
		});
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
			placeholderText: "Type something \n or click inside me",
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
		};

		return (
			<div>
				<FroalaEditor
					config={config}
					model={this.state.model}
					onModelChange={this.handleModelChange}
				/>
			</div>
		);
	}
}

export default FroalaEmail;

const contentModel = `
    <p style="text-align: left">Hello {first_name},</p>
    <p style="text-align: left">Thank you for registering for {event_name}.</p>
    <p style="text-align: left">A few minutes before the event begins, please click the following button to join.</p>
    <p style="text-align: left;">
      <button style="
        font-family: Helvetica, Arial, sans-serif;
        font-weight: bold;
        font-size: 20;
        color: white;
        background-color: var(--main-color);
        padding: 16px;
        border-width: 2px;
        border-radius: 6px;
        border-color: var(--main-color);
        border-style: solid;
        height: min-content;
        text-align: left;
      ">
        Join Now
      </button>
    </p>
    
  `;
