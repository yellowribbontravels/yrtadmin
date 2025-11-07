"use client";

import { useCallback, useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import {Table} from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import toast from "react-hot-toast";

export default function BlogEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append("file", file);
    data.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );
    const json = await res.json();
    return json.secure_url;
  };

  const editor = useEditor({
    immediatelyRender: false,
    content: value || "<p>Remove this content and start writing.</p>",
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Link.configure({ openOnClick: true }),
      Image,
      Table,
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockLowlight.configure({ lowlight: createLowlight(common) }),
    ],
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });


  const addImage = useCallback(() => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const url = await uploadToCloudinary(file);
        editor.chain().focus().setImage({ src: url }).run();
        toast.success("Image added");
      } catch {
        toast.error("Upload failed");
      }
    };

    input.click();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 border p-2 rounded bg-gray-50">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="px-2 py-1 border rounded text-sm">
          Bold
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="px-2 py-1 border rounded text-sm">
          Italic
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="px-2 py-1 border rounded text-sm">
          Underline
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="px-2 py-1 border rounded text-sm">
          H2
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="px-2 py-1 border rounded text-sm">
          List
        </button>
        <button onClick={addImage} className="px-2 py-1 border rounded text-sm">
          Image
        </button>
      </div>

      <div className="border rounded p-3 min-h-[350px] bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
