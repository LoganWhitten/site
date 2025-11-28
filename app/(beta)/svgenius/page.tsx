'use client';

import { useState, useRef } from 'react';
// @ts-expect-error: imagetracerjs has no TypeScript types
import ImageTracer from 'imagetracerjs';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export default function Page() {
  const [svgContent, setSvgContent] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log('Drop event fired');
    const files = e.dataTransfer.files;
    console.log('Files:', files);
    if (files.length > 0) {
      const file = files[0];
      console.log('File type:', file.type);
      if (file.type === 'image/png') {
        processImage(file);
      } else {
        console.log('Not a PNG file');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'image/png') {
        processImage(file);
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const processImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          // Threshold to black and white
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i+1], b = data[i+2];
            const gray = (r + g + b) / 3;
            if (gray < 128) {
              data[i] = 0;
              data[i+1] = 0;
              data[i+2] = 0;
            } else {
              data[i] = 255;
              data[i+1] = 255;
              data[i+2] = 255;
            }
          }
          ctx.putImageData(imageData, 0, 0);
          const processedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
          // Convert to SVG using imagetracerjs
          const svgString = ImageTracer.imagedataToSVG(processedImageData, {
            // Options for imagetracerjs
            ltres: 0.5,
            qtres: 0.5,
            pathomit: 0,
            rightangleenhance: true,
            colorsampling: 0,
            numberofcolors: 2,
            mincolorratio: 0,
            colorquantcycles: 1,
            pal: [{r:0,g:0,b:0,a:255}, {r:255,g:255,b:255,a:255}],
            layercontainerid: '',
            linefilter: false,
            scale: 1,
            roundcoords: 1,
            viewbox: true,
            desc: false,
            id: false,
          });

          // Now, modify the SVG to add layers
          const modifiedSvg = modifySvg(svgString);
          setSvgContent(modifiedSvg);
        } else {
          console.log('No 2d context');
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const downloadSvg = () => {
    if (svgContent) {
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'symbol.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const modifySvg = (svgString: string): string => {
    // Wrap the content in groups
    let newSvg = svgString.replace(/<svg([^>]*)>/, `<svg$1><g id="etc_symbol_base"><rect width="100%" height="100%" fill="white"/></g><g id="etc_symbol_outline">`);
    newSvg = newSvg.replace(/<\/svg>/, '</g></svg>');
    // Modify path attributes
    newSvg = newSvg.replace(/fill="[^"]*"/g, 'fill="none"');
    newSvg = newSvg.replace(/stroke="[^"]*"/g, 'stroke="black"');
    newSvg = newSvg.replace(/stroke-width="[^"]*"/g, 'stroke-width="12"');
    return newSvg;
  };

  return (
    <div className="light min-h-svh bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">SVGenius</h1>
          <p className="text-lg text-muted-foreground">
            An easier way to turn a screenshot into an EOS importable SVG.
          </p>
        </div>

        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {svgContent ? (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">Preview:</div>
                <div className="flex justify-center">
                  <div
                    className="border rounded p-4 bg-white"
                    style={{ maxWidth: '500px', maxHeight: '500px', overflow: 'auto' }}
                  />
                </div>
                <Button onClick={downloadSvg} size="lg">
                  Download SVG
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-6xl w-full flex place-content-center"><Upload /> </div>
                <div>
                  <p className="text-lg font-medium">Drop your PNG here</p>
                  <p className="text-sm text-muted-foreground">
                    Or click the button below to select a file
                  </p>
                </div>
                <Button onClick={openFileDialog} variant="outline" size="lg">
                  Choose PNG File
                </Button>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}