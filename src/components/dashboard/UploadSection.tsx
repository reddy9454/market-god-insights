
import React, { useState } from "react";
import { toast } from "sonner";
import { Upload, X, FileText, CheckCircle, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ensureValidData } from "@/utils/dataHelpers";

interface UploadSectionProps {
  onFileUploaded: (data: any) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onFileUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [dataType, setDataType] = useState<'market' | 'document'>('market');

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
    
    // Auto-detect file type
    if (['csv', 'xlsx', 'xls'].includes(fileType || '')) {
      setDataType('market');
    } else {
      setDataType('document');
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
    }, 200); // Faster upload simulation
  };
  
  const processFile = (file: File) => {
    const fileType = file.name.split('.').pop()?.toLowerCase();
    const selectedDataType = dataType;
    
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
      
      // Generate enhanced mock data based on data type
      if (selectedDataType === 'market' || fileType === 'csv' || fileType === 'xlsx' || fileType === 'xls' || fileType === 'json') {
        // Generate more realistic stock data with trends
        const startPrice = 100 + Math.random() * 100;
        let currentPrice = startPrice;
        const trend = Math.random() > 0.5 ? 1 : -1; // Upward or downward trend
        const volatility = 0.02 + Math.random() * 0.03; // Daily volatility between 2-5%
        
        mockData = {
          stockName: file.name.split('.')[0].replace(/[_-]/g, ' '),
          ticker: file.name.split('.')[0].slice(0, 4).toUpperCase(),
          dataType: 'marketData',
          data: dates.map((date, i) => {
            // Apply trend and random daily change
            const dailyChange = (trend * 0.003) + (Math.random() - 0.5) * volatility;
            currentPrice = currentPrice * (1 + dailyChange);
            
            const open = currentPrice * (1 + (Math.random() - 0.5) * 0.01);
            const close = currentPrice;
            const high = Math.max(open, close) * (1 + Math.random() * 0.01);
            const low = Math.min(open, close) * (1 - Math.random() * 0.01);
            const volume = Math.floor(300000 + Math.random() * 700000 + (i % 5 === 0 ? 500000 : 0));
            
            return {
              date,
              open: parseFloat(open.toFixed(2)),
              high: parseFloat(high.toFixed(2)),
              low: parseFloat(low.toFixed(2)),
              close: parseFloat(close.toFixed(2)),
              volume
            };
          }),
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
      } else {
        // For document analysis data including PDFs
        const sentimentTrend = Math.random() > 0.6 ? 'improving' : Math.random() > 0.5 ? 'declining' : 'stable';
        let currentSentiment = 0.4 + Math.random() * 0.3; // Start with 40-70% sentiment
        
        // Generate document specific title
        let docTitle = file.name.split('.')[0].replace(/[_-]/g, ' ');
        // For PDF files, add indicator that it's a PDF analysis
        if (fileType === 'pdf') {
          docTitle = `${docTitle} PDF Report Analysis`;
        }
        
        mockData = {
          stockName: docTitle,
          ticker: file.name.split('.')[0].slice(0, 4).toUpperCase(),
          dataType: 'documentAnalysis',
          source: file.name,
          fileType: fileType, // Store the file type for reference
          data: dates.slice(-10).map((date, i) => {
            // Apply sentiment trend
            if (sentimentTrend === 'improving') {
              currentSentiment = Math.min(0.9, currentSentiment + 0.03 + Math.random() * 0.02);
            } else if (sentimentTrend === 'declining') {
              currentSentiment = Math.max(0.2, currentSentiment - 0.02 - Math.random() * 0.02);
            } else {
              currentSentiment = currentSentiment + (Math.random() - 0.5) * 0.05;
              currentSentiment = Math.min(0.9, Math.max(0.3, currentSentiment));
            }
            
            // Add PDF specific keywords if it's a PDF file
            const allKeywords = [
              'growth', 'revenue', 'profit', 'loss', 'market', 'strategy',
              'investment', 'dividend', 'acquisition', 'debt', 'earnings',
              'forecast', 'competition', 'expansion', 'regulation', 'technology'
            ];
            
            // For PDF files, add some PDF-specific keywords
            if (fileType === 'pdf') {
              allKeywords.push('report', 'analysis', 'quarterly', 'annual', 'financial', 'statement');
            }
            
            // Select 2-4 random keywords
            const keywordCount = 2 + Math.floor(Math.random() * 3);
            const shuffled = [...allKeywords].sort(() => 0.5 - Math.random());
            const keywords = shuffled.slice(0, keywordCount);
            
            return {
              date,
              sentiment: parseFloat(currentSentiment.toFixed(2)),
              confidence: parseFloat((0.7 + Math.random() * 0.25).toFixed(2)),
              keywords,
              // For charting purposes, we need a close value
              close: parseFloat(currentSentiment.toFixed(2))
            };
          }),
          // Add mock fundamental data for document analysis
          fundamentalData: {
            pe: parseFloat((17 + Math.random() * 8).toFixed(2)),
            eps: parseFloat((3 + Math.random() * 1.5).toFixed(2)),
            roe: parseFloat((0.12 + Math.random() * 0.08).toFixed(2)),
            debtToEquity: parseFloat((0.6 + Math.random() * 0.4).toFixed(2)),
            currentRatio: parseFloat((1.6 + Math.random() * 0.4).toFixed(2)),
            quickRatio: parseFloat((1.1 + Math.random() * 0.4).toFixed(2)),
            profitMargin: parseFloat((0.09 + Math.random() * 0.06).toFixed(2)),
            dividendYield: parseFloat((0.02 + Math.random() * 0.03).toFixed(2))
          }
        };
      }
      
      // Ensure data is valid before passing it up
      if (mockData && mockData.data) {
        mockData.data = ensureValidData(mockData.data);
      }
      
      setIsUploading(false);
      setIsUploaded(true);
      
      // Pass the enhanced data to parent component and display success message
      onFileUploaded(mockData);
      toast.success(`Analysis of ${file.name} completed successfully`, {
        description: `${fileType?.toUpperCase()} analysis insights and recommendations are now available below.`
      });
      
    }, 800);
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
        return <FileText className="h-8 w-8 text-rose-600 mr-3" />; // Red icon for PDF
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
        
        {!file ? (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-2">Select data type:</p>
              <div className="flex space-x-2">
                <Button
                  variant={dataType === 'market' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDataType('market')}
                >
                  Market Data
                </Button>
                <Button
                  variant={dataType === 'document' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDataType('document')}
                >
                  Document Analysis
                </Button>
              </div>
            </div>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging 
                  ? "border-market-accent bg-market-accent/5" 
                  : "border-gray-300 hover:border-market-accent"
              }`}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Drop your file here</h3>
              <p className="text-sm text-gray-500 mb-4">
                {dataType === 'market' 
                  ? "Upload market data (CSV, Excel) for stock analysis" 
                  : "Upload documents (PDF, Word, Text) for sentiment analysis"}
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
                accept={dataType === 'market' 
                  ? ".csv,.xlsx,.xls,.json" 
                  : ".pdf,.doc,.docx,.txt"}
                onChange={handleFileInput}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getFileIcon(file.name.split('.').pop()?.toLowerCase())}
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {getFileTypeLabel(file.name.split('.').pop()?.toLowerCase())} • {(file.size / 1024).toFixed(2)} KB
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
        
        <div className="mt-6 text-sm text-gray-500">
          <h4 className="font-medium text-gray-700 mb-1">File type recommendations:</h4>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-24 font-medium">Market Data</span>
              <span>- CSV or Excel files with OHLCV data</span>
            </li>
            <li className="flex items-center">
              <span className="w-24 font-medium">Documents</span> 
              <span>- Annual reports, earnings calls, research papers (PDF/DOC)</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadSection;
