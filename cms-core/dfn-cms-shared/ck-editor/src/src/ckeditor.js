import ClassicEditorBase from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";

import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment.js";
import Autoformat from "@ckeditor/ckeditor5-autoformat/src/autoformat.js";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote.js";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold.js";
import CKFinder from "@ckeditor/ckeditor5-ckfinder/src/ckfinder.js";
import CKFinderUploadAdapter from "@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter.js";
import Code from "@ckeditor/ckeditor5-basic-styles/src/code.js";
import CodeBlock from "@ckeditor/ckeditor5-code-block/src/codeblock.js";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials.js";
import ExportToPDF from "@ckeditor/ckeditor5-export-pdf/src/exportpdf.js";
import FontBackgroundColor from "@ckeditor/ckeditor5-font/src/fontbackgroundcolor.js";
import FontColor from "@ckeditor/ckeditor5-font/src/fontcolor.js";
import FontFamily from "@ckeditor/ckeditor5-font/src/fontfamily.js";
import FontSize from "@ckeditor/ckeditor5-font/src/fontsize.js";
import Heading from "@ckeditor/ckeditor5-heading/src/heading.js";
import Highlight from "@ckeditor/ckeditor5-highlight/src/highlight.js";
import HorizontalLine from "@ckeditor/ckeditor5-horizontal-line/src/horizontalline.js";
import Image from "@ckeditor/ckeditor5-image/src/image.js";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption.js";
import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize.js";
import ImageResizeEditing from "@ckeditor/ckeditor5-image/src/imageresize/imageresizeediting";
import ImageResizeHandles from "@ckeditor/ckeditor5-image/src/imageresize/imageresizehandles";
import ImageResizeButtons from "@ckeditor/ckeditor5-image/src/imageresize/imageresizebuttons";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle.js";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar.js";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload.js";
import ImageInsert from "@ckeditor/ckeditor5-image/src/imageinsert";
import LinkImage from "@ckeditor/ckeditor5-link/src/linkimage";
import Indent from "@ckeditor/ckeditor5-indent/src/indent.js";
import IndentBlock from "@ckeditor/ckeditor5-indent/src/indentblock.js";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic.js";
import Link from "@ckeditor/ckeditor5-link/src/link.js";
import List from "@ckeditor/ckeditor5-list/src/list.js";
import MathType from "@wiris/mathtype-ckeditor5";
import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed.js";
import MediaEmbedToolbar from "@ckeditor/ckeditor5-media-embed/src/mediaembedtoolbar.js";
import PageBreak from "@ckeditor/ckeditor5-page-break/src/pagebreak.js";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph.js";
import PasteFromOffice from "@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice";
import SpecialCharacters from "@ckeditor/ckeditor5-special-characters/src/specialcharacters.js";
import SpecialCharactersArrows from "@ckeditor/ckeditor5-special-characters/src/specialcharactersarrows.js";
import SpecialCharactersCurrency from "@ckeditor/ckeditor5-special-characters/src/specialcharacterscurrency.js";
import SpecialCharactersEssentials from "@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials.js";
import SpecialCharactersLatin from "@ckeditor/ckeditor5-special-characters/src/specialcharacterslatin.js";
import SpecialCharactersMathematical from "@ckeditor/ckeditor5-special-characters/src/specialcharactersmathematical.js";
import SpecialCharactersText from "@ckeditor/ckeditor5-special-characters/src/specialcharacterstext.js";
import StandardEditingMode from "@ckeditor/ckeditor5-restricted-editing/src/standardeditingmode.js";
import Strikethrough from "@ckeditor/ckeditor5-basic-styles/src/strikethrough.js";
import Subscript from "@ckeditor/ckeditor5-basic-styles/src/subscript.js";
import Superscript from "@ckeditor/ckeditor5-basic-styles/src/superscript.js";
import Table from "@ckeditor/ckeditor5-table/src/table.js";
import TableCellProperties from "@ckeditor/ckeditor5-table/src/tablecellproperties";
import TableProperties from "@ckeditor/ckeditor5-table/src/tableproperties";
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar.js";
import TextTransformation from "@ckeditor/ckeditor5-typing/src/texttransformation.js";
import Title from "@ckeditor/ckeditor5-heading/src/title.js";
import TodoList from "@ckeditor/ckeditor5-list/src/todolist";
import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline.js";
import WordCount from "@ckeditor/ckeditor5-word-count/src/wordcount.js";
import UploadAdapter from "@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter";
import SimpleUploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter";
import EasyImage from "@ckeditor/ckeditor5-easy-image/src/easyimage";
import TooltipView from "@ckeditor/ckeditor5-ui/src/tooltip/tooltipview";
import Popover from '@ckpro/ckeditor5-popover';

export default class ClassicEditor extends ClassicEditorBase {}

const customColorPalette = [
	{
		color: "#c6974b",
		label: "Tussock",
	},
	{
		color: "#435058",
		label: "River Bed",
	},
	{
		color: "#b5bdc4",
		label: "Submarine",
	},
	{
		color: "#000000",
		label: "Black",
	},
	{
		color: "#ffffff",
		label: "White",
	},
	{
		color: "#dfddd0",
		label: "Moon Mist",
	},
	{
		color: "#88958d",
		label: "Mantle",
	},
	{
		color: "#133a5b",
		label: "Elephant",
	},
	{
		color: "#a31621",
		label: "Tamarillo",
	},
	{
		color: "#4c7F58",
		label: "Como",
	},
	{
		color: "#4B4C4D",
		label: "Abbey",
	},
	{
		color: "#808080",
		label: "Gray",
	},
];

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
	Essentials,
	UploadAdapter,
	// CKFinderUploadAdapter,
	// MathType,
	// MediaEmbedToolbar,
	PageBreak,
	// Title,
	Autoformat,
	Bold,
	Italic,
	BlockQuote,
	CKFinder,
	EasyImage,
	Heading,
	Image,
	ImageToolbar,
	ImageCaption,
	ImageStyle,
	// ImageTextAlternative,
	ImageUpload,
	ImageInsert,
	// AutoImage,
	ImageResize,
	ImageResizeEditing,
	ImageResizeHandles,
	LinkImage,
	Indent,
	IndentBlock,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,
	TableProperties,
	TableCellProperties,
	TextTransformation,
	SimpleUploadAdapter,
	FontSize,
	FontFamily,
	FontColor,
	FontBackgroundColor,
	Highlight,
	Underline,
	Strikethrough,
	Superscript,
	Subscript,
	HorizontalLine,
	Alignment,
	Code,
	CodeBlock,
	ExportToPDF,
	SpecialCharacters,
	SpecialCharactersArrows,
	SpecialCharactersCurrency,
	SpecialCharactersEssentials,
	SpecialCharactersLatin,
	SpecialCharactersMathematical,
	SpecialCharactersText,
	StandardEditingMode,
	TodoList,
	WordCount,
	// TooltipView,
    Popover
];

// Editor configuration.
ClassicEditor.defaultConfig = {
	toolbar: {
		items: [
			"heading",
			"|",
			"fontFamily",
			"fontSize",
			"fontColor",
			"fontBackgroundColor",
			"highlight",
			"|",
			"bold",
			"italic",
			"underline",
			"strikethrough",
			"link",
            "popover",
			"superscript",
			"subscript",
			"horizontalLine",
			"bulletedList",
			"numberedList",
			"|",
			"alignment",
			"|",
			"indent",
			"outdent",
			"|",
			// "imageUpload",
            "imageInsert",
			"blockQuote",
			"insertTable",
			"mediaEmbed",
			"|",
			"undo",
			"redo",
			"|",
			"code",
			"codeBlock",
			"|",
			"exportPdf",
			"|",
			"specialCharacters",
			"restrictedEditingException",
			"todoList",
			"pageBreak"
		],
	},
	heading: {
		options: [
			{
				model: "paragraph",
				title: "Paragraph",
				class: "ck-heading_paragraph",
			},
			{
				model: "heading1",
				view: {
					name: "h1",
					// classes: "ck-custom-heading1",
				},
				title: "Heading 1",
				class: "ck-custom-heading1",
			},
			{
				model: "heading2",
				view: {
					name: "h2",
					// classes: "ck-custom-heading2",
				},
				title: "Heading 2",
				class: "ck-custom-heading2",
			},
			{
				model: "heading3",
				view: {
					name: "h3",
					// classes: "ck-custom-heading3",
				},
				title: "Heading 3",
				class: "ck-custom-heading3",
			},
			{
				model: "heading4",
				view: {
					name: "h4",
					// classes: "ck-custom-heading4",
				},
				title: "Heading 4",
				class: "ck-custom-heading4",
			},
			{
				model: "heading5",
				view: {
					name: "h5",
					// classes: "ck-custom-heading5",
				},
				title: "Heading 5",
				class: "ck-custom-heading5",
			},
			{
				model: "heading6",
				view: {
					name: "h6",
					// classes: "ck-custom-heading6",
				},
				title: "Heading 6",
				class: "ck-custom-heading6",
			},
		],
	},
	image: {
		toolbar: [
			"imageStyle:alignLeft",
			"imageStyle:alignCenter",
			"imageStyle:alignRight",
			"|",
			"imageResize",
			"|",
			"imageTextAlternative",
            // "|",
            // "imageInsert"
		],
		styles: ["alignLeft", "alignCenter", "alignRight"],
		resizeOptions: [
			{
				name: "imageResize:original",
				label: "Original",
				value: null,
			},
			{
				name: "imageResize:50",
				label: "50%",
				value: "50",
			},
			{
				name: "imageResize:75",
				label: "75%",
				value: "75",
			},
		],
	},
	table: {
		contentToolbar: [
			"tableColumn",
			"tableRow",
			"mergeTableCells",
			"tableProperties",
			"tableCellProperties",
		],
		tableProperties: {
			borderColors: customColorPalette,
			backgroundColors: customColorPalette,
		},
		tableCellProperties: {
			borderColors: customColorPalette,
			backgroundColors: customColorPalette,
		},
	},
	fontFamily: {
		options: [
			"default",
			"Arial, Helvetica, sans-serif",
			"Courier New, Courier, monospace",
			"Georgia, serif",
			"Lucida Sans Unicode, Lucida Grande, sans-serif",
			"Tahoma, Geneva, sans-serif",
			"Times New Roman, Times, serif",
			"Trebuchet MS, Helvetica, sans-serif",
			"Verdana, Geneva, sans-serif",
		],
		supportAllValues: false,
	},
	fontSize: {
		options: [
			// "tiny", "default", "big", "huge"
			8,
			9,
			10,
			11,
			12,
			14,
			16,
			18,
			20,
			22,
			24,
			26,
			28,
			36,
			48,
			72,
		],
		supportAllValues: false,
	},
	fontColor: {
		colors: customColorPalette,
	},
	fontBackgroundColor: {
		colors: customColorPalette,
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: "en",
	indentBlock: {
		offset: 1,
		unit: "em",
	}
};
