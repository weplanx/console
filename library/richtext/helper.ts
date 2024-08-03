import { Any } from '@weplanx/ng';

export function defaultTools(windowAny: Any): Any {
  return {
    paragraph: {
      class: windowAny.Paragraph,
      inlineToolbar: true
    },
    header: windowAny.Header,
    table: windowAny.Table,
    delimiter: windowAny.Delimiter,
    underline: windowAny.Underline,
    list: {
      class: windowAny.NestedList,
      inlineToolbar: true
    },
    checklist: {
      class: windowAny.Checklist,
      inlineToolbar: true
    },
    quote: windowAny.Quote,
    code: windowAny.CodeTool,
    marker: {
      class: windowAny.Marker,
      shortcut: 'CMD+SHIFT+M'
    },
    inlineCode: {
      class: windowAny.InlineCode,
      shortcut: 'CMD+SHIFT+M'
    }
  };
}

export const zh_CN = {
  messages: {
    ui: {
      blockTunes: {
        toggler: {
          'Click to tune': '更多',
          'or drag to move': '拖拽至此'
        }
      },
      inlineToolbar: {
        converter: {
          'Convert to': '类型转换'
        }
      },
      toolbar: {
        toolbox: {
          Add: '新增'
        }
      }
    },

    /**
     * Section for translation Tool Names: both block and inline tools
     */
    toolNames: {
      Text: '正文',
      Heading: '标题',
      List: '列表',
      Checklist: '任务列表',
      Quote: '引用',
      Code: '代码',
      Delimiter: '分割线',
      Underline: '下划线',
      Table: '表格',
      Link: '链接',
      Bold: '粗体',
      Italic: '斜体',
      Image: '图库',
      Video: '视频库'
    },

    /**
     * Section for passing translations to the external tools classes
     */
    tools: {
      /**
       * Link is the internal Inline Tool
       */
      link: {
        'Add a link': '新增链接'
      },
      /**
       * The "stub" is an internal block tool, used to fit blocks that does not have the corresponded plugin
       */
      stub: {
        'The block can not be displayed correctly.': '无法正确显示'
      }
    },

    /**
     * Section allows to translate Block Tunes
     */
    blockTunes: {
      /**
       * Each subsection is the i18n dictionary that will be passed to the corresponded Block Tune plugin
       * The name of a plugin should be equal the name you specify in the 'tunes' section for that plugin
       *
       * Also, there are few internal block tunes: "delete", "moveUp" and "moveDown"
       */
      delete: {
        Delete: '删除'
      },
      moveUp: {
        'Move up': '向上移动'
      },
      moveDown: {
        'Move down': '向下移动'
      }
    }
  }
};
