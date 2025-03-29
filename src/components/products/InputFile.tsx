"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

interface InputFileProps {
  onFileChange: (fileData: string | null) => void;
  disabled?: boolean; // Thêm prop disabled
}

export default function InputFile({ onFileChange, disabled = false }: InputFileProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return; // Ngăn xử lý nếu bị vô hiệu hóa
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file hình ảnh!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedFile(result);
        onFileChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Input
        id="picture"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
      />
      {selectedFile && (
        <div className="mt-2">
          <Image
            src={selectedFile}
            alt="Preview"
            className="rounded-md"
            width={75}
            height={75}
          />
        </div>
      )}
    </div>
  );
}