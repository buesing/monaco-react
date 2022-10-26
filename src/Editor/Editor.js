import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
<<<<<<< v4
import loader from '@monaco-editor/loader';
import state from 'state-local';
=======
import loader from '@monaco-editor/loader';
>>>>>>> master

import MonacoContainer from '../MonacoContainer';
import useMount from '../hooks/useMount';
import useUpdate from '../hooks/useUpdate';
<<<<<<< v4
import { noop, getOrCreateModel } from '../utils';
=======
import usePrevious from '../hooks/usePrevious';
import { noop, getOrCreateModel, isUndefined } from '../utils';
>>>>>>> master

<<<<<<< v4
const [getModelMarkersSetter, setModelMarkersSetter] = state.create({
  backup: null,
});

=======
const viewStates = new Map();

>>>>>>> master
function Editor({
<<<<<<< v4
  defaultValue,
=======
  defaultValue,
  defaultLanguage,
  defaultPath,
>>>>>>> master
  value,
  language,
<<<<<<< v4
  /* === */
  defaultModelPath,
=======
  path,
  /* === */
>>>>>>> master
  theme,
  line,
  loading,
  options,
  overrideServices,
<<<<<<< v4
  /* === */
  width,
  height,
=======
  saveViewState,
  keepCurrentModel,
  /* === */
  width,
  height,
>>>>>>> master
  className,
<<<<<<< v4
  wrapperClassName,
  /* === */
  beforeMount,
  onMount,
  onChange,
  onValidate,
=======
  wrapperProps,
  /* === */
  beforeMount,
  onMount,
  onChange,
  onValidate,
>>>>>>> master
}) {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isMonacoMounting, setIsMonacoMounting] = useState(true);
  const monacoRef = useRef(null);
  const editorRef = useRef(null);
  const containerRef = useRef(null);
<<<<<<< v4
  const onMountRef = useRef(onMount);
  const beforeMountRef = useRef(beforeMount);
  const subscriptionRef = useRef(null);
  const valueRef = useRef(value);
=======
  const onMountRef = useRef(onMount);
  const beforeMountRef = useRef(beforeMount);
  const subscriptionRef = useRef(null);
  const valueRef = useRef(value);
  const previousPath = usePrevious(path);
  const preventCreation = useRef(false);
>>>>>>> master

  useMount(() => {
    const cancelable = loader.init();

    cancelable
      .then(monaco => ((monacoRef.current = monaco) && setIsMonacoMounting(false)))
      .catch(error => error?.type !== 'cancelation' &&
        console.error('Monaco initialization: error:', error));

    return () => editorRef.current ? disposeEditor() : cancelable.cancel();
  });

  useUpdate(() => {
    const model = getOrCreateModel(
      monacoRef.current,
      defaultValue || value,
      defaultLanguage || language,
      path,
    );

    if (model !== editorRef.current.getModel()) {
      saveViewState && viewStates.set(previousPath, editorRef.current.saveViewState());
      editorRef.current.setModel(model);
      saveViewState && editorRef.current.restoreViewState(viewStates.get(path));
    }
  }, [path], isEditorReady);

  useUpdate(() => {
    editorRef.current.updateOptions(options);
  }, [options], isEditorReady);

  useUpdate(() => {
    if (editorRef.current.getOption(monacoRef.current.editor.EditorOption.readOnly)) {
      editorRef.current.setValue(value);
    } else {
      if (value !== editorRef.current.getValue()) {
        editorRef.current.executeEdits('', [{
          range: editorRef.current.getModel().getFullModelRange(),
          text: value,
          forceMoveMarkers: true,
        }]);

        editorRef.current.pushUndoStop();
      }
    }
  }, [value], isEditorReady);

  useUpdate(() => {
    monacoRef.current.editor.setModelLanguage(editorRef.current.getModel(), language);
  }, [language], isEditorReady);

  useUpdate(() => {
    // reason for undefined check: https://github.com/suren-atoyan/monaco-react/pull/188
    if(!isUndefined(line)) {
      editorRef.current.revealLine(line);
    }
  }, [line], isEditorReady);

  useUpdate(() => {
    monacoRef.current.editor.setTheme(theme);
  }, [theme], isEditorReady);

  const createEditor = useCallback(() => {
<<<<<<< v4
    beforeMountRef.current(monacoRef.current);
    const defaultModel = getOrCreateModel(
      monacoRef.current,
      defaultValue || value,
      language,
      defaultModelPath,
    );

    editorRef.current = monacoRef.current.editor.create(containerRef.current, {
      model: defaultModel,
      automaticLayout: true,
      ...options,
    }, overrideServices);
=======
    if (!preventCreation.current) {
      beforeMountRef.current(monacoRef.current);
      const autoCreatedModelPath = path || defaultPath;
>>>>>>> master

      const defaultModel = getOrCreateModel(
        monacoRef.current,
        value || defaultValue,
        defaultLanguage || language,
        autoCreatedModelPath,
      );

<<<<<<< v4
    if (!getModelMarkersSetter().backup) {
      setModelMarkersSetter({
        backup: monacoRef.current.editor.setModelMarkers,
      });
    }

    setIsEditorReady(true);
  }, [
    language,
    options,
    overrideServices,
    theme,
    value,
    defaultValue,
    defaultModelPath,
  ]);
=======
      editorRef.current = monacoRef.current.editor.create(containerRef.current, {
        model: defaultModel,
        automaticLayout: true,
        ...options,
      }, overrideServices);
>>>>>>> master

      saveViewState && editorRef.current.restoreViewState(viewStates.get(autoCreatedModelPath));

      monacoRef.current.editor.setTheme(theme);

      setIsEditorReady(true);
      preventCreation.current = true;
    }
  }, [
    defaultValue,
    defaultLanguage,
    defaultPath,
    value,
    language,
    path,
    options,
    overrideServices,
    saveViewState,
    theme,
  ]);

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

  // subscription
  // to avoid unnecessary updates (attach - dispose listener) in subscription
  valueRef.current = value;

<<<<<<< v4
  useEffect(() => {
    if (isEditorReady && onChange) {
      subscriptionRef.current?.dispose();
      subscriptionRef.current = editorRef.current?.onDidChangeModelContent(event => {
        const editorValue = editorRef.current.getValue();

        if (valueRef.current !== editorValue) {
          onChange(editorValue, event);
        }
      });
    }
  }, [isEditorReady, onChange]);

  // onValidate
  useEffect(() => {
    if (isEditorReady) {
      monacoRef.current.editor.setModelMarkers = function(model, owner, markers) {
        getModelMarkersSetter().backup?.call(
          monacoRef.current.editor,
          model,
          owner,
          markers,
        );

        if (markers.length !== 0) {
          onValidate?.(markers);
        }
      }
    }
  }, [isEditorReady, onValidate]);

  function disposeEditor() {
    subscriptionRef.current?.dispose();
    editorRef.current.dispose();
  }

=======
  // onChange
  useEffect(() => {
    if (isEditorReady && onChange) {
      subscriptionRef.current?.dispose();
      subscriptionRef.current = editorRef.current?.onDidChangeModelContent(event => {
        onChange(editorRef.current.getValue(), event);
      });
    }
  }, [isEditorReady, onChange]);

  // onValidate
  useEffect(() => {
    if (isEditorReady) {
      const changeMarkersListener = monacoRef.current.editor.onDidChangeMarkers(uris => {
        const editorUri = editorRef.current.getModel()?.uri;

        if (editorUri) {
          const currentEditorHasMarkerChanges = uris.find((uri) => uri.path === editorUri.path);
          if (currentEditorHasMarkerChanges) {
            const markers = monacoRef.current.editor.getModelMarkers({ resource: editorUri });
            onValidate?.(markers);
          }
        }
      });
   
      return () => {
        changeMarkersListener?.dispose();
      };
    }
  }, [isEditorReady, onValidate]);

  function disposeEditor() {
    subscriptionRef.current?.dispose();

    if (keepCurrentModel) {
      saveViewState && viewStates.set(path, editorRef.current.saveViewState());
    } else {
      editorRef.current.getModel()?.dispose();
    }

    editorRef.current.dispose();
  }

>>>>>>> master
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

Editor.propTypes = {
<<<<<<< v4
  defaultValue: PropTypes.string,
=======
  defaultValue: PropTypes.string,
  defaultPath: PropTypes.string,
  defaultLanguage: PropTypes.string,
>>>>>>> master
  value: PropTypes.string,
  language: PropTypes.string,
<<<<<<< v4
  /* === */
  defaultModelPath: PropTypes.string,
=======
  path: PropTypes.string,
  /* === */
>>>>>>> master
  theme: PropTypes.string,
  line: PropTypes.number,
  loading: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  options: PropTypes.object,
<<<<<<< v4
  overrideServices: PropTypes.object,
  /* === */
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
  /* === */
  beforeMount: PropTypes.func,
  onMount: PropTypes.func,
  onChange: PropTypes.func,
  onValidate: PropTypes.func,
=======
  overrideServices: PropTypes.object,
  saveViewState: PropTypes.bool,
  keepCurrentModel: PropTypes.bool,
  /* === */
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  wrapperProps: PropTypes.object,
  /* === */
  beforeMount: PropTypes.func,
  onMount: PropTypes.func,
  onChange: PropTypes.func,
  onValidate: PropTypes.func,
>>>>>>> master
};

Editor.defaultProps = {
<<<<<<< v4
  defaultModelPath: 'inmemory://model/1',
=======
>>>>>>> master
  theme: 'light',
  loading: 'Loading...',
  options: {},
  overrideServices: {},
<<<<<<< v4
  /* === */
  width: '100%',
  height: '100%',
  /* === */
  beforeMount: noop,
  onMount: noop,
  onValidate: noop,
=======
  saveViewState: true,
  keepCurrentModel: false,
  /* === */
  width: '100%',
  height: '100%',
  wrapperProps: {},
  /* === */
  beforeMount: noop,
  onMount: noop,
  onValidate: noop,
>>>>>>> master
};

export default Editor;
