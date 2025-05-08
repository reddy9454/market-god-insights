import React, { useState } from "react";
import { toast } from "sonner";
import { Upload, X, FileText, CheckCircle, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface UploadSectionProps {
  onFileUploaded: (data: any) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onFileUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const fileType = file.name.split('.').pop()?.toLowerCase();
    const supportedFormats = ['csv', 'xlsx', 'xls', 'pdf', 'doc', 'docx', 'txt', 'json'];
    
    if (!supportedFormats.includes(fileType || '')) {
      toast.error("Unsupported file format. Please upload a CSV, Excel, PDF, Word, or text file.");
      return;
    }
    
    setFile(file);
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          processFile(file);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };
  
  const processFile = (file: File) => {
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    // Enhanced file processing with more detailed mock data
    setTimeout(() => {
      let mockData;
      const currentDate = new Date();
      let dates = [];
      
      // Generate dates for the past 30 days
      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(currentDate.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }
      
      // Generate enhanced mock data based on file type
      if (fileType === 'csv' || fileType === 'xlsx' || fileType === 'xls') {
        // More detailed stock data with all OHLCV fields
        mockData = {
          stockName: file.name.split('.')[0].replace(/[_-]/g, ' '),
          ticker: file.name.split('.')[0].slice(0, 4).toUpperCase(),
          dataType: 'marketData',
          data: dates.map((date, i) => {
            const base = 150 + Math.sin(i / 5) * 10 + (i / 30) * 15;
            const open = base - 2 + Math.random() * 4;
            const close = base - 2 + Math.random() * 4;
            const high = Math.max(open, close) + Math.random() * 2;
            const low = Math.min(open, close) - Math.random() * 2;
            const volume = Math.floor(500000 + Math.random() * 500000);
            
            return {
              date,
              open: parseFloat(open.toFixed(2)),
              high: parseFloat(high.toFixed(2)),
              low: parseFloat(low.toFixed(2)),
              close: parseFloat(close.toFixed(2)),
              volume
            };
          })
        };
      } else {
        // Enhanced document analysis data with sentiment scores
        mockData = {
          stockName: file.name.split('.')[0].replace(/[_-]/g, ' '),
          ticker: file.name.split('.')[0].slice(0, 4).toUpperCase(),
          dataType: 'documentAnalysis',
          source: file.name,
          data: dates.slice(-7).map((date, i) => {
            return {
              date,
              sentiment: parseFloat((0.6 + Math.random() * 0.4).toFixed(2)),
              confidence: parseFloat((0.7 + Math.random() * 0.3).toFixed(2)),
              keywords: ['growth', 'investment', 'profit', 'strategy', 'market'].slice(0, 3 + Math.floor(Math.random() * 3))
            };
          }),
          // Add mock fundamental data for document analysis
          fundamentalData: {
            pe: parseFloat((15 + Math.random() * 10).toFixed(2)),
            eps: parseFloat((2.5 + Math.random() * 2).toFixed(2)),
            roe: parseFloat((0.1 + Math.random() * 0.1).toFixed(2)),
            debtToEquity: parseFloat((0.5 + Math.random() * 0.5).toFixed(2)),
            currentRatio: parseFloat((1.5 + Math.random() * 0.5).toFixed(2)),
            quickRatio: parseFloat((1.0 + Math.random() * 0.5).toFixed(2)),
            profitMargin: parseFloat((0.08 + Math.random() * 0.08).toFixed(2)),
            dividendYield: parseFloat((0.01 + Math.random() * 0.04).toFixed(2))
          }
        };
      }
      
      setIsUploading(false);
      setIsUploaded(true);
      
      // Pass the enhanced data to parent component and display success message
      onFileUploaded(mockData);
      toast.success(`Analysis of ${file.name} completed successfully`, {
        description: "Insights and recommendations are now available below."
      });
      
    }, 1000);
  };

  const getFileTypeLabel = (fileType?: string): string => {
    switch(fileType) {
      case 'pdf': return 'PDF Document';
      case 'doc':
      case 'docx': return 'Word Document';
      case 'csv': return 'CSV File';
      case 'xlsx':
      case 'xls': return 'Excel File';
      case 'txt': return 'Text File';
      case 'json': return 'JSON File';
      default: return 'File';
    }
  };

  const getFileIcon = (fileType?: string) => {
    switch(fileType) {
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
        return <FileText className="h-8 w-8 text-market-primary mr-3" />;
      default:
        return <FileIcon className="h-8 w-8 text-market-primary mr-3" />;
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setIsUploaded(false);
    setIsUploading(false);
    setUploadProgress(0);
  };

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-market-primary mb-4">Upload Data for Analysis</h2>
        
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging 
              ? "border-market-accent bg-market-accent/5" 
              : isUploaded 
                ? "border-market-success bg-market-success/5" 
                : "border-gray-300 hover:border-market-accent"
          }`}
        >
          {!file ? (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Drop your file here</h3>
              <p className="text-sm text-gray-500 mb-4">
                Supported formats: CSV, Excel (.xlsx, .xls), PDF, Word (.doc, .docx), Text (.txt)
              </p>
              <Button 
                variant="outline" 
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                Browse Files
              </Button>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.xls,.pdf,.doc,.docx,.txt,.json"
                onChange={handleFileInput}
              />
            </>
          ) : (
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getFileIcon(file.name.split('.').pop()?.toLowerCase())}
                  <div className="text-left">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                
                {isUploaded ? (
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-market-success mr-2" />
                    <span className="text-market-success">Analysis Complete</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleRemoveFile}
                      className="ml-4"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {isUploading && (
                <div className="mt-4 w-full">
                  <Progress 
                    value={uploadProgress} 
                    className="h-2 w-full"
                    indicatorClassName="bg-market-accent"
                  />
                  <p className="text-sm text-gray-500 mt-1">Processing... {uploadProgress}%</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>For best results, ensure your files include:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Stock price history in spreadsheets (CSV, Excel)</li>
            <li>Annual reports or financial statements in documents (PDF, Word)</li>
            <li>Analyst reports or research papers</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadSection;
