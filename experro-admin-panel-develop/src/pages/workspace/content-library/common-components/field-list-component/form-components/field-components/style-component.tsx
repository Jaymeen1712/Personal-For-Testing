import React from 'react';
import { Form } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';

import { IContentLibraryFieldPops } from '../../../../../../../types';
import { useFieldPermission, CommonController } from './controllers';

interface FieldProps {
  contentModalInternalName: string;
  data: IContentLibraryFieldPops;
  componentName?: string;
}

const StyleComponent: React.FC<FieldProps> = ({
  contentModalInternalName,
  data,
  componentName,
}) => {
  const { canEditField } = useFieldPermission(
    contentModalInternalName,
    data,
    componentName
  );
  const { onScriptTagBlurAction } = CommonController();

  const myTheme = createTheme({
    theme: 'light',
    settings: {
      background: '#ffffff',
      foreground: '#75baff',
      caret: '#5d00ff',
      selection: '#036dd626',
      selectionMatch: '#036dd626',
      lineHighlight: '#8a91991a',
      gutterBackground: '#fff',
      gutterForeground: '#8a919966',
    },
    styles: [
      { tag: t.comment, color: '#787b8099' },
      { tag: t.variableName, color: '#0080ff' },
      { tag: [t.string, t.special(t.brace)], color: '#5c6166' },
      { tag: t.number, color: '#5c6166' },
      { tag: t.bool, color: '#5c6166' },
      { tag: t.null, color: '#5c6166' },
      { tag: t.keyword, color: '#5c6166' },
      { tag: t.operator, color: '#5c6166' },
      { tag: t.className, color: '#5c6166' },
      { tag: t.definition(t.typeName), color: '#5c6166' },
      { tag: t.typeName, color: '#5c6166' },
      { tag: t.angleBracket, color: '#5c6166' },
      { tag: t.tagName, color: '#5c6166' },
      { tag: t.attributeName, color: '#5c6166' },
    ],
  });
  return (
    <>
      <Form.Item
        className={!data.isDataEditable || !canEditField ? 'table-section table-disable' : ''}
        label={data.title}
        name={data.name}
        tooltip={
          data.fieldProperties.helpText && {
            title: data.fieldProperties.helpText,
            icon: <InfoCircleOutlined />,
          }
        }
        initialValue={
          data.editValue ? data.editValue : data.fieldProperties.defaultValue
        }
        normalize={(value) => value.trimStart()}>
        <CodeMirror
          placeholder="<style></style>"
          onBlur={(e) => {
            onScriptTagBlurAction(
              e.target.innerText,
              data.editValue,
              data.name
            );
          }}
          height="200px"
          extensions={[javascript({ jsx: true })]}
          theme={myTheme}
          //@ts-ignore
          options={{
            lineNumbers: true,
            lineWrapping: true,
            matchBrackets: true,
            mode: 'javascript',
            tabSize: 2,
            gutters: ['CodeMirror-lint-markers'],
            lint: true,
          }}
        />
      </Form.Item>
    </>
  );
};

export default StyleComponent;
