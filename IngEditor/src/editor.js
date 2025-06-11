function initCodeMirror(elementId) {
  const editor = CodeMirror(document.getElementById(elementId), {
    lineNumbers: true,
    tabSize: 2,
    value: '',
    mode: 'text/plain',
    theme: 'default',
    autoCloseBrackets: true,
    matchBrackets: true,
    viewportMargin: Infinity,
    lineWrapping: true,
    readOnly: false 
  });
  return editor;
}

function setEditorMode(editor, fileName) {
  const extension = fileName.split('.').pop().toLowerCase();
  const modeMap = {
    'js': 'javascript',
    'py': 'python',
    'cpp': 'text/x-c++src',
    'c': 'text/x-csrc',
    'java': 'text/x-java',
    'html': 'htmlmixed',
    'css': 'css',
    'xml': 'xml',
    'sql': 'sql',
    'json': 'javascript',
    'ts': 'javascript',
    'jsx': 'jsx',
    'php': 'php',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust'
  };
  const mode = modeMap[extension] || 'text/plain';
  editor.setOption('mode', mode);
}