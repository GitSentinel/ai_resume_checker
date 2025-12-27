export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfLib: any;
let pendingLoad: Promise<any> | null = null;

const getPdfLib = async (): Promise<any> => {
    if (pdfLib) return pdfLib;
    if (!pendingLoad) {
        // @ts-expect-error
        pendingLoad = import("pdfjs-dist/build/pdf.mjs").then((m) => {
            m.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
            pdfLib = m;
            return m;
        });
    }
    return pendingLoad;
};

const renderFirstPage = async (
    lib: any,
    buffer: ArrayBuffer,
    scale: number
): Promise<HTMLCanvasElement> => {
    const doc = await lib.getDocument({ data: buffer }).promise;
    const page = await doc.getPage(1);

    const view = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    canvas.width = view.width;
    canvas.height = view.height;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    await page.render({ canvasContext: ctx, viewport: view }).promise;
    return canvas;
};

const canvasToResult = (
    canvas: HTMLCanvasElement,
    source: File
): Promise<PdfConversionResult> =>
    new Promise((resolve) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    resolve({
                        imageUrl: "",
                        file: null,
                        error: "Image generation failed",
                    });
                    return;
                }

                const baseName = source.name.replace(/\.pdf$/i, "");
                const output = new File([blob], `${baseName}.png`, {
                    type: "image/png",
                });

                resolve({
                    imageUrl: URL.createObjectURL(blob),
                    file: output,
                });
            },
            "image/png",
            1
        );
    });

export const convertPdfToImage = async (
    file: File
): Promise<PdfConversionResult> => {
    try {
        const lib = await getPdfLib();
        const buffer = await file.arrayBuffer();
        const canvas = await renderFirstPage(lib, buffer, 4);
        return await canvasToResult(canvas, file);
    } catch (e) {
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${e}`,
        };
    }
};
