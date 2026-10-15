"use client";

import React, { useState, useMemo } from "react";
import Container from "@/components/ui/CustomUi/Container";
import { DocumentRecord } from "@/service/DocumentsService/DocumentsServiceApi";
import DocumentsHeader from "./DocumentsHeader";
import DocumentsToolbar, { DocumentCategory } from "./DocumentsToolbar";
import DocumentCard from "./DocumentCard";
import DocumentPreviewModal from "./DocumentPreviewModal";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DocumentsClientProps {
  initialDocuments: DocumentRecord[];
  total: number;
}

export const DocumentsClient: React.FC<DocumentsClientProps> = ({
  initialDocuments,
  total,
}) => {
  const [documents] = useState<DocumentRecord[]>(initialDocuments);
  const [activeCategory, setActiveCategory] = useState<DocumentCategory>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [previewDoc, setPreviewDoc] = useState<DocumentRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  /**
   * ==============================================================================
   * REDUX RTK QUERY / REST API INTEGRATION:
   *
   * const { data: documentsData, isLoading } = useGetDocumentsQuery({
   *   category: activeCategory,
   *   search: searchTerm,
   *   sort: sortBy,
   *   page: currentPage,
   * });
   * const [downloadDocTrigger] = useLazyDownloadDocumentQuery();
   * ==============================================================================
   */

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredDocuments = useMemo(() => {
    let list = documents.filter((doc) => {
      const matchesCategory =
        activeCategory === "All" || doc.category === activeCategory;
      const matchesSearch =
        !searchTerm.trim() ||
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.equipmentName &&
          doc.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    if (sortBy === "name") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "oldest") {
      list = [...list].reverse();
    }

    return list;
  }, [documents, activeCategory, searchTerm, sortBy]);

  const handleDownload = (doc: DocumentRecord) => {
    showToast(`Downloading "${doc.title}" (${doc.fileSize})…`);
    // Simulated download action
    const link = document.createElement("a");
    link.href = doc.fileUrl;
    link.setAttribute("download", `${doc.title}.pdf`);
  };

  return (
    <main className="w-full min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* 1. Dark Top Bar for Navbar Contrast */}
      <div className="w-full bg-[#041D37] h-20 sm:h-24 shadow-xs" />

      {/* 2. Notification Toast */}
      {toastMessage && (
        <div className="w-full bg-blue-600 text-white py-3 px-4 text-center text-sm font-semibold shadow-md animate-fadeIn transition-all">
          <Container>
            <div className="flex items-center justify-between gap-4">
              <span className="flex-1 text-center">{toastMessage}</span>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-white/80 hover:text-white text-xs uppercase font-bold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </Container>
        </div>
      )}

      {/* 3. Main Content Area */}
      <div className="w-full py-8 sm:py-12">
        <Container>
          <div className="w-full flex flex-col gap-6 sm:gap-8">
            {/* Heading */}
            <DocumentsHeader />

            {/* Toolbar: Search, Category Pills, Sort */}
            <DocumentsToolbar
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Document List */}
            <div className="w-full flex flex-col gap-3">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onPreview={(d) => setPreviewDoc(d)}
                    onDownload={handleDownload}
                  />
                ))
              ) : (
                <div className="w-full py-16 bg-white rounded-2xl border border-gray-200 text-center flex flex-col items-center justify-center p-6 shadow-2xs">
                  <p className="text-zinc-600 font-semibold text-base">
                    No documents found matching your criteria.
                  </p>
                  <p className="text-zinc-400 text-sm mt-1">
                    Try adjusting your search terms or filter selection.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination matching Figma Node 40014997:10279 */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200/80">
              <span className="text-zinc-500 text-sm font-medium">
                Showing {filteredDocuments.length} of {total} documents
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="size-10 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-zinc-600 transition-all cursor-pointer shadow-2xs"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[1, 2, 3].map((page) => {
                  const isActive = currentPage === page;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`size-10 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-xs"
                          : "bg-white border border-gray-200 text-zinc-800 hover:bg-gray-50 shadow-2xs"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                  disabled={currentPage === 3}
                  className="size-10 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-zinc-600 transition-all cursor-pointer shadow-2xs"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* 4. Preview Modal */}
      <DocumentPreviewModal
        document={previewDoc}
        open={Boolean(previewDoc)}
        onOpenChange={(open) => !open && setPreviewDoc(null)}
        onDownload={handleDownload}
      />
    </main>
  );
};

export default DocumentsClient;

