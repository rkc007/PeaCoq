requirejs.config({
  baseUrl: 'js/lib',
  paths: {
    ace: './ace',
    peacoq: '../peacoq',
  },
  shim: {
    'bootstrap': {
      deps: ['jquery']
    },
  }
});

// Start the main app logic.
requirejs(['ace/ace', 'jquery', 'bootstrap', 'lodash'],
  function(ace, $, bootstrap, lodash) {
    window.ace = ace;
    requirejs([
      'ace/mode/ocaml',
      'peacoq/highlight-coq',
      'peacoq/mode-coq',
      'peacoq/coqtop85',
    ], function() {
      requirejs(['peacoq/coq85']);
    });
  });
