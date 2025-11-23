'use client';

import { useState } from 'react';
// @ts-ignore
import ImageTracer from 'imagetracerjs';

export default function Page() {
  const [svgContent, setSvgContent] = useState<string>('');

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
  };

  const processImage = (file: File) => {
    console.log('Processing image');
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log('Reader onload');
      const img = new Image();
      img.onload = () => {
        console.log('Image loaded');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          console.log('ImageData created');
          
          // Convert to SVG using imagetracerjs
          const svgString = ImageTracer.imagedataToSVG(imageData, {
            // Options for imagetracerjs
            ltres: 1,
            qtres: 1,
            pathomit: 8,
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
            viewbox: false,
            desc: false,
            id: false,
          });
          console.log('SVG string:', svgString);

          // Now, modify the SVG to add layers
          const modifiedSvg = modifySvg(svgString, imageData.width, imageData.height);
          console.log('Modified SVG:', modifiedSvg);
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
    console.log('Download clicked');
    if (svgContent) {
      console.log('SVG content exists, length:', svgContent.length);
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      console.log('Blob URL:', url);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'symbol.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log('Download initiated');
    } else {
      console.log('No SVG content');
    }
  };

  const modifySvg = (svgString: string, width: number, height: number): string => {
    // Extract the path d
    const pathMatch = svgString.match(/<path ([^>]*)d="([^"]*)"([^>]*)\/>/);
    if (!pathMatch) return svgString;
    const d = pathMatch[2];
    // Extract the first subpath for the base (outer shape)
    const firstZIndex = d.indexOf('Z');
    const firstSubpath = firstZIndex !== -1 ? d.substring(0, firstZIndex + 1) : d;
    // Replace the path with groups
    const newSvg = svgString.replace(/<path [^>]*\/>/, `<g id="etc_symbol_base"><path fill="white" d="${firstSubpath}"/></g><g id="etc_symbol_outline"><path fill="none" stroke="black" stroke-width="1" d="${d}"/></g>`);
    // Set viewBox
    const withViewBox = newSvg.replace(/<svg ([^>]*)>/, `<svg $1 viewBox="0 0 ${width} ${height}">`);
    return withViewBox;
  };

  return (
    <div 
      className="flex h-svh w-screen items-center content-center border-2 border-dashed border-gray-400 flex-col"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {svgContent ? (
        <>
          <button onClick={downloadSvg} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
            Download SVG
          </button>
          <div dangerouslySetInnerHTML={{ __html: svgContent }} />
        </>
      ) : (
        <div>Drop a PNG image here</div>
      )}
    </div>
  );
}