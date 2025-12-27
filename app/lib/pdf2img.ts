"use client";

export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    if (typeof window === "undefined") {
        return { imageUrl: "", file: null, error: "SSR environment" };
    }

    try {
        const pdfjsLib = await import("pdfjs-dist");
        const worker = await import(
            "pdfjs-dist/build/pdf.worker.min.mjs?url"
        );

        pdfjsLib.GlobalWorkerOptions.workerSrc = worker.default;

        const buffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return { imageUrl: "", file: null, error: "Canvas unavailable" };
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvas,
            canvasContext: ctx,
            viewport,
        }).promise;

        return await new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    resolve({ imageUrl: "", file: null, error: "Blob failed" });
                    return;
                }

                const imageFile = new File(
                    [blob],
                    file.name.replace(/\.pdf$/i, ".png"),
                    { type: "image/png" }
                );

                resolve({
                    imageUrl: URL.createObjectURL(blob),
                    file: imageFile,
                });
            });
        });
    } catch (err) {
        console.error("PDF conversion error:", err);
        return { imageUrl: "", file: null, error: "Conversion failed" };
    }
}
