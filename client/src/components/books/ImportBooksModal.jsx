import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  X,
  FileSpreadsheet,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useBooks } from '../../context/BookContext';
import { useToast } from '../../context/ToastContext';

export const ImportBooksModal = ({ isOpen, onClose }) => {
  const { importBulkBooks } = useBooks();
  const { showError, showSuccess } = useToast();

  const [file, setFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Download Sample Excel Template
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Book Title': 'Siddhartha',
        'Author Name': 'Hermann Hesse',
        'Category': 'Philosophy',
        'Language': 'English',
        'Status': 'Finished',
        'Progress': 100,
        'Tags': 'Classic, Spiritual, Journey',
        'Notes': 'A profound quest for enlightenment through self-discovery and inner peace.',
        'Favorite': 'Yes'
      },
      {
        'Book Title': 'Thinking, Fast and Slow',
        'Author Name': 'Daniel Kahneman',
        'Category': 'Psychology',
        'Language': 'English',
        'Status': 'Reading',
        'Progress': 35,
        'Tags': 'Behavioral Economics, Cognitive Bias',
        'Notes': 'System 1 (fast, emotional) vs System 2 (slow, deliberative) thinking.',
        'Favorite': 'No'
      },
      {
        'Book Title': 'Madhushala',
        'Author Name': 'Harivansh Rai Bachchan',
        'Category': 'Poetry',
        'Language': 'Hindi',
        'Status': 'Finished',
        'Progress': 100,
        'Tags': 'Indian Literature, Poetry, Classic',
        'Notes': '“मदिरालय जाने को घर से चलता है पीनेवाला...” Timeless metaphorical verses on life.',
        'Favorite': 'Yes'
      },
      {
        'Book Title': 'Dune',
        'Author Name': 'Frank Herbert',
        'Category': 'Science Fiction',
        'Language': 'English',
        'Status': 'Not Started',
        'Progress': 0,
        'Tags': 'Sci-Fi, Epic, Space Opera',
        'Notes': 'Recommended sci-fi masterpiece set in the desert planet Arrakis.',
        'Favorite': 'No'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    // Set column widths
    worksheet['!cols'] = [
      { wch: 25 }, // Title
      { wch: 22 }, // Author
      { wch: 16 }, // Category
      { wch: 12 }, // Language
      { wch: 14 }, // Status
      { wch: 10 }, // Progress
      { wch: 30 }, // Tags
      { wch: 45 }, // Notes
      { wch: 10 }  // Favorite
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Books_Template');
    XLSX.writeFile(workbook, 'My_Library_Books_Template.xlsx');
    showSuccess('Sample Excel template downloaded!');
  };

  // Process Excel / CSV file
  const handleFile = async (uploadedFile) => {
    if (!uploadedFile) return;

    const fileExt = uploadedFile.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(fileExt)) {
      showError('Please upload a valid Excel (.xlsx, .xls) or CSV (.csv) file');
      return;
    }

    setFile(uploadedFile);

    try {
      const data = await uploadedFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (rawJson.length === 0) {
        showError('The uploaded sheet is empty');
        setParsedRows([]);
        return;
      }

      // Map raw rows to normalized format
      const normalized = rawJson.map((row, index) => {
        const title = row['Book Title'] || row.Title || row['title'] || row['Book Name'] || row.name || '';
        const author = row['Author Name'] || row.Author || row['author'] || row.Writer || '';
        const category = row.Category || row.category || row.Genre || 'Fiction';
        const language = row.Language || row.language || 'English';
        const status = row.Status || row.status || 'Not Started';
        const progress = row.Progress !== undefined ? row.Progress : (status === 'Finished' ? 100 : 0);
        const tags = row.Tags || row.tags || '';
        const notes = row.Notes || row.notes || row.Review || '';
        const isFavourite = row.Favorite || row.Favourite || row.isFavourite || row.isFavorite || false;

        const isValid = Boolean(String(title).trim() && String(author).trim());

        return {
          rowNum: index + 1,
          title: String(title).trim(),
          author: String(author).trim(),
          category: String(category).trim() || 'Fiction',
          language: String(language).trim() || 'English',
          status: String(status).trim() || 'Not Started',
          progress: Number(progress) || 0,
          tags: typeof tags === 'string' ? tags.split(/[,;|]/).map(t => t.trim()).filter(Boolean) : [],
          notes: String(notes).trim(),
          isFavourite: isFavourite === true || isFavourite === 'Yes' || isFavourite === 'yes' || isFavourite === 'true' || isFavourite === 1,
          isValid
        };
      });

      setParsedRows(normalized);
      showSuccess(`Parsed ${normalized.length} rows from ${uploadedFile.name}`);
    } catch (err) {
      console.error('Error parsing sheet:', err);
      showError('Failed to parse Excel file. Please ensure it is a valid spreadsheet.');
      setParsedRows([]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleReset = () => {
    setFile(null);
    setParsedRows([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportSubmit = async () => {
    const validBooks = parsedRows.filter((r) => r.isValid);
    if (validBooks.length === 0) {
      showError('No valid books to import. Every book requires at least a Title and Author.');
      return;
    }

    setLoading(true);
    try {
      await importBulkBooks(validBooks);
      onClose();
      handleReset();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const invalidCount = parsedRows.length - validCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl my-8 animate-slide-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-parchment-200 dark:border-ink-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-ink-900 dark:text-ink-50">
                Batch Import Books from Excel / CSV
              </h2>
              <p className="text-xs text-ink-500 dark:text-ink-400">
                Quickly populate multiple books into your personal sanctuary
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {/* Download Template Banner */}
          <div className="p-4 rounded-2xl bg-parchment-100/70 dark:bg-ink-800/60 border border-parchment-200 dark:border-ink-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white dark:bg-ink-900 text-forest-700 dark:text-forest-400 shadow-xs">
                <Download className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-ink-900 dark:text-ink-100 block">
                  Need the Excel format template?
                </span>
                <span className="text-ink-500 dark:text-ink-400">
                  Includes sample columns for Title, Author, Category, Status, Progress, and Notes.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-ink-900 border border-parchment-300 dark:border-ink-700 text-xs font-semibold text-ink-800 dark:text-ink-200 hover:bg-parchment-50 dark:hover:bg-ink-800 shadow-xs transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Template (.xlsx)</span>
            </button>
          </div>

          {/* Upload Drop Area */}
          {!file ? (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                accept=".xlsx,.xls,.csv"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`cursor-pointer border-2 border-dashed rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center transition-all ${
                  isDragging
                    ? 'border-forest-500 bg-forest-50/60 dark:bg-forest-950/40'
                    : 'border-parchment-300 dark:border-ink-700 hover:border-forest-500/60 bg-parchment-50/50 dark:bg-ink-900/30'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-forest-100 dark:bg-forest-950/80 text-forest-700 dark:text-forest-400 flex items-center justify-center mb-3 shadow-xs">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-base text-ink-900 dark:text-ink-50 mb-1">
                  Upload Excel Sheet or CSV
                </h3>
                <p className="text-xs text-ink-500 dark:text-ink-400 max-w-sm mb-3">
                  Drag & drop your <strong>.xlsx</strong>, <strong>.xls</strong>, or <strong>.csv</strong> spreadsheet here, or click to browse.
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-forest-700 dark:text-forest-400 bg-forest-100 dark:bg-forest-950 px-3 py-1 rounded-full border border-forest-200 dark:border-forest-800">
                  Multiple books supported at once
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info Bar */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-ink-800/80 border border-parchment-200 dark:border-ink-700 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-forest-100 dark:bg-forest-950/60 text-forest-700 dark:text-forest-400">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-ink-900 dark:text-ink-50 truncate">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-ink-500 dark:text-ink-400">
                      {(file.size / 1024).toFixed(1)} KB • {validCount} valid books
                      {invalidCount > 0 && ` • ${invalidCount} skipped (missing title/author)`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2 rounded-xl text-ink-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Preview Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                    Import Preview ({parsedRows.length} rows detected)
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {validCount} ready
                    </span>
                    {invalidCount > 0 && (
                      <span className="flex items-center gap-1 text-rose-500 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {invalidCount} incomplete
                      </span>
                    )}
                  </div>
                </div>

                <div className="border border-parchment-200 dark:border-ink-800 rounded-2xl overflow-hidden shadow-xs bg-white dark:bg-ink-900 max-h-64 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-parchment-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 font-semibold border-b border-parchment-200 dark:border-ink-700">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Title</th>
                        <th className="py-2.5 px-3">Author</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Progress</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-parchment-100 dark:divide-ink-800">
                      {parsedRows.map((row) => (
                        <tr
                          key={row.rowNum}
                          className={row.isValid ? 'hover:bg-parchment-50/50 dark:hover:bg-ink-800/40' : 'bg-rose-50/40 dark:bg-rose-950/20'}
                        >
                          <td className="py-2.5 px-3 text-ink-400 font-mono">{row.rowNum}</td>
                          <td className="py-2.5 px-3 font-serif font-semibold text-ink-900 dark:text-ink-50 max-w-[150px] truncate">
                            {row.title || <span className="text-rose-500 italic">Missing</span>}
                          </td>
                          <td className="py-2.5 px-3 text-ink-600 dark:text-ink-300 max-w-[120px] truncate">
                            {row.author || <span className="text-rose-500 italic">Missing</span>}
                          </td>
                          <td className="py-2.5 px-3 text-ink-500 dark:text-ink-400 truncate">
                            {row.category}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-parchment-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border border-parchment-200 dark:border-ink-700">
                              {row.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono font-medium text-ink-700 dark:text-ink-300">
                            {row.progress}%
                          </td>
                          <td className="py-2.5 px-3">
                            {row.isValid ? (
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                Ready
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-rose-500">
                                Invalid
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-parchment-200 dark:border-ink-800 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-ink-600 dark:text-ink-400 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors"
          >
            Cancel
          </button>

          {file && (
            <button
              type="button"
              disabled={loading || validCount === 0}
              onClick={handleImportSubmit}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-parchment-50 bg-forest-800 hover:bg-forest-700 shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Importing Books...</span>
                </>
              ) : (
                <>
                  <span>Import {validCount} {validCount === 1 ? 'Book' : 'Books'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
