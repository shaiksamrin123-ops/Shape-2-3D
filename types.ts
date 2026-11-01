export type PageId =
  | 'home'
  | 'explore'
  | 'sketch'
  | 'upload'
  | 'text'
  | 'result'
  | 'history'
  | 'about';

export interface ModelCustomSettings {
  heightScale: number; // 0.5 to 2.5
  widthScale: number;  // 0.5 to 2.5
  color: string;       // hex e.g. #4f46e5
}

export interface GeneratedModel {
  id: string;
  name: string;
  inputType: 'sketch' | 'upload' | 'text';
  inputThumbnail: string; // Data URL of the sketch or uploaded image
  glbBlobUrl: string;
  glbArrayBuffer?: ArrayBuffer;
  createdAt: string;
  vertexCount: number;
  faceCount: number;
  fileSizeBytes: number;
  customSettings: ModelCustomSettings;
}

export interface HistoryItem {
  id: string;
  name: string;
  inputType: 'sketch' | 'upload' | 'text';
  inputThumbnail: string;
  createdAt: string;
  vertexCount: number;
  faceCount: number;
  fileSizeBytes: number;
  customSettings: ModelCustomSettings;
  // Serialized base64 or stored GLB data
  glbBase64?: string;
}
