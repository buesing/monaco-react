import React, { useState, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import loader from '@monaco-editor/loader';

import MonacoContainer from '../MonacoContainer';
import useMount from '../hooks/useMount';
import useUpdate from '../hooks/useUpdate';
import { noop, getOrCreateModel } from '../utils';
Whattt11t1ttttt
}) {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isMonacoMounting, setIsMonacoMounting] = useState(true);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const containerRef = useRef(null);
  const onMountRef = useRef(onMount);
  const beforeMountRef = useRef(beforeMount);

  useMount(() => {
    const cancelable = loader.init();

    cancelable
      .then(monaco => ((monacoRef.current = monaco) && setIsMonacoMounting(false)))
      .catch(error => error?.type !== 'cancelation' &&
        console.error('Monaco initialization: error:', error));

    return () => editorRef.current ? disposeEditor() : cancelable.cancel();
  });

  useUpdate(() => {
    const modifiedEditor = editorRef.current.getModifiedEditor();
    if (modifiedEditor.getOption(monacoRef.current.editor.EditorOption.readOnly)) {
      modifiedEditor.setValue(modified);
    } else {
      if (modified !== modifiedEditor.getValue()) {
        modifiedEditor.executeEdits('', [{
          range: modifiedEditor.getModel().getFullModelRange(),
          text: modified,
          forceMoveMarkers: true,
        }]);

        modifiedEditor.pushUndoStop();
      }
    }
  }, [modified], isEditorReady);

  useUpdate(() => {
    editorRef.current.getModel().original.setValue(original);
  }, [original], isEditorReady);

  useUpdate(() => {
    const { original, modified } = editorRef.current.getModel();

    monacoRef.current.editor.setModelLanguage(original, originalLanguage || language);
    monacoRef.current.editor.setModelLanguage(modified, modifiedLanguage || language);
  }, [language, originalLanguage, modifiedLanguage], isEditorReady);

  useUpdate(() => {
    monacoRef.current.editor.setTheme(theme);
  }, [theme], isEditorReady);

  useUpdate(() => {
    editorRef.current.updateOptions(options);
  }, [options], isEditorReady);

  const setModels = useCallback(() => {
<<<<<<< v4
    beforeMountRef.current(monacoRef.current);
    const originalModel = monacoRef.current.editor
      .createModel(
        original,
        originalLanguage || language,
        monacoRef.current.Uri.parse(originalModelPath),
      );
=======
    beforeMountRef.current(monacoRef.current);
    const originalModel = getOrCreateModel(
      monacoRef.current,
      original,
      originalLanguage || language,
      originalModelPath,
    );
>>>>>>> master

<<<<<<< v4
    const modifiedModel = monacoRef.current.editor
      .createModel(
        modified,
        modifiedLanguage || language,
        monacoRef.current.Uri.parse(modifiedModelPath),
      );
=======
    const modifiedModel = getOrCreateModel(
      monacoRef.current,
      modified,
      modifiedLanguage || language,
      modifiedModelPath,
    );
>>>>>>> master

    editorRef.current.setModel({ original: originalModel, modified: modifiedModel });
  }, [language, modified, modifiedLanguage, original, originalLanguage, originalModelPath, modifiedModelPath]);

  const createEditor = useCallback(() => {
    editorRef.current = monacoRef.current.editor.createDiffEditor(containerRef.current, {
      automaticLayout: true,
      ...options,
    });

    setModels();

    monacoRef.current.editor.setTheme(theme);

    setIsEditorReady(true);
  }, [options, theme, setModels]);

  useEffect(() => {
    if (isEditorReady) {
      onMountRef.current(
        editorRef.current,
        monacoRef.current,
      );
    }
  }, [isEditorReady]);

  useEffect(() => {
    !isMonacoMounting && !isEditorReady && createEditor();
  }, [isMonacoMounting, isEditorReady, createEditor]);

  function disposeEditor() {
    const models = editorRef.current.getModel();

    if (!keepCurrentOriginalModel) {
      models.original?.dispose();
    }

    if (!keepCurrentModifiedModel) {
      models.modified?.dispose();
    }

    editorRef.current.dispose();
  }

  return (
    <MonacoContainer
      width={width}
      height={height}
      isEditorReady={isEditorReady}
      loading={loading}
      _ref={containerRef}
      className={className}
      wrapperProps={wrapperProps}
    />
  );
}

DiffEditor.propTypes = {
  original: PropTypes.string,
  modified: PropTypes.string,
  language: PropTypes.string,
  originalLanguage: PropTypes.string,
  modifiedLanguage: PropTypes.string,
<<<<<<< v4
  /* === */
  originalModelPath: PropTypes.string,
  modifiedModelPath: PropTypes.string,
=======
  /* === */
  originalModelPath: PropTypes.string,
  modifiedModelPath: PropTypes.string,
  keepCurrentOriginalModel: PropTypes.bool,
  keepCurrentModifiedModel: PropTypes.bool,
>>>>>>> master
  theme: PropTypes.string,
  loading: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  options: PropTypes.object,
  /* === */
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
<<<<<<< v4
  wrapperClassName: PropTypes.string,
  /* === */
  beforeMount: PropTypes.func,
  onMount: PropTypes.func,
=======
  wrapperProps: PropTypes.object,
  /* === */
  beforeMount: PropTypes.func,
  onMount: PropTypes.func,
>>>>>>> master
};

DiffEditor.defaultProps = {
<<<<<<< v4
  originalModelPath: 'inmemory://model/1',
  modifiedModelPath: 'inmemory://model/2',
=======
>>>>>>> master
  theme: 'light',
  loading: 'Loading...',
  options: {},
<<<<<<< v4
  /* === */
  width: '100%',
  height: '100%',
  /* === */
  beforeMount: noop,
  onMount: noop,
=======
  keepCurrentOriginalModel: false,
  keepCurrentModifiedModel: false,
  /* === */
  width: '100%',
  height: '100%',
  wrapperProps: {},
  /* === */
  beforeMount: noop,
  onMount: noop,
>>>>>>> master
};

export default DiffEditor;
