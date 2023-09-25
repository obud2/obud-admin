import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { SEditor } from './Editor.styled';

/**
 *
 * @param {*} value : value 넣으면 에디터에 내용 표시됨  =  에디터 만들어지기전에 value값 없는 경우 있어서 setValue 도 사용.
 * @returns
 *
 */
const Editor = forwardRef(({ value, disabled }, ref) => {
  const editorRef = useRef('');
  const oEditors = useRef([]);

  const [id] = useState(uuidv4());

  const [isInit, setIsInit] = useState(false);
  const [delay, setDelay] = useState('');

  useImperativeHandle(ref, () => ({
    /**
     * @returns 에디터에 작성한 내용 가져오기
     */
    getValue() {
      if (oEditors.current) {
        try {
          const contents = oEditors.current.getById[id]?.getContents();

          return contents;
        } catch (error) {
          return '';
        }
      }
    },

    /**
     * @returns 에디터에 디비에서 가져온 데이터 넣기.
     */
    setValue(data) {
      if (oEditors.current) {
        try {
          oEditors.current.getById[id].setContents(data);
        } catch (error) {
          //
        }
      }
    },
  }));

  const loadExternalJS = () => {
    // 필요한 파일들을 동적으로 생성해줍니다.
    const scriptJquery = document.createElement('script');
    scriptJquery.id = 'smart_editor';
    scriptJquery.src = '/smartEditor/js/HuskyEZCreator.js';

    // 생성된 script 요소들을 body에 붙여주세요
    document.head.appendChild(scriptJquery);
  };

  useEffect(() => {
    loadExternalJS();

    const temp = setInterval(() => {
      const script = document.getElementById('smart_editor');

      if (script) {
        setIsInit(true);
      }
    }, [1000]);

    setDelay(temp);
  }, []);

  useEffect(() => {
    // Editor Setting
    if (isInit) {
      clearInterval(delay);

      editorRef.current = window?.nhn?.husky?.EZCreator;

      editorRef.current?.createInIFrame({
        oAppRef: oEditors.current,
        elPlaceHolder: id, // 에디터를 적용할 textarea ID에 맞게 변경
        sSkinURI: '/smartEditor/SmartEditor2Skin.html', // Editor HTML파일 위치로 변경
        fCreator: 'createSEditor2', // SE2BasicCreator.js 메소드명으로 변경하면 안된다.
        htParams: {
          // 툴바 사용 여부 (true/false)
          bUseToolbar: true,

          // 입력창 크기 조절바 사용 여부 (true/false)
          bUseVerticalResizer: false,

          // 모드 탭(Editor|HTML|TEXT) 사용 여부 (true/false)
          bUseModeChanger: true,

          // client-side xss filter 무시 여부 (true:사용하지 않음 / 그외:사용)
          bSkipXssFilter: true,

          // 페이지 벗어 날 시 이벤트 삭제
          fOnBeforeUnload: function () {},
        },
      });
    }
  }, [isInit, delay]);

  useEffect(() => {
    if (ref?.current) {
      ref?.current?.setValue(value);
    }
  }, [value]);

  return (
    <SEditor ref={ref}>
      <div className={`disabled-loading ${disabled ? 'active' : ''}`} />
      <textarea className="editor-textarea" rows="50" id={id} name={id} value={value} readOnly />
    </SEditor>
  );
});

export default Editor;
