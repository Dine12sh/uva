// @ts-nocheck
"use client";

import React, { useState } from "react";
import {
  deleteMemoryAction,
  editMemoryAction,
  uploadMemoryAction
} from "./actions";
import { Image as ImageIcon, Upload, Trash2, Edit2, Check, X } from "lucide-react";


interface Memory {
  id: string;
  type: string;
  url: string;
  caption: string | null;
  section: string;
  order: number;
}

interface AdminDashboardClientProps {
  initialMemories: Memory[];
}

export default function AdminDashboardClient({ initialMemories }: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "memories">("memories");
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadSection, setUploadSection] = useState("first_memories");
  const [uploadOrder, setUploadOrder] = useState(0);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [editSection, setEditSection] = useState("");
  const [editOrder, setEditOrder] = useState(0);

  // Drag and Drop/File selection reader
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadMsg("❌ Please select a file first.");
      return;
    }

    setUploadLoading(true);
    setUploadMsg(null);

    // Convert file to Base64
    const reader = new FileReader();
    reader.readAsDataURL(uploadFile);
    reader.onload = async () => {
      const base64Data = reader.result as string;
      const fileType = uploadFile.type.startsWith("video") ? "video" : "photo";

      const res = await uploadMemoryAction({
        type: fileType as any,
        caption: uploadCaption,
        section: uploadSection,
        order: uploadOrder,
        fileName: uploadFile.name,
        base64Data,
      });

      if (res.success) {
        setUploadMsg("✅ Memory uploaded successfully!");
        setUploadFile(null);
        setUploadCaption("");
        setUploadOrder(0);
        // Force refresh table
        window.location.reload();
      } else {
        setUploadMsg(`❌ ${res.error || "Failed to upload file."}`);
      }
      setUploadLoading(false);
    };
  };

  // Delete memory
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this memory?")) return;
    const res = await deleteMemoryAction(id);
    if (res.success) {
      setMemories(memories.filter((m) => m.id !== id));
    } else {
      alert("Failed to delete memory.");
    }
  };

  // Edit states loaders
  const startEdit = (mem: Memory) => {
    setEditingId(mem.id);
    setEditCaption(mem.caption || "");
    setEditSection(mem.section);
    setEditOrder(mem.order);
  };

  const handleSaveEdit = async (id: string) => {
    const res = await editMemoryAction({
      id,
      caption: editCaption,
      section: editSection,
      order: editOrder,
    });

    if (res.success) {
      setMemories(
        memories.map((m) =>
          m.id === id ? { ...m, caption: editCaption, section: editSection, order: editOrder } : m
        )
      );
      setEditingId(null);
    } else {
      alert("Failed to update memory.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col">
      {/* Header bar */}
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-300 via-pink-400 to-amber-200">
            Cinematic Admin
          </span>
          <span className="text-xs bg-neutral-800 px-2.5 py-1 rounded-full text-zinc-500 font-semibold uppercase">
            JSON DB
          </span>
        </div>


      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:flex-row max-w-7xl w-full mx-auto p-6 gap-8">

        {/* Navigation Sidebar */}
        <aside className="lg:w-64 flex flex-row lg:flex-col gap-2 border-b lg:border-b-0 lg:border-r border-neutral-800 pb-4 lg:pb-0 lg:pr-6">


          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm w-full transition-all cursor-pointer ${activeTab === "upload" ? "bg-pink-500/10 text-pink-300 border border-pink-500/20" : "text-zinc-400 hover:bg-white/5"
              }`}
          >
            <Upload size={18} /> Upload Memory
          </button>

          <button
            onClick={() => setActiveTab("memories")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm w-full transition-all cursor-pointer ${activeTab === "memories" ? "bg-pink-500/10 text-pink-300 border border-pink-500/20" : "text-zinc-400 hover:bg-white/5"
              }`}
          >
            <ImageIcon size={18} /> Manage Catalog
          </button>
        </aside>

        {/* Tab Contents */}
        <main className="flex-1 bg-neutral-900/30 border border-neutral-800/80 rounded-2xl p-6 md:p-8">



          {/* Tab 2: Upload new Media */}
          {activeTab === "upload" && (
            <form onSubmit={handleUploadSubmit} className="space-y-6">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-amber-200">
                Upload New Memory Asset
              </h3>

              {/* Drag and Drop File Input Area */}
              <div className="border-2 border-dashed border-neutral-800 hover:border-pink-500/50 rounded-2xl p-8 text-center transition-colors relative">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-2">
                  <Upload size={36} className="text-zinc-500" />
                  <span className="font-bold text-zinc-300 mt-2">
                    {uploadFile ? uploadFile.name : "Drag & drop photos/videos here or click to browse"}
                  </span>
                  <span className="text-xs text-zinc-600">Supports PNG, JPG, GIF, MP4 up to 50MB</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Timeline Section</label>
                  <select
                    value={uploadSection}
                    onChange={(e) => setUploadSection(e.target.value)}
                    className="w-full h-11 px-4 bg-black/40 border border-neutral-800 rounded-xl focus:border-pink-500 focus:outline-none transition-colors text-white"
                  >
                    <option value="first_memories">🌸 Beautiful shot</option>
                    <option value="beautiful_moments">📸 Unforgettable Memories</option>
                    <option value="fun_adventures">🎈 Unforgettable Memories</option>
                    <option value="special_days">🌟 Special Days</option>
                    <option value="unforgettable_memories">💖 Unforgettable Memories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Layout Sorting Order</label>
                  <input
                    type="number"
                    value={uploadOrder}
                    onChange={(e) => setUploadOrder(Number(e.target.value))}
                    required
                    className="w-full h-11 px-4 bg-black/40 border border-neutral-800 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Caption / Description</label>
                <input
                  type="text"
                  placeholder="Optional caption details..."
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  className="w-full h-11 px-4 bg-black/40 border border-neutral-800 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
                />
              </div>

              {uploadMsg && (
                <p className="text-sm font-semibold tracking-wide">{uploadMsg}</p>
              )}

              <button
                type="submit"
                disabled={uploadLoading}
                className="px-6 h-12 bg-pink-600 hover:bg-pink-500 rounded-xl font-bold tracking-wider transition-all cursor-pointer shadow-lg disabled:opacity-50"
              >
                {uploadLoading ? "Uploading Memory..." : "Upload Memory"}
              </button>
            </form>
          )}

          {/* Tab 3: Manage existing memory items */}
          {activeTab === "memories" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-amber-200">
                Manage Registered Memories ({memories.length})
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 text-xs font-bold text-zinc-400 uppercase">
                      <th className="py-3 px-4">Preview</th>
                      <th className="py-3 px-4">Section</th>
                      <th className="py-3 px-4">Caption</th>
                      <th className="py-3 px-4">Order</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 text-sm">
                    {memories.map((mem) => {
                      const isEditing = editingId === mem.id;

                      return (
                        <tr key={mem.id} className="hover:bg-neutral-900/20">
                          {/* Thumbnail Column */}
                          <td className="py-3 px-4">
                            <div className="w-16 h-12 rounded-lg overflow-hidden bg-neutral-800 border border-neutral-800">
                              {mem.type === "photo" ? (
                                <img src={mem.url} alt="thumbnail" className="w-full h-full object-cover" />
                              ) : (
                                <video src={mem.url} muted className="w-full h-full object-cover" />
                              )}
                            </div>
                          </td>

                          {/* Section Column */}
                          <td className="py-3 px-4 font-semibold text-zinc-300">
                            {isEditing ? (
                              <select
                                value={editSection}
                                onChange={(e) => setEditSection(e.target.value)}
                                className="bg-black border border-neutral-800 rounded px-2 py-1 text-xs"
                              >
                                <option value="first_memories">🌸 Beautiful shot</option>
                                <option value="beautiful_moments">📸 Unforgettable Memories</option>
                                <option value="fun_adventures">🎈 Beautiful Moments</option>
                                <option value="special_days">🌟 Special Days</option>
                                <option value="unforgettable_memories">💖 Unforgettable Memories</option>
                              </select>
                            ) : (
                              mem.section.replace("_", " ")
                            )}
                          </td>

                          {/* Caption Column */}
                          <td className="py-3 px-4 text-zinc-400">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editCaption}
                                onChange={(e) => setEditCaption(e.target.value)}
                                className="bg-black border border-neutral-800 rounded px-2 py-1 text-xs w-full max-w-xs"
                              />
                            ) : (
                              mem.caption || "-"
                            )}
                          </td>

                          {/* Order Column */}
                          <td className="py-3 px-4 text-zinc-400">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editOrder}
                                onChange={(e) => setEditOrder(Number(e.target.value))}
                                className="bg-black border border-neutral-800 rounded px-2 py-1 text-xs w-16"
                              />
                            ) : (
                              mem.order
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => handleSaveEdit(mem.id)}
                                    className="p-1.5 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 hover:bg-green-500/20 cursor-pointer"
                                  >
                                    <Check size={14} />
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="p-1.5 bg-neutral-800 rounded-lg text-zinc-400 hover:bg-neutral-700 cursor-pointer"
                                  >
                                    <X size={14} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEdit(mem)}
                                    className="p-1.5 bg-neutral-900 rounded-lg text-zinc-400 hover:bg-neutral-800 hover:text-white cursor-pointer"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(mem.id)}
                                    className="p-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 cursor-pointer"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
