
"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";

export function EditButton({ idAsNumber }: { idAsNumber: number }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    fetch(`/api/image/${idAsNumber}/info`).then(r => r.json()).then(d => {
      setUrl(d.imageUrl);
      setName(d.ImageName || d.filename || "");
    });
  }, [open, idAsNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      if (name) {
        const res = await fetch(`/api/image/${idAsNumber}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ImageName: name }),
        });
        if (!res.ok) throw new Error("Failed to update image name");
      }
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch(`/api/image/${idAsNumber}/replace`, {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) throw new Error("Failed to upload new image");
      }
      setOpen(false); window.location.reload();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)} className="cursor-pointer">Edit</Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl pointer-events-auto">
            <h2 className="text-xl font-bold mb-4">Edit Image</h2>
            {(file || url) && (
              <img
                src={file ? URL.createObjectURL(file) : url}
                alt={name || "Image"}
                className="mb-4 rounded border shadow max-h-48 mx-auto w-full"
                style={{ objectFit: 'contain', maxWidth: '100%' }}
              />
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label className="font-semibold">Image Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="p-2 border rounded"
                placeholder="Enter new image name"
                disabled={loading}
              />
              <label className="font-semibold">Change Image File</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="p-2"
                disabled={loading}
              />
              <div className="flex gap-2 mt-4">
                <Button type="submit" variant="outline" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
                  Cancel
                </Button>
              </div>
              {error && <span className="text-red-500 text-xs">{error}</span>}
            </form>
          </div>
        </div>
      )}
    </>
  );
}