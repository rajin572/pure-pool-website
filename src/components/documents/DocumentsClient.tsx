"use client";

import React, { useEffect, useMemo, useState } from "react";
import Container from "@/components/ui/CustomUi/Container";
import { getDocuments, type DocumentRecord } from "@/service/DocumentsService/DocumentsServiceApi";
import { errorMessage } from "@/lib/apiRequest";
import DocumentsHeader from "./DocumentsHeader";
import DocumentsToolbar, { DocumentCategory } from "./DocumentsToolbar";
import DocumentCard from "./DocumentCard";
import DocumentPreviewModal from "./DocumentPreviewModal";

export const DocumentsClient: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentRecord[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<DocumentCategory>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [previewDoc, setPreviewDoc] = useState<DocumentRecord | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await getDocuments({ limit: 100 });
      if (cancelled) return;
      if (res.success) setDocuments(res.data);
      else setLoadError(errorMessage(res, "Could not load your documents."));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredDocuments = useMemo(() => {
    if (!documents) return [];
    let list = documents.filter((doc) => {
      const matchesCategory = activeCategory === "All" || doc.kind === activeCategory;
      const matchesSearch = !searchTerm.trim() || doc.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === "name") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "oldest") list = [...list].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    else list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return list;
  }, [documents, activeCategory, searchTerm, sortBy]);

  return (
    <main className="w-full min-h-screen bg-[#F9FAFB] flex flex-col">
      <div className="w-full bg-[#041D37] h-20 sm:h-24 shadow-xs" />

      <div className="w-full py-8 sm:py-12">
        <Container>
          <div className="w-full flex flex-col gap-6 sm:gap-8">
            <DocumentsHeader />

            <DocumentsToolbar
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={(v) => setSortBy(v as "newest" | "oldest" | "name")}
            />

            <div className="w-full flex flex-col gap-3">
              {!documents ? (
                <div className="w-full py-16 bg-white rounded-2xl border border-gray-200 text-center text-sm text-zinc-500">
                  Loading your documents...
                </div>
              ) : loadError ? (
                <div className="w-full py-16 bg-white rounded-2xl border border-gray-200 text-center text-sm text-red-600">
                  {loadError}
                </div>
              ) : filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <DocumentCard key={doc._id} document={doc} onPreview={(d) => setPreviewDoc(d)} />
                ))
              ) : (
                <div className="w-full py-16 bg-white rounded-2xl border border-gray-200 text-center flex flex-col items-center justify-center p-6 shadow-2xs">
                  <p className="text-zinc-600 font-semibold text-base">No documents found matching your criteria.</p>
                  <p className="text-zinc-400 text-sm mt-1">Try adjusting your search terms or filter selection.</p>
                </div>
              )}
            </div>

            {documents && documents.length > 0 && (
              <div className="w-full flex items-center justify-between gap-4 pt-4 border-t border-gray-200/80">
                <span className="text-zinc-500 text-sm font-medium">
                  Showing {filteredDocuments.length} of {documents.length} documents
                </span>
              </div>
            )}
          </div>
        </Container>
      </div>

      <DocumentPreviewModal document={previewDoc} open={Boolean(previewDoc)} onOpenChange={(open) => !open && setPreviewDoc(null)} />
    </main>
  );
};

export default DocumentsClient;
