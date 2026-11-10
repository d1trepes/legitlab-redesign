// Фото заявок: проверка файла, пересборка через canvas (убирает EXIF и геометки), хранение в IndexedDB.

const DB = "legitlab-photos";
const STORE = "photos";
export const MAX_BYTES = 15 * 1024 * 1024;
export const MIN_SIDE = 600;
const MAX_SIDE = 1600;

function open(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((res, rej) => {
    const t = db.transaction(STORE, mode);
    const r = fn(t.objectStore(STORE));
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
    t.oncomplete = () => db.close();
  });
}
export const putPhoto = (id: string, blob: Blob) => tx("readwrite", (s) => s.put(blob, id));
export const getPhoto = (id: string) => tx<Blob | undefined>("readonly", (s) => s.get(id));
export const deletePhoto = (id: string) => tx("readwrite", (s) => s.delete(id));
export const clearPhotos = () => tx("readwrite", (s) => s.clear());

async function sniff(file: File): Promise<"jpeg" | "png" | "webp" | "heic" | null> {
  const b = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png";
  const str = String.fromCharCode(...b);
  if (str.startsWith("RIFF") && str.slice(8, 12) === "WEBP") return "webp";
  if (str.slice(4, 8) === "ftyp" && /hei|mif1|msf1/.test(str.slice(8, 12))) return "heic";
  return null;
}

export type Prepared = { ok: true; blob: Blob; width: number; height: number } | { ok: false; error: string };

/** Проверяет файл по содержимому (а не по расширению) и возвращает очищенный JPEG. */
export async function preparePhoto(file: File): Promise<Prepared> {
  if (file.size > MAX_BYTES) return { ok: false, error: `Файл больше 15 МБ (${(file.size / 1048576).toFixed(1)} МБ). Сожми фото или сними заново.` };
  const kind = await sniff(file);
  if (kind === "heic") return { ok: false, error: "HEIC пока не поддерживается. На iPhone выбери «Наиболее совместимый» формат камеры или отправь снимок экрана." };
  if (!kind) return { ok: false, error: "Это не фото. Подойдут JPG, PNG и WebP." };
  let bmp: ImageBitmap;
  try {
    bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return { ok: false, error: "Файл повреждён и не открывается. Попробуй другое фото." };
  }
  if (Math.min(bmp.width, bmp.height) < MIN_SIDE) {
    const size = `${bmp.width}×${bmp.height}`;
    bmp.close();
    return { ok: false, error: `Фото слишком маленькое: ${size}. Нужно от ${MIN_SIDE} px по короткой стороне, иначе детали не разобрать.` };
  }
  const k = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * k);
  const h = Math.round(bmp.height * k);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.86));
  if (!blob) return { ok: false, error: "Не получилось обработать фото. Попробуй другое." };
  return { ok: true, blob, width: w, height: h };
}
