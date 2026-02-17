"use client";
import React, { useState } from "react";
import { useAddProductMutation } from "@/redux/product/productApi";
import { notifyError, notifySuccess } from "@/utils/toast";
import * as XLSX from "xlsx";

const BulkProductUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [addProduct] = useAddProductMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
      
      if (fileExtension === "csv" || fileExtension === "xlsx" || fileExtension === "xls") {
        setFile(selectedFile);
      } else {
        notifyError("Please upload a CSV or Excel file (.csv, .xlsx, .xls)");
      }
    }
  };

  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());
    const products = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(",").map((v) => v.trim());
      if (values.length !== headers.length) continue;

      const product: any = {};
      headers.forEach((header, index) => {
        product[header] = values[index] || "";
      });
      products.push(product);
    }

    return products;
  };

  const parseExcel = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const mapProductData = (row: any) => {
    // Map CSV/Excel columns to product data structure
    // Adjust column names based on your CSV structure
    return {
      sku: row.SKU || row.sku || "",
      img: row.Image || row.image || row.Img || "",
      title: row.Title || row.title || row.Name || row.name || "",
      unit: row.Unit || row.unit || "pcs",
      parent: row.Parent || row.parent || row.Category || row.category || "",
      children: row.Children || row.children || row.SubCategory || row.subcategory || "",
      price: parseFloat(row.Price || row.price || 0),
      discount: parseFloat(row.Discount || row.discount || 0),
      quantity: parseInt(row.Quantity || row.quantity || 0),
      brand: {
        name: row.Brand || row.brand || "",
        id: row.BrandId || row.brandId || "",
      },
      category: {
        name: row.Category || row.category || "",
        id: row.CategoryId || row.categoryId || "",
      },
      status: row.Status || row.status || "in-stock",
      productType: row.ProductType || row.productType || row.Type || row.type || "",
      description: row.Description || row.description || "",
      videoId: row.VideoId || row.videoId || "",
      tags: row.Tags || row.tags ? (typeof row.Tags === "string" ? row.Tags.split(",").map((t: string) => t.trim()) : row.Tags) : [],
      imageURLs: [],
    };
  };

  const handleBulkUpload = async () => {
    if (!file) {
      notifyError("Please select a file first");
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      let products: any[] = [];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (fileExtension === "csv") {
        const text = await file.text();
        const parsed = parseCSV(text);
        products = parsed.map(mapProductData);
      } else if (fileExtension === "xlsx" || fileExtension === "xls") {
        const parsed = await parseExcel(file);
        products = parsed.map(mapProductData);
      } else {
        notifyError("Unsupported file format");
        setIsProcessing(false);
        return;
      }

      if (products.length === 0) {
        notifyError("No products found in the file");
        setIsProcessing(false);
        return;
      }

      // Validate required fields
      const invalidProducts = products.filter(
        (p) => !p.title || !p.img || !p.price || !p.category.name
      );

      if (invalidProducts.length > 0) {
        notifyError(
          `${invalidProducts.length} product(s) are missing required fields (title, image, price, or category)`
        );
        setIsProcessing(false);
        return;
      }

      // Upload products one by one
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < products.length; i++) {
        try {
          const res = await addProduct(products[i]);
          if ("error" in res) {
            errorCount++;
            console.error(`Error uploading product ${i + 1}:`, res.error);
          } else {
            successCount++;
          }
          setUploadProgress(Math.round(((i + 1) / products.length) * 100));
        } catch (error) {
          errorCount++;
          console.error(`Error uploading product ${i + 1}:`, error);
        }
      }

      if (successCount > 0) {
        notifySuccess(
          `Successfully uploaded ${successCount} product(s). ${errorCount > 0 ? `${errorCount} failed.` : ""}`
        );
      } else {
        notifyError("Failed to upload any products. Please check the file format and data.");
      }

      setFile(null);
    } catch (error: any) {
      console.error("Bulk upload error:", error);
      notifyError(error.message || "Failed to process file. Please check the format.");
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="bg-white px-8 py-8 rounded-md mb-6">
      <h4 className="text-[22px] mb-4">Bulk Product Upload</h4>
      <p className="text-base text-gray-600 mb-6">
        Upload products in bulk using a CSV or Excel file. Ensure your file includes the following columns:
        Title, Image (URL), Price, Category, Brand, SKU, Quantity, Unit, Description, etc.
      </p>

      <div className="mb-6">
        <label className="block text-base text-black mb-2">Select File (CSV/Excel)</label>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-theme file:text-white hover:file:bg-theme-dark cursor-pointer"
          disabled={isProcessing}
        />
        {file && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: <span className="font-medium">{file.name}</span>
          </p>
        )}
      </div>

      {isProcessing && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Processing...</span>
            <span className="text-sm font-medium">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-theme h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleBulkUpload}
        disabled={!file || isProcessing}
        className="tp-btn px-5 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? "Uploading..." : "Upload Products"}
      </button>

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <p className="text-sm font-medium text-black mb-2">CSV/Excel Format Guide:</p>
        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
          <li>Required columns: Title, Image (URL), Price, Category, CategoryId</li>
          <li>Optional columns: SKU, Brand, BrandId, Quantity, Unit, Description, Discount, Tags, Status, ProductType</li>
          <li>For tags, use comma-separated values</li>
          <li>Ensure image URLs are valid and accessible</li>
        </ul>
      </div>
    </div>
  );
};

export default BulkProductUpload;
