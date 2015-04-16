'use strict';

var CKEDITOR = CKEDITOR || {};

CKEDITOR.plugins.add('liquid', {

  requires: ['richcombo'],

  onLoad: function() {
    CKEDITOR.addCss('' +
    'liquidVariable, liquidBlock' + '{' +
      'color: #000;' +
      'background-color: #ffc;' +
      'border: 1px solid #ccc;' +
      'padding: 2px;' +
      'white-space:nowrap;' +
    '}\n' +
    'liquidBlock' + '{' +
      'background-color: #fcc;' +
    '}');
  },

  init: function(editor) {

    var dataProcessor = editor.dataProcessor;
    var dataFilter = dataProcessor && dataProcessor.dataFilter;
    var htmlFilter = dataProcessor && dataProcessor.htmlFilter;

    editor.ui.addRichCombo('InsertLiquidTag', {
      label: 'Insert Data',
      title: 'Insert Data',
      voiceLabel: 'Insert Data',
      className: 'cke_format',
      multiSelect: false,
      panel: {
        css: [ editor.config.contentsCss, CKEDITOR.skin.getPath('editor') ],
        voiceLabel: editor.lang.panelVoiceLabel
      },
      init: function() {
        this.add('<liquidBlock>{% current_date %}</liquidBlock>', 'Current Date', 'Current Date');
        this.startGroup('User');
        this.add('<liquidVariable>{{ name }}</liquidVariable>', 'Name', 'Name');
        this.add('<liquidVariable>{{ email }}</liquidVariable>', 'Email', 'Email');
        this.add('<liquidVariable>{{ singup }}</liquidVariable>', 'Signup Date', 'Signup Date');
        this.startGroup('Application');
        this.add('<liquidVariable>{{ app_name }}</liquidVariable>', 'App Name', 'App Name');
        this.add('<liquidVariable>{{ app_url }}</liquidVariable>', 'App URL', 'App URL');
        this.add('<liquidVariable>{{ app_region }}</liquidVariable>', 'App Region', 'App Region');
      },
      onClick: function( value ) {
        editor.focus();
        editor.fire('saveSnapshot');
        var element = CKEDITOR.dom.element.createFromHtml(value);
        editor.insertElement(element);
        editor.insertText(' ');
        editor.fire('saveSnapshot');
      }
    });
    
    if (dataFilter) {
      dataFilter.addRules({
        text: function(text) {
          text = text.replace(/\{\{(.+?)\}\}/g, '<liquidVariable>{{$1}}</liquidVariable>');
          text = text.replace(/\{%(.+?)%\}/g, '<liquidBlock>{%$1%}</liquidBlock>');
          return text;
        }
      });
    }
    
    if (htmlFilter) {
      htmlFilter.addRules({
        elements: {
          liquidvariable: function(element, b, c){
            delete element.name;
            if (element.children.length > 0) {
              element.children[0].value = element.children[0].value;
            }
          },
          liquidblock: function(element, b, c){
            delete element.name;
            if (element.children.length > 0) {
              element.children[0].value = element.children[0].value;
            }
          }
        }
      });
    }
  }
});
