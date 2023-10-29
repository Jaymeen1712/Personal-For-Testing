//@ts-nocheck
import React, { useRef } from 'react';
import { Form } from 'antd';
import 'react-quill/dist/quill.snow.css';
import { InfoCircleOutlined } from '@ant-design/icons';

// eslint-disable-next-line import/extensions
import 'froala-editor/js/froala_editor.pkgd.min.js';
// eslint-disable-next-line import/extensions
import 'froala-editor/js/plugins.pkgd.min.js';
// eslint-disable-next-line import/extensions
import 'froala-editor/js/third_party/embedly.min.js';

import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/third_party/embedly.min.css';
import 'froala-editor/css/plugins/fullscreen.min.css';
// eslint-disable-next-line import/extensions
import 'froala-editor/js/plugins/fullscreen.min.js';

import { IContentLibraryFieldPops } from '../../../../../../../types';
import Froala from 'react-froala-wysiwyg';
import Froalaeditor from 'froala-editor';
import useRichTextController from './controllers/rich-text-controller';
import { CommonController } from './controllers';
import { isFieldLocalizationEnabled } from '../../../../utils';
import MediaManager from '../../../../../media-manager';

interface FieldProps {
  contentModalInternalName: string;
  data: IContentLibraryFieldPops;
  componentName?: string;
}

const RichTextComponent: React.FC<FieldProps> = ({
  contentModalInternalName,
  data,
  componentName,
}) => {
  const {
    t,
    value,
    onRichTextBlurAction,
    onChange,
    setEditorInstanceValue,
    onImageSelection,
    froalaImageModalVisible,
    isVisible,
    setIsVisible,
  } = useRichTextController(
    data.name,
    data.editValue,
    data.fieldProperties.defaultValue,
    contentModalInternalName,
    componentName,
    data
  );
  const editorRef = useRef(null);
  const { language } = CommonController();
  const isFieldLocalizationEnable = isFieldLocalizationEnabled(
    language,
    data.fieldProperties.validation?.includes('enable_localization')
  );

  Froalaeditor.DefineIcon('imageIcon', { SVG_KEY: 'insertImage' });
  Froalaeditor.RegisterCommand('imageIcon', {
    title: 'Image Upload',
    icon: 'imageIcon',
    focus: true,
    undo: false,
    refreshAfterCallback: true,
  });
  return (
    <>
      {isVisible && (
        <MediaManager
          showSubmenuIcon={false}
          accept={'image'}
          isPopUp={true}
          multiple={true}
          onInsert={(file) => {
            setIsVisible(false);
            onImageSelection(file, editorRef);
          }}
          onCancel={() => {
            editorRef.current.editor.selection.restore();
            setIsVisible(false);
          }}
        />
      )}
      <Form.Item
        key={data.name}
        label={data.title}
        name={data.name}
        tooltip={
          data.fieldProperties.helpText && {
            title: data.fieldProperties.helpText,
            icon: <InfoCircleOutlined />,
          }
        }
        rules={[
          {
            required: data.isRequired,
            message: t('common.messages.required', { entity: data.title }),
          },
        ]}
        normalize={(value) => value.trimStart()}>
        <Froala
          ref={editorRef}
          key={data.name}
          model={value}
          onModelChange={(value) => onChange(value)}
          tag="textarea"
          config={{
            toolbarInline:
              data.fieldProperties.richTextEditorType === 'inlineEditor',
            charCounterCount:
              !data.fieldProperties.richTextEditorType === 'inlineEditor',
            toolbarVisibleWithoutSelection:
              data.fieldProperties.richTextEditorType === 'inlineEditor',
            key: 'zEG4iH4B9D9B5A3F5g1JWSDBCQG1ZGDf1C1d2JXDAAOZWJhE5B4E4H3F2H3C7A4E5F5==',
            events: {
              blur: function (e, editor) {
                onRichTextBlurAction();
              },
              'commands.before': function (cmd) {
                if (cmd === 'imageIcon') {
                  froalaImageModalVisible(editorRef);
                }
              },
              initialized() {
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const editor = this;
                setEditorInstanceValue(editor);
                if (!data.isDataEditable || !isFieldLocalizationEnable) {
                  editor.edit.off();
                }
              },
            },
            heightMin: data.fieldProperties.minHeight
              ? data.fieldProperties.minHeight
              : 200,
            heightMax: data.fieldProperties.maxHeight
              ? data.fieldProperties.maxHeight
              : 400,
            htmlRemoveTags: [],
            htmlAllowedAttrs: [
              'accept',
              'accept-charset',
              'accesskey',
              'action',
              'align',
              'allowfullscreen',
              'allowtransparency',
              'alt',
              'aria-.*',
              'async',
              'autocomplete',
              'autofocus',
              'autoplay',
              'autosave',
              'background',
              'bgcolor',
              'border',
              'charset',
              'cellpadding',
              'cellspacing',
              'checked',
              'cite',
              'class',
              'color',
              'cols',
              'colspan',
              'content',
              'contenteditable',
              'contextmenu',
              'controls',
              'coords',
              'data',
              'data-.*',
              'datetime',
              'default',
              'defer',
              'dir',
              'dirname',
              'disabled',
              'download',
              'draggable',
              'dropzone',
              'enctype',
              'for',
              'form',
              'formaction',
              'frameborder',
              'headers',
              'height',
              'hidden',
              'high',
              'href',
              'hreflang',
              'http-equiv',
              'icon',
              'id',
              'ismap',
              'itemprop',
              'keytype',
              'kind',
              'label',
              'lang',
              'language',
              'list',
              'loop',
              'low',
              'max',
              'maxlength',
              'media',
              'method',
              'min',
              'mozallowfullscreen',
              'multiple',
              'muted',
              'name',
              'novalidate',
              'open',
              'optimum',
              'pattern',
              'ping',
              'placeholder',
              'playsinline',
              'poster',
              'preload',
              'pubdate',
              'radiogroup',
              'readonly',
              'rel',
              'required',
              'reversed',
              'rows',
              'rowspan',
              'sandbox',
              'scope',
              'scoped',
              'scrolling',
              'seamless',
              'selected',
              'shape',
              'size',
              'sizes',
              'span',
              'src',
              'srcdoc',
              'srclang',
              'srcset',
              'start',
              'step',
              'summary',
              'spellcheck',
              'style',
              'tabindex',
              'target',
              'title',
              'type',
              'translate',
              'usemap',
              'value',
              'valign',
              'webkitallowfullscreen',
              'width',
              'wrap',
              'onload',
              'onclick',
              'onClick',
            ],
            linkAutoPrefix: '',
            attribution: false,
            linkAutoPrefix: '',
            placeholder: 'Start typing...',
            toolbarButtons: {
              moreText: {
                buttons: [
                  'bold',
                  'italic',
                  'underline',
                  'strikeThrough',
                  'subscript',
                  'superscript',
                  'fontFamily',
                  'fontSize',
                  'textColor',
                  'backgroundColor',
                  'inlineClass',
                  'inlineStyle',
                  'clearFormatting',
                ],
              },
              moreParagraph: {
                buttons: [
                  'alignLeft',
                  'alignCenter',
                  'alignRight',
                  'alignJustify',
                  'paragraphFormat',
                  'formatOLSimple',
                  'formatOL',
                  'formatUL',
                  'paragraphStyle',
                  'lineHeight',
                  'outdent',
                  'indent',
                  'quote',
                ],
                align: 'left',
                buttonsVisible: 5,
              },
              moreRich: {
                buttons: [
                  'insertLink',
                  'imageIcon',
                  'insertImage',
                  'insertVideo',
                  'insertTable',
                  'emoticons',
                  'fontAwesome',
                  'specialCharacters',
                  'embedly',
                  'insertFile',
                  'insertHR',
                ],
              },
              moreMisc: {
                buttons: [
                  'undo',
                  'redo',
                  'html',
                  'fullscreen',
                  // 'spellChecker',
                  // 'selectAll',
                  // 'help',
                ],
                align: 'right',
                buttonsVisible: 4,
              },
            },
            pluginsEnabled: [
              'table',
              'spell',
              'quote',
              'imageIcon',
              'save',
              'paragraphFormat',
              'paragraphStyle',
              'help',
              'draggable',
              'align',
              'embedly',
              'colors',
              'entities',
              'inlineClass',
              'inlineStyle',
              'entities',
              'lists',
              'embedly',
              'codeBeautify',
              'spellChecker',
              'codeView',
              'link',
              'fullscreen',
            ],
          }}
        />
      </Form.Item>
    </>
  );
};

export default RichTextComponent;
