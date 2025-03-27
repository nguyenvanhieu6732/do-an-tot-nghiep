"use client"

import { useState } from "react"
import Image from "next/image"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function InputFile() {
  const [selectedFile, setSelectedFile] = useState<string | ArrayBuffer | null>(null)

  const handleFileChange = (e : any) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedFile(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Hình ảnh</Label>
      <Input id="picture" type="file" onChange={handleFileChange} />
      {selectedFile && (
        <div className="mt-2">
          <Image
            src={typeof selectedFile === "string" ? selectedFile : ""}
            alt="Preview"
            className="rounded-md"
            width={100}
            height={100}
          />
        </div>
      )}
    </div>
  )
}