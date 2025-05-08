
import React, { useState } from "react";
import { toast } from "sonner";
import { Upload, X, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface UploadSectionProps {
  onFileUploaded: (data: any) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onFileUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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
    
    if (fileType !== 'csv' && fileType !== 'xlsx' && fileType !== 'xls') {
      toast.error("Please upload a CSV or Excel file");
      return;
    }
    
    setFile(file);
    
    // Mock file processing - in a real app, you'd parse the file here
    setTimeout(() => {
      // Mock data for demonstration
      const mockData = {
        stockName: "Sample Stock",
        ticker: "SMPL",
        data: [
          { date: '2023-01-01', close: 150.25 },
          { date: '2023-01-02', close: 152.30 },
          { date: '2023-01-03', close: 148.75 },
          { date: '2023-01-04', close: 155.20 },
          { date: '2023-01-05', close: 153.50 },
        ]
      };
      
      setIsUploaded(true);
      onFileUploaded(mockData);
      toast.success("File processed successfully");
    }, 1500);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setIsUploaded(false);
  };

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-market-primary mb-4">Upload Stock Data</h2>
        
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
                Supported formats: CSV, Excel (.xlsx, .xls)
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
                accept=".csv,.xlsx,.xls"
                onChange={handleFileInput}
              />
            </>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-market-primary mr-3" />
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
                  <span className="text-market-success">Processed</span>
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
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>For best results, ensure your file includes:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Stock price history (Open, High, Low, Close)</li>
            <li>Trading volume</li>
            <li>Financial ratios (if available)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadSection;
