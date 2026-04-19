import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, all } from 'lowlight';
import { useEffect } from 'react';

const lowlight = createLowlight(all);

interface RichEditorProps {
  html: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichEditor({ html, onChange, placeholder }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noreferrer noopener' } }),
      Placeholder.configure({ placeholder: placeholder ?? '从这里开始写作…' }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: html || '<p></p>',
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-content',
      },
    },
  });

  // keep external html in sync when switching to edit a different article
  useEffect(() => {
    if (editor && html && editor.getHTML() !== html) {
      editor.commands.setContent(html, false);
    }
  }, [html, editor]);

  if (!editor) return null;

  const btn = (fn: () => void, active: boolean, label: string) => (
    <button
      type="button"
      className={`tool-btn ${active ? 'tool-btn-on' : ''}`}
      onClick={fn}
      style={active ? { background: 'var(--brand-subtle)', color: 'var(--brand-ink)' } : undefined}
    >
      {label}
    </button>
  );

  return (
    <div className="tiptap-wrap">
      <div className="esub" style={{ height: 'auto', minHeight: 44, padding: '6px 18px' }}>
        {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }), 'H2')}
        {btn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive('heading', { level: 3 }), 'H3')}
        <span className="tool-sep" />
        {btn(() => editor.chain().focus().toggleBold().run(), editor.isActive('bold'), 'B')}
        {btn(() => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'), 'I')}
        {btn(() => editor.chain().focus().toggleStrike().run(), editor.isActive('strike'), 'S')}
        <span className="tool-sep" />
        {btn(() => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'), '• 列表')}
        {btn(() => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'), '1. 列表')}
        {btn(() => editor.chain().focus().toggleBlockquote().run(), editor.isActive('blockquote'), '引用')}
        {btn(() => editor.chain().focus().toggleCodeBlock().run(), editor.isActive('codeBlock'), '</> 代码块')}
        {btn(
          () => {
            const url = window.prompt('输入链接 URL');
            if (!url) return;
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          },
          editor.isActive('link'),
          '🔗 链接',
        )}
        {btn(() => editor.chain().focus().setHorizontalRule().run(), false, '— 分隔线')}
        {btn(() => editor.chain().focus().undo().run(), false, '↶ 撤销')}
        {btn(() => editor.chain().focus().redo().run(), false, '↷ 重做')}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
