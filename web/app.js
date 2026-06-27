const SERVICE_UUID = "7369666c-695f-7364-0000-000000000000";
const DATA_CHARACTERISTIC_UUID = "7369666c-695f-7364-0002-000000000000";
const alternateUuid = (uuid) => {
  const hex = String(uuid || "").replace(/-/g, "").toLowerCase();
  if (hex.length !== 32) return uuid;
  const reversed = hex.match(/../g).reverse().join("");
  return `${reversed.slice(0, 8)}-${reversed.slice(8, 12)}-${reversed.slice(12, 16)}-${reversed.slice(16, 20)}-${reversed.slice(20)}`;
};
const SERVICE_UUIDS = Array.from(new Set([SERVICE_UUID, alternateUuid(SERVICE_UUID)]));
const DATA_CHARACTERISTIC_UUIDS = Array.from(new Set([DATA_CHARACTERISTIC_UUID, alternateUuid(DATA_CHARACTERISTIC_UUID)]));
const CATEGORY = { OTA: 1, FILE: 4, CONTROL: 31 };
const CONTROL_COMMAND = {
  SET_CARD_INFO: 14,
  RESP_CARD_INFO: 15,
  READ_CARD_INFO: 16,
  RESP_READ_CARD: 17,
  GET_SERIAL_NUMBER: 18,
  GET_VERSION: 20,
  GET_BATTERY: 22,
  CONTROL_INFO: 24,
  CONTROL_INFO_RESPONSE: 25,
  GET_FS_INFO: 32,
  GET_FS_INFO_RESPONSE: 33,
  SET_TAGS: 34,
  RESP_TAGS: 35,
  READ_CARDS_COUNT: 36,
  RESP_CARDS_COUNT: 37,
  READ_CARD_BY_ID: 38,
  RESP_CARD_BY_ID: 39,
  DELETE_CARD: 40,
  RESP_DELETE_CARD: 41,
  SET_CAROUSEL: 42,
  RESP_CAROUSEL: 43,
  READ_CAROUSEL: 44,
  RESP_CAROUSEL_RD: 45
};
const FILE_COMMAND = {
  START_REQUEST: 0,
  START_RESPONSE: 1,
  FILE_SEND_START_REQUEST: 2,
  FILE_SEND_START_RESPONSE: 3,
  FILE_SEND_DATA_REQUEST: 4,
  FILE_SEND_DATA_RESPONSE: 5,
  FILE_SEND_END_REQUEST: 6,
  FILE_SEND_END_RESPONSE: 7,
  END_REQUEST: 8,
  END_RESPONSE: 9,
  FILE_INFO_REQUEST: 13,
  FILE_INFO_RESPONSE: 14
};
const SIFLI_OTA_COMMAND = {
  IMAGE_PACKAGE_START_REQUEST: 38,
  IMAGE_PACKAGE_START_RESPONSE: 39,
  IMAGE_PACKAGE_PACKET_REQUEST: 40,
  IMAGE_PACKAGE_PACKET_RESPONSE: 41,
  IMAGE_PACKAGE_END_REQUEST: 42,
  IMAGE_PACKAGE_END_RESPONSE: 43
};
const FILE_TYPE = { RESOURCE: 1, IP: 2, PURCHASE: 3, UI: 4 };
const OTA_PACKAGE_PACKET_BYTES = 2048;
const FIRMWARE_MIN_BYTES = 64 * 1024;
const FIRMWARE_MAX_BYTES = 8 * 1024 * 1024;
const CARD_INFO_MAX_BYTES = 319;
const TAGS_MAX_COUNT = 5;
const CONTROL_INFO_BYTES = 8;
const FILE_TRANSFER_FREE_MARGIN_BYTES = 50 * 1024;
const RESERVED_STORAGE_BYTES = 3 * 1024 * 1024;
const MOTION_MAX_DURATION_MS = 10000;
const MOTION_MAX_FRAME_RATE = 20;
const MEDIA_QUALITY_OPTIONS = {
  high: { ratio: 26 / 30, label: "87%" },
  balanced: { ratio: 0.7, label: "70%" },
  compact: { ratio: 0.45, label: "45%" },
  maximum: { ratio: 1, label: "100%" }
};
const STORAGE_KEY = "monicard-web-state-v1";
const LOCALE_STORAGE_KEY = "monicard-web-locale";

const $ = (selector) => document.querySelector(selector);
const view = $("#view");
const banner = $("#statusBanner");
const filePicker = $("#filePicker");
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const i18n = {
  "zh-Hant": {
    appTitle: "魔力卡 Web",
    brandName: "魔力卡",
    autoLanguage: "跟隨系統語言",
    navDevices: "設備",
    navDetail: "詳情",
    navCard: "名片",
    navMedia: "素材",
    navTags: "標籤",
    navSettings: "設備設定",
    navReceived: "收到的名片",
    navFirmware: "韌體",
    navAppSettings: "軟體設定",
    eyebrowConnected: "已連線",
    eyebrowWeb: "網頁版",
    connectDevice: "連線設備",
    disconnect: "中斷連線",
    bluetoothReady: "可使用藍牙",
    bluetoothUnavailable: "藍牙不可用",
    bluetoothReadyDesc: "請點擊按鈕選擇設備",
    bluetoothUnsupportedDesc: "目前瀏覽器不支援 Web Bluetooth",
    bluetoothSecureDesc: "請使用 localhost 或 HTTPS",
    devicesList: "設備列表",
    refreshCurrentDevice: "重新整理目前設備",
    emptyDevices: "還沒有設備。請使用右上角「連線設備」選擇你的 MoniCard。",
    connectKnownDevice: "連線",
    reconnectFromCardFailed: "無法直接連線這台設備，請使用右上角「連線設備」重新選擇。",
    manage: "管理",
    remove: "移除",
    noDeviceSelected: "還沒有選擇設備。",
    serialNumber: "序列號",
    battery: "電量",
    firmwareVersion: "韌體",
    storage: "儲存空間",
    refreshDeviceStatus: "重新整理設備狀態",
    saveName: "儲存名稱",
    deviceName: "設備名稱",
    cardFeature: "名片",
    cardFeatureDesc: "編輯並同步個人名片",
    mediaFeature: "素材",
    mediaFeatureDesc: "上傳圖片、影片或 GIF",
    tagsFeature: "標籤",
    tagsFeatureDesc: "設定同好感應標籤",
    settingsFeature: "設備設定",
    settingsFeatureDesc: "燈光、震動、蜂鳴器",
    receivedFeature: "收到的名片",
    receivedFeatureDesc: "同步附近設備名片",
    firmwareFeature: "韌體",
    firmwareFeatureDesc: "上傳本機更新檔",
    cardContent: "名片內容",
    maxBytes: "最多 {count} bytes",
    readFromDevice: "從設備讀取",
    uploadCard: "上傳名片",
    preview: "預覽",
    avatarText: "顯示縮寫",
    noCardContent: "還沒有名片內容",
    defaultCard: "MoniCard\nQQ：12345678\n我是 Monica",
    mediaTransfer: "素材傳輸",
    mediaHelp: "上傳想在設備上顯示的照片、短影片或 GIF。",
    mediaProcessHelp: "系統會自動調整尺寸與格式；影片與 GIF 預設取前 10 秒製作成設備素材。開啟上傳前編輯後，可以改選任意 10 秒內片段。建議使用直式 3:4 素材。",
    mediaQuality: "素材品質",
    mediaQualityHigh: "畫質優先（約 87%，預設）",
    mediaQualityBalanced: "平衡（約 70%）",
    mediaQualityCompact: "省空間（約 45%）",
    mediaQualityMaximum: "最高品質（不建議，檔案較大）",
    mediaQualityHelp: "只影響影片與 GIF 的畫質和檔案大小，不改變解析度與幀率。",
    mediaClip: "影片 / GIF 片段",
    mediaClipHelp: "可從原始影片或 GIF 中選取任意片段，最長 10 秒。",
    mediaClipStart: "開始",
    mediaClipEnd: "結束",
    mediaSummary: "素材摘要",
    mediaSummaryEmpty: "選擇素材後會顯示解析度、秒數、幀數與原始大小。",
    mediaPreparedSummary: "素材摘要\n原始：{source}\n輸出：{output}\n轉檔後大小：{fileSize}",
    mediaStorageWarning: "設備剩餘空間偏低。此素材上傳約需 {size} 空間，設備目前剩餘約 {free}。仍要繼續上傳嗎？",
    mediaStorageUnknown: "無法讀取設備剩餘空間，仍要繼續上傳嗎？",
    mediaLayout: "顯示方式",
    mediaEditBeforeUpload: "上傳前編輯素材",
    mediaEditBeforeUploadDesc: "開啟後可先預覽、拖曳裁切位置並加上文字。",
    mediaLayoutCover: "裁切填滿畫面",
    mediaLayoutContain: "完整顯示並留邊",
    mediaAdjustments: "畫面微調",
    mediaZoom: "縮放",
    mediaOffsetX: "左右位置",
    mediaOffsetY: "上下位置",
    mediaCaption: "疊加文字",
    mediaCaptionPlaceholder: "可留空，例如活動名稱或暱稱",
    mediaTextStyle: "文字樣式",
    mediaCaptionX: "文字左右位置",
    mediaCaptionY: "文字上下位置",
    mediaCaptionFont: "字型",
    mediaCaptionCustomFont: "自訂字型名稱",
    mediaCaptionCustomFontPlaceholder: "需為此裝置已安裝的字型",
    mediaCaptionCustomFontHelp: "只有使用者電腦或手機已安裝的字型才會生效。",
    mediaCaptionSize: "文字大小",
    mediaCaptionColors: "文字顏色與背景",
    mediaCaptionColor: "文字顏色",
    mediaCaptionBackground: "文字背景",
    mediaCaptionBackgroundOpacity: "背景透明度",
    mediaCaptionWeight: "粗體",
    mediaCaptionItalic: "斜體",
    mediaCaptionDirection: "文字方向",
    mediaCaptionHorizontal: "橫寫",
    mediaCaptionVertical: "直寫",
    fileType: "素材類型",
    fileTypeHelp: "支援 JPG、PNG、WebP、常見影片格式與 GIF。",
    resourceFile: "圖片 / 影片 / GIF",
    pickAndTransfer: "選擇檔案",
    uploadSelectedMedia: "上傳素材",
    mediaPreview: "預覽",
    mediaPreviewEmpty: "選擇圖片、影片或 GIF 後會在這裡預覽；可直接拖曳畫面調整位置",
    mediaSelected: "已選擇素材：{name}",
    mediaPreviewFailed: "無法產生預覽，仍可嘗試上傳。",
    cancelTransfer: "取消傳輸",
    waitingFile: "等待選擇檔案",
    dropMedia: "也可以把圖片、影片或 GIF 拖曳到這裡",
    dropMediaActive: "放開即可準備傳輸",
    processingMedia: "正在處理素材格式",
    mediaPrepared: "已產生設備素材：{name}\n大小：{size}",
    storageInsufficient: "設備儲存空間不足，需要 {needed}（含安全餘量），目前剩餘約 {free}。請先在設備上刪除部分素材後再試。",
    tagSettings: "標籤設定",
    category: "分類",
    tag: "標籤",
    searchTags: "搜尋標籤",
    tagSearchPlaceholder: "輸入作品、角色或分類名稱",
    noTagResults: "找不到符合的標籤",
    addToList: "加入列表",
    clearAllTags: "清除所有標籤",
    readDeviceTags: "讀取設備標籤",
    writeToDevice: "寫入設備",
    tagHint: "最多 5 個標籤，點擊標籤可移除。",
    currentDeviceTags: "目前設備標籤",
    pendingDeviceTags: "準備寫入的新標籤",
    noPendingTags: "尚未選擇要寫入的標籤",
    confirmOverwriteTags: "寫入後會覆蓋設備目前的標籤設定。要繼續嗎？",
    tagsCleared: "已清除標籤列表",
    readingDeviceTags: "正在讀取設備標籤，請保持設備開機並靠近電腦。",
    tagsRead: "已讀取 {count} 個設備標籤",
    tagsReadEmpty: "設備目前沒有標籤",
    tagReadUnsupported: "此瀏覽器不支援讀取當前標籤設定；但仍可手動選擇並寫入覆蓋標籤設定。",
    tagReadFailed: "讀取設備標籤失敗",
    tagsWrittenHint: "標籤已寫入設備，稍等 1～2 秒後廣播會生效。",
    deviceSwitches: "設備開關",
    readSettings: "讀取設備設定",
    buzzer: "蜂鳴器",
    buzzerDesc: "遇到同好時發出提示音",
    vibration: "震動",
    vibrationDesc: "遇到同好時震動提醒",
    light: "同好感應燈光",
    lightDesc: "遇到同好時亮燈閃爍提示",
    interest: "同好感應",
    interestDesc: "自動掃描並識別附近的同好設備",
    ambience: "背面氛圍燈",
    ambienceDesc: "背面呼吸燈緩慢呼吸閃爍",
    broadcast: "廣播",
    broadcastDesc: "允許設備廣播名片與標籤",
    videoCarousel: "影片輪播",
    carouselSeconds: "輪播間隔",
    carouselEnabled: "啟用輪播",
    readCarousel: "讀取輪播",
    saveCarousel: "儲存輪播",
    autoReadingSettings: "正在自動讀取設備設定",
    autoReadSkipped: "連接設備後會自動讀取設定",
    autoRefreshingDevice: "正在自動同步設備狀態",
    syncFromDevice: "從設備同步",
    autoSyncReceivedCards: "正在自動同步收到的名片",
    waitingSync: "等待同步",
    noReceivedCards: "尚未收到名片。",
    deleteReceivedCard: "刪除",
    confirmDeleteReceivedCard: "確定要刪除這張收到的名片嗎？",
    receivedCardDeleted: "名片已刪除",
    deleteReceivedCardFailed: "刪除名片失敗",
    firmwareUpgrade: "韌體升級",
    firmwareHelp: "請選擇可信任的韌體更新檔，並確認設備電量充足後再開始。更新完成並重新連線前，請停留在此頁面。",
    pickFirmware: "選擇韌體檔",
    firmwareAdvanced: "進階韌體更新",
    firmwareAdvancedHelp: "僅在你確定檔案來自官方且對應此設備時使用。",
    firmwareCurrentVersion: "目前設備韌體版本：{version}",
    firmwareConfirmOfficial: "我確認這是官方提供且對應此設備的韌體檔",
    firmwareRequireConfirm: "請先確認韌體檔來源與設備型號。",
    waitingFirmware: "等待選擇韌體檔",
    firmwareReady: "已讀取韌體檔：{name}\n大小：{size}\n更新期間請勿切換頁面、關閉瀏覽器、讓電腦睡眠，或中斷設備電源。",
    firmwareOnlyBin: "韌體更新只接受官方 .bin 檔。",
    firmwareTooSmall: "此檔案太小，不像有效的韌體檔。",
    firmwareTooLarge: "此檔案太大，不像此設備的韌體檔。",
    firmwareLooksWrong: "此檔案格式不像韌體檔，請確認你選的是官方 .bin 更新檔。",
    firmwareInstalling: "傳輸完成，設備正在校驗並安裝更新。",
    firmwareReconnectHint: "設備已收到更新。請等待約 10 秒後按電源鍵開機，並保持此頁面開啟直到自動重新連線完成。",
    firmwareVerifying: "正在嘗試重新連線並檢查更新結果…({count})",
    firmwareVerified: "設備已重新連線，韌體版本：{version}",
    firmwareVerifyFailed: "尚未自動重新連線。請確認設備已開機後，手動重新連線。",
    confirmFirmwareUpdate: "確定要開始韌體更新？請只使用官方提供且對應此設備的 .bin 檔。錯誤韌體可能讓設備無法正常開機；更新完成並重新連線前，請不要切換頁面、關閉瀏覽器、讓電腦睡眠，或中斷設備電源。",
    webSettings: "網頁設定",
    language: "語言",
    transferDelay: "傳輸包間隔 ms",
    transferDelayHelp: "每個藍牙資料包之間的等待時間。數值越大越穩但越慢；一般不需要調整。",
    saveSettings: "儲存設定",
    clearData: "清空網頁資料",
    migrationNotes: "使用說明",
    migrationHelp: "請使用 Chrome 或 Edge，並透過 HTTPS 網址開啟。首次連線設備時，瀏覽器會要求你手動選擇並授權。",
    unnamedDevice: "設備名稱",
    online: "在線",
    disconnected: "已中斷連線",
    card: "名片",
    chooseDeviceBanner: "請在瀏覽器設備選擇器中選擇 MoniCard。",
    deviceDisconnected: "設備已中斷連線",
    connectedToast: "設備已連線",
    connectFailed: "連線失敗",
    noDevice: "還沒有設備",
    refreshRequiresConnection: "重新整理前請先連線到設備",
    deviceUpdated: "設備已更新",
    updateFailed: "更新失敗",
    nameSaved: "名稱已儲存",
    cardRead: "已讀取名片",
    readFailed: "讀取失敗",
    cardUploaded: "名片已上傳",
    uploadFailed: "上傳失敗",
    transferDone: "素材已傳輸",
    transferFailed: "傳輸失敗",
    cancelingTransfer: "正在取消傳輸",
    maxTags: "最多 {count} 個標籤",
    tagExists: "標籤已在列表中",
    tagsWritten: "標籤已寫入",
    writeFailed: "寫入失敗",
    settingsRead: "設備設定已讀取",
    settingsSynced: "設定已同步",
    syncFailed: "同步失敗",
    carouselRead: "已讀取輪播",
    carouselSaved: "輪播已設定",
    carouselOff: "輪播已關閉",
    saveFailed: "儲存失敗",
    syncedCards: "已同步 {count} 張名片",
    firmwareTransferred: "韌體檔已傳輸",
    firmwareTransferFailed: "韌體傳輸失敗",
    settingsSaved: "設定已儲存",
    dataCleared: "資料已清空",
    confirmClear: "確定清空網頁本地資料？",
    filePreparing: "準備傳輸：{name}\n大小：{size}",
    fileTransferring: "正在傳輸：{name}\n進度：{percent}%",
    fileComplete: "傳輸完成：{name}",
    syncingCard: "正在同步第 {index}/{total} 張名片",
    firmwarePreparing: "正在準備韌體檔：{name}",
    firmwareProgress: "正在傳輸韌體檔：{percent}%",
    errorCanceled: "已取消設備選擇",
    errorBluetooth: "{fallback}：藍牙連線異常",
    errorTimeout: "{fallback}：設備回應逾時",
    errorNoConnection: "請先連線設備",
    errorFirmwareFile: "韌體檔無法讀取，請確認檔案正確。",
    errorUnsupportedMedia: "不支援此檔案格式，請選擇圖片、影片或 GIF。",
    errorInvalidGif: "GIF 檔案無法讀取，請改用其他 GIF 或轉成影片後再上傳。",
    errorMediaEncode: "素材處理失敗，請換一個檔案再試。",
    errorGeneric: "{fallback}：{message}"
  },
  en: {
    appTitle: "MoniCard Web",
    brandName: "MoniCard",
    autoLanguage: "System language",
    navDevices: "Devices",
    navDetail: "Overview",
    navCard: "Digital Card",
    navMedia: "Assets",
    navTags: "Tags",
    navSettings: "Device Settings",
    navReceived: "Received Cards",
    navFirmware: "Firmware",
    navAppSettings: "App Settings",
    eyebrowConnected: "Connected",
    eyebrowWeb: "Web app",
    connectDevice: "Connect device",
    disconnect: "Disconnect",
    bluetoothReady: "Bluetooth ready",
    bluetoothUnavailable: "Bluetooth unavailable",
    bluetoothReadyDesc: "Click the button to choose your device",
    bluetoothUnsupportedDesc: "This browser does not support Web Bluetooth",
    bluetoothSecureDesc: "Use localhost or HTTPS",
    devicesList: "Devices",
    refreshCurrentDevice: "Refresh current device",
    emptyDevices: "No devices yet. Use “Connect device” in the top right to choose your MoniCard.",
    connectKnownDevice: "Connect",
    reconnectFromCardFailed: "Could not connect to this saved device. Use “Connect device” in the top right and select it again.",
    manage: "Manage",
    remove: "Remove",
    noDeviceSelected: "No device selected yet.",
    serialNumber: "Serial",
    battery: "Battery",
    firmwareVersion: "Firmware",
    storage: "Storage",
    refreshDeviceStatus: "Refresh status",
    saveName: "Save name",
    deviceName: "Device name",
    cardFeature: "Digital Card",
    cardFeatureDesc: "Edit your business card info and upload it to the device",
    mediaFeature: "Assets",
    mediaFeatureDesc: "Upload images, videos, or GIFs",
    tagsFeature: "Tags",
    tagsFeatureDesc: "Set tags for matching and social recognition",
    settingsFeature: "Device Settings",
    settingsFeatureDesc: "Lights, vibration, and buzzer",
    receivedFeature: "Received Cards",
    receivedFeatureDesc: "Sync digital business cards from nearby devices",
    firmwareFeature: "Firmware",
    firmwareFeatureDesc: "Upload a local update file",
    cardContent: "Business card info",
    maxBytes: "Up to {count} bytes",
    readFromDevice: "Read from device",
    uploadCard: "Upload card",
    preview: "Preview",
    avatarText: "Initials",
    noCardContent: "No business card info yet",
    defaultCard: "MoniCard\nQQ: 12345678\nHi, I'm Monica.",
    mediaTransfer: "Asset upload",
    mediaHelp: "Upload images, videos, or GIFs to show on your device.",
    mediaProcessHelp: "Files are automatically resized and prepared for the display. Videos and GIFs use the first 10 seconds by default. Turn on editing to choose any segment up to 10 seconds. Portrait 3:4 assets work best.",
    mediaQuality: "Asset quality",
    mediaQualityHigh: "Quality first (about 87%, default)",
    mediaQualityBalanced: "Balanced (about 70%)",
    mediaQualityCompact: "Save space (about 45%)",
    mediaQualityMaximum: "Maximum quality (not recommended, larger files)",
    mediaQualityHelp: "Affects video and GIF quality and file size only. Resolution and frame rate stay the same.",
    mediaClip: "Video / GIF clip",
    mediaClipHelp: "Choose any segment from the original video or GIF, up to 10 seconds.",
    mediaClipStart: "Start",
    mediaClipEnd: "End",
    mediaSummary: "Asset summary",
    mediaSummaryEmpty: "Choose an asset to see resolution, duration, frames, and original size.",
    mediaPreparedSummary: "Asset summary\nSource: {source}\nOutput: {output}\nPrepared size: {fileSize}",
    mediaStorageWarning: "Device storage is low. Uploading this asset needs about {size}, and about {free} is available. Continue uploading?",
    mediaStorageUnknown: "Couldn’t read remaining device storage. Continue uploading?",
    mediaLayout: "Display mode",
    mediaEditBeforeUpload: "Edit before upload",
    mediaEditBeforeUploadDesc: "Preview the asset, drag to adjust framing, and add text before uploading.",
    mediaLayoutCover: "Fill screen by cropping",
    mediaLayoutContain: "Show full image with padding",
    mediaAdjustments: "Framing adjustments",
    mediaZoom: "Zoom",
    mediaOffsetX: "Horizontal position",
    mediaOffsetY: "Vertical position",
    mediaCaption: "Text overlay",
    mediaCaptionPlaceholder: "Optional, such as an event name or nickname",
    mediaTextStyle: "Text style",
    mediaCaptionX: "Text horizontal position",
    mediaCaptionY: "Text vertical position",
    mediaCaptionFont: "Font",
    mediaCaptionCustomFont: "Custom font name",
    mediaCaptionCustomFontPlaceholder: "Must be installed on this device",
    mediaCaptionCustomFontHelp: "This works only when the font is installed on the user's computer or phone.",
    mediaCaptionSize: "Text size",
    mediaCaptionColors: "Text color and background",
    mediaCaptionColor: "Text color",
    mediaCaptionBackground: "Text background",
    mediaCaptionBackgroundOpacity: "Background opacity",
    mediaCaptionWeight: "Bold",
    mediaCaptionItalic: "Italic",
    mediaCaptionDirection: "Text direction",
    mediaCaptionHorizontal: "Horizontal",
    mediaCaptionVertical: "Vertical",
    fileType: "Asset type",
    fileTypeHelp: "Supports JPG, PNG, WebP, common video formats, and GIF.",
    resourceFile: "Image / video / GIF",
    pickAndTransfer: "Choose file",
    uploadSelectedMedia: "Upload asset",
    mediaPreview: "Preview",
    mediaPreviewEmpty: "Choose an image, video, or GIF to preview it here. Drag the preview to adjust framing.",
    mediaSelected: "Selected asset: {name}",
    mediaPreviewFailed: "Could not generate a preview. You can still try uploading it.",
    cancelTransfer: "Cancel upload",
    waitingFile: "Waiting for a file",
    dropMedia: "You can also drag an image, video, or GIF here",
    dropMediaActive: "Drop to prepare the upload",
    processingMedia: "Preparing asset for the device",
    mediaPrepared: "Prepared device asset: {name}\nSize: {size}",
    storageInsufficient: "Not enough storage on the device. {needed} is required, including a safety margin, and about {free} is available. Delete some assets on the device and try again.",
    tagSettings: "Tag settings",
    category: "Category",
    tag: "Tag",
    searchTags: "Search tags",
    tagSearchPlaceholder: "Search by title, name, or category",
    noTagResults: "No matching tags",
    addToList: "Add",
    clearAllTags: "Clear all tags",
    readDeviceTags: "Read device tags",
    writeToDevice: "Write to device",
    tagHint: "Up to 5 tags. Click a tag to remove it.",
    currentDeviceTags: "Current device tags",
    pendingDeviceTags: "Tags to write",
    noPendingTags: "No tags selected to write yet",
    confirmOverwriteTags: "Writing will overwrite the current tag settings on the device. Continue?",
    tagsCleared: "Tag list cleared",
    readingDeviceTags: "Reading device tags. Keep the device powered on and near this computer.",
    tagsRead: "Read {count} device tags",
    tagsReadEmpty: "No tags are currently set on the device",
    tagReadUnsupported: "This browser cannot read the current tag settings. You can still choose tags manually and overwrite the tag settings.",
    tagReadFailed: "Couldn’t read device tags",
    tagsWrittenHint: "Tags written. The broadcast should update in 1-2 seconds.",
    deviceSwitches: "Device Settings",
    readSettings: "Read device settings",
    buzzer: "Buzzer",
    buzzerDesc: "Control sound alerts",
    vibration: "Vibration",
    vibrationDesc: "Control vibration feedback",
    light: "Light Cues",
    lightDesc: "Control LED light alerts",
    interest: "Interest Radar",
    interestDesc: "Detect devices with shared interests",
    ambience: "Back ambient light",
    ambienceDesc: "Run the rear breathing light effect",
    broadcast: "Broadcast",
    broadcastDesc: "Allow the device to broadcast cards and tags",
    videoCarousel: "Video carousel",
    carouselSeconds: "Carousel interval",
    carouselEnabled: "Enable carousel",
    readCarousel: "Read carousel",
    saveCarousel: "Save carousel",
    autoReadingSettings: "Reading device settings automatically",
    autoReadSkipped: "Settings will be read automatically after a device is connected",
    autoRefreshingDevice: "Refreshing device status automatically",
    syncFromDevice: "Sync from device",
    autoSyncReceivedCards: "Syncing received cards automatically",
    waitingSync: "Waiting to sync",
    noReceivedCards: "No received cards yet.",
    deleteReceivedCard: "Delete",
    confirmDeleteReceivedCard: "Delete this received card?",
    receivedCardDeleted: "Card deleted",
    deleteReceivedCardFailed: "Couldn’t delete card",
    firmwareUpgrade: "Firmware update",
    firmwareHelp: "Choose a trusted firmware update file, and make sure the device has enough battery before starting. Stay on this page until the update reconnects.",
    pickFirmware: "Choose firmware file",
    firmwareAdvanced: "Advanced firmware update",
    firmwareAdvancedHelp: "Use only when you are sure the file is official and made for this device.",
    firmwareCurrentVersion: "Current firmware version: {version}",
    firmwareConfirmOfficial: "I confirm this is the official firmware file for this device",
    firmwareRequireConfirm: "Confirm the firmware source and device model first.",
    waitingFirmware: "Waiting for a firmware file",
    firmwareReady: "Firmware file loaded: {name}\nSize: {size}\nDo not switch pages, close the browser, let the computer sleep, or power off the device during the update.",
    firmwareOnlyBin: "Firmware updates only accept official .bin files.",
    firmwareTooSmall: "This file is too small to look like a valid firmware file.",
    firmwareTooLarge: "This file is too large to look like firmware for this device.",
    firmwareLooksWrong: "This file does not look like a firmware file. Choose the official .bin update file.",
    firmwareInstalling: "Upload complete. The device is verifying and installing the update.",
    firmwareReconnectHint: "The device has received the update. Wait about 10 seconds, press the power button, and keep this page open until automatic reconnection finishes.",
    firmwareVerifying: "Trying to reconnect and verify the update…({count})",
    firmwareVerified: "Device reconnected. Firmware version: {version}",
    firmwareVerifyFailed: "Automatic reconnection did not finish. Power on the device, then reconnect manually.",
    confirmFirmwareUpdate: "Start the firmware update? Use only the official .bin file for this exact device. The wrong firmware may prevent the device from booting. Until the update reconnects, do not switch pages, close the browser, let the computer sleep, or power off the device.",
    webSettings: "Web app settings",
    language: "Language",
    transferDelay: "Packet delay, ms",
    transferDelayHelp: "Delay between Bluetooth packets. Higher values can be more stable but slower. Most users should leave this unchanged.",
    saveSettings: "Save settings",
    clearData: "Clear web data",
    migrationNotes: "Usage notes",
    migrationHelp: "Use Chrome or Edge and open the app from an HTTPS address. The browser will ask you to choose and authorize the device the first time you connect.",
    unnamedDevice: "Device name",
    online: "Online",
    disconnected: "Disconnected",
    card: "Card",
    chooseDeviceBanner: "Select your MoniCard in the browser’s device picker.",
    deviceDisconnected: "Device disconnected",
    connectedToast: "Device connected",
    connectFailed: "Couldn’t connect",
    noDevice: "No devices yet",
    refreshRequiresConnection: "Connect the device before refreshing",
    deviceUpdated: "Device updated",
    updateFailed: "Update failed",
    nameSaved: "Name saved",
    cardRead: "Card loaded",
    readFailed: "Read failed",
    cardUploaded: "Card uploaded",
    uploadFailed: "Upload failed",
    transferDone: "Asset uploaded",
    transferFailed: "Upload failed",
    cancelingTransfer: "Canceling upload",
    maxTags: "Up to {count} tags",
    tagExists: "That tag is already in the list",
    tagsWritten: "Tags written",
    writeFailed: "Write failed",
    settingsRead: "Device settings loaded",
    settingsSynced: "Settings synced",
    syncFailed: "Sync failed",
    carouselRead: "Carousel loaded",
    carouselSaved: "Carousel saved",
    carouselOff: "Carousel turned off",
    saveFailed: "Save failed",
    syncedCards: "Synced {count} cards",
    firmwareTransferred: "Firmware file uploaded",
    firmwareTransferFailed: "Firmware upload failed",
    settingsSaved: "Settings saved",
    dataCleared: "Data cleared",
    confirmClear: "Clear local web app data?",
    filePreparing: "Preparing upload: {name}\nSize: {size}",
    fileTransferring: "Uploading: {name}\nProgress: {percent}%",
    fileComplete: "Upload complete: {name}",
    syncingCard: "Syncing card {index} of {total}",
    firmwarePreparing: "Preparing firmware file: {name}",
    firmwareProgress: "Uploading firmware file: {percent}%",
    errorCanceled: "Device selection canceled",
    errorBluetooth: "{fallback}: Bluetooth connection error",
    errorTimeout: "{fallback}: device response timed out",
    errorNoConnection: "Connect a device first",
    errorFirmwareFile: "This firmware file could not be read. Check that you selected the correct file.",
    errorUnsupportedMedia: "This file type is not supported. Choose an image, video, or GIF.",
    errorInvalidGif: "This GIF could not be read. Try another GIF or convert it to a video first.",
    errorMediaEncode: "Asset processing failed. Try another file.",
    errorGeneric: "{fallback}: {message}"
  },
  ja: {
    appTitle: "MoniCard Web",
    brandName: "MoniCard",
    autoLanguage: "システム言語",
    navDevices: "端末",
    navDetail: "概要",
    navCard: "名刺",
    navMedia: "素材",
    navTags: "タグ",
    navSettings: "端末設定",
    navReceived: "受け取った名刺",
    navFirmware: "ファームウェア",
    navAppSettings: "アプリ設定",
    eyebrowConnected: "接続中",
    eyebrowWeb: "Web 版",
    connectDevice: "端末を接続",
    disconnect: "切断",
    bluetoothReady: "Bluetooth 使用可",
    bluetoothUnavailable: "Bluetooth 使用不可",
    bluetoothReadyDesc: "ボタンを押して端末を選択してください",
    bluetoothUnsupportedDesc: "このブラウザは Web Bluetooth に対応していません",
    bluetoothSecureDesc: "localhost または HTTPS で開いてください",
    devicesList: "端末",
    refreshCurrentDevice: "端末状態を更新",
    emptyDevices: "まだ端末がありません。右上の「端末を接続」から MoniCard を選択してください。",
    connectKnownDevice: "接続",
    reconnectFromCardFailed: "保存済み端末に直接接続できませんでした。右上の「端末を接続」から再度選択してください。",
    manage: "管理",
    remove: "削除",
    noDeviceSelected: "端末が選択されていません。",
    serialNumber: "シリアル",
    battery: "バッテリー",
    firmwareVersion: "ファームウェア",
    storage: "保存容量",
    refreshDeviceStatus: "端末状態を更新",
    saveName: "名前を保存",
    deviceName: "端末名",
    cardFeature: "電子名刺",
    cardFeatureDesc: "名刺情報を編集して端末へアップロード",
    mediaFeature: "素材",
    mediaFeatureDesc: "画像、動画、GIFをアップロード",
    tagsFeature: "タグ",
    tagsFeatureDesc: "交流用のタグを設定",
    settingsFeature: "端末設定",
    settingsFeatureDesc: "ライト、振動、ブザー",
    receivedFeature: "受け取った名刺",
    receivedFeatureDesc: "近くの端末から受け取った名刺を同期",
    firmwareFeature: "ファームウェア",
    firmwareFeatureDesc: "ローカルの更新ファイルをアップロード",
    cardContent: "名刺内容",
    maxBytes: "最大 {count} バイト",
    readFromDevice: "端末から読み込み",
    uploadCard: "名刺をアップロード",
    preview: "プレビュー",
    avatarText: "表示文字",
    noCardContent: "名刺内容はまだありません",
    defaultCard: "MoniCard\nQQ：12345678\nMonicaです",
    mediaTransfer: "素材アップロード",
    mediaHelp: "端末に表示したい画像、動画、GIFをアップロードできます。",
    mediaProcessHelp: "表示に合わせてサイズと形式を自動調整します。動画とGIFは初期設定では先頭10秒を端末用素材にします。アップロード前編集をオンにすると、任意の最大10秒を選べます。縦長の3:4素材がおすすめです。",
    mediaQuality: "素材品質",
    mediaQualityHigh: "画質優先（約87%、初期設定）",
    mediaQualityBalanced: "バランス（約70%）",
    mediaQualityCompact: "容量優先（約45%）",
    mediaQualityMaximum: "最高品質（非推奨、ファイルサイズ大）",
    mediaQualityHelp: "動画とGIFの画質とファイルサイズにのみ影響します。解像度とフレームレートは変わりません。",
    mediaClip: "動画 / GIF の範囲",
    mediaClipHelp: "元の動画またはGIFから、最大10秒まで任意の範囲を選べます。",
    mediaClipStart: "開始",
    mediaClipEnd: "終了",
    mediaSummary: "素材の概要",
    mediaSummaryEmpty: "素材を選択すると、解像度、秒数、フレーム数、元のサイズを表示します。",
    mediaPreparedSummary: "素材の概要\n元データ：{source}\n出力：{output}\n変換後サイズ：{fileSize}",
    mediaStorageWarning: "端末の空き容量が少なくなっています。この素材のアップロードには約 {size} 必要です。端末の空き容量は約 {free} です。アップロードを続行しますか？",
    mediaStorageUnknown: "端末の空き容量を読み取れませんでした。アップロードを続行しますか？",
    mediaLayout: "表示方法",
    mediaEditBeforeUpload: "アップロード前に編集",
    mediaEditBeforeUploadDesc: "アップロード前にプレビュー、ドラッグで位置調整、文字入れができます。",
    mediaLayoutCover: "画面いっぱいに切り抜く",
    mediaLayoutContain: "全体を表示して余白を入れる",
    mediaAdjustments: "表示位置の調整",
    mediaZoom: "拡大率",
    mediaOffsetX: "左右位置",
    mediaOffsetY: "上下位置",
    mediaCaption: "文字を重ねる",
    mediaCaptionPlaceholder: "任意：イベント名やニックネームなど",
    mediaTextStyle: "文字スタイル",
    mediaCaptionX: "文字の左右位置",
    mediaCaptionY: "文字の上下位置",
    mediaCaptionFont: "フォント",
    mediaCaptionCustomFont: "カスタムフォント名",
    mediaCaptionCustomFontPlaceholder: "この端末にインストール済みのフォント名",
    mediaCaptionCustomFontHelp: "ユーザーのPCやスマートフォンにインストールされているフォントのみ有効です。",
    mediaCaptionSize: "文字サイズ",
    mediaCaptionColors: "文字色と背景",
    mediaCaptionColor: "文字色",
    mediaCaptionBackground: "文字背景",
    mediaCaptionBackgroundOpacity: "背景の透明度",
    mediaCaptionWeight: "太字",
    mediaCaptionItalic: "斜体",
    mediaCaptionDirection: "文字方向",
    mediaCaptionHorizontal: "横書き",
    mediaCaptionVertical: "縦書き",
    fileType: "素材種別",
    fileTypeHelp: "JPG、PNG、WebP、主要な動画形式、GIFに対応しています。",
    resourceFile: "画像 / 動画 / GIF",
    pickAndTransfer: "ファイルを選択",
    uploadSelectedMedia: "素材をアップロード",
    mediaPreview: "プレビュー",
    mediaPreviewEmpty: "画像、動画、GIFを選ぶとここにプレビューが表示されます。プレビューをドラッグして位置を調整できます。",
    mediaSelected: "選択中の素材：{name}",
    mediaPreviewFailed: "プレビューを作成できませんでした。アップロードは試行できます。",
    cancelTransfer: "アップロードをキャンセル",
    waitingFile: "ファイルの選択待ち",
    dropMedia: "画像、動画、GIFをここにドラッグして選択できます",
    dropMediaActive: "ドロップするとアップロード準備を開始します",
    processingMedia: "端末用素材を作成しています",
    mediaPrepared: "端末用素材を作成しました：{name}\nサイズ：{size}",
    storageInsufficient: "端末の空き容量が不足しています。安全マージン込みで {needed} が必要ですが、空き容量は約 {free} です。端末側で不要な素材を削除してから再度お試しください。",
    tagSettings: "タグ設定",
    category: "カテゴリ",
    tag: "タグ",
    searchTags: "タグを検索",
    tagSearchPlaceholder: "作品名、名称、カテゴリで検索",
    noTagResults: "一致するタグがありません",
    addToList: "追加",
    clearAllTags: "すべてのタグを削除",
    readDeviceTags: "端末のタグを読み込み",
    writeToDevice: "端末に書き込み",
    tagHint: "タグは最大 5 個です。タグをクリックすると削除できます。",
    currentDeviceTags: "現在の端末タグ",
    pendingDeviceTags: "書き込む新しいタグ",
    noPendingTags: "書き込むタグはまだ選択されていません",
    confirmOverwriteTags: "書き込むと端末の現在のタグ設定が上書きされます。続行しますか？",
    tagsCleared: "タグ一覧をクリアしました",
    readingDeviceTags: "端末のタグを読み込んでいます。端末の電源を入れ、PCの近くに置いてください。",
    tagsRead: "端末のタグを {count} 個読み込みました",
    tagsReadEmpty: "端末にタグは設定されていません",
    tagReadUnsupported: "このブラウザでは現在のタグ設定を読み取れません。手動でタグを選択し、タグ設定を上書きできます。",
    tagReadFailed: "端末のタグを読み込めませんでした",
    tagsWrittenHint: "タグを書き込みました。1～2秒後に発信内容へ反映されます。",
    deviceSwitches: "端末設定",
    readSettings: "設定を読み込み",
    buzzer: "ブザー",
    buzzerDesc: "近くにマッチする相手がいると音で通知",
    vibration: "振動",
    vibrationDesc: "近くにマッチする相手がいると振動で通知",
    light: "ライト通知",
    lightDesc: "マッチ時にカラーライトで通知",
    interest: "動的感知",
    interestDesc: "近くの対応端末を検知",
    ambience: "背面ライト",
    ambienceDesc: "背面ライトを点灯",
    broadcast: "名刺・タグ発信",
    broadcastDesc: "名刺とタグの発信を許可",
    videoCarousel: "動画カルーセル",
    carouselSeconds: "切替間隔",
    carouselEnabled: "カルーセルを有効にする",
    readCarousel: "設定を読み込み",
    saveCarousel: "保存",
    autoReadingSettings: "端末設定を自動で読み込んでいます",
    autoReadSkipped: "端末接続後、設定を自動で読み込みます",
    autoRefreshingDevice: "端末状態を自動で同期しています",
    syncFromDevice: "端末から同期",
    autoSyncReceivedCards: "受け取った名刺を自動で同期しています",
    waitingSync: "同期待ち",
    noReceivedCards: "まだ受け取った名刺はありません。",
    deleteReceivedCard: "削除",
    confirmDeleteReceivedCard: "この受け取った名刺を削除しますか？",
    receivedCardDeleted: "名刺を削除しました",
    deleteReceivedCardFailed: "名刺を削除できませんでした",
    firmwareUpgrade: "ファームウェア更新",
    firmwareHelp: "信頼できるファームウェア更新ファイルを選び、端末の電池残量を十分に確保してから開始してください。更新後の再接続が完了するまで、このページを開いたままにしてください。",
    pickFirmware: "ファームウェアファイルを選択",
    firmwareAdvanced: "高度なファームウェア更新",
    firmwareAdvancedHelp: "公式かつこの端末に対応したファイルだと確認できる場合のみ使用してください。",
    firmwareCurrentVersion: "現在のファームウェア：{version}",
    firmwareConfirmOfficial: "公式提供で、この端末に対応したファームウェアファイルであることを確認しました",
    firmwareRequireConfirm: "先にファームウェアの入手元と端末モデルを確認してください。",
    waitingFirmware: "ファームウェアファイルの選択待ち",
    firmwareReady: "ファームウェアファイルを読み込みました：{name}\nサイズ：{size}\n更新中はページを切り替えず、ブラウザを閉じず、PCをスリープさせず、端末の電源を切らないでください。",
    firmwareOnlyBin: "ファームウェア更新は公式の .bin ファイルのみ対応しています。",
    firmwareTooSmall: "このファイルは小さすぎるため、有効なファームウェアには見えません。",
    firmwareTooLarge: "このファイルは大きすぎるため、この端末向けのファームウェアには見えません。",
    firmwareLooksWrong: "このファイル形式はファームウェアには見えません。公式の .bin 更新ファイルを選択してください。",
    firmwareInstalling: "アップロードが完了しました。端末側で確認とインストールを行っています。",
    firmwareReconnectHint: "端末が更新を受け取りました。約10秒待ってから電源ボタンを押し、自動再接続が完了するまでこのページを開いたままにしてください。",
    firmwareVerifying: "再接続して更新結果を確認しています…({count})",
    firmwareVerified: "端末に再接続しました。ファームウェア：{version}",
    firmwareVerifyFailed: "自動再接続が完了しませんでした。端末の電源を入れてから手動で再接続してください。",
    confirmFirmwareUpdate: "ファームウェア更新を開始しますか？必ずこの端末に対応した公式の .bin ファイルだけを使用してください。誤ったファームウェアを使うと端末が正常に起動しなくなる可能性があります。更新後の再接続が完了するまで、ページを切り替えず、ブラウザを閉じず、PCをスリープさせず、端末の電源を切らないでください。",
    webSettings: "Web アプリ設定",
    language: "言語",
    transferDelay: "パケット間隔 ms",
    transferDelayHelp: "Bluetooth パケット間の待ち時間です。大きいほど安定しやすくなりますが遅くなります。通常は変更不要です。",
    saveSettings: "設定を保存",
    clearData: "Web データを消去",
    migrationNotes: "ご利用メモ",
    migrationHelp: "Chrome または Edge で、HTTPS のURLから開いてください。初回接続時は、ブラウザ上で端末を選択して許可する必要があります。",
    unnamedDevice: "端末名",
    online: "オンライン",
    disconnected: "切断済み",
    card: "名刺",
    chooseDeviceBanner: "ブラウザの端末選択画面で MoniCard を選んでください。",
    deviceDisconnected: "端末が切断されました",
    connectedToast: "端末を接続しました",
    connectFailed: "接続できませんでした",
    noDevice: "端末がありません",
    refreshRequiresConnection: "更新する前に端末を接続してください",
    deviceUpdated: "端末状態を更新しました",
    updateFailed: "更新に失敗しました",
    nameSaved: "名前を保存しました",
    cardRead: "名刺を読み込みました",
    readFailed: "読み込みに失敗しました",
    cardUploaded: "名刺をアップロードしました",
    uploadFailed: "アップロードに失敗しました",
    transferDone: "素材をアップロードしました",
    transferFailed: "アップロードに失敗しました",
    cancelingTransfer: "アップロードをキャンセルしています",
    maxTags: "タグは最大 {count} 個です",
    tagExists: "このタグはすでに追加されています",
    tagsWritten: "タグを書き込みました",
    writeFailed: "書き込みに失敗しました",
    settingsRead: "設定を読み込みました",
    settingsSynced: "設定を同期しました",
    syncFailed: "同期に失敗しました",
    carouselRead: "カルーセル設定を読み込みました",
    carouselSaved: "カルーセルを保存しました",
    carouselOff: "カルーセルをオフにしました",
    saveFailed: "保存に失敗しました",
    syncedCards: "{count} 枚の名刺を同期しました",
    firmwareTransferred: "ファームウェアをアップロードしました",
    firmwareTransferFailed: "ファームウェアのアップロードに失敗しました",
    settingsSaved: "設定を保存しました",
    dataCleared: "データを消去しました",
    confirmClear: "Web アプリのローカルデータを消去しますか？",
    filePreparing: "アップロード準備中：{name}\nサイズ：{size}",
    fileTransferring: "アップロード中：{name}\n進捗：{percent}%",
    fileComplete: "アップロード完了：{name}",
    syncingCard: "{index}/{total} 枚目の名刺を同期中",
    firmwarePreparing: "ファームウェアアップロード中：{name}",
    firmwareProgress: "ファームウェアアップロード中：{percent}%",
    errorCanceled: "端末選択をキャンセルしました",
    errorBluetooth: "{fallback}：Bluetooth 接続エラー",
    errorTimeout: "{fallback}：端末の応答がタイムアウトしました",
    errorNoConnection: "先に端末を接続してください",
    errorFirmwareFile: "ファームウェアファイルを読み込めませんでした。正しいファイルを選択してください。",
    errorUnsupportedMedia: "このファイル形式には対応していません。画像、動画、GIFを選択してください。",
    errorInvalidGif: "このGIFを読み込めませんでした。別のGIFを使うか、動画に変換してからアップロードしてください。",
    errorMediaEncode: "素材の処理に失敗しました。別のファイルでお試しください。",
    errorGeneric: "{fallback}：{message}"
  }
};

const localeNames = {
  auto: "Auto",
  "zh-Hant": "繁體中文",
  en: "English",
  ja: "日本語"
};

function readStoredValue(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value === null || value === undefined ? fallback : value;
  } catch {
    return fallback;
  }
}

function writeStoredValue(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be blocked by browser settings; keep the app usable in memory.
  }
}

function detectLocale() {
  const saved = readStoredValue(LOCALE_STORAGE_KEY);
  if (saved && saved !== "auto") return saved;
  const language = (navigator.languages && navigator.languages[0] || navigator.language || "").toLowerCase();
  if (language.startsWith("ja")) return "ja";
  if (language.startsWith("en")) return "en";
  return "zh-Hant";
}

function currentLocale() {
  return i18n[state.locale || detectLocale()] ? state.locale || detectLocale() : "zh-Hant";
}

function t(key, params = {}) {
  const locale = currentLocale();
  const template = i18n[locale][key] || i18n["zh-Hant"][key] || key;
  return template.replace(/\{(\w+)\}/g, (_, name) => params[name] ?? "");
}

const categoryLocaleMap = {
  "国产手游": { "zh-Hant": "中國手遊", en: "Chinese Mobile Games", ja: "中国モバイルゲーム" },
  "国产IP改编手游": { "zh-Hant": "中國 IP 改編手遊", en: "Chinese IP Mobile Games", ja: "中国IP原作モバイルゲーム" },
  "国产动画": { "zh-Hant": "中國動畫", en: "Chinese Animation", ja: "中国アニメ" },
  "日系动画": { "zh-Hant": "日系動畫", en: "Japanese Anime", ja: "日本アニメ" },
  "日系手游": { "zh-Hant": "日系手遊", en: "Japanese Mobile Games", ja: "日本モバイルゲーム" },
  "日系游戏": { "zh-Hant": "日系遊戲", en: "Japanese Games", ja: "日本ゲーム" },
  "欧美游戏": { "zh-Hant": "歐美遊戲", en: "Western Games", ja: "欧米ゲーム" },
  "国产动画电影": { "zh-Hant": "中國動畫電影", en: "Chinese Animated Films", ja: "中国アニメ映画" },
  "国产漫画": { "zh-Hant": "中國漫畫", en: "Chinese Comics", ja: "中国コミック" },
  "国产网文": { "zh-Hant": "中國網文", en: "Chinese Web Novels", ja: "中国Web小説" },
  "国产游戏": { "zh-Hant": "中國遊戲", en: "Chinese Games", ja: "中国ゲーム" },
  "音游": { "zh-Hant": "音遊", en: "Rhythm Games", ja: "音楽ゲーム" },
  "潮玩": { "zh-Hant": "潮玩", en: "Designer Toys", ja: "デザイナーズトイ" }
};

const titleLocaleMap = {
  "《原神》": { en: "Genshin Impact", ja: "原神" },
  "《崩坏：星穹铁道》": { "zh-Hant": "《崩壞：星穹鐵道》", en: "Honkai: Star Rail", ja: "崩壊：スターレイル" },
  "《绝区零》": { "zh-Hant": "《絕區零》", en: "Zenless Zone Zero", ja: "ゼンレスゾーンゼロ" },
  "《崩坏3》": { "zh-Hant": "《崩壞3》", en: "Honkai Impact 3rd", ja: "崩壊3rd" },
  "《明日方舟》": { en: "Arknights", ja: "アークナイツ" },
  "《恋与深空》": { "zh-Hant": "《戀與深空》", en: "Love and Deepspace", ja: "恋と深空" },
  "《战双帕弥什》": { "zh-Hant": "《戰雙帕彌什》", en: "Punishing: Gray Raven", ja: "パニシング：グレイレイヴン" },
  "《阴阳师》": { "zh-Hant": "《陰陽師》", en: "Onmyoji", ja: "陰陽師" },
  "《少女前线》": { "zh-Hant": "《少女前線》", en: "Girls' Frontline", ja: "ドールズフロントライン" },
  "《王者荣耀》": { "zh-Hant": "《王者榮耀》", en: "Honor of Kings", ja: "Honor of Kings" },
  "《鸣潮》": { "zh-Hant": "《鳴潮》", en: "Wuthering Waves", ja: "鳴潮" },
  "《无限暖暖》": { "zh-Hant": "《無限暖暖》", en: "Infinity Nikki", ja: "インフィニティニキ" },
  "《闪耀暖暖》": { "zh-Hant": "《閃耀暖暖》", en: "Shining Nikki", ja: "シャイニングニキ" },
  "《重返未来：1999》": { "zh-Hant": "《重返未來：1999》", en: "Reverse: 1999", ja: "リバース：1999" },
  "《蔚蓝档案》": { "zh-Hant": "《蔚藍檔案》", en: "Blue Archive", ja: "ブルーアーカイブ" },
  "《第五人格》": { en: "Identity V", ja: "Identity V" },
  "《碧蓝航线》": { "zh-Hant": "《碧藍航線》", en: "Azur Lane", ja: "アズールレーン" },
  "《幻塔》": { en: "Tower of Fantasy", ja: "Tower of Fantasy" },
  "《罗小黑战记》": { "zh-Hant": "《羅小黑戰記》", en: "The Legend of Hei", ja: "羅小黒戦記" },
  "《时光代理人》": { "zh-Hant": "《時光代理人》", en: "Link Click", ja: "時光代理人 -LINK CLICK-" },
  "《天官赐福》": { "zh-Hant": "《天官賜福》", en: "Heaven Official's Blessing", ja: "天官賜福" },
  "《斗罗大陆》": { "zh-Hant": "《斗羅大陸》", en: "Soul Land", ja: "斗羅大陸" },
  "《魔道祖师》": { "zh-Hant": "《魔道祖師》", en: "Mo Dao Zu Shi", ja: "魔道祖師" },
  "《药师少女的独语》": { "zh-Hant": "《藥師少女的獨語》", en: "The Apothecary Diaries", ja: "薬屋のひとりごと" },
  "《间谍过家家》": { "zh-Hant": "《間諜家家酒》", en: "SPY x FAMILY", ja: "SPY×FAMILY" },
  "《进击的巨人》": { "zh-Hant": "《進擊的巨人》", en: "Attack on Titan", ja: "進撃の巨人" },
  "《咒术回战》": { "zh-Hant": "《咒術迴戰》", en: "Jujutsu Kaisen", ja: "呪術廻戦" },
  "《海贼王》": { "zh-Hant": "《航海王》", en: "ONE PIECE", ja: "ONE PIECE" },
  "《我独自升级》": { "zh-Hant": "《我獨自升級》", en: "Solo Leveling", ja: "俺だけレベルアップな件" },
  "《鬼灭之刃》": { "zh-Hant": "《鬼滅之刃》", en: "Demon Slayer: Kimetsu no Yaiba", ja: "鬼滅の刃" },
  "《火影忍者》": { en: "Naruto", ja: "NARUTO -ナルト-" },
  "《龙珠》": { "zh-Hant": "《七龍珠》", en: "Dragon Ball", ja: "ドラゴンボール" },
  "《哆啦A梦》": { "zh-Hant": "《哆啦A夢》", en: "Doraemon", ja: "ドラえもん" },
  "《美少女战士》": { "zh-Hant": "《美少女戰士》", en: "Sailor Moon", ja: "美少女戦士セーラームーン" },
  "《新世纪福音战士》": { "zh-Hant": "《新世紀福音戰士》", en: "Neon Genesis Evangelion", ja: "新世紀エヴァンゲリオン" },
  "《机动战士高达》": { "zh-Hant": "《機動戰士鋼彈》", en: "Mobile Suit Gundam", ja: "機動戦士ガンダム" },
  "《电锯人》": { "zh-Hant": "《鏈鋸人》", en: "Chainsaw Man", ja: "チェンソーマン" },
  "《灌篮高手》": { "zh-Hant": "《灌籃高手》", en: "Slam Dunk", ja: "SLAM DUNK" },
  "《钢之炼金术师》": { "zh-Hant": "《鋼之鍊金術師》", en: "Fullmetal Alchemist", ja: "鋼の錬金術師" },
  "《刀剑神域》": { "zh-Hant": "《刀劍神域》", en: "Sword Art Online", ja: "ソードアート・オンライン" },
  "《葬送的芙莉莲》": { "zh-Hant": "《葬送的芙莉蓮》", en: "Frieren: Beyond Journey's End", ja: "葬送のフリーレン" },
  "《命运-冠位指定》": { "zh-Hant": "《命運－冠位指定》", en: "Fate/Grand Order", ja: "Fate/Grand Order" },
  "《怪物弹珠》": { "zh-Hant": "《怪物彈珠》", en: "Monster Strike", ja: "モンスターストライク" },
  "《公主连结Re:Dive》": { "zh-Hant": "《超異域公主連結☆Re:Dive》", en: "Princess Connect! Re:Dive", ja: "プリンセスコネクト！Re:Dive" },
  "《塞尔达传说》": { "zh-Hant": "《薩爾達傳說》", en: "The Legend of Zelda", ja: "ゼルダの伝説" },
  "《超级马力欧》": { "zh-Hant": "《超級瑪利歐》", en: "Super Mario", ja: "スーパーマリオ" },
  "《最终幻想》": { "zh-Hant": "《Final Fantasy》", en: "Final Fantasy", ja: "ファイナルファンタジー" },
  "《勇者斗恶龙》": { "zh-Hant": "《勇者鬥惡龍》", en: "Dragon Quest", ja: "ドラゴンクエスト" },
  "《生化危机》": { "zh-Hant": "《惡靈古堡》", en: "Resident Evil", ja: "バイオハザード" },
  "《街头霸王》": { "zh-Hant": "《快打旋風》", en: "Street Fighter", ja: "ストリートファイター" },
  "《艾尔登法环》": { "zh-Hant": "《艾爾登法環》", en: "Elden Ring", ja: "ELDEN RING" },
  "《英雄联盟》": { "zh-Hant": "《英雄聯盟》", en: "League of Legends", ja: "リーグ・オブ・レジェンド" },
  "《无畏契约》": { "zh-Hant": "《特戰英豪》", en: "VALORANT", ja: "VALORANT" },
  "《使命召唤》": { "zh-Hant": "《決勝時刻》", en: "Call of Duty", ja: "Call of Duty" },
  "《侠盗猎车手》": { "zh-Hant": "《俠盜獵車手》", en: "Grand Theft Auto", ja: "グランド・セフト・オート" },
  "《魔兽世界》": { "zh-Hant": "《魔獸世界》", en: "World of Warcraft", ja: "World of Warcraft" },
  "《守望先锋》": { "zh-Hant": "《鬥陣特攻》", en: "Overwatch", ja: "オーバーウォッチ" },
  "《赛博朋克2077》": { "zh-Hant": "《電馭叛客2077》", en: "Cyberpunk 2077", ja: "サイバーパンク2077" },
  "《刺客信条》": { "zh-Hant": "《刺客教條》", en: "Assassin's Creed", ja: "アサシン クリード" },
  "《古墓丽影》": { "zh-Hant": "《古墓奇兵》", en: "Tomb Raider", ja: "トゥームレイダー" },
  "《最后生还者》": { "zh-Hant": "《最後生還者》", en: "The Last of Us", ja: "The Last of Us" },
  "《黑神话：悟空》": { "zh-Hant": "《黑神話：悟空》", en: "Black Myth: Wukong", ja: "黒神話：悟空" },
  "《初音未来：歌姬计划》": { "zh-Hant": "《初音未來：歌姬計畫》", en: "Hatsune Miku: Project DIVA", ja: "初音ミク -Project DIVA-" },
  "《美乐蒂》": { "zh-Hant": "《美樂蒂》", en: "My Melody", ja: "マイメロディ" },
  "《玉桂狗》": { en: "Cinnamoroll", ja: "シナモロール" },
  "《库洛米》": { "zh-Hant": "《酷洛米》", en: "Kuromi", ja: "クロミ" },
  "《懒蛋蛋》": { "zh-Hant": "《蛋黃哥》", en: "Gudetama", ja: "ぐでたま" },
  // User-provided title dictionary. Later entries intentionally override earlier guesses.
  "《崩坏：学园2》": {"zh-Hant": "《崩壞：學園2》", "en": "Honkai Gakuen 2 / Guns Girl Z", "ja": "崩壊学園"},
  "《明日方舟：终末地》": {"zh-Hant": "《明日方舟：終末地》", "en": "Arknights: Endfield", "ja": "アークナイツ：エンドフィールド"},
  "《深空之眼》": {"zh-Hant": "《深空之眼》", "en": "Aether Gazer", "ja": "エーテルゲイザー"},
  "《苍雾世界》": {"zh-Hant": "《蒼霧世界》", "en": "Azure Mist World (暫譯)", "ja": "蒼霧世界 (暫譯)"},
  "《少女前线2：追放》": {"zh-Hant": "《少女前線2：追放》", "en": "Girls' Frontline 2: Exilium", "ja": "ドールズフロントライン2：エクシリウム"},
  "《光与夜之恋》": {"zh-Hant": "《光與夜之戀》", "en": "Light and Night", "ja": "光と夜の恋"},
  "《星痕共鸣》": {"zh-Hant": "《星痕共鳴》", "en": "Resonance of Star (暫譯)", "ja": "星痕共鳴 (暫譯)"},
  "《蓝色星原：旅谣》": {"zh-Hant": "《藍色星原：旅謠》", "en": "Azur Promilia", "ja": "アズールプロミリア"},
  "《偶像梦幻祭2》": {"zh-Hant": "《偶像夢幻祭2》", "en": "Ensemble Stars!! Music", "ja": "あんさんぶるスターズ！！Music"},
  "《异环》": {"zh-Hant": "《異環》", "en": "Neverness to Everness (NTE)", "ja": "異環（Neverness to Everness）"},
  "《洛克王国：世界》": {"zh-Hant": "《洛克王國：世界》", "en": "Roco Kingdom: World", "ja": "ロックキングダム：ワールド"},
  "《和平精英》": {"zh-Hant": "《和平精英》", "en": "Game for Peace / PUBG Mobile", "ja": "ゲーム・フォー・ピース / PUBG MOBILE"},
  "《蛋仔派对》": {"zh-Hant": "《蛋仔派對》", "en": "Eggy Party", "ja": "エギーパーティー"},
  "《逆水寒手游》": {"zh-Hant": "《逆水寒手遊》", "en": "Justice Mobile", "ja": "逆水寒（Justice）"},
  "《梦幻西游手游》": {"zh-Hant": "《夢幻西遊手遊》", "en": "Fantasy Westward Journey Mobile", "ja": "夢幻西遊"},
  "《大话西游手游》": {"zh-Hant": "《大話西遊手遊》", "en": "Westward Journey Online Mobile", "ja": "大話西遊"},
  "《倩女幽魂手游》": {"zh-Hant": "《倩女幽魂手遊》", "en": "A Chinese Ghost Story Mobile", "ja": "チャイニーズゴーストストーリー"},
  "《天涯明月刀手游》": {"zh-Hant": "《天涯明月刀手遊》", "en": "Moonlight Blade Mobile", "ja": "天涯明月刀"},
  "《一梦江湖》": {"zh-Hant": "《一夢江湖》", "en": "Sword and Fairy / Life Makeover", "ja": "一夢江湖"},
  "《率土之滨》": {"zh-Hant": "《率土之濱》", "en": "Infinite Borders", "ja": "大三国志"},
  "《荒野行动》": {"zh-Hant": "《荒野行動》", "en": "Knives Out", "ja": "荒野行動"},
  "《三角洲行动》": {"zh-Hant": "《三角洲行動》", "en": "Delta Force: Hawk Ops", "ja": "Delta Force: Hawk Ops"},
  "《暗区突围》": {"zh-Hant": "《暗區突圍》", "en": "Arena Breakout", "ja": "アリーナブレイクアウト"},
  "《永劫无间手游》": {"zh-Hant": "《永劫無間手遊》", "en": "NARAKA: BLADEPOINT Mobile", "ja": "NARAKA: BLADEPOINT Mobile"},
  "《无尽冬日》": {"zh-Hant": "《無盡冬日》", "en": "Whiteout Survival", "ja": "ホワイトアウト・サバイバル"},
  "《寒霜启示录》": {"zh-Hant": "《寒霜啟示錄》", "en": "Frostpunk: Beyond the Ice", "ja": "フロストパンク：ビヨンド・ザ・アイス"},
  "《万国觉醒》": {"zh-Hant": "《萬國覺醒》", "en": "Rise of Kingdoms", "ja": "ライズ オブ キングダム"},
  "《剑与远征》": {"zh-Hant": "《劍與遠征》", "en": "AFK Arena", "ja": "AFKアリーナ"},
  "《白夜极光》": {"zh-Hant": "《白夜極光》", "en": "Alchemy Stars", "ja": "白夜極光"},
  "《尘白禁区》": {"zh-Hant": "《塵白禁區》", "en": "Snowbreak: Containment Zone", "ja": "スノウブレイク：禁域降臨"},
  "《奇迹暖暖》": {"zh-Hant": "《奇迹暖暖》", "en": "Love Nikki-Dress UP Queen", "ja": "ミラクルニキ"},
  "《以闪亮之名》": {"zh-Hant": "《以閃亮之名》", "en": "Life Makeover", "ja": "きらめきパラダイス"},
  "《香肠派对》": {"zh-Hant": "《香腸派對》", "en": "Sausage Man", "ja": "ソーセージマン"},
  "《最强蜗牛》": {"zh-Hant": "《最強蝸牛》", "en": "Super Snail", "ja": "最強でんでん"},
  "《一念逍遥》": {"zh-Hant": "《一念逍遙》", "en": "Overmortal", "ja": "仙境修行（暫譯）"},
  "《无期迷途》": {"zh-Hant": "《無期迷途》", "en": "Path to Nowhere", "ja": "無期迷途"},
  "《燕云十六声》": {"zh-Hant": "《燕雲十六聲》", "en": "Where Winds Meet", "ja": "Where Winds Meet"},
  "《白猫Project》": {"zh-Hant": "《白貓Project》", "en": "White Cat Project", "ja": "白猫プロジェクト"},
  "《第七史诗》": {"zh-Hant": "《第七史詩》", "en": "Epic Seven", "ja": "エピックセブン"},
  "《智龙迷城》": {"zh-Hant": "《智龍迷城》", "en": "Puzzle & Dragons", "ja": "パズル＆ドラゴンズ"},
  "《碧蓝幻想》": {"zh-Hant": "《碧藍幻想》", "en": "Granblue Fantasy", "ja": "グランブルーファンタジー"},
  "《赛马娘 芦毛灰姑娘》": {"zh-Hant": "《賽馬娘 蘆毛灰姑娘》", "en": "Umamusume: Cinderella Gray", "ja": "ウマ娘 シンデレラグレイ"},
  "《闪耀！优俊少女》": {"zh-Hant": "《閃耀！優俊少女》", "en": "Umamusume: Pretty Derby", "ja": "ウマ娘 プリティーダービー"},
  "《胜利女神：新的希望》": {"zh-Hant": "《勝利女神：新的希望》", "en": "GODDESS OF VICTORY: NIKKE", "ja": "勝利の女神：NIKKE"},
  "《SAKAMOTO DAYS 坂本日常》": {"zh-Hant": "《SAKAMOTO DAYS 坂本日常》", "en": "Sakamoto Days", "ja": "SAKAMOTO DAYS"},
  "《黑执事 绿之魔女篇》": {"zh-Hant": "《黑執事 綠之魔女篇》", "en": "Black Butler: Emerald Witch Arc", "ja": "黒執事 緑の魔女編"},
  "《咒术回战 死灭洄游》": {"zh-Hant": "《咒術迴戰 死滅迴游》", "en": "Jujutsu Kaisen: Culling Game", "ja": "呪術廻戦 死滅回游"},
  "《更衣人偶坠入爱河》": {"zh-Hant": "《戀上換裝娃娃》", "en": "My Dress-Up Darling", "ja": "その着せ替え人形は恋をする"},
  "《Re：从零开始的异世界生活》": {"zh-Hant": "《Re：從零開始的異世界生活》", "en": "Re:Zero - Starting Life in Another World", "ja": "Re:ゼロから始める異世界生活"},
  "《鬼灭之刃 柱训练篇》": {"zh-Hant": "《鬼滅之刃 柱訓練篇》", "en": "Demon Slayer: Hashira Training Arc", "ja": "鬼滅の刃 柱稽古編"},
  "《赛博朋克：边缘行者》": {"zh-Hant": "《電馭叛客：邊緣行者》", "en": "Cyberpunk: Edgerunners", "ja": "サイバーパンク エッジランナーズ"},
  "《蜡笔小新》": {"zh-Hant": "《蠟筆小新》", "en": "Crayon Shin-chan", "ja": "クレヨンしんちゃん"},
  "《死神》": {"zh-Hant": "《死神 / BLEACH》", "en": "BLEACH", "ja": "BLEACH"},
  "《排球少年！！》": {"zh-Hant": "《排球少年！！》", "en": "Haikyu!!", "ja": "ハイキュー!!"},
  "《JOJO的奇妙冒险》": {"zh-Hant": "《JOJO的奇妙冒險》", "en": "JoJo's Bizarre Adventure", "ja": "ジョジョの奇妙な冒険"},
  "《银魂》": {"zh-Hant": "《銀魂》", "en": "Gintama", "ja": "銀魂"},
  "《全职猎人》": {"zh-Hant": "《HUNTER×HUNTER 獵人》", "en": "Hunter × Hunter", "ja": "HUNTER×HUNTER"},
  "《数码宝贝》": {"zh-Hant": "《數碼寶貝》", "en": "Digimon", "ja": "デジモン"},
  "《游戏王》": {"zh-Hant": "《遊戲王》", "en": "Yu-Gi-Oh!", "ja": "遊☆戯☆王"},
  "《Fate/stay night》": {"zh-Hant": "《Fate/stay night》", "en": "Fate/stay night", "ja": "Fate/stay night"},
  "《我推的孩子》": {"zh-Hant": "《我推的孩子》", "en": "Oshi no Ko", "ja": "【推しの子】"},
  "《Love Live!》": {"zh-Hant": "《Love Live!》", "en": "Love Live!", "ja": "ラブライブ！"},
  "《光之美少女》": {"zh-Hant": "《光之美少女》", "en": "Pretty Cure / Precure", "ja": "プリキュア"},
  "《面包超人》": {"zh-Hant": "《麵包超人》", "en": "Anpanman", "ja": "アンパンマン"},
  "《东京卍复仇者》": {"zh-Hant": "《東京卍復仇者》", "en": "Tokyo Revengers", "ja": "東京卍リベンジャーズ"},
  "《犬夜叉》": {"zh-Hant": "《犬夜叉》", "en": "Inuyasha", "ja": "犬夜叉"},
  "《夏目友人帐》": {"zh-Hant": "《夏目友人帳》", "en": "Natsume's Book of Friends", "ja": "夏目友人帳"},
  "《黑子的篮球》": {"zh-Hant": "《黑子的籃球 / 影子籃球員》", "en": "Kuroko's Basketball", "ja": "黒子のバスケ"},
  "《文豪野犬》": {"zh-Hant": "《文豪Stray Dogs / 文豪野犬》", "en": "Bungo Stray Dogs", "ja": "文豪ストレイドッグス"},
  "《孤独摇滚！》": {"zh-Hant": "《孤獨搖滾！》", "en": "Bocchi the Rock!", "ja": "ぼっち・ざ・ろっく！"},
  "《哪吒之魔童降世》": {"zh-Hant": "《哪吒之魔童降世》", "en": "Ne Zha", "ja": "ナタ～魔童降臨～"},
  "《西游记之大圣归来》": {"zh-Hant": "《西遊記之大聖歸來》", "en": "Monkey King: Hero Is Back", "ja": "西遊記 ヒーロー・イズ・バック"},
  "《白蛇：缘起》": {"zh-Hant": "《白蛇：緣起》", "en": "White Snake", "ja": "白蛇：縁起"},
  "《长安三万里》": {"zh-Hant": "《長安三萬里》", "en": "Chang An", "ja": "長安三万里"},
  "《深海》": {"zh-Hant": "《深海》", "en": "Deep Sea", "ja": "深海（Deep Sea）"},
  "《刺客伍六七》": {"zh-Hant": "《刺客伍六七》", "en": "Scissor Seven", "ja": "シザー・セブン"},
  "《罗小黑战记》": {"zh-Hant": "《羅小黑戰記》", "en": "The Legend of Hei", "ja": "羅小黒戦記"},
  "《全职高手》": {"zh-Hant": "《全職高手》", "en": "The King's Avatar", "ja": "マスターオブスキル"},
  "《一人之下》": {"zh-Hant": "《一人之下》", "en": "The Outcast", "ja": "一人之下 the outcast"},
  "《狐妖小红娘》": {"zh-Hant": "《狐妖小紅娘》", "en": "Fox Spirit Matchmaker", "ja": "縁結びの妖狐ちゃん"},
  "《灵笼》": {"zh-Hant": "《靈籠》", "en": "Ling Long: Incarnation", "ja": "霊籠（Incarnation）"},
  "《暗喻幻想：ReFantazio》": {"zh-Hant": "《暗喻幻想：ReFantazio》", "en": "Metaphor: ReFantazio", "ja": "メタファー：リファンタジオ"},
  "《最终幻想7重置版》": {"zh-Hant": "《最終幻想7重製版》", "en": "Final Fantasy VII Remake", "ja": "ファイナルファンタジーVII リメイク"},
  "《歧路旅人》": {"zh-Hant": "《歧路旅人》", "en": "Octopath Traveler", "ja": "オクトパストラベラー"},
  "《碧蓝幻想：Relink》": {"zh-Hant": "《碧藍幻想：Relink》", "en": "Granblue Fantasy: Relink", "ja": "グランブルーファンタジー リリンク"},
  "《女神异闻录5皇家版》": {"zh-Hant": "《女神異聞錄5 皇家版》", "en": "Persona 5 Royal", "ja": "ペルソナ5 ザ・ロイヤル"},
  "《莱莎的炼金工房》": {"zh-Hant": "《萊莎的鍊金工房》", "en": "Atelier Ryza", "ja": "ライザのアトリエ"},
  "《真·女神转生5》": {"zh-Hant": "《真·女神轉生V》", "en": "Shin Megami Tensei V", "ja": "真・女神転生V"},
  "《铁拳》": {"zh-Hant": "《鐵拳》", "en": "Tekken", "ja": "鉄拳"},
  "《合金装备》": {"zh-Hant": "《潛龍諜影 / 合金裝備》", "en": "Metal Gear", "ja": "メタルギア"},
  "《恶魔城》": {"zh-Hant": "《惡魔城》", "en": "Castlevania", "ja": "悪魔城ドラキュラ"},
  "《洛克人》": {"zh-Hant": "《洛克人》", "en": "Mega Man / Rockman", "ja": "ロックマン"},
  "《如龙》": {"zh-Hant": "《人中之龍》", "en": "Yakuza / Like a Dragon", "ja": "龍が如く"},
  "《火焰之纹章》": {"zh-Hant": "《聖火降魔錄》", "en": "Fire Emblem", "ja": "ファイアーエムブレム"},
  "《星之卡比》": {"zh-Hant": "《星之卡比》", "en": "Kirby", "ja": "星のカービィ"},
  "《斯普拉遁》": {"zh-Hant": "《斯普拉遁》", "en": "Splatoon", "ja": "スプラトゥーン"},
  "《任天堂明星大乱斗》": {"zh-Hant": "《任天堂明星大亂鬥》", "en": "Super Smash Bros.", "ja": "大乱闘スマッシュブラザーズ"},
  "《尼尔》": {"zh-Hant": "《尼爾》", "en": "NieR", "ja": "ニーア"},
  "《黑暗之魂》": {"zh-Hant": "《黑暗靈魂》", "en": "Dark Souls", "ja": "ダークソウル"},
  "《战国无双》": {"zh-Hant": "《戰國無雙》", "en": "Samurai Warriors", "ja": "戦国無双"},
  "《真·三国无双》": {"zh-Hant": "《真·三國無雙》", "en": "Dynasty Warriors", "ja": "真・三國無双"},
  "《异度神剑》": {"zh-Hant": "《異度神劍》", "en": "Xenoblade Chronicles", "ja": "ゼノブレイド"},
  "《死亡搁浅》": {"zh-Hant": "《死亡擱淺》", "en": "Death Stranding", "ja": "デス・ストランディング"},
  "《Minecraft》": {"zh-Hant": "《Minecraft / 當個創世神》", "en": "Minecraft", "ja": "マインクラフト"},
  "《Roblox》": {"zh-Hant": "《Roblox / 機器磚塊》", "en": "Roblox", "ja": "ロブロックス"},
  "《Fortnite》": {"zh-Hant": "《Fortnite / 要塞英雄》", "en": "Fortnite", "ja": "フォートナイト"},
  "《荒野大镖客》": {"zh-Hant": "《碧血狂殺》", "en": "Red Dead Redemption", "ja": "レッド・デッド・リデンプション"},
  "《上古卷轴》": {"zh-Hant": "《上古卷軸》", "en": "The Elder Scrolls", "ja": "The Elder Scrolls"},
  "《辐射》": {"zh-Hant": "《異塵餘生》", "en": "Fallout", "ja": "Fallout"},
  "《光环》": {"zh-Hant": "《最後一戰》", "en": "Halo", "ja": "Halo"},
  "《毁灭战士》": {"zh-Hant": "《毀滅戰士》", "en": "DOOM", "ja": "DOOM"},
  "《魔兽争霸》": {"zh-Hant": "《魔獸爭霸》", "en": "Warcraft", "ja": "ウォークラフト"},
  "《暗黑破坏神》": {"zh-Hant": "《暗黑破壞神》", "en": "Diablo", "ja": "ディアブロ"},
  "《巫师》": {"zh-Hant": "《巫師》", "en": "The Witcher", "ja": "ウィッチャー"},
  "《战神》": {"zh-Hant": "《戰神》", "en": "God of War", "ja": "ゴッド・オブ・ウォー"},
  "《生化奇兵》": {"zh-Hant": "《生化奇兵》", "en": "BioShock", "ja": "バイオショック"},
  "《文明》": {"zh-Hant": "《文明帝國》", "en": "Civilization", "ja": "シヴィライゼーション"},
  "《星际争霸》": {"zh-Hant": "《星海爭霸》", "en": "StarCraft", "ja": "スタークラフト"},
  "《半条命》": {"zh-Hant": "《戰慄時空》", "en": "Half-Life", "ja": "ハーフライフ"},
  "《反恐精英》": {"zh-Hant": "《絕對武力 (CS)》", "en": "Counter-Strike", "ja": "カウンターストライク"},
  "《地平线：零之曙光》": {"zh-Hant": "《地平線：期待黎明》", "en": "Horizon Zero Dawn", "ja": "ホライゾン ゼロ ドーン"},
  "《诡秘之主》": {"zh-Hant": "《詭秘之主》", "en": "Lord of the Mysteries", "ja": "詭秘の主"},
  "《盗墓笔记》": {"zh-Hant": "《盜墓筆記》", "en": "The Lost Tomb / Daomu Biji", "ja": "盗墓筆記（とうぼひっき）"},
  "《鬼吹灯》": {"zh-Hant": "《鬼吹燈》", "en": "Ghost Blows Out the Light", "ja": "鬼吹灯（きすいとう）"},
  "《三体》": {"zh-Hant": "《三體》", "en": "The Three-Body Problem", "ja": "三体"},
  "《大奉打更人》": {"zh-Hant": "《大奉打更人》", "en": "Nightwatcher", "ja": "大奉打更人"},
  "《将夜》": {"zh-Hant": "《將夜》", "en": "Ever Night", "ja": "将夜"},
  "《雪中悍刀行》": {"zh-Hant": "《雪中悍刀行》", "en": "Sword Snow Stride", "ja": "雪中悍刀行"},
  "《赘婿》": {"zh-Hant": "《贅婿》", "en": "My Heroic Husband", "ja": "贅婿"},
  "《琅琊榜》": {"zh-Hant": "《琅琊榜》", "en": "Nirvana in Fire", "ja": "琅琊榜"},
  "《后宫甄嬛传》": {"zh-Hant": "《後宮甄嬛傳》", "en": "Empresses in the Palace", "ja": "宮廷の諍い女"},
  "《庆余年》": {"zh-Hant": "《慶餘年》", "en": "Joy of Life", "ja": "慶余年"},
  "《仙逆》": {"zh-Hant": "《仙逆》", "en": "Renegade Immortal", "ja": "仙逆"},
  "《凡人修仙传》": {"zh-Hant": "《凡人修仙傳》", "en": "A Record of a Mortal's Journey to Immortality", "ja": "凡人修仙伝"},
  "《诛仙》": {"zh-Hant": "《誅仙》", "en": "Jade Dynasty", "ja": "誅仙"},
  "《全职法师》": {"zh-Hant": "《全職法師》", "en": "Versatile Mage", "ja": "全職法師"},
  "《节奏大师》": {"zh-Hant": "《節奏大師》", "en": "Rhythm Master", "ja": "リズムマスター"},
  "《喵斯快跑》": {"zh-Hant": "《喵斯快跑》", "en": "Muse Dash", "ja": "Muse Dash"},
  "《Phigros》": {"zh-Hant": "《Phigros》", "en": "Phigros", "ja": "Phigros"},
  "《Cytus》": {"zh-Hant": "《Cytus》", "en": "Cytus", "ja": "Cytus"},
  "《Deemo》": {"zh-Hant": "《Deemo》", "en": "Deemo", "ja": "Deemo"},
  "《Arcaea》": {"zh-Hant": "《Arcaea》", "en": "Arcaea", "ja": "Arcaea"},
  "《BanG Dream! 少女乐团派对！》": {"zh-Hant": "《BanG Dream! 少女樂團派對》", "en": "BanG Dream! Girls Band Party!", "ja": "バンドリ！ ガールズバンドパーティ！"},
  "《世界计划 缤纷舞台！》": {"zh-Hant": "《世界計畫 繽紛舞台！》", "en": "HATSUNE MIKU: COLORFUL STAGE!", "ja": "プロジェクトセカイ カラフルステージ！"},
  "《maimai》": {"zh-Hant": "《maimai》", "en": "maimai", "ja": "maimai"},
  "《CHUNITHM》": {"zh-Hant": "《CHUNITHM》", "en": "CHUNITHM", "ja": "CHUNITHM (チュウニズム)"},
  "《太鼓达人》": {"zh-Hant": "《太鼓之達人》", "en": "Taiko no Tatsujin", "ja": "太鼓の達人"},
  "《Beat Saber》": {"zh-Hant": "《Beat Saber》", "en": "Beat Saber", "ja": "ビートセイバー"},
  "《节奏天国》": {"zh-Hant": "《節奏天國》", "en": "Rhythm Heaven / Rhythm Tengoku", "ja": "リズム天国"},
  "《戴森球计划》": {"zh-Hant": "《戴森球計劃》", "en": "Dyson Sphere Program", "ja": "ダイソンスフィアプログラム"},
  "《鬼谷八荒》": {"zh-Hant": "《鬼谷八荒》", "en": "Tale of Immortal", "ja": "鬼谷八荒"},
  "《中国式家长》": {"zh-Hant": "《中國式家長》", "en": "Chinese Parents", "ja": "中国式エリート悪徳官僚への道 (非官方)/ Chinese Parents"},
  "《烟火》": {"zh-Hant": "《煙火》", "en": "Firework", "ja": "ファイヤーワーク"},
  "《纸嫁衣》": {"zh-Hant": "《紙嫁衣》", "en": "Paper Bride", "ja": "紙装束"},
  "《波西亚时光》": {"zh-Hant": "《波西亞時光》", "en": "My Time at Portia", "ja": "きみのまち ポルティア"},
  "《沙石镇时光》": {"zh-Hant": "《沙石鎮時光》", "en": "My Time at Sandrock", "ja": "きみのまち サンドロック"},
  "《MOLLY茉莉》": {"zh-Hant": "《MOLLY茉莉》", "en": "MOLLY", "ja": "MOLLY (モリー)"},
  "《LABUBU拉布布》": {"zh-Hant": "《LABUBU拉布布》", "en": "LABUBU", "ja": "LABUBU (ラブブ)"},
  "《SKULLPANDA熊喵》": {"zh-Hant": "《SKULLPANDA熊喵》", "en": "SKULLPANDA", "ja": "SKULLPANDA"},
  "《DIMOO迪莫》": {"zh-Hant": "《DIMOO迪莫》", "en": "DIMOO", "ja": "DIMOO (ディムー)"},
  "《CRYBABY哭娃》": {"zh-Hant": "《CRYBABY哭娃》", "en": "CRYBABY", "ja": "CRYBABY"},
  "《Hello Kitty》": {"zh-Hant": "《Hello Kitty / 凱蒂貓》", "en": "Hello Kitty", "ja": "ハローキティ"},
  "《布丁狗》": {"zh-Hant": "《布丁狗》", "en": "Pompompurin", "ja": "ポムポムプリン"},
  "《酷企鹅》": {"zh-Hant": "《酷企鵝》", "en": "Badtz-Maru", "ja": "バッドばつ丸"},

};

const zhPhraseMap = {
  "手游": "手遊",
  "游戏": "遊戲",
  "动画": "動畫",
  "漫画": "漫畫",
  "网文": "網文",
  "欧美": "歐美",
  "国产": "中國",
  "改编": "改編",
  "星穹铁道": "星穹鐵道",
  "绝区零": "絕區零",
  "崩坏": "崩壞",
  "少女前线": "少女前線"
};

const zhCharMap = {
  国: "國", 产: "產", 动: "動", 画: "畫", 戏: "戲", 游: "遊", 编: "編", 网: "網", 欧: "歐",
  节: "節", 酱: "醬", 铁: "鐵", 绝: "絕", 终: "終", 恋: "戀", 战: "戰", 鸣: "鳴",
  无: "無", 闪: "閃", 蓝: "藍", 档: "檔", 线: "線", 阴: "陰", 阳: "陽", 师: "師",
  苍: "蒼", 过: "過", 发: "發", 现: "現", 华: "華", 龙: "龍", 门: "門", 风: "風",
  云: "雲", 剑: "劍", 侠: "俠", 猫: "貓", 马: "馬", 药: "藥", 独: "獨", 语: "語",
  执: "執", 绿: "綠", 缝: "縫", 间: "間", 谍: "諜", 进: "進", 击: "擊", 术: "術",
  贼: "賊", 级: "級", 灭: "滅", 训: "訓", 练: "練", 边: "邊", 电: "電", 锯: "鋸",
  钢: "鋼", 炼: "鍊", 宝: "寶", 贝: "貝", 骑: "騎", 团: "團", 连: "連", 缤: "繽",
  场: "場", 职: "職", 暗: "暗", 复: "復", 斗: "鬥", 恶: "惡", 萨: "薩", 达: "達",
  盗: "盜", 猎: "獵", 车: "車", 辐: "輻", 毁: "毀", 兽: "獸", 锋: "鋒", 条: "條",
  岛: "島", 远: "遠", 丽: "麗", 还: "還", 质: "質", 应: "應", 纪: "紀", 时: "時",
  记: "記", 体: "體", 开: "開", 盘: "盤", 飞: "飛", 问: "問", 尘: "塵", 劲: "勁",
  乐: "樂", 计: "計", 书: "書", 凉: "涼", 灵: "靈", 笼: "籠", 赐: "賜", 义: "義",
  礼: "禮", 叶: "葉", 万: "萬", 与: "與", 这: "這", 后: "後", 习: "習", 气: "氣"
};

function toTraditionalLabel(value) {
  let output = String(value || "");
  Object.keys(zhPhraseMap).forEach((key) => {
    output = output.replaceAll(key, zhPhraseMap[key]);
  });
  return Array.from(output).map((char) => zhCharMap[char] || char).join("");
}

function localizeTagLabel(label) {
  const raw = String(label || "");
  const locale = currentLocale();
  const mapped = titleLocaleMap[raw] && titleLocaleMap[raw][locale];
  if (mapped) return mapped;
  if (locale !== "zh-Hant" && titleLocaleMap[raw] && titleLocaleMap[raw]["zh-Hant"]) return titleLocaleMap[raw]["zh-Hant"];
  return toTraditionalLabel(raw);
}

const DEFAULT_TAG_CATEGORIES = [{
  name: "国产手游",
  tags: ["《原神》", "《崩坏：星穹铁道》", "《绝区零》", "《崩坏3》", "《崩坏：学园2》", "《明日方舟》", "《明日方舟：终末地》", "《恋与深空》", "《战双帕弥什》", "《深空之眼》", "《阴阳师》", "《少女前线》", "《苍雾世界》", "《王者荣耀》", "《鸣潮》", "《无限暖暖》", "《闪耀暖暖》", "《重返未来：1999》", "《蔚蓝档案》", "《少女前线2：追放》", "《光与夜之恋》", "《星痕共鸣》", "《蓝色星原：旅谣》", "《偶像梦幻祭2》", "《异环》", "《洛克王国：世界》", "《和平精英》", "《第五人格》", "《蛋仔派对》", "《逆水寒手游》", "《梦幻西游手游》", "《大话西游手游》", "《倩女幽魂手游》", "《天涯明月刀手游》", "《一梦江湖》", "《率土之滨》", "《荒野行动》", "《三角洲行动》", "《暗区突围》", "《永劫无间手游》", "《无尽冬日》", "《寒霜启示录》", "《万国觉醒》", "《剑与远征》", "《碧蓝航线》", "《白夜极光》", "《尘白禁区》", "《幻塔》", "《天谕手游》", "《问道手游》", "《奇迹暖暖》", "《以闪亮之名》", "《香肠派对》", "《最强蜗牛》", "《一念逍遥》", "《浮生为卿歌》", "《江南百景图》", "《小森生活》", "《开心消消乐》", "《元梦之星》", "《无期迷途》", "《燕云十六声》"]
}, {
  name: "国产IP改编手游",
  tags: ["《火影忍者：木叶高手》", "《葫芦娃大作战》", "《剑网3：指尖江湖》", "", "《伍六七：暗影交锋》", "《仙逆H5》", "《新不良人》", "《镇魂街：破晓》", "", "《凹凸世界》", "《空之要塞：启航》", "《苍之骑士团2》", "《斗罗大陆》", "《斗破苍穹》", "《完美世界》", "《凡人修仙传》", "《一人之下》", "《狐妖小红娘》", "《秦时明月》", "《画江湖之不良人》", "《镇魂街》", "《全职高手》", "《庆余年》", "《诛仙》", "《吞噬星空》", "《雪鹰领主》", "《择天记》", "《大主宰》", "《武动乾坤》", "《天龙八部》", "《射雕英雄传》", "《神雕侠侣》", "《倚天屠龙记》", "《仙剑奇侠传》", "《轩辕剑》", "《古剑奇谭》", "《剑侠情缘》", "《葫芦娃》", "《喜羊羊与灰太狼》", "《熊出没》", "《哪吒》", "《大圣归来》", "《少年歌行》", "《魔道祖师》", "", "《从前有座灵剑山》", "《全职法师》", "《龙族》"]
}, {
  name: "国产动画",
  tags: ["《罗小黑战记》", "", "《非人哉》", "《灵笼》", "《长歌行》", "", "", "", "《仙逆》", "《剑来》", "《神印王座》", "《斩神》", "", "《诡秘之主》", "《仙帝归来》", "《仙王的日常生活》", "", "《遮天》", "", "《斗罗大陆Ⅱ绝世唐门》", "《牧神记》", "《师兄啊师兄》", "《天官赐福》", "", "《时光代理人》", "", "", "", "《星辰变》", "《沧元图》", "", "", "《一念永恒》", "《中国奇谭》", "《雾山五行》", "《刺客伍六七》", "", "", "", "《天行九歌》", "", "《百妖谱》", "《眷思量》", "《京剧猫》", "", "", "《开心超人联盟》", "《大理寺日志》", "《魁拔》", "《纳米核心》", "", "", "《妖神记》", "《万界仙踪》", "《武庚纪》", "《西行纪》", "《怪物大师》"]
}, {
  name: "日系动画",
  tags: ["《SAKAMOTO DAYS 坂本日常》", "《药师少女的独语》", "《黑执事 绿之魔女篇》", "《赛马娘 芦毛灰姑娘》", "《记忆缝线》", "《碧蓝之海》", "《间谍过家家》", "《进击的巨人》", "《咒术回战 死灭洄游》", "《海贼王》", "《更衣人偶坠入爱河》", "《我独自升级》", "《Re：从零开始的异世界生活》", "", "《鬼灭之刃》", "《鬼灭之刃 柱训练篇》", "《赛博朋克：边缘行者》", "", "《火影忍者》", "《龙珠》", "《咒术回战》", "《哆啦A梦》", "《蜡笔小新》", "《美少女战士》", "《新世纪福音战士》", "《机动战士高达》", "《死神》", "《排球少年！！》", "", "《电锯人》", "《灌篮高手》", "《JOJO的奇妙冒险》", "《银魂》", "《全职猎人》", "《钢之炼金术师》", "", "《数码宝贝》", "《游戏王》", "《Fate/stay night》", "《刀剑神域》", "《葬送的芙莉莲》", "《我推的孩子》", "《Love Live!》", "《光之美少女》", "《面包超人》", "《东京卍复仇者》", "《犬夜叉》", "《夏目友人帐》", "《黑子的篮球》", "《文豪野犬》", "《孤独摇滚！》"]
}, {
  name: "日系手游",
  tags: ["《命运-冠位指定》", "《闪耀！优俊少女》", "《胜利女神：新的希望》", "《第七史诗》", "", "", "", "《怪物弹珠》", "《智龙迷城》", "《偶像大师》", "《碧蓝幻想》", "《公主连结Re:Dive》", "《BanG Dream! 少女乐团派对！》", "《Love Live! 学园偶像祭》", "《世界计划 缤纷舞台！feat. 初音未来》", "《刀剑乱舞》", "《Another Eden：穿越时空的猫》", "《白猫Project》", "《七龙珠Z 爆裂激战》", "《Pokémon GO》", "《最终幻想：勇气启示录》", "《勇者斗恶龙WALK》", "《NieR Re[in]carnation》", "《SINoALICE》", "《魔法纪录 魔法少女小圆外传》", "《东方LostWord》", "《实况力量棒球》", "《职业棒球魂A》"]
}, {
  name: "日系游戏",
  tags: ["《暗喻幻想：ReFantazio》", "《最终幻想7重置版》", "《歧路旅人》", "《碧蓝幻想：Relink》", "《鬼灭之刃 火之神血风谭2》", "《机动战士高达 激战任务2》", "《JOJO的奇妙冒险 群星之战 重制版》", "《七龙珠 电光炸裂！ZERO》", "《女神异闻录5皇家版》", "《七龙珠 破界斗士》", "《伊苏X -北境历险》", "《莱莎的炼金工房》", "《亚路塔：狐狸狐途的面包冒险》", "《真·女神转生5》", "", "《超级马力欧》", "《塞尔达传说》", "《最终幻想》", "《勇者斗恶龙》", "《生化危机》", "", "《街头霸王》", "《铁拳》", "《合金装备》", "《恶魔城》", "《洛克人》", "《真·女神转生》", "《女神异闻录》", "《如龙》", "《火焰之纹章》", "", "《星之卡比》", "《斯普拉遁》", "《任天堂明星大乱斗》", "《尼尔》", "《黑暗之魂》", "《艾尔登法环》", "《传说系列》", "《皇牌空战》", "《太鼓达人》", "《死或生》", "《忍者龙剑传》", "《樱花大战》", "《牧场物语》", "《逆转裁判》", "《寂静岭》", "《王国之心》", "《鬼泣》", "《战国无双》", "《真·三国无双》", "《零》", "《异度神剑》", "《死亡搁浅》"]
}, {
  name: "欧美游戏",
  tags: ["《英雄联盟》", "《Minecraft》", "《Roblox》", "《Fortnite》", "《无畏契约》", "《使命召唤》", "《侠盗猎车手》", "《荒野大镖客》", "《上古卷轴》", "《辐射》", "《光环》", "《毁灭战士》", "《魔兽争霸》", "《魔兽世界》", "《暗黑破坏神》", "《守望先锋》", "《巫师》", "《赛博朋克2077》", "《刺客信条》", "《孤岛惊魂》", "《古墓丽影》", "《战神》", "《最后生还者》", "《神秘海域》", "《EA Sports FC》", "《极品飞车》", "《模拟人生》", "《战地》", "《质量效应》", "《龙腾世纪》", "《生化奇兵》", "《真人快打》", "《文明》", "《星际争霸》", "《半条命》", "《传送门》", "《反恐精英》", "《Apex英雄》", "《命运》", "《无主之地》", "《极限竞速》", "《地平线：零之曙光》", "《杀手》", "《看门狗》", "《彩虹六号》", "《波斯王子》"]
}, {
  name: "国产动画电影",
  tags: ["《哪吒之魔童闹海》", "《哪吒之魔童降世》", "《西游记之大圣归来》", "《白蛇：缘起》", "《白蛇2：青蛇劫起》", "《新神榜：杨戬》", "《新神榜：哪吒重生》", "《长安三万里》", "《深海》", "《姜子牙》", "《大鱼海棠》", "", "《雄狮少年》", "", "", "", "《风语咒》", "《小门神》", "《大护法》", "《昨日青空》", "《茶啊二中》", "《伞少女》", "《天书奇谭》", "《宝莲灯》", "《阿唐奇遇》", "《新大头儿子和小头爸爸》"]
}, {
  name: "国产漫画",
  tags: ["", "《我是大神仙》", "", "", "", "《快把我哥带走》", "《中国惊奇先生》", "《尸兄》", "《我叫白小飞》", "《妖怪名单》", "《拾又之国》", "《镖人》", "《端脑》", "《血族》", "《子不语》", "", "《19天》", "《SQ从你的名字开始》", "", "《降灵记》", "《通灵妃》", "《王牌御史》", "《雏蜂》", "《偷星九月天》", "《星海镖师》", "", "", "", "《记忆U盘》", "《日月同错》", "《情绪病》", "《开局一座山》", "《放开那个女巫》", "《谁让他修仙的！》", "《道诡异仙》", "《大王饶命》", "《绍宋》"]
}, {
  name: "国产网文",
  tags: ["", "", "《人渣反派自救系统》（小说）", "", "", "", "", "", "", "", "", "", "《盗墓笔记》", "《鬼吹灯》", "《三体》", "《大奉打更人》", "《将夜》", "", "《雪中悍刀行》", "《赘婿》", "《琅琊榜》", "《花千骨》", "《后宫甄嬛传》", "", "", "", "", "", "《盘龙》", "《莽荒纪》", "", "", "《神墓》", "", "《求魔》", "", "《深海余烬》", "《第一序列》", "《修真聊天群》", "", "", "", "", "", "", "《斗罗大陆Ⅲ龙王传说》", "《斗罗大陆Ⅳ终极斗罗》", "《我欲封天》", "《飞剑问道》", "《圣墟》"]
}, {
  name: "国产游戏",
  tags: ["《黑神话：悟空》", "《王者荣耀：世界》", "《异环》", "《洛克王国：世界》", "", "", "", "", "《流星蝴蝶剑》", "《三国群英传》", "《大富翁》", "《幻想三国志》", "《风色幻想》", "《河洛群侠传》", "《侠客风云传》", "《太吾绘卷》", "《戴森球计划》", "《鬼谷八荒》", "《中国式家长》", "《烟火》", "《纸嫁衣》", "《影之刃》", "《永劫无间》", "《逆水寒》", "《天涯明月刀》", "《剑网3》", "《梦幻西游》", "《大话西游》", "《问道》", "《征途》", "", "", "《原神》", "《崩坏》", "《明日方舟》", "", "《少女前线》", "《隐形守护者》", "《了不起的修仙模拟器》", "《波西亚时光》", "《沙石镇时光》", "《暖雪》", "《霓虹深渊》", "《暗影火炬城》", "《昭和米国物语》", "《燕云十六声》"]
}, {
  name: "音游",
  tags: ["《节奏大师》", "《QQ炫舞》", "《QQ炫舞手游》", "《劲舞团》", "《劲舞团手游》", "《恋舞OL》", "《同步音律喵赛克》", "", "《喵斯快跑》", "《Phigros》", "《Lanota》", "《Orzmic》", "《Rizline》", "《Cytus》", "《Cytus II》", "《Deemo》", "《Deemo II》", "《VOEZ》", "《Arcaea》", "《Dynamix》", "《Malody》", "《KALPA》", "《Rotaeno》", "", "", "《D4DJ Groovy Mix》", "", "", "《THE IDOLM@STER Cinderella Girls Starlight Stage》", "", "《maimai》", "《CHUNITHM》", "《SOUND VOLTEX》", "《Beatmania IIDX》", "《DanceDanceRevolution》", "《GITADORA》", "《jubeat》", "《节奏天国》", "《初音未来：歌姬计划》", "《Groove Coaster》", "《Pianista》", "《Piano Tiles》", "《Magic Tiles 3》", "《Beat Saber》", "《Friday Night Funkin’》", "《A Dance of Fire and Ice》", "《Crypt of the NecroDancer》", "《Just Dance》"]
}, {
  name: "潮玩",
  tags: ["《YOYO右右酱》", "《MOLLY茉莉》", "《THE MONSTERS》", "《LABUBU拉布布》", "《SKULLPANDA熊喵》", "《DIMOO迪莫》", "《CRYBABY哭娃》", "《Hello Kitty》", "《HIRONO小野》", "《PUCKY毕奇》", "《BOBO&COCO》", "《Zsiga》", "《VIVICAT懒猫》", "《DUCKOO鸭子》", "《美乐蒂》", "《玉桂狗》", "《库洛米》", "《酷企鹅》", "《布丁狗》", "《懒蛋蛋》"]
}];

function localizeTagCategories(categories) {
  const locale = currentLocale();
  return (Array.isArray(categories) ? categories : []).map((category) => {
    const name = category && category.name ? String(category.name) : "";
    const localizedName = categoryLocaleMap[name]?.[locale] || categoryLocaleMap[name]?.["zh-Hant"] || toTraditionalLabel(name);
    return {
      ...category,
      originalName: name,
      name: localizedName,
      tags: (category.tags || []).map((tag) => {
        if (!tag) return "";
        if (typeof tag === "string") return localizeTagLabel(tag);
        const tagName = tag.name || tag.label || tag.title || "";
        const localizedTag = localizeTagLabel(tagName);
        return { ...tag, originalName: tagName, name: localizedTag, label: localizedTag, title: localizedTag };
      })
    };
  });
}

function normalizeTagSearchText(value) {
  return String(value || "").trim().toLocaleLowerCase();
}

function tagDisplayName(tag) {
  return typeof tag === "string" ? tag : tag?.name || tag?.title || tag?.label || "";
}

function tagOptionEntries(categories, categoryIndex, query) {
  const normalizedQuery = normalizeTagSearchText(query);
  const sourceCategories = normalizedQuery ? categories : [categories[categoryIndex] || categories[0]];
  const sourceOffset = normalizedQuery ? 0 : categoryIndex;
  return sourceCategories.flatMap((category, sourceIndex) => {
    const catIndex = normalizedQuery ? sourceIndex : sourceOffset;
    const categoryName = category?.name || "";
    return (category?.tags || []).map((tag, tagIndex) => {
      const tagName = tagDisplayName(tag);
      return { category, catIndex, tag, tagIndex, categoryName, tagName };
    }).filter((entry) => {
      if (!entry.tagName) return false;
      if (!normalizedQuery) return true;
      const haystack = normalizeTagSearchText(`${entry.categoryName} ${entry.tagName}`);
      return haystack.includes(normalizedQuery);
    });
  }).slice(0, 200);
}

function resolveTagPayload(categories, payload) {
  const catIndex = categories.findIndex((category, index) => categoryId(category, index) === Number(payload?.category));
  const category = catIndex >= 0 ? categories[catIndex] : null;
  const tagIndex = category && Array.isArray(category.tags)
    ? category.tags.findIndex((tag, index) => tagId(tag, index) === Number(payload?.tagId))
    : -1;
  const tag = category && tagIndex >= 0 ? category.tags[tagIndex] : null;
  return {
    category: Number(payload?.category) || 0,
    tagId: Number(payload?.tagId) || 0,
    categoryName: category ? category.name : `${t("category")} ${Number(payload?.category) || 0}`,
    tagName: tag ? tagDisplayName(tag) : `${t("tag")} ${Number(payload?.tagId) || 0}`
  };
}

const routes = [
  ["devices", "navDevices", renderDevices],
  ["detail", "navDetail", renderDetail],
  ["card", "navCard", renderCard],
  ["media", "navMedia", renderMedia],
  ["tags", "navTags", renderTags],
  ["settings", "navSettings", renderDeviceSettings],
  ["firmware", "navFirmware", renderFirmware],
  ["appsettings", "navAppSettings", renderAppSettings]
];

const initialState = () => ({
  currentRoute: "devices",
  currentDeviceId: "",
  devices: [],
  pendingDevice: null,
  receivedCardsByDevice: {},
  deviceSettings: {
    disableLight: false,
    disableBuzzer: false,
    disableVibration: false,
    disableBroadcast: false,
    disableInterestSensing: false,
    disableAmbienceLight: false,
    controlInfoBytes: [1, 1, 1, 1, 1, 0, 0, 1]
  },
  appSettings: {
    transferChunkDelay: 8,
    mediaEditBeforeUpload: false,
    mediaQuality: "high",
    mediaLayout: "cover",
    mediaZoom: 100,
    mediaOffsetX: 0,
    mediaOffsetY: 0,
    mediaCaption: "",
    mediaCaptionX: 50,
    mediaCaptionY: 82,
    mediaCaptionSize: 18,
    mediaCaptionColor: "#ffffff",
    mediaCaptionBackgroundEnabled: true,
    mediaCaptionBackgroundColor: "#000000",
    mediaCaptionBackgroundOpacity: 58,
    mediaCaptionFont: "system",
    mediaCaptionCustomFont: "",
    mediaCaptionBold: true,
    mediaCaptionItalic: false,
    mediaCaptionDirection: "horizontal",
    mediaClipStartMs: 0,
    mediaClipEndMs: MOTION_MAX_DURATION_MS,
    firmwareAdvancedVisible: false,
    firmwareRiskAccepted: false
  },
  firmwareBusy: false,
  mediaBusy: false,
  localeMode: readStoredValue(LOCALE_STORAGE_KEY, "auto"),
  locale: detectLocale(),
  tagCategories: []
});

let state = loadState();
let activeTransferAbort = false;
let toastTimer = null;
let lastRenderedRoute = "";
let receivedCardsSyncing = false;
let detailAutoRefreshing = false;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const cached = JSON.parse(readStoredValue(STORAGE_KEY, "null") || "null");
    const base = initialState();
    const loaded = {
      ...base,
      ...(cached || {}),
      appSettings: { ...base.appSettings, ...((cached || {}).appSettings || {}) },
      firmwareBusy: false,
      mediaBusy: false
    };
    if (loaded.currentRoute === "received") loaded.currentRoute = "card";
    loaded.currentRoute = "devices";
    loaded.devices = Array.isArray(loaded.devices) ? loaded.devices.map((device) => ({ ...device, connected: false })) : [];
    return loaded;
  } catch {
    return initialState();
  }
}

function saveState() {
  const storedState = {
    ...state,
    devices: state.devices.map((device) => ({ ...device, connected: false }))
  };
  writeStoredValue(STORAGE_KEY, JSON.stringify(storedState));
}

function setState(patch) {
  state = { ...state, ...patch };
  saveState();
  render();
}

function ensureAppSettings() {
  const defaults = initialState().appSettings;
  if (!state.appSettings || typeof state.appSettings !== "object") state.appSettings = {};
  state.appSettings = { ...defaults, ...state.appSettings };
  return state.appSettings;
}

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), String(message || "").length > 80 ? 8000 : 2600);
}

function setBanner(message = "") {
  banner.textContent = message;
  banner.classList.toggle("show", Boolean(message));
}

function formatError(error, fallback = t("saveFailed")) {
  const message = String(error && (error.message || error.name) || fallback);
  if (/User cancelled|cancelled|canceled|NotFoundError/i.test(message)) return t("errorCanceled");
  if (message === t("refreshRequiresConnection") || message === t("errorNoConnection")) return message;
  if (/GATT|Bluetooth|NetworkError|disconnected/i.test(message)) return t("errorBluetooth", { fallback });
  if (/timeout|超时/i.test(message)) return t("errorTimeout", { fallback });
  return t("errorGeneric", { fallback, message: localizeKnownErrorMessage(message) });
}

function localizeKnownErrorMessage(message) {
  if (/請先連接設備|请先连接设备|藍牙未連接|蓝牙未连接|no connection|not connected/i.test(message)) return t("errorNoConnection");
  if (/只接受|太小|太大|不像|official \.bin|too small|too large|does not look|小さすぎ|大きすぎ|公式.*\.bin|見えません/i.test(message)) return message;
  if (/Firmware|firmware|韌體|ファームウェア|Device returned error|update|OTA|damaged|incompatible|does not match|empty|official \.bin|\.bin|too small|too large/i.test(message)) return t("errorFirmwareFile");
  if (/Unsupported media type/i.test(message)) return t("errorUnsupportedMedia");
  if (/GIF|Not a valid GIF|GIF file|GIF data|LZW|color table/i.test(message)) return t("errorInvalidGif");
  if (/Canvas export failed|No frames to encode|video|media/i.test(message)) return t("errorMediaEncode");
  return message;
}

function getCurrentDevice() {
  return state.devices.find((item) => item.id === state.currentDeviceId || item.sn === state.currentDeviceId) || state.devices[0] || null;
}

function isDeviceLive(device) {
  if (!device || !ble.device || !ble.device.gatt || !ble.device.gatt.connected) return false;
  if (ble.connection?.bleDeviceId && device.bleDeviceId && ble.connection.bleDeviceId === device.bleDeviceId) return true;
  if (state.currentDeviceId && (device.id === state.currentDeviceId || device.sn === state.currentDeviceId)) return true;
  return false;
}

function upsertDevice(device) {
  const normalized = {
    id: device.sn || device.id || `web-${Date.now()}`,
    sn: device.sn || device.id || "",
    mac: device.mac || "",
    name: device.name || "MoniCard",
    battery: device.battery ?? "--",
    usedStorageLabel: device.usedStorageLabel || "--",
    totalStorageLabel: device.totalStorageLabel || "--",
    storagePercent: Number(device.storagePercent) || 0,
    statusLabel: device.statusLabel || t("disconnected"),
    signalStrength: device.signalStrength || 0,
    connected: false,
    firmwareVersion: device.firmwareVersion || "--",
    latestFirmwareVersion: device.latestFirmwareVersion || "--",
    cardPreview: device.cardPreview || "",
    tagCategory: device.tagCategory || "",
    tagName: device.tagName || "",
    carouselDuration: device.carouselDuration || 0,
    bleDeviceId: device.bleDeviceId || ""
  };
  const index = state.devices.findIndex((item) => item.id === normalized.id || item.sn === normalized.sn);
  if (index >= 0) state.devices[index] = { ...state.devices[index], ...normalized };
  else state.devices.unshift(normalized);
  state.currentDeviceId = normalized.id;
  saveState();
  return normalized;
}

function updateDevice(id, patch) {
  state.devices = state.devices.map((item) => item.id === id || item.sn === id ? { ...item, ...patch } : item);
  saveState();
}

function bytesToHex(bytes) {
  return Array.from(bytes || []).map((byte) => byte.toString(16).padStart(2, "0")).join(" ");
}

function readUint16(bytes, offset) {
  return (bytes[offset] | (bytes[offset + 1] << 8)) >>> 0;
}

function readUint32(bytes, offset) {
  return (bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24)) >>> 0;
}

function pushUint16(out, value) {
  out.push(value & 255, (value >> 8) & 255);
}

function pushUint32(out, value) {
  out.push(value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255);
}

function concatBytes(parts) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  parts.forEach((part) => {
    out.set(part, offset);
    offset += part.length;
  });
  return out;
}

function asciiBytes(text) {
  return new Uint8Array(Array.from(String(text || "")).map((char) => char.charCodeAt(0) & 255));
}

function utf8Bytes(text) {
  return encoder.encode(String(text || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n"));
}

function trimZeros(bytes) {
  let end = bytes.length;
  while (end > 0 && bytes[end - 1] === 0) end -= 1;
  return bytes.slice(0, end);
}

function textFromBytes(bytes) {
  return decoder.decode(trimZeros(bytes || new Uint8Array())).replace(/\u0000/g, "").trim();
}

function encodeFrame(category, payload) {
  const head = [category, 0];
  pushUint16(head, payload.length);
  return concatBytes([new Uint8Array(head), payload]);
}

function encodeLengthPrefixedMessage(category, command, payload = new Uint8Array()) {
  const head = [];
  pushUint16(head, command);
  pushUint16(head, payload.length);
  return encodeFrame(category, concatBytes([new Uint8Array(head), payload]));
}

function encodeControl(command, payload = new Uint8Array()) {
  const head = [];
  pushUint16(head, command);
  return encodeFrame(CATEGORY.CONTROL, concatBytes([new Uint8Array(head), payload]));
}

function encodeReadCardInfo() {
  return encodeControl(CONTROL_COMMAND.READ_CARD_INFO, new Uint8Array([1]));
}

function encodeSetCardInfo(text) {
  const payload = utf8Bytes(text);
  if (payload.length > CARD_INFO_MAX_BYTES) throw new Error(`名片内容超过 ${CARD_INFO_MAX_BYTES} 字节限制`);
  return encodeControl(CONTROL_COMMAND.SET_CARD_INFO, payload);
}

function encodeGetSerialNumber() {
  return encodeControl(CONTROL_COMMAND.GET_SERIAL_NUMBER, new Uint8Array([1, 0]));
}

function encodeGetVersion() {
  return encodeControl(CONTROL_COMMAND.GET_VERSION, new Uint8Array([1, 0]));
}

function encodeGetBattery() {
  return encodeControl(CONTROL_COMMAND.GET_BATTERY, new Uint8Array([1, 0]));
}

function encodeGetFileSystemInfo() {
  return encodeControl(CONTROL_COMMAND.GET_FS_INFO, new Uint8Array([1]));
}

function encodeReadControlInfo() {
  return encodeControl(CONTROL_COMMAND.CONTROL_INFO, new Uint8Array([1]));
}

function encodeWriteControlInfo(bytes) {
  if (!bytes || bytes.length !== CONTROL_INFO_BYTES) throw new Error("控制資訊必須為 8 位元組");
  return encodeControl(CONTROL_COMMAND.CONTROL_INFO, concatBytes([new Uint8Array([2]), new Uint8Array(bytes)]));
}

function encodeSetTags(tags) {
  const list = Array.isArray(tags) ? tags : [];
  if (list.length > TAGS_MAX_COUNT) throw new Error(`標籤最多設定 ${TAGS_MAX_COUNT} 個`);
  const payload = [list.length & 255];
  list.forEach((tag) => {
    payload.push(Number(tag.category || tag.categoryId) & 255);
    pushUint16(payload, Number(tag.tagId || tag.id) || 0);
  });
  return encodeControl(CONTROL_COMMAND.SET_TAGS, new Uint8Array(payload));
}

function encodeReadCardsCount() {
  return encodeControl(CONTROL_COMMAND.READ_CARDS_COUNT, new Uint8Array([1]));
}

function encodeReadCardById(id) {
  return encodeControl(CONTROL_COMMAND.READ_CARD_BY_ID, new Uint8Array([1, id & 255]));
}

function encodeDeleteCard(id) {
  return encodeControl(CONTROL_COMMAND.DELETE_CARD, new Uint8Array([2, id & 255]));
}

function encodeSetCarousel(seconds) {
  const value = Math.max(0, Math.min(Number(seconds) || 0, 3600));
  return encodeControl(CONTROL_COMMAND.SET_CAROUSEL, new Uint8Array([value & 255, (value >> 8) & 255]));
}

function encodeReadCarousel() {
  return encodeControl(CONTROL_COMMAND.READ_CAROUSEL, new Uint8Array([1]));
}

function encodeFileTransferStart(size, fileType) {
  const payload = [];
  pushUint16(payload, fileType);
  payload.push(2);
  pushUint32(payload, size);
  return encodeLengthPrefixedMessage(CATEGORY.FILE, FILE_COMMAND.START_REQUEST, new Uint8Array(payload));
}

function encodeFileInfoRequest(blockCount) {
  const payload = [];
  pushUint32(payload, blockCount);
  return encodeLengthPrefixedMessage(CATEGORY.FILE, FILE_COMMAND.FILE_INFO_REQUEST, new Uint8Array(payload));
}

function encodeFileSendStart(size, name) {
  const nameBytes = asciiBytes(name);
  const payload = [];
  pushUint32(payload, size);
  pushUint16(payload, nameBytes.length);
  return encodeLengthPrefixedMessage(CATEGORY.FILE, FILE_COMMAND.FILE_SEND_START_REQUEST, concatBytes([new Uint8Array(payload), nameBytes]));
}

function encodeFileSendData(index, bytes) {
  const payload = [];
  pushUint32(payload, index);
  return encodeLengthPrefixedMessage(CATEGORY.FILE, FILE_COMMAND.FILE_SEND_DATA_REQUEST, concatBytes([new Uint8Array(payload), bytes]));
}

function encodeFileSendEnd() {
  return encodeLengthPrefixedMessage(CATEGORY.FILE, FILE_COMMAND.FILE_SEND_END_REQUEST, new Uint8Array([0, 0]));
}

function encodeFileTransferEnd() {
  return encodeLengthPrefixedMessage(CATEGORY.FILE, FILE_COMMAND.END_REQUEST, new Uint8Array());
}

function fileTransferBytes(bytes) {
  const alignedLength = (bytes.length + 3) & -4;
  const aligned = new Uint8Array(alignedLength);
  aligned.set(bytes);
  const crc = crc32Mpeg2(aligned);
  const out = new Uint8Array(alignedLength + 4);
  out.set(aligned);
  out[alignedLength] = crc & 255;
  out[alignedLength + 1] = (crc >>> 8) & 255;
  out[alignedLength + 2] = (crc >>> 16) & 255;
  out[alignedLength + 3] = (crc >>> 24) & 255;
  return { bytes: out, alignedLength, totalLength: out.length, crc };
}

function filePacketSize(mtu = 247) {
  const value = Number(mtu) || 247;
  const byMtu = Math.max(256, 50 * Math.max(value - 7, 1) - 8);
  return Math.max(256, Math.min(10240, byMtu));
}

function crc32Mpeg2(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte << 24;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 0x80000000) ? ((crc << 1) ^ 0x04c11db7) >>> 0 : (crc << 1) >>> 0;
    }
  }
  return crc >>> 0;
}

function looksLikeWrongFirmwareFile(bytes) {
  if (!bytes || bytes.length < 16) return true;
  const signature = Array.from(bytes.slice(0, 16)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  const ascii = textFromBytes(bytes.slice(0, 16)).toLowerCase();
  return signature.startsWith("504b0304") ||
    signature.startsWith("89504e47") ||
    signature.startsWith("47494638") ||
    signature.startsWith("25504446") ||
    signature.startsWith("ffd8ff") ||
    ascii.includes("<!doctype") ||
    ascii.includes("<html") ||
    ascii.includes("ftyp");
}

async function validateFirmwareFile(file) {
  const name = String(file?.name || "");
  if (!/\.bin$/i.test(name)) throw new Error(t("firmwareOnlyBin"));
  if (!file || file.size <= 0) throw new Error("Firmware file is empty");
  if (file.size < FIRMWARE_MIN_BYTES) throw new Error(t("firmwareTooSmall"));
  if (file.size > FIRMWARE_MAX_BYTES) throw new Error(t("firmwareTooLarge"));
  const header = new Uint8Array(await file.slice(0, 32).arrayBuffer());
  if (looksLikeWrongFirmwareFile(header)) throw new Error(t("firmwareLooksWrong"));
}

function encodeOta(command, payload = new Uint8Array()) {
  const head = [];
  pushUint16(head, command);
  pushUint16(head, payload.length);
  return encodeFrame(CATEGORY.OTA, concatBytes([new Uint8Array(head), payload]));
}

function encodeOtaPackageStart(totalBytes, packetCount, crc) {
  const payload = [];
  pushUint32(payload, totalBytes);
  pushUint32(payload, packetCount);
  pushUint32(payload, crc);
  payload.push(2, 0, 0, 0);
  return encodeOta(SIFLI_OTA_COMMAND.IMAGE_PACKAGE_START_REQUEST, new Uint8Array(payload));
}

function encodeOtaPackagePacket(index, bytes, crc) {
  const payload = [];
  pushUint32(payload, index);
  pushUint32(payload, bytes.length);
  pushUint32(payload, crc);
  return encodeOta(SIFLI_OTA_COMMAND.IMAGE_PACKAGE_PACKET_REQUEST, concatBytes([new Uint8Array(payload), bytes]));
}

function encodeOtaPackageEnd() {
  return encodeOta(SIFLI_OTA_COMMAND.IMAGE_PACKAGE_END_REQUEST, new Uint8Array([0, 0]));
}

function otaPayload(message) {
  if (!message?.data || message.data.length < 2) return new Uint8Array();
  const length = readUint16(message.data, 0);
  return message.data.slice(2, 2 + length);
}

function otaErrorMessage(code) {
  const map = {
    3: "Storage is full",
    5: "Firmware does not match this device",
    6: "Firmware version is incompatible",
    7: "Firmware version is incompatible",
    8: "Firmware file is damaged",
    9: "Firmware file is damaged",
    10: "Device is already updating",
    13: "Transfer was interrupted"
  };
  return map[code] || `Device returned error ${code}`;
}

function parseOtaPackageStart(message) {
  const payload = otaPayload(message);
  const resultCode = payload.length >= 2 ? readUint16(payload, 0) : -1;
  if (resultCode !== 0) throw new Error(otaErrorMessage(resultCode));
  return {
    responseFrequency: payload.length >= 3 ? payload[2] : 1,
    completedCount: payload.length >= 8 ? readUint32(payload, 4) : 0
  };
}

function parseOtaPackagePacket(message, expectedIndex) {
  const payload = otaPayload(message);
  const resultCode = payload.length >= 2 ? readUint16(payload, 0) : -1;
  const retransmission = payload.length >= 3 ? payload[2] : 0;
  const completedCount = payload.length >= 8 ? readUint32(payload, 4) : 0;
  if (resultCode !== 0) throw new Error(retransmission ? `${otaErrorMessage(resultCode)}. Please restart the update.` : otaErrorMessage(resultCode));
  if (completedCount && completedCount < expectedIndex) throw new Error("Device update progress is inconsistent. Please restart the update.");
  return { resultCode, retransmission, completedCount };
}

function parseOtaPackageEnd(message) {
  const payload = otaPayload(message);
  const resultCode = payload.length >= 2 ? readUint16(payload, 0) : -1;
  if (resultCode !== 0) throw new Error(otaErrorMessage(resultCode));
  return resultCode;
}

function splitFrame(frame, mtu = 247) {
  const limit = Math.max(20, mtu - 7);
  if (frame.length <= limit) {
    const head = [frame[0], 0];
    pushUint16(head, frame.length - 4);
    return [concatBytes([new Uint8Array(head), frame.slice(4)])];
  }
  const chunks = [];
  for (let offset = 0; offset < frame.length - 4;) {
    const remaining = frame.length - 4 - offset;
    const size = Math.min(limit, remaining);
    if (offset === 0) {
      const head = [frame[0], 1];
      pushUint16(head, frame.length - 4);
      chunks.push(concatBytes([new Uint8Array(head), frame.slice(4, 4 + size)]));
    } else {
      chunks.push(concatBytes([new Uint8Array([frame[0], remaining > limit ? 2 : 3]), frame.slice(4 + offset, 4 + offset + size)]));
    }
    offset += size;
  }
  return chunks;
}

function parseNotification(raw, fragmentState) {
  const bytes = raw instanceof Uint8Array ? raw : new Uint8Array(raw);
  if (!bytes.length) return null;
  const type = bytes[1];
  if (type === 0) {
    const length = readUint16(bytes, 2);
    return bytes.slice(0, 4 + length);
  }
  if (type === 1) {
    fragmentState.value = { category: bytes[0], length: readUint16(bytes, 2), chunks: [bytes.slice(4)] };
    return null;
  }
  if (!fragmentState.value) return null;
  fragmentState.value.chunks.push(bytes.slice(2));
  if (type !== 3) return null;
  const payload = concatBytes(fragmentState.value.chunks).slice(0, fragmentState.value.length);
  const frame = new Uint8Array(4 + fragmentState.value.length);
  frame[0] = fragmentState.value.category;
  frame[1] = 0;
  frame[2] = fragmentState.value.length & 255;
  frame[3] = (fragmentState.value.length >> 8) & 255;
  frame.set(payload, 4);
  fragmentState.value = null;
  return frame;
}

function parseMessage(frame) {
  if (!frame || frame.length < 6) return null;
  const category = frame[0];
  const length = readUint16(frame, 2);
  const payload = frame.slice(4, 4 + length);
  const command = readUint16(payload, 0);
  return { category, command, data: payload.slice(2) };
}

function statusFromResponse(message) {
  return !message || message.data.length < 2 ? 0 : readUint16(message.data, 0);
}

function ensureFileOk(message, fallback) {
  const status = statusFromResponse(message);
  if (status === 0) return message;
  const messages = {
    1: "設備儲存空間不足，請刪除部分素材後重試",
    2: "檔案類型不被設備支援",
    3: "檔案大小超出設備限制",
    4: "檔案名稱格式不正確",
    5: "傳輸校驗失敗，請重試"
  };
  throw new Error(messages[status] || `${fallback || "檔案傳輸失敗"}(${status})`);
}

class MoniCardWebBluetooth {
  constructor() {
    this.device = null;
    this.server = null;
    this.characteristic = null;
    this.mtu = 247;
    this.pending = [];
    this.fragmentState = { value: null };
    this.connection = null;
  }

  isSupported() {
    return Boolean(navigator.bluetooth && window.isSecureContext);
  }

  async requestAndConnect() {
    if (!this.isSupported()) throw new Error("目前瀏覽器或頁面環境不支援 Web Bluetooth");
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "MoniCard" }, ...SERVICE_UUIDS.map((service) => ({ services: [service] }))],
      optionalServices: SERVICE_UUIDS
    });
    return this.connectDevice(device);
  }

  async connectDevice(device) {
    this.device = device;
    this.device.addEventListener("gattserverdisconnected", () => this.handleDisconnected());
    this.server = await device.gatt.connect();
    const service = await this.getMoniCardService();
    this.characteristic = await this.getMoniCardCharacteristic(service);
    await this.characteristic.startNotifications();
    this.characteristic.addEventListener("characteristicvaluechanged", (event) => this.handleNotification(event));
    this.connection = { bleDeviceId: device.id, name: device.name || "MoniCard" };
    return this.connection;
  }

  async getMoniCardService() {
    let lastError = null;
    for (const uuid of SERVICE_UUIDS) {
      try {
        return await this.server.getPrimaryService(uuid);
      } catch (error) {
        lastError = error;
      }
    }
    const accessible = await this.listAccessibleServices();
    const error = new Error(`MoniCard service not found. Tried: ${SERVICE_UUIDS.join(", ")}. Accessible services: ${accessible.join(", ") || "none"}`);
    error.cause = lastError;
    throw error;
  }

  async getMoniCardCharacteristic(service) {
    let lastError = null;
    for (const uuid of DATA_CHARACTERISTIC_UUIDS) {
      try {
        return await service.getCharacteristic(uuid);
      } catch (error) {
        lastError = error;
      }
    }
    const accessible = await this.listAccessibleCharacteristics(service);
    const error = new Error(`MoniCard data characteristic not found. Tried: ${DATA_CHARACTERISTIC_UUIDS.join(", ")}. Accessible characteristics: ${accessible.join(", ") || "none"}`);
    error.cause = lastError;
    throw error;
  }

  async listAccessibleServices() {
    try {
      const services = await this.server.getPrimaryServices();
      return services.map((service) => service.uuid);
    } catch {
      return [];
    }
  }

  async listAccessibleCharacteristics(service) {
    try {
      const characteristics = await service.getCharacteristics();
      return characteristics.map((characteristic) => characteristic.uuid);
    } catch {
      return [];
    }
  }

  async connectGranted(savedDevice = {}) {
    if (!navigator.bluetooth?.getDevices) throw new Error(t("refreshRequiresConnection"));
    const devices = await navigator.bluetooth.getDevices();
    const target = devices.find((device) => {
      return device.id === savedDevice.bleDeviceId || device.name === savedDevice.name || /monicard/i.test(device.name || "");
    });
    if (!target) throw new Error("沒有找到已授權的 MoniCard，請重新點擊連接設備");
    return this.connectDevice(target);
  }

  async readTagsFromAdvertisement(savedDevice = {}, options = {}) {
    if (!navigator.bluetooth?.requestLEScan) throw new Error("BLE_ADVERTISEMENT_UNSUPPORTED");
    const timeout = Number(options.timeout) || 6500;
    const expectedCount = Number.isInteger(Number(options.expectedCount)) ? Number(options.expectedCount) : -1;
    return new Promise(async (resolve, reject) => {
      let scan = null;
      let settled = false;
      let bestMatch = null;
      const finish = (callback) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        navigator.bluetooth.removeEventListener("advertisementreceived", handleAdvertisement);
        try {
          scan?.stop();
        } catch {
          // Some browser builds throw after an already-stopped scan.
        }
        callback();
      };
      const matchesDevice = (event) => {
        if (savedDevice?.bleDeviceId && event.device?.id === savedDevice.bleDeviceId) return true;
        return /monicard/i.test(`${event.device?.name || ""} ${event.name || ""}`);
      };
      const handleAdvertisement = (event) => {
        if (!matchesDevice(event)) return;
        const parsed = parseAdvertisementTags(event);
        const result = {
          bleDeviceId: event.device?.id || "",
          name: event.device?.name || event.name || "MoniCard",
          found: Boolean(parsed.found),
          count: parsed.count || 0,
          tags: parsed.tags || [],
          expectedCount,
          matchesExpectedCount: expectedCount < 0 || parsed.count === expectedCount
        };
        if (result.found) {
          bestMatch = result;
          if (expectedCount >= 0 && result.matchesExpectedCount) finish(() => resolve(result));
        } else if (!bestMatch) {
          bestMatch = result;
        }
      };
      const timer = setTimeout(() => {
        finish(() => {
          if (bestMatch) resolve(bestMatch);
          else reject(new Error("未讀取到設備標籤廣播"));
        });
      }, timeout);
      try {
        navigator.bluetooth.addEventListener("advertisementreceived", handleAdvertisement);
        scan = await navigator.bluetooth.requestLEScan({
          filters: [{ namePrefix: "MoniCard" }, ...SERVICE_UUIDS.map((service) => ({ services: [service] }))],
          keepRepeatedDevices: true
        });
      } catch (error) {
        finish(() => reject(error));
      }
    });
  }

  async disconnect() {
    this.pending.splice(0).forEach((item) => {
      clearTimeout(item.timer);
      item.reject(new Error("藍牙連線已關閉"));
    });
    if (this.device && this.device.gatt.connected) this.device.gatt.disconnect();
    this.device = null;
    this.server = null;
    this.characteristic = null;
    this.connection = null;
  }

  handleDisconnected() {
    const current = getCurrentDevice();
    if (current) updateDevice(current.id, { connected: false, statusLabel: t("deviceDisconnected") });
    this.connection = null;
    this.pending.splice(0).forEach((item) => item.reject(new Error("藍牙連線已斷開")));
      toast(t("deviceDisconnected"));
    render();
  }

  handleNotification(event) {
    const frame = parseNotification(new Uint8Array(event.target.value.buffer), this.fragmentState);
    const message = parseMessage(frame);
    if (!message) return;
    const index = this.pending.findIndex((item) => item.command === message.command && item.category === message.category);
    if (index >= 0) {
      const item = this.pending.splice(index, 1)[0];
      clearTimeout(item.timer);
      item.resolve(message);
    }
  }

  async writeFrame(frame) {
    if (!this.characteristic) throw new Error("藍牙未連接");
    const chunks = splitFrame(frame, this.mtu);
    for (const chunk of chunks) {
      if (this.characteristic.writeValueWithoutResponse) await this.characteristic.writeValueWithoutResponse(chunk);
      else await this.characteristic.writeValue(chunk);
      await sleep(4);
    }
  }

  async request(frame, category, command, timeout = 5000) {
    const response = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending = this.pending.filter((item) => item.timer !== timer);
        reject(new Error("設備回應逾時"));
      }, timeout);
      this.pending.push({ category, command, resolve, reject, timer });
    });
    try {
      await this.writeFrame(frame);
    } catch (error) {
      this.pending = this.pending.filter((item) => item.command !== command || item.category !== category);
      throw error;
    }
    return response;
  }

  async control(frame, command, timeout = 5000) {
    return this.request(frame, CATEGORY.CONTROL, command, timeout);
  }

  async file(frame, command, timeout = 10000) {
    return this.request(frame, CATEGORY.FILE, command, timeout);
  }

  async ota(frame, command, timeout = 60000) {
    return this.request(frame, CATEGORY.OTA, command, timeout);
  }

  async readSummary(device = {}) {
    await this.ensureConnected();
    const sn = textFromBytes((await this.control(encodeGetSerialNumber(), CONTROL_COMMAND.GET_SERIAL_NUMBER + 1)).data);
    const batteryMessage = await this.control(encodeGetBattery(), CONTROL_COMMAND.GET_BATTERY + 1).catch(() => null);
    const versionMessage = await this.control(encodeGetVersion(), CONTROL_COMMAND.GET_VERSION + 1).catch(() => null);
    const fsMessage = await this.control(encodeGetFileSystemInfo(), CONTROL_COMMAND.GET_FS_INFO_RESPONSE).catch(() => null);
    const fs = parseFsInfo(fsMessage);
    const summary = {
      id: sn || device.id || this.device.id,
      sn: sn || "",
      bleDeviceId: this.device.id,
      name: device.name || this.device.name || "MoniCard",
      connected: true,
      statusLabel: t("online"),
      battery: batteryMessage && batteryMessage.data.length >= 2 ? readUint16(batteryMessage.data, 0) : "--",
      firmwareVersion: versionMessage ? textFromBytes(versionMessage.data) || "--" : "--",
      ...formatFsInfo(fs)
    };
    this.connection = { ...this.connection, ...summary };
    return summary;
  }

  async ensureConnected() {
    if (!this.device || !this.device.gatt.connected) throw new Error("請先連接設備");
    return this.connection;
  }

  async readCardInfo() {
    await this.ensureConnected();
    const message = await this.control(encodeReadCardInfo(), CONTROL_COMMAND.RESP_READ_CARD, 1500);
    return textFromBytes(message.data);
  }

  async writeCardInfo(text) {
    await this.ensureConnected();
    const message = await this.control(encodeSetCardInfo(text), CONTROL_COMMAND.RESP_CARD_INFO, 2500);
    const status = statusFromResponse(message);
    if (status !== 0) throw new Error(`名片寫入失敗(${status})`);
    return { cardInfo: text, byteLength: utf8Bytes(text).length };
  }

  async readControlSettings() {
    await this.ensureConnected();
    const message = await this.control(encodeReadControlInfo(), CONTROL_COMMAND.CONTROL_INFO_RESPONSE, 5000);
    if (!message.data || message.data.length < CONTROL_INFO_BYTES) throw new Error("設備控制資訊回應異常");
    return settingsFromControlBytes(message.data.slice(0, CONTROL_INFO_BYTES));
  }

  async writeControlSettings(settings) {
    await this.ensureConnected();
    const normalized = normalizeSettings(settings);
    const message = await this.control(encodeWriteControlInfo(normalized.controlInfoBytes), CONTROL_COMMAND.CONTROL_INFO_RESPONSE, 5000);
    const status = statusFromResponse(message);
    if (status !== 0) throw new Error(`寫入設備設定失敗(${status})`);
    return normalized;
  }

  async readCarousel() {
    await this.ensureConnected();
    const message = await this.control(encodeReadCarousel(), CONTROL_COMMAND.RESP_CAROUSEL_RD, 5000);
    return message.data.length >= 2 ? readUint16(message.data, 0) : 0;
  }

  async writeCarousel(seconds) {
    await this.ensureConnected();
    const message = await this.control(encodeSetCarousel(seconds), CONTROL_COMMAND.RESP_CAROUSEL, 5000);
    const status = statusFromResponse(message);
    if (status !== 0) throw new Error("設定輪播間隔失敗");
    return seconds;
  }

  async writeTags(tags) {
    await this.ensureConnected();
    const message = await this.control(encodeSetTags(tags), CONTROL_COMMAND.RESP_TAGS, 5000);
    const status = statusFromResponse(message);
    if (status !== 0) throw new Error(`寫入標籤失敗(${status})`);
    return tags;
  }

  async readFileSystemInfo() {
    await this.ensureConnected();
    const message = await this.control(encodeGetFileSystemInfo(), CONTROL_COMMAND.GET_FS_INFO_RESPONSE, 5000);
    return parseFsInfo(message);
  }

  async syncReceivedCards(onProgress) {
    await this.ensureConnected();
    const countMessage = await this.control(encodeReadCardsCount(), CONTROL_COMMAND.RESP_CARDS_COUNT, 1500);
    const count = countMessage.data.length >= 2 ? readUint16(countMessage.data, 0) : 0;
    const cards = [];
    for (let id = count - 1; id >= 1; id -= 1) {
      onProgress?.(t("syncingCard", { index: count - id, total: Math.max(count - 1, 0) }));
      const message = await this.control(encodeReadCardById(id), CONTROL_COMMAND.RESP_CARD_BY_ID, 2000);
      const card = parseReceivedCard(message.data);
      if (card) cards.push(card);
    }
    return { totalCount: count, cards };
  }

  async deleteReceivedCard(id) {
    await this.ensureConnected();
    const message = await this.control(encodeDeleteCard(id), CONTROL_COMMAND.RESP_DELETE_CARD, 1500);
    const status = statusFromResponse(message);
    if (status !== 0) throw new Error(`刪除名片失敗(${status})`);
  }

  async transferFile(file, type, onProgress) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    return this.transferBytes(bytes, safeFileName(file.name), type, onProgress);
  }

  async transferBytes(bytes, fileName, type, onProgress) {
    await this.ensureConnected();
    activeTransferAbort = false;
    const prepared = fileTransferBytes(bytes);
    const safeName = safeFileName(fileName);
    const fsMessage = await this.control(encodeGetFileSystemInfo(), CONTROL_COMMAND.GET_FS_INFO_RESPONSE, 5000).catch(() => null);
    const fs = parseFsInfo(fsMessage);
    if (fs && Number.isFinite(fs.freeBytes)) {
      const needed = prepared.totalLength + FILE_TRANSFER_FREE_MARGIN_BYTES;
      if (needed > fs.freeBytes) {
        const error = new Error(t("storageInsufficient", { needed: formatBytes(needed), free: formatBytes(fs.freeBytes) }));
        error.code = "STORAGE_INSUFFICIENT";
        throw error;
      }
    }
    const start = await this.file(encodeFileTransferStart(prepared.totalLength, type), FILE_COMMAND.START_RESPONSE, 12000);
    ensureFileOk(start, "檔案傳輸初始化失敗");
    const fileBlockSize = 10240;
    const fileBlocks = Math.max(1, Math.ceil(prepared.totalLength / fileBlockSize));
    const chunkSize = filePacketSize(this.mtu);
    const chunks = [];
    for (let offset = 0; offset < prepared.bytes.length; offset += chunkSize) chunks.push(prepared.bytes.slice(offset, offset + chunkSize));
    ensureFileOk(await this.file(encodeFileInfoRequest(fileBlocks), FILE_COMMAND.FILE_INFO_RESPONSE, 10000), "檔案區塊資訊提交失敗");
    ensureFileOk(await this.file(encodeFileSendStart(prepared.totalLength, safeName), FILE_COMMAND.FILE_SEND_START_RESPONSE, 10000), "檔案開始傳輸失敗");
    for (let block = 0; block < chunks.length; block += 1) {
      if (activeTransferAbort) throw new Error("傳輸已取消");
      ensureFileOk(await this.file(encodeFileSendData(block, chunks[block]), FILE_COMMAND.FILE_SEND_DATA_RESPONSE, 12000), "檔案分包寫入失敗");
      onProgress?.(Math.min(100, 20 + Math.round(((block + 1) / chunks.length) * 72)));
      await sleep(Number(ensureAppSettings().transferChunkDelay) || 0);
    }
    ensureFileOk(await this.file(encodeFileSendEnd(), FILE_COMMAND.FILE_SEND_END_RESPONSE, 12000), "檔案結束確認失敗");
    ensureFileOk(await this.file(encodeFileTransferEnd(), FILE_COMMAND.END_RESPONSE, 12000), "檔案總結束確認失敗");
    return { fileName: safeName, type, byteLength: bytes.length, transferSize: prepared.totalLength, crc: prepared.crc };
  }

  async transferFirmwarePackage(file, onProgress) {
    await this.ensureConnected();
    activeTransferAbort = false;
    await validateFirmwareFile(file);
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!bytes.length) throw new Error("Firmware file is empty");
    const packetCount = Math.max(1, Math.ceil(bytes.length / OTA_PACKAGE_PACKET_BYTES));
    const packageCrc = crc32Mpeg2(bytes);
    onProgress?.({ percent: 2, message: t("firmwarePreparing", { name: file.name }) });
    const start = await this.ota(
      encodeOtaPackageStart(bytes.length, packetCount, packageCrc),
      SIFLI_OTA_COMMAND.IMAGE_PACKAGE_START_RESPONSE,
      180000
    );
    const startInfo = parseOtaPackageStart(start);
    const responseFrequency = Math.max(1, Number(startInfo.responseFrequency) || 1);
    const completedCount = Math.max(0, Math.min(Number(startInfo.completedCount) || 0, packetCount));
    for (let packetIndex = completedCount + 1; packetIndex <= packetCount; packetIndex += 1) {
      if (activeTransferAbort) throw new Error("傳輸已取消");
      const offset = OTA_PACKAGE_PACKET_BYTES * (packetIndex - 1);
      const packet = bytes.slice(offset, offset + OTA_PACKAGE_PACKET_BYTES);
      const frame = encodeOtaPackagePacket(packetIndex, packet, crc32Mpeg2(packet));
      if (packetIndex % responseFrequency === 0 || packetIndex === packetCount) {
        const response = await this.ota(frame, SIFLI_OTA_COMMAND.IMAGE_PACKAGE_PACKET_RESPONSE, 60000);
        parseOtaPackagePacket(response, packetIndex);
      } else {
        await this.writeFrame(frame);
      }
      const percent = 8 + Math.round((packetIndex / packetCount) * 84);
      onProgress?.({ percent, message: t("firmwareProgress", { percent }) });
      await sleep(Number(ensureAppSettings().transferChunkDelay) || 0);
    }
    onProgress?.({ percent: 94, message: t("firmwareInstalling") });
    const end = await this.ota(encodeOtaPackageEnd(), SIFLI_OTA_COMMAND.IMAGE_PACKAGE_END_RESPONSE, 180000);
    parseOtaPackageEnd(end);
    onProgress?.({ percent: 100, message: t("firmwareReconnectHint") });
    return { fileName: safeFileName(file.name), byteLength: bytes.length, packetCount, crc: packageCrc };
  }
}

const ble = new MoniCardWebBluetooth();

function parseFsInfo(message) {
  if (!message || !message.data || message.data.length < 12) return null;
  const blockSize = readUint32(message.data, 0);
  const totalBlocks = readUint32(message.data, 4);
  const freeBlocks = readUint32(message.data, 8);
  return { blockSize, totalBlocks, freeBlocks, totalBytes: blockSize * totalBlocks, freeBytes: blockSize * freeBlocks };
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "--";
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024 / 1024).toFixed(1)}G`;
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)}M`;
  return `${Math.round(bytes / 1024)}K`;
}

function formatFsInfo(fs) {
  if (!fs) return { usedStorageLabel: "--", totalStorageLabel: "--", storagePercent: 0 };
  const rawUsed = Math.max(0, fs.totalBytes - fs.freeBytes);
  const used = Math.max(0, rawUsed - RESERVED_STORAGE_BYTES);
  const total = Math.max(0, fs.totalBytes - RESERVED_STORAGE_BYTES);
  return {
    usedStorageLabel: formatBytes(used),
    totalStorageLabel: formatBytes(total),
    storagePercent: total ? Math.max(0, Math.min(Math.round((used / total) * 100), 100)) : 0
  };
}

function settingsFromControlBytes(bytes) {
  const normalized = Array.from(bytes || []).slice(0, CONTROL_INFO_BYTES);
  while (normalized.length < CONTROL_INFO_BYTES) normalized.push(1);
  return {
    disableBroadcast: normalized[0] === 0,
    disableBuzzer: normalized[1] === 0,
    disableVibration: normalized[2] === 0,
    disableLight: normalized[3] === 0,
    disableInterestSensing: normalized[4] === 0,
    disableAmbienceLight: normalized[5] === 0,
    controlInfoBytes: normalized
  };
}

function normalizeSettings(settings) {
  const bytes = Array.isArray(settings.controlInfoBytes) ? settings.controlInfoBytes.slice(0, CONTROL_INFO_BYTES) : [1, 1, 1, 1, 1, 0, 0, 1];
  while (bytes.length < CONTROL_INFO_BYTES) bytes.push(1);
  const map = [
    "disableBroadcast",
    "disableBuzzer",
    "disableVibration",
    "disableLight",
    "disableInterestSensing",
    "disableAmbienceLight"
  ];
  map.forEach((key, index) => {
    if (typeof settings[key] === "boolean") bytes[index] = settings[key] ? 0 : 1;
  });
  return settingsFromControlBytes(bytes);
}

function parseReceivedCard(data) {
  if (!data || data.length < 14 || data[0] !== 0) return null;
  const sourceId = data[1];
  const sourceMac = textFromBytes(data.slice(2, 14)).replace(/[^0-9a-f]/gi, "").toUpperCase();
  const detail = textFromBytes(data.slice(14));
  const firstLine = detail.split("\n").find(Boolean) || sourceMac || t("card");
  const receivedAt = new Date().toLocaleString("zh-CN", { hour12: false });
  return {
    id: sourceMac ? `recv-${sourceMac}` : `recv-id-${sourceId}`,
    sourceId,
    sourceMac,
    title: firstLine.trim().slice(0, 2) || t("card"),
    description: firstLine,
    detail,
    receivedAt
  };
}

function dataViewBytes(view) {
  if (!view) return new Uint8Array();
  return new Uint8Array(view.buffer, view.byteOffset || 0, view.byteLength || view.buffer?.byteLength || 0);
}

function parseTagPayloadBytes(bytes) {
  const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || []);
  for (let offset = 0; offset < data.length - 1; offset += 1) {
    if (data[offset] !== 1) continue;
    const count = data[offset + 1];
    if (count > TAGS_MAX_COUNT || offset + 2 + count * 3 > data.length) continue;
    const tags = [];
    let cursor = offset + 2;
    for (let index = 0; index < count; index += 1) {
      tags.push({ category: data[cursor], tagId: readUint16(data, cursor + 1) });
      cursor += 3;
    }
    return { found: true, count, tags };
  }
  return null;
}

function parseAdvertisementTags(event) {
  const candidates = [];
  event?.manufacturerData?.forEach((value) => candidates.push(dataViewBytes(value)));
  event?.serviceData?.forEach((value) => candidates.push(dataViewBytes(value)));
  for (const bytes of candidates) {
    const parsed = parseTagPayloadBytes(bytes);
    if (parsed) return parsed;
  }
  return { found: false, count: 0, tags: [] };
}

function receivedCardKey(card) {
  if (!card) return "";
  if (card.sourceMac) return `mac:${String(card.sourceMac).toUpperCase()}`;
  if (Number.isFinite(Number(card.sourceId)) && Number(card.sourceId) > 0) return `id:${Number(card.sourceId)}`;
  return String(card.id || "");
}

function preserveReceivedCardTimes(cards, cachedCards) {
  const receivedAtByKey = new Map(
    (Array.isArray(cachedCards) ? cachedCards : [])
      .map((card) => [receivedCardKey(card), card.receivedAt])
      .filter(([key, receivedAt]) => key && receivedAt)
  );
  return (Array.isArray(cards) ? cards : []).map((card) => {
    const cachedReceivedAt = receivedAtByKey.get(receivedCardKey(card));
    return cachedReceivedAt ? { ...card, receivedAt: cachedReceivedAt } : card;
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function safeFileName(name) {
  return String(name || "resource.bin").split("/").pop().replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "resource.bin";
}

function resourceStamp() {
  return Date.now().toString(36);
}

function imageResourceFileName() {
  return `c${resourceStamp()}.png`;
}

function motionResourceFileName() {
  return `v${resourceStamp()}.mp4`;
}

function mediaBaseName(name, fallback = "media") {
  return safeFileName(name || fallback).replace(/\.[^.]+$/, "").slice(0, 42) || fallback;
}

function bytesLen(text) {
  return utf8Bytes(text).length;
}

function blobToBytes(blob) {
  return blob.arrayBuffer().then((buffer) => new Uint8Array(buffer));
}

function canvasToBlob(canvas, type = "image/png", quality = 0.88) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Canvas export failed")), type, quality);
  });
}

function makeCanvas(width = 240, height = 320) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

function drawCover(ctx, source, sourceWidth, sourceHeight, width = 240, height = 320, options = {}) {
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = width / height;
  let sx = 0;
  let sy = 0;
  let sw = sourceWidth;
  let sh = sourceHeight;
  if (sourceRatio > targetRatio) {
    sw = sourceHeight * targetRatio;
    sx = (sourceWidth - sw) / 2;
  } else {
    sh = sourceWidth / targetRatio;
    sy = (sourceHeight - sh) / 2;
  }
  const zoom = clamp(options.zoom || 100, 100, 240) / 100;
  const cropW = Math.max(1, sw / zoom);
  const cropH = Math.max(1, sh / zoom);
  const maxX = Math.max(0, sourceWidth - cropW);
  const maxY = Math.max(0, sourceHeight - cropH);
  sx = clamp(sx + (clamp(options.offsetX, -100, 100) / 100) * maxX / 2, 0, maxX);
  sy = clamp(sy + (clamp(options.offsetY, -100, 100) / 100) * maxY / 2, 0, maxY);
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(source, sx, sy, cropW, cropH, 0, 0, width, height);
}

function drawContain(ctx, source, sourceWidth, sourceHeight, width = 240, height = 320, options = {}) {
  const scale = Math.min(width / sourceWidth, height / sourceHeight) * (clamp(options.zoom || 100, 80, 240) / 100);
  const dw = Math.max(1, Math.round(sourceWidth * scale));
  const dh = Math.max(1, Math.round(sourceHeight * scale));
  const freeX = Math.max(0, width - dw);
  const freeY = Math.max(0, height - dh);
  const overflowX = Math.max(0, dw - width);
  const overflowY = Math.max(0, dh - height);
  const dx = Math.round((width - dw) / 2 + (clamp(options.offsetX, -100, 100) / 100) * (freeX + overflowX) / 2);
  const dy = Math.round((height - dh) / 2 + (clamp(options.offsetY, -100, 100) / 100) * (freeY + overflowY) / 2);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(source, 0, 0, sourceWidth, sourceHeight, dx, dy, dw, dh);
}

function mediaProcessingOptions(forceEditing = false) {
  const settings = ensureAppSettings();
  const useEditing = forceEditing || Boolean(settings.mediaEditBeforeUpload);
  if (!useEditing) {
    return {
      layout: "cover",
      zoom: 100,
      offsetX: 0,
      offsetY: 0,
      caption: ""
    };
  }
  return {
    layout: settings.mediaLayout === "contain" ? "contain" : "cover",
    zoom: clamp(settings.mediaZoom || 100, settings.mediaLayout === "contain" ? 80 : 100, 240),
    offsetX: clamp(settings.mediaOffsetX, -100, 100),
    offsetY: clamp(settings.mediaOffsetY, -100, 100),
    caption: String(settings.mediaCaption || "").trim().slice(0, 48),
    captionX: clamp(settings.mediaCaptionX || 50, 8, 92),
    captionY: clamp(settings.mediaCaptionY || 82, 8, 92),
    captionSize: clamp(settings.mediaCaptionSize || 18, 10, 42),
    captionColor: normalizeHexColor(settings.mediaCaptionColor, "#ffffff"),
    captionBackgroundEnabled: settings.mediaCaptionBackgroundEnabled !== false,
    captionBackgroundColor: normalizeHexColor(settings.mediaCaptionBackgroundColor, "#000000"),
    captionBackgroundOpacity: clamp(settings.mediaCaptionBackgroundOpacity ?? 58, 0, 100),
    captionFont: ["system", "serif", "mono", "custom"].includes(settings.mediaCaptionFont) ? settings.mediaCaptionFont : "system",
    captionCustomFont: String(settings.mediaCaptionCustomFont || "").trim().slice(0, 80),
    captionBold: settings.mediaCaptionBold !== false,
    captionItalic: Boolean(settings.mediaCaptionItalic),
    captionDirection: settings.mediaCaptionDirection === "vertical" ? "vertical" : "horizontal"
  };
}

function mediaMotionQuality() {
  const key = ensureAppSettings().mediaQuality || "high";
  return MEDIA_QUALITY_OPTIONS[key] || MEDIA_QUALITY_OPTIONS.high;
}

function mediaClipSettings(totalDurationMs = MOTION_MAX_DURATION_MS) {
  const settings = ensureAppSettings();
  const total = Math.max(100, Number(totalDurationMs) || MOTION_MAX_DURATION_MS);
  if (!settings.mediaEditBeforeUpload) {
    const end = Math.min(total, MOTION_MAX_DURATION_MS);
    return { startMs: 0, endMs: Math.round(end), durationMs: Math.max(100, Math.round(end)) };
  }
  const startMax = Math.max(0, total - 100);
  const start = clamp(settings.mediaClipStartMs ?? 0, 0, startMax);
  const maxEnd = Math.min(total, start + MOTION_MAX_DURATION_MS);
  const end = clamp(settings.mediaClipEndMs ?? maxEnd, start + 100, maxEnd);
  return { startMs: Math.round(start), endMs: Math.round(end), durationMs: Math.max(100, Math.round(end - start)) };
}

function mediaClipLabel(startMs, endMs) {
  return `${(Math.round(startMs) / 1000).toFixed(1)}-${(Math.round(endMs) / 1000).toFixed(1)}s`;
}

function quoteFontName(name) {
  return `"${String(name || "").replace(/["\\]/g, "\\$&")}"`;
}

function normalizeHexColor(value, fallback) {
  const text = String(value || "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(text)) return text;
  if (/^#[0-9a-fA-F]{3}$/.test(text)) return `#${text[1]}${text[1]}${text[2]}${text[2]}${text[3]}${text[3]}`;
  return fallback;
}

function hexToRgba(hex, opacityPercent = 100) {
  const color = normalizeHexColor(hex, "#000000").slice(1);
  const red = parseInt(color.slice(0, 2), 16);
  const green = parseInt(color.slice(2, 4), 16);
  const blue = parseInt(color.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${clamp(opacityPercent, 0, 100) / 100})`;
}

function captionFontFamily(font, customFont = "") {
  if (font === "custom" && customFont) return `${quoteFontName(customFont)}, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  if (font === "serif") return "Georgia, 'Times New Roman', serif";
  if (font === "mono") return "ui-monospace, SFMono-Regular, Menlo, monospace";
  return "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
}

function drawMediaCaption(ctx, caption, options = {}, width = 240, height = 320) {
  if (!caption) return;
  ctx.save();
  const style = options.captionItalic ? "italic " : "";
  const weight = options.captionBold ? "700 " : "400 ";
  const fontSize = clamp(options.captionSize || 18, 10, 42);
  ctx.font = `${style}${weight}${fontSize}px ${captionFontFamily(options.captionFont, options.captionCustomFont)}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const normalized = caption.split(/\s+/).join(" ");
  const matchedLines = normalized.match(/.{1,14}/g);
  const lines = matchedLines ? matchedLines.slice(0, 2) : [caption.slice(0, 14)];
  const lineHeight = Math.round(fontSize * 1.22);
  const centerX = width * (clamp(options.captionX || 50, 8, 92) / 100);
  const centerY = height * (clamp(options.captionY || 82, 8, 92) / 100);
  ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
  ctx.shadowBlur = 3;
  if (options.captionDirection === "vertical") {
    const chars = Array.from(normalized.replace(/\s+/g, "")).slice(0, 8);
    const boxWidth = Math.round(fontSize + 18);
    const boxHeight = 14 + chars.length * lineHeight;
    const x = clamp(centerX - boxWidth / 2, 8, width - boxWidth - 8);
    const y = clamp(centerY - boxHeight / 2, 8, height - boxHeight - 8);
    ctx.shadowBlur = 0;
    if (options.captionBackgroundEnabled) {
      ctx.fillStyle = hexToRgba(options.captionBackgroundColor, options.captionBackgroundOpacity);
      ctx.fillRect(x, y, boxWidth, boxHeight);
    }
    ctx.fillStyle = options.captionColor || "#fff";
    ctx.shadowBlur = 3;
    const firstCharY = y + boxHeight / 2 - (chars.length - 1) * lineHeight / 2;
    chars.forEach((char, index) => ctx.fillText(char, x + boxWidth / 2, firstCharY + index * lineHeight));
  } else {
    const textWidth = Math.min(width - 24, Math.max(...lines.map((line) => ctx.measureText(line).width)) + 24);
    const boxHeight = 14 + lines.length * lineHeight;
    const x = clamp(centerX - textWidth / 2, 8, width - textWidth - 8);
    const y = clamp(centerY - boxHeight / 2, 8, height - boxHeight - 8);
    ctx.shadowBlur = 0;
    if (options.captionBackgroundEnabled) {
      ctx.fillStyle = hexToRgba(options.captionBackgroundColor, options.captionBackgroundOpacity);
      ctx.fillRect(x, y, textWidth, boxHeight);
    }
    ctx.fillStyle = options.captionColor || "#fff";
    ctx.shadowBlur = 3;
    const firstLineY = y + boxHeight / 2 - (lines.length - 1) * lineHeight / 2;
    lines.forEach((line, index) => ctx.fillText(line, x + textWidth / 2, firstLineY + index * lineHeight));
  }
  ctx.restore();
}

function drawPreparedFrame(ctx, source, sourceWidth, sourceHeight, options = {}, width = 240, height = 320) {
  if (options.layout === "contain") drawContain(ctx, source, sourceWidth, sourceHeight, width, height, options);
  else drawCover(ctx, source, sourceWidth, sourceHeight, width, height, options);
  drawMediaCaption(ctx, options.caption, options, width, height);
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image decode failed"));
    };
    image.src = url;
  });
}

async function prepareImageMedia(file) {
  const image = await loadImageFromFile(file);
  const canvas = makeCanvas(240, 320);
  drawPreparedFrame(canvas.getContext("2d"), image, image.naturalWidth || image.width, image.naturalHeight || image.height, mediaProcessingOptions());
  const blob = await canvasToBlob(canvas, "image/png");
  return {
    bytes: await blobToBytes(blob),
    fileName: imageResourceFileName(),
    kind: "image",
    source: `${image.naturalWidth || image.width || "--"}x${image.naturalHeight || image.height || "--"}`,
    output: "240x320 PNG",
    label: "240x320 PNG"
  };
}

function loadVideoFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.onloadedmetadata = () => resolve({ video, url });
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Video decode failed"));
    };
    video.src = url;
  });
}

function seekVideo(video, time) {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      video.onseeked = null;
      video.onerror = null;
    };
    video.onseeked = () => {
      cleanup();
      resolve();
    };
    video.onerror = () => {
      cleanup();
      reject(new Error("Video seek failed"));
    };
    video.currentTime = Math.max(0, Math.min(time, Math.max(0, video.duration || 0)));
  });
}

function asciiAtom(text) {
  const bytes = new Uint8Array(String(text || "").length);
  for (let index = 0; index < bytes.length; index += 1) bytes[index] = String(text).charCodeAt(index) & 255;
  return bytes;
}

function be8(value) {
  return new Uint8Array([value & 255]);
}

function be16(value) {
  return new Uint8Array([(value >> 8) & 255, value & 255]);
}

function be24(value) {
  return new Uint8Array([(value >> 16) & 255, (value >> 8) & 255, value & 255]);
}

function be32(value) {
  return new Uint8Array([(value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255]);
}

function fixed16(value) {
  return be32((value << 16) >>> 0);
}

function zeroes(length) {
  return new Uint8Array(length);
}

function mp4Box(type, parts = []) {
  const body = concatBytes(parts);
  return concatBytes([be32(body.length + 8), asciiAtom(type), body]);
}

function fullBox(type, version, flags, parts = []) {
  return mp4Box(type, [be8(version), be24(flags), ...parts]);
}

function videoSampleEntry(width, height) {
  const name = new Uint8Array(32);
  const codecName = asciiAtom("Motion JPEG");
  name[0] = codecName.length;
  name.set(codecName, 1);
  return mp4Box("mjpg", [
    zeroes(6), be16(1), be16(0), be16(0), be32(0), be32(0), be32(0),
    be16(width), be16(height), be32(0x00480000), be32(0x00480000), be32(0),
    be16(1), name, be16(24), be16(0xffff)
  ]);
}

function buildMjpegMp4(frames, options = {}) {
  if (!frames.length) throw new Error("No frames to encode");
  const frameRate = Math.max(1, Math.round(options.frameRate || 12));
  const width = Math.max(1, Math.round(options.width || 240));
  const height = Math.max(1, Math.round(options.height || 320));
  const sampleSizes = frames.map((frame) => frame.byteLength);
  const ftyp = mp4Box("ftyp", [asciiAtom("isom"), be32(512), asciiAtom("isom"), asciiAtom("iso2"), asciiAtom("mp41"), asciiAtom("mjpg")]);
  const mdat = mp4Box("mdat", frames.map((frame) => new Uint8Array(frame)));
  const sampleCount = frames.length;
  const movieDurationMs = Math.round(sampleCount / frameRate * 1000);
  const stsd = fullBox("stsd", 0, 0, [be32(1), videoSampleEntry(width, height)]);
  const stts = fullBox("stts", 0, 0, [be32(1), be32(sampleCount), be32(1)]);
  const stsc = fullBox("stsc", 0, 0, [be32(1), be32(1), be32(sampleCount), be32(1)]);
  const stsz = fullBox("stsz", 0, 0, [be32(0), be32(sampleSizes.length), ...sampleSizes.map(be32)]);
  const stco = fullBox("stco", 0, 0, [be32(1), be32(ftyp.byteLength + 8)]);
  const stss = fullBox("stss", 0, 0, [be32(sampleCount), ...Array.from({ length: sampleCount }, (_, index) => be32(index + 1))]);
  const stbl = mp4Box("stbl", [stsd, stts, stsc, stsz, stco, stss]);
  const minf = mp4Box("minf", [fullBox("vmhd", 0, 1, [be16(0), be16(0), be16(0), be16(0)]), mp4Box("dinf", [fullBox("dref", 0, 0, [be32(1), fullBox("url ", 0, 1)])]), stbl]);
  const mdia = mp4Box("mdia", [fullBox("mdhd", 0, 0, [be32(0), be32(0), be32(frameRate), be32(sampleCount), be16(21956), be16(0)]), fullBox("hdlr", 0, 0, [be32(0), asciiAtom("vide"), be32(0), be32(0), be32(0), asciiAtom("VideoHandler"), be8(0)]), minf]);
  const tkhd = fullBox("tkhd", 0, 7, [be32(0), be32(0), be32(1), be32(0), be32(Math.max(1, movieDurationMs)), zeroes(8), be16(0), be16(0), be16(0), be16(0), fixed16(1), be32(0), be32(0), be32(0), fixed16(1), be32(0), be32(0), be32(0), be32(0x40000000), fixed16(width), fixed16(height)]);
  const trak = mp4Box("trak", [tkhd, mdia]);
  const mvhd = fullBox("mvhd", 0, 0, [be32(0), be32(0), be32(1000), be32(Math.max(1, movieDurationMs)), fixed16(1), be16(0x0100), be16(0), zeroes(8), fixed16(1), be32(0), be32(0), be32(0), fixed16(1), be32(0), be32(0), be32(0), be32(0x40000000), zeroes(24), be32(2)]);
  return concatBytes([ftyp, mdat, mp4Box("moov", [mvhd, trak])]);
}

async function prepareVideoMedia(file) {
  const { video, url } = await loadVideoFromFile(file);
  try {
    const canvas = makeCanvas(240, 320);
    const ctx = canvas.getContext("2d");
    const sourceDurationMs = Math.max(0, Math.round((Number(video.duration) || 0) * 1000));
    const clip = mediaClipSettings(sourceDurationMs || MOTION_MAX_DURATION_MS);
    const durationMs = clip.durationMs || 1000;
    const duration = durationMs / 1000;
    const frameRate = MOTION_MAX_FRAME_RATE;
    const frameCount = Math.max(1, Math.ceil(duration * frameRate));
    const frames = [];
    const options = mediaProcessingOptions();
    const quality = mediaMotionQuality();
    for (let index = 0; index < frameCount; index += 1) {
      const time = (clip.startMs / 1000) + (frameCount === 1 ? 0 : Math.min(duration - 0.01, index / frameRate));
      await seekVideo(video, time);
      drawPreparedFrame(ctx, video, video.videoWidth || 240, video.videoHeight || 320, options);
      frames.push(await blobToBytes(await canvasToBlob(canvas, "image/jpeg", quality.ratio)));
    }
    return {
      bytes: buildMjpegMp4(frames, { frameRate, width: 240, height: 320 }),
      fileName: motionResourceFileName(),
      kind: "motion",
      source: `${video.videoWidth || "--"}x${video.videoHeight || "--"} · ${sourceDurationMs ? (sourceDurationMs / 1000).toFixed(1) : "--"}s`,
      output: `240x320 MJPEG MP4 · ${frameRate} fps · ${frameCount} frames · ${mediaClipLabel(clip.startMs, clip.endMs)} · quality ${quality.label}`,
      label: `240x320 MJPEG MP4 · ${frameRate} fps · ${frameCount} frames · ${mediaClipLabel(clip.startMs, clip.endMs)} · quality ${quality.label}`
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function gifReadU16(bytes, offset) {
  return bytes[offset] | (bytes[offset + 1] << 8);
}

function gifConcat(parts, totalLength) {
  const out = new Uint8Array(totalLength);
  let offset = 0;
  parts.forEach((part) => {
    out.set(part, offset);
    offset += part.length;
  });
  return out;
}

function gifReadSubBlocks(bytes, offset) {
  const parts = [];
  let total = 0;
  let cursor = offset;
  while (cursor < bytes.length) {
    const size = bytes[cursor];
    cursor += 1;
    if (!size) break;
    if (cursor + size > bytes.length) throw new Error("GIF data block is incomplete");
    const part = bytes.subarray(cursor, cursor + size);
    parts.push(part);
    total += part.length;
    cursor += size;
  }
  return { bytes: gifConcat(parts, total), nextOffset: cursor };
}

function gifReadColorTable(bytes, offset, packed) {
  const length = 3 * (1 << (1 + (packed & 7)));
  if (offset + length > bytes.length) throw new Error("GIF color table is incomplete");
  return { table: bytes.subarray(offset, offset + length), nextOffset: offset + length };
}

function gifClearRect(rgba, canvasWidth, rect, color) {
  const left = Math.max(0, rect.left);
  const top = Math.max(0, rect.top);
  const right = Math.min(canvasWidth, rect.left + rect.width);
  const canvasHeight = rgba.length / 4 / canvasWidth;
  const bottom = Math.min(canvasHeight, rect.top + rect.height);
  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) {
      const offset = 4 * (y * canvasWidth + x);
      rgba[offset] = color[0];
      rgba[offset + 1] = color[1];
      rgba[offset + 2] = color[2];
      rgba[offset + 3] = color[3];
    }
  }
}

function gifDeinterlace(indices, width, height) {
  const out = new Uint8Array(indices.length);
  const starts = [0, 4, 2, 1];
  const steps = [8, 8, 4, 2];
  let source = 0;
  for (let pass = 0; pass < starts.length; pass += 1) {
    for (let y = starts[pass]; y < height; y += steps[pass]) {
      out.set(indices.subarray(source, source + width), y * width);
      source += width;
    }
  }
  return out;
}

function gifLzwDecode(minCodeSize, data, expectedLength) {
  const clearCode = 1 << minCodeSize;
  const endCode = clearCode + 1;
  const prefixes = new Int16Array(4096);
  const suffixes = new Uint8Array(4096);
  const stack = new Uint8Array(4097);
  const output = new Uint8Array(expectedLength);
  let bitOffset = 0;
  let codeSize = minCodeSize + 1;
  let nextCode = endCode + 1;
  let oldCode = -1;
  let outOffset = 0;

  function reset() {
    for (let index = 0; index < clearCode; index += 1) {
      prefixes[index] = -1;
      suffixes[index] = index;
    }
    codeSize = minCodeSize + 1;
    nextCode = endCode + 1;
    oldCode = -1;
  }

  function readCode() {
    if (bitOffset + codeSize > data.length * 8) return null;
    let code = 0;
    for (let bit = 0; bit < codeSize; bit += 1) {
      if (data[(bitOffset + bit) >> 3] & (1 << ((bitOffset + bit) & 7))) code |= 1 << bit;
    }
    bitOffset += codeSize;
    return code;
  }

  function outputCode(code) {
    let stackSize = 0;
    let cursor = code;
    while (cursor > clearCode && stackSize < stack.length - 1) {
      stack[stackSize] = suffixes[cursor];
      stackSize += 1;
      cursor = prefixes[cursor];
    }
    if (stackSize >= stack.length - 1) throw new Error("GIF LZW dictionary is invalid");
    const first = cursor < clearCode ? cursor : suffixes[cursor];
    stack[stackSize] = first;
    stackSize += 1;
    for (let index = stackSize - 1; index >= 0 && outOffset < output.length; index -= 1) {
      output[outOffset] = stack[index];
      outOffset += 1;
    }
    return first;
  }

  reset();
  while (outOffset < output.length) {
    const code = readCode();
    if (code === null) break;
    if (code === clearCode) {
      reset();
      continue;
    }
    if (code === endCode) break;
    let first;
    if (oldCode < 0) {
      first = outputCode(code);
      oldCode = code;
      continue;
    }
    if (code < nextCode) {
      first = outputCode(code);
    } else if (code === nextCode) {
      first = outputCode(oldCode);
      if (outOffset < output.length) {
        output[outOffset] = first;
        outOffset += 1;
      }
    } else {
      throw new Error("GIF LZW data is invalid");
    }
    prefixes[nextCode] = oldCode;
    suffixes[nextCode] = first;
    nextCode += 1;
    if (nextCode === (1 << codeSize) && codeSize < 12) codeSize += 1;
    oldCode = code;
  }
  return output;
}

function gifDrawFrame(canvasRgba, canvasWidth, canvasHeight, frame, palette) {
  const transparentIndex = frame.transparentIndex;
  for (let y = 0; y < frame.height; y += 1) {
    const targetY = frame.top + y;
    if (targetY < 0 || targetY >= canvasHeight) continue;
    for (let x = 0; x < frame.width; x += 1) {
      const targetX = frame.left + x;
      if (targetX < 0 || targetX >= canvasWidth) continue;
      const colorIndex = frame.indices[y * frame.width + x];
      if (transparentIndex !== null && colorIndex === transparentIndex) continue;
      const colorOffset = colorIndex * 3;
      if (colorOffset + 2 >= palette.length) continue;
      const targetOffset = 4 * (targetY * canvasWidth + targetX);
      canvasRgba[targetOffset] = palette[colorOffset];
      canvasRgba[targetOffset + 1] = palette[colorOffset + 1];
      canvasRgba[targetOffset + 2] = palette[colorOffset + 2];
      canvasRgba[targetOffset + 3] = 255;
    }
  }
}

function parseGifBytes(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  if (bytes.length < 13) throw new Error("GIF file is too small");
  const signature = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3], bytes[4], bytes[5]);
  if (signature !== "GIF87a" && signature !== "GIF89a") throw new Error("Not a valid GIF file");
  let offset = 6;
  const width = gifReadU16(bytes, offset);
  const height = gifReadU16(bytes, offset + 2);
  const packed = bytes[offset + 4];
  const backgroundIndex = bytes[offset + 5];
  offset += 7;
  let globalPalette = null;
  if (packed & 128) {
    const global = gifReadColorTable(bytes, offset, packed);
    globalPalette = global.table;
    offset = global.nextOffset;
  }
  const background = [0, 0, 0, 0];
  if (globalPalette) {
    const bgOffset = backgroundIndex * 3;
    if (bgOffset + 2 < globalPalette.length) {
      background[0] = globalPalette[bgOffset];
      background[1] = globalPalette[bgOffset + 1];
      background[2] = globalPalette[bgOffset + 2];
      background[3] = 255;
    }
  }
  const canvasRgba = new Uint8ClampedArray(width * height * 4);
  const frames = [];
  let control = { delayMs: 100, disposal: 0, transparentIndex: null };
  let previousRect = null;
  let previousDisposal = 0;
  let restoreRgba = null;
  while (offset < bytes.length) {
    const blockId = bytes[offset];
    offset += 1;
    if (blockId === 0x3b) break;
    if (blockId === 0x21) {
      const label = bytes[offset];
      offset += 1;
      if (label === 0xf9) {
        const blockSize = bytes[offset];
        offset += 1;
        if (blockSize !== 4 || offset + blockSize > bytes.length) throw new Error("Invalid GIF graphics control block");
        const flags = bytes[offset];
        const delayMs = gifReadU16(bytes, offset + 1) * 10;
        control = {
          delayMs: delayMs > 0 ? delayMs : 100,
          disposal: (flags >> 2) & 7,
          transparentIndex: flags & 1 ? bytes[offset + 3] : null
        };
        offset += blockSize;
        if (bytes[offset] === 0) offset += 1;
      } else {
        offset = gifReadSubBlocks(bytes, offset).nextOffset;
      }
      continue;
    }
    if (blockId !== 0x2c) throw new Error("GIF contains an unsupported block");
    if (previousRect) {
      if (previousDisposal === 2) gifClearRect(canvasRgba, width, previousRect, background);
      if (previousDisposal === 3 && restoreRgba) canvasRgba.set(restoreRgba);
    }
    const left = gifReadU16(bytes, offset);
    const top = gifReadU16(bytes, offset + 2);
    const frameWidth = gifReadU16(bytes, offset + 4);
    const frameHeight = gifReadU16(bytes, offset + 6);
    const imagePacked = bytes[offset + 8];
    offset += 9;
    let palette = globalPalette;
    if (imagePacked & 128) {
      const local = gifReadColorTable(bytes, offset, imagePacked);
      palette = local.table;
      offset = local.nextOffset;
    }
    if (!palette) throw new Error("GIF is missing a color table");
    const minCodeSize = bytes[offset];
    offset += 1;
    const subBlocks = gifReadSubBlocks(bytes, offset);
    offset = subBlocks.nextOffset;
    let indices = gifLzwDecode(minCodeSize, subBlocks.bytes, frameWidth * frameHeight);
    if (imagePacked & 64) indices = gifDeinterlace(indices, frameWidth, frameHeight);
    restoreRgba = control.disposal === 3 ? new Uint8ClampedArray(canvasRgba) : null;
    gifDrawFrame(canvasRgba, width, height, {
      left,
      top,
      width: frameWidth,
      height: frameHeight,
      indices,
      transparentIndex: control.transparentIndex
    }, palette);
    frames.push({
      index: frames.length,
      delayMs: control.delayMs,
      disposal: control.disposal,
      rgba: new Uint8ClampedArray(canvasRgba)
    });
    previousRect = { left, top, width: frameWidth, height: frameHeight };
    previousDisposal = control.disposal;
    control = { delayMs: 100, disposal: 0, transparentIndex: null };
  }
  if (!frames.length) throw new Error("GIF has no usable frames");
  let elapsed = 0;
  frames.forEach((frame) => {
    frame.startMs = elapsed;
    elapsed += frame.delayMs;
    frame.endMs = elapsed;
  });
  return { width, height, frames, frameCount: frames.length, totalDurationMs: elapsed };
}

function gifFrameAtMs(gif, ms) {
  const total = Math.max(gif.totalDurationMs || 0, 1);
  const target = Math.max(0, Math.min(Math.round(ms || 0), total - 1));
  return gif.frames.find((frame) => target < frame.endMs) || gif.frames[gif.frames.length - 1];
}

function sampleGifFrames(gif, maxDurationMs = MOTION_MAX_DURATION_MS, maxFrameRate = MOTION_MAX_FRAME_RATE) {
  const clip = mediaClipSettings(gif.totalDurationMs || maxDurationMs);
  const duration = Math.min(clip.durationMs, maxDurationMs);
  const sourceRate = gif.frameCount && gif.totalDurationMs ? Math.max(1, Math.round(1000 * gif.frameCount / gif.totalDurationMs)) : 1;
  const frameRate = Math.max(1, Math.min(sourceRate, maxFrameRate));
  const frameCount = Math.max(1, Math.ceil(duration / (1000 / frameRate)));
  return {
    frameRate,
    durationMs: duration,
    startMs: clip.startMs,
    endMs: clip.endMs,
    frames: Array.from({ length: frameCount }, (_, index) => gifFrameAtMs(gif, Math.min(clip.endMs - 1, clip.startMs + Math.round(index * 1000 / frameRate))))
  };
}

async function prepareGifMedia(file) {
  const gif = parseGifBytes(await file.arrayBuffer());
  const canvas = makeCanvas(240, 320);
  const sourceCanvas = makeCanvas(gif.width, gif.height);
  const sourceCtx = sourceCanvas.getContext("2d");
  const ctx = canvas.getContext("2d");
  const sample = sampleGifFrames(gif);
  const frames = [];
  const options = mediaProcessingOptions();
  const quality = mediaMotionQuality();
  for (const frame of sample.frames) {
    sourceCtx.putImageData(new ImageData(frame.rgba, gif.width, gif.height), 0, 0);
    drawPreparedFrame(ctx, sourceCanvas, gif.width, gif.height, options);
    frames.push(await blobToBytes(await canvasToBlob(canvas, "image/jpeg", quality.ratio)));
  }
  const clipped = (gif.totalDurationMs || 0) > MOTION_MAX_DURATION_MS;
  return {
    bytes: buildMjpegMp4(frames, { frameRate: sample.frameRate, width: 240, height: 320 }),
    fileName: motionResourceFileName(),
    kind: "motion",
    source: `${gif.width}x${gif.height} · ${(gif.totalDurationMs / 1000).toFixed(1)}s · ${gif.frameCount} frames`,
    output: `240x320 MJPEG MP4 · GIF · ${sample.frameRate} fps · ${frames.length} frames · ${mediaClipLabel(sample.startMs, sample.endMs)} · quality ${quality.label}`,
    label: `240x320 MJPEG MP4 · GIF · ${sample.frameRate} fps · ${frames.length} frames · ${mediaClipLabel(sample.startMs, sample.endMs)} · quality ${quality.label}${clipped ? " · clipped" : ""}`
  };
}

async function renderMediaPreview(file, canvas) {
  if (!file || !canvas) return;
  const ctx = canvas.getContext("2d");
  const type = String(file.type || "").toLowerCase();
  const name = String(file.name || "").toLowerCase();
  const options = mediaProcessingOptions(true);
  if (type.includes("gif") || name.endsWith(".gif")) {
    const gif = parseGifBytes(await file.arrayBuffer());
    const frame = gif.frames[0];
    const sourceCanvas = makeCanvas(gif.width, gif.height);
    sourceCanvas.getContext("2d").putImageData(new ImageData(frame.rgba, gif.width, gif.height), 0, 0);
    drawPreparedFrame(ctx, sourceCanvas, gif.width, gif.height, options);
    return;
  }
  if (type.startsWith("video/")) {
    const { video, url } = await loadVideoFromFile(file);
    try {
      await seekVideo(video, 0);
      drawPreparedFrame(ctx, video, video.videoWidth || 240, video.videoHeight || 320, options);
    } finally {
      URL.revokeObjectURL(url);
    }
    return;
  }
  if (type.startsWith("image/")) {
    const image = await loadImageFromFile(file);
    drawPreparedFrame(ctx, image, image.naturalWidth || image.width, image.naturalHeight || image.height, options);
    return;
  }
  throw new Error("Unsupported media type");
}

async function startVideoMediaPreview(file, canvas, isActive = () => true) {
  const { video, url } = await loadVideoFromFile(file);
  const ctx = canvas.getContext("2d");
  const options = mediaProcessingOptions(true);
  const clip = mediaClipSettings(Math.max(100, Math.round((Number(video.duration) || 0) * 1000)));
  let frameId = 0;
  let seeking = false;
  let stopped = false;
  const draw = async () => {
    if (stopped || !isActive()) return;
    if (!seeking && video.currentTime * 1000 >= clip.endMs - 20) {
      seeking = true;
      await seekVideo(video, clip.startMs / 1000).catch(() => {});
      seeking = false;
      video.play?.().catch(() => {});
    }
    drawPreparedFrame(ctx, video, video.videoWidth || 240, video.videoHeight || 320, options);
    frameId = requestAnimationFrame(draw);
  };
  await seekVideo(video, clip.startMs / 1000);
  await video.play?.().catch(() => {});
  draw();
  return () => {
    stopped = true;
    cancelAnimationFrame(frameId);
    video.pause?.();
    URL.revokeObjectURL(url);
  };
}

async function prepareMediaFile(file) {
  const type = String(file.type || "").toLowerCase();
  const name = String(file.name || "").toLowerCase();
  if (type.includes("gif") || name.endsWith(".gif")) return prepareGifMedia(file);
  if (type.startsWith("video/")) return prepareVideoMedia(file);
  if (type.startsWith("image/")) return prepareImageMedia(file);
  throw new Error("Unsupported media type");
}

function isMotionMediaFile(file) {
  const type = String(file?.type || "").toLowerCase();
  const name = String(file?.name || "").toLowerCase();
  return type.startsWith("video/") || type.includes("gif") || name.endsWith(".gif");
}

function titleFromCard(text) {
  const clean = String(text || "").trim();
  return clean ? clean.slice(0, 2) : t("card");
}

async function connectFlow() {
  try {
    setBanner(t("chooseDeviceBanner"));
    await ble.requestAndConnect();
    const summary = await ble.readSummary({ name: ble.device.name });
    upsertDevice(summary);
    setBanner("");
    toast(t("connectedToast"));
    setState({ currentRoute: "detail" });
  } catch (error) {
    console.error("Connect failed", error);
    setBanner("");
    toast(formatError(error, t("connectFailed")));
  }
}

async function refreshCurrentDevice(silent = false, options = {}) {
  const current = getCurrentDevice();
  if (!current) return toast(t("noDevice"));
  try {
    if (!ble.device || !ble.device.gatt.connected) await ble.connectGranted(current);
    const summary = await ble.readSummary(current);
    upsertDevice({ ...current, ...summary });
    if (!silent) toast(t("deviceUpdated"));
    render();
  } catch (error) {
    if (!options.quietErrors) toast(formatError(error, t("updateFailed")));
  }
}

async function connectKnownDevice(deviceId) {
  const device = state.devices.find((item) => item.id === deviceId || item.sn === deviceId);
  if (!device) return toast(t("noDevice"));
  try {
    state.currentDeviceId = device.id;
    saveState();
    setBanner(t("chooseDeviceBanner"));
    await ble.connectGranted(device);
    const summary = await ble.readSummary(device);
    upsertDevice({ ...device, ...summary, connected: true, statusLabel: t("online") });
    setBanner("");
    toast(t("connectedToast"));
    setState({ currentRoute: "detail" });
  } catch (error) {
    setBanner("");
    toast(formatError(error, t("reconnectFromCardFailed")));
  }
}

function render() {
  try {
    const route = routes.find(([key]) => key === state.currentRoute) || routes[0];
    const enteringRoute = lastRenderedRoute !== route[0];
    document.documentElement.lang = currentLocale();
    document.title = t("appTitle");
    $("#brandName").textContent = t("brandName");
    $("#connectBtn").textContent = t("connectDevice");
    $("#disconnectBtn").textContent = t("disconnect");
    $("#disconnectBtn").title = t("disconnect");
    renderLanguageSelect();
    $("#pageTitle").textContent = t(route[1]);
    $("#eyebrow").textContent = ble.connection ? t("eyebrowConnected") : t("eyebrowWeb");
    renderNav();
    renderSupport();
    route[2]({ enteringRoute });
    lastRenderedRoute = route[0];
  } catch (error) {
    showRenderError(error);
  }
}

function showRenderError(error) {
  console.error("Render failed", error);
  const message = error && (error.stack || error.message) ? String(error.stack || error.message) : String(error);
  const safeMessage = escapeHtml(message);
  document.title = "MoniCard Web";
  const pageTitle = $("#pageTitle");
  const eyebrow = $("#eyebrow");
  const supportTitle = $("#supportTitle");
  const supportText = $("#supportText");
  if (pageTitle) pageTitle.textContent = "MoniCard Web";
  if (eyebrow) eyebrow.textContent = "App error";
  if (supportTitle) supportTitle.textContent = "畫面初始化失敗";
  if (supportText) supportText.textContent = "請重新整理，或把下方錯誤訊息傳給開發者。";
  if (view) {
    view.innerHTML = `
      <div class="panel">
        <h2>畫面初始化失敗</h2>
        <p class="muted">請先重新整理頁面。如果持續發生，請把這段錯誤訊息傳給我。</p>
        <pre class="log">${safeMessage}</pre>
      </div>
    `;
  }
}

function renderNav() {
  $("#nav").innerHTML = routes.map(([key, label]) => {
    const disabled = (state.firmwareBusy && key !== "firmware") || (state.mediaBusy && key !== "media");
    return `<button class="${state.currentRoute === key ? "active" : ""}" data-route="${key}" type="button" ${disabled ? "disabled" : ""}>${t(label)}</button>`;
  }).join("");
  $("#nav").querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.firmwareBusy && button.dataset.route !== "firmware") return;
      if (state.mediaBusy && button.dataset.route !== "media") return;
      setState({ currentRoute: button.dataset.route });
    });
  });
}

function renderSupport() {
  const secure = window.isSecureContext;
  const supported = Boolean(navigator.bluetooth && secure);
  $("#supportDot").classList.toggle("ok", supported);
  $("#supportTitle").textContent = supported ? t("bluetoothReady") : t("bluetoothUnavailable");
  $("#supportText").textContent = supported ? t("bluetoothReadyDesc") : secure ? t("bluetoothUnsupportedDesc") : t("bluetoothSecureDesc");
}

function renderLanguageSelect() {
  const select = $("#languageSelect");
  const mode = state.localeMode || "auto";
  const options = [
    ["auto", t("autoLanguage")],
    ["zh-Hant", localeNames["zh-Hant"]],
    ["en", localeNames.en],
    ["ja", localeNames.ja]
  ];
  select.innerHTML = options.map(([value, label]) => `<option value="${value}" ${mode === value ? "selected" : ""}>${escapeHtml(label)}</option>`).join("");
  select.onchange = () => {
    setLocaleMode(select.value);
  };
}

function setLocaleMode(localeMode) {
  writeStoredValue(LOCALE_STORAGE_KEY, localeMode);
  state.localeMode = localeMode;
  state.locale = localeMode === "auto" ? detectLocale() : localeMode;
  saveState();
  render();
}

function renderDevices() {
  const cards = state.devices.map((device) => deviceCard(device)).join("");
  view.innerHTML = `
    <div class="panel">
      <h2>${t("devicesList")}</h2>
      <div class="actions">
        <button class="secondary-btn" id="refreshKnownBtn" type="button">${t("refreshCurrentDevice")}</button>
      </div>
    </div>
    <div class="grid device-grid">${cards || `<div class="empty">${t("emptyDevices")}</div>`}</div>
  `;
  $("#refreshKnownBtn").addEventListener("click", () => refreshCurrentDevice());
  view.querySelectorAll("[data-manage-device]").forEach((button) => {
    button.addEventListener("click", () => setState({ currentDeviceId: button.dataset.manageDevice, currentRoute: "detail" }));
  });
  view.querySelectorAll("[data-connect-device]").forEach((button) => {
    button.addEventListener("click", () => connectKnownDevice(button.dataset.connectDevice));
  });
  view.querySelectorAll("[data-forget-device]").forEach((button) => {
    button.addEventListener("click", () => {
      state.devices = state.devices.filter((item) => item.id !== button.dataset.forgetDevice);
      if (state.currentDeviceId === button.dataset.forgetDevice) state.currentDeviceId = state.devices[0]?.id || "";
      saveState();
      render();
    });
  });
}

function deviceCard(device) {
  const isLiveConnection = isDeviceLive(device);
  const displayStatus = isLiveConnection ? t("online") : t("disconnected");
  const primaryAction = isLiveConnection
    ? `<button class="primary-btn" data-manage-device="${escapeAttr(device.id)}" type="button">${t("manage")}</button>`
    : `<button class="primary-btn" data-connect-device="${escapeAttr(device.id)}" type="button">${t("connectKnownDevice")}</button>`;
  return `
    <article class="card device-card">
      <div class="device-head">
        <div>
          <div class="device-name">${escapeHtml(device.name || "MoniCard")}</div>
          <div class="muted">${escapeHtml(device.sn || device.id || "--")}</div>
        </div>
        <span class="badge ${isLiveConnection ? "" : "off"}">${escapeHtml(displayStatus)}</span>
      </div>
      <div class="stats">
        <div class="stat"><span>${t("battery")}</span><strong>${escapeHtml(String(device.battery ?? "--"))}%</strong></div>
        <div class="stat"><span>${t("firmwareVersion")}</span><strong>${escapeHtml(device.firmwareVersion || "--")}</strong></div>
        <div class="stat"><span>${t("storage")}</span><strong>${escapeHtml(device.usedStorageLabel || "--")} / ${escapeHtml(device.totalStorageLabel || "--")}</strong></div>
      </div>
      <div class="progress"><span style="width:${Math.max(0, Math.min(Number(device.storagePercent) || 0, 100))}%"></span></div>
      <div class="actions">
        ${primaryAction}
        <button class="danger-btn" data-forget-device="${escapeAttr(device.id)}" type="button">${t("remove")}</button>
      </div>
    </article>
  `;
}

function renderDetail(options = {}) {
  const device = getCurrentDevice();
  if (!device) {
    view.innerHTML = `<div class="empty">${t("noDeviceSelected")}</div>`;
    return;
  }
  view.innerHTML = `
    <div class="split">
      <article class="panel">
        <h2>${escapeHtml(device.name || "MoniCard")}</h2>
        <div class="stats">
          <div class="stat"><span>${t("serialNumber")}</span><strong>${escapeHtml(device.sn || "--")}</strong></div>
          <div class="stat"><span>${t("battery")}</span><strong>${escapeHtml(String(device.battery ?? "--"))}%</strong></div>
          <div class="stat"><span>${t("firmwareVersion")}</span><strong>${escapeHtml(device.firmwareVersion || "--")}</strong></div>
        </div>
        <p class="muted">${t("storage")}：${escapeHtml(device.usedStorageLabel || "--")} / ${escapeHtml(device.totalStorageLabel || "--")}</p>
        <div class="progress"><span style="width:${Math.max(0, Math.min(Number(device.storagePercent) || 0, 100))}%"></span></div>
        <div class="actions" style="margin-top:16px">
          <button id="refreshDeviceBtn" class="primary-btn" type="button">${t("refreshDeviceStatus")}</button>
          <button id="renameDeviceBtn" class="secondary-btn" type="button">${t("saveName")}</button>
        </div>
        <p id="detailStatus" class="muted">${options.enteringRoute && (ble.connection || device.bleDeviceId) ? t("autoRefreshingDevice") : ""}</p>
        <div class="field" style="margin-top:14px">
          <label>${t("deviceName")}</label>
          <input id="deviceNameInput" value="${escapeAttr(device.name || "")}">
        </div>
      </article>
      <div class="grid feature-grid">
        ${featureButton("card", t("cardFeature"), t("cardFeatureDesc"))}
        ${featureButton("media", t("mediaFeature"), t("mediaFeatureDesc"))}
        ${featureButton("tags", t("tagsFeature"), t("tagsFeatureDesc"))}
        ${featureButton("settings", t("settingsFeature"), t("settingsFeatureDesc"))}
        ${featureButton("firmware", t("firmwareFeature"), t("firmwareFeatureDesc"))}
      </div>
    </div>
  `;
  $("#refreshDeviceBtn").addEventListener("click", () => refreshCurrentDevice());
  $("#renameDeviceBtn").addEventListener("click", () => {
    updateDevice(device.id, { name: $("#deviceNameInput").value.trim() || "MoniCard" });
    toast(t("nameSaved"));
    render();
  });
  view.querySelectorAll("[data-feature]").forEach((button) => {
    button.addEventListener("click", () => setState({ currentRoute: button.dataset.feature }));
  });
  if (options.enteringRoute && !detailAutoRefreshing && (ble.connection || device.bleDeviceId)) {
    detailAutoRefreshing = true;
    setTimeout(async () => {
      try {
        await refreshCurrentDevice(true, { quietErrors: true });
      } finally {
        detailAutoRefreshing = false;
        const status = $("#detailStatus");
        if (status) status.textContent = "";
      }
    }, 0);
  }
}

function featureButton(key, title, desc) {
  return `<button class="feature-btn" data-feature="${key}" type="button"><strong>${title}</strong><span>${desc}</span></button>`;
}

function renderCard(options = {}) {
  const device = getCurrentDevice();
  const text = device?.cardPreview || t("defaultCard");
  view.innerHTML = `
    <div class="split">
      <div class="panel form">
        <h2>${t("cardContent")}</h2>
        <div class="field">
          <label>${t("maxBytes", { count: CARD_INFO_MAX_BYTES })}</label>
          <textarea id="cardText">${escapeHtml(text)}</textarea>
        </div>
        <div class="muted" id="cardBytes">${bytesLen(text)} / ${CARD_INFO_MAX_BYTES} bytes</div>
        <div class="actions">
          <button id="readCardBtn" class="secondary-btn" type="button">${t("readFromDevice")}</button>
          <button id="writeCardBtn" class="primary-btn" type="button">${t("uploadCard")}</button>
        </div>
      </div>
      <div class="panel">
        <h2>${t("preview")}</h2>
        <div class="stat"><span>${t("avatarText")}</span><strong id="cardAvatar">${escapeHtml(titleFromCard(text))}</strong></div>
        <pre class="log" id="cardPreview">${escapeHtml(text || t("noCardContent"))}</pre>
      </div>
    </div>
    ${receivedCardsPanel()}
  `;
  const input = $("#cardText");
  input.addEventListener("input", () => {
    const value = input.value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    $("#cardBytes").textContent = `${bytesLen(value)} / ${CARD_INFO_MAX_BYTES} bytes`;
    $("#cardAvatar").textContent = titleFromCard(value);
    $("#cardPreview").textContent = value || t("noCardContent");
  });
  $("#readCardBtn").addEventListener("click", async () => {
    try {
      const cardInfo = await ble.readCardInfo();
      input.value = cardInfo;
      input.dispatchEvent(new Event("input"));
      if (device) updateDevice(device.id, { cardPreview: cardInfo, connected: true, statusLabel: t("online") });
      toast(t("cardRead"));
    } catch (error) {
      toast(formatError(error, t("readFailed")));
    }
  });
  $("#writeCardBtn").addEventListener("click", async () => {
    try {
      if (bytesLen(input.value) > CARD_INFO_MAX_BYTES) throw new Error("名片内容过长");
      await ble.writeCardInfo(input.value);
      if (device) updateDevice(device.id, { cardPreview: input.value, connected: true, statusLabel: t("settingsSynced") });
      toast(t("cardUploaded"));
    } catch (error) {
      toast(formatError(error, t("uploadFailed")));
    }
  });
  bindReceivedCards({ autoSync: options.enteringRoute });
}

function renderMedia() {
  const settings = ensureAppSettings();
  const mediaLayout = settings.mediaLayout === "contain" ? "contain" : "cover";
  const mediaCaption = settings.mediaCaption || "";
  const mediaZoom = clamp(settings.mediaZoom || 100, 80, 240);
  const mediaOffsetX = clamp(settings.mediaOffsetX, -100, 100);
  const mediaOffsetY = clamp(settings.mediaOffsetY, -100, 100);
  const mediaCaptionX = clamp(settings.mediaCaptionX || 50, 8, 92);
  const mediaCaptionY = clamp(settings.mediaCaptionY || 82, 8, 92);
  const mediaCaptionSize = clamp(settings.mediaCaptionSize || 18, 10, 42);
  const mediaCaptionColor = normalizeHexColor(settings.mediaCaptionColor, "#ffffff");
  const mediaCaptionBackgroundEnabled = settings.mediaCaptionBackgroundEnabled !== false;
  const mediaCaptionBackgroundColor = normalizeHexColor(settings.mediaCaptionBackgroundColor, "#000000");
  const mediaCaptionBackgroundOpacity = clamp(settings.mediaCaptionBackgroundOpacity ?? 58, 0, 100);
  const mediaCaptionFont = ["system", "serif", "mono", "custom"].includes(settings.mediaCaptionFont) ? settings.mediaCaptionFont : "system";
  const mediaCaptionCustomFont = settings.mediaCaptionCustomFont || "";
  const mediaCaptionBold = settings.mediaCaptionBold !== false;
  const mediaCaptionItalic = Boolean(settings.mediaCaptionItalic);
  const mediaCaptionDirection = settings.mediaCaptionDirection === "vertical" ? "vertical" : "horizontal";
  const mediaQuality = MEDIA_QUALITY_OPTIONS[settings.mediaQuality] ? settings.mediaQuality : "high";
  const clipStart = Math.round(clamp(settings.mediaClipStartMs ?? 0, 0, MOTION_MAX_DURATION_MS) / 100) / 10;
  const clipEnd = Math.round(clamp(settings.mediaClipEndMs ?? MOTION_MAX_DURATION_MS, 0.1, MOTION_MAX_DURATION_MS) / 100) / 10;
  const editBeforeUpload = Boolean(settings.mediaEditBeforeUpload);
  view.innerHTML = `
    <div class="panel form">
      <h2>${t("mediaTransfer")}</h2>
      <p class="muted">${t("mediaHelp")}</p>
      <p class="muted">${t("mediaProcessHelp")}</p>
      <div class="field">
        <label>${t("fileType")}</label>
        <input value="${t("resourceFile")}" disabled>
        <span class="muted">${t("fileTypeHelp")}</span>
      </div>
      <div class="field">
        <label>${t("mediaQuality")}</label>
        <select id="mediaQualitySelect">
          <option value="high" ${mediaQuality === "high" ? "selected" : ""}>${t("mediaQualityHigh")}</option>
          <option value="balanced" ${mediaQuality === "balanced" ? "selected" : ""}>${t("mediaQualityBalanced")}</option>
          <option value="compact" ${mediaQuality === "compact" ? "selected" : ""}>${t("mediaQualityCompact")}</option>
          <option value="maximum" ${mediaQuality === "maximum" ? "selected" : ""}>${t("mediaQualityMaximum")}</option>
        </select>
        <span class="muted">${t("mediaQualityHelp")}</span>
      </div>
      <label class="switch-row">
        <span><strong>${t("mediaEditBeforeUpload")}</strong><br><span class="muted">${t("mediaEditBeforeUploadDesc")}</span></span>
        <input id="mediaEditToggle" class="switch" type="checkbox" ${editBeforeUpload ? "checked" : ""}>
      </label>
      <div id="mediaEditor" class="${editBeforeUpload ? "" : "hidden"}">
        <div class="field hidden" id="mediaClipField">
          <label>${t("mediaClip")}</label>
          <div class="range-grid">
            <span>${t("mediaClipStart")}</span>
            <input id="mediaClipStartInput" type="range" min="0" max="9.9" step="0.1" value="${Math.min(clipStart, 9.9)}">
            <strong id="mediaClipStartValue">${Math.min(clipStart, 9.9).toFixed(1)}s</strong>
            <span>${t("mediaClipEnd")}</span>
            <input id="mediaClipEndInput" type="range" min="0.1" max="10" step="0.1" value="${Math.max(clipEnd, 0.1)}">
            <strong id="mediaClipEndValue">${Math.max(clipEnd, 0.1).toFixed(1)}s</strong>
          </div>
          <span class="muted">${t("mediaClipHelp")}</span>
        </div>
        <div class="field">
          <label>${t("mediaLayout")}</label>
          <select id="mediaLayoutSelect">
            <option value="cover" ${mediaLayout === "cover" ? "selected" : ""}>${t("mediaLayoutCover")}</option>
            <option value="contain" ${mediaLayout === "contain" ? "selected" : ""}>${t("mediaLayoutContain")}</option>
          </select>
        </div>
        <div class="field">
          <label>${t("mediaAdjustments")}</label>
          <div class="range-grid">
            <span>${t("mediaZoom")}</span>
            <input id="mediaZoomInput" type="range" min="80" max="240" value="${mediaZoom}">
            <strong id="mediaZoomValue">${mediaZoom}%</strong>
            <span>${t("mediaOffsetX")}</span>
            <input id="mediaOffsetXInput" type="range" min="-100" max="100" value="${mediaOffsetX}">
            <strong id="mediaOffsetXValue">${mediaOffsetX}</strong>
            <span>${t("mediaOffsetY")}</span>
            <input id="mediaOffsetYInput" type="range" min="-100" max="100" value="${mediaOffsetY}">
            <strong id="mediaOffsetYValue">${mediaOffsetY}</strong>
          </div>
        </div>
        <div class="field">
          <label>${t("mediaCaption")}</label>
          <input id="mediaCaptionInput" maxlength="48" value="${escapeAttr(mediaCaption)}" placeholder="${escapeAttr(t("mediaCaptionPlaceholder"))}">
        </div>
        <div class="field">
          <label>${t("mediaTextStyle")}</label>
          <div class="text-style-grid">
            <select id="mediaCaptionFontSelect" aria-label="${escapeAttr(t("mediaCaptionFont"))}">
              <option value="system" ${mediaCaptionFont === "system" ? "selected" : ""}>${t("mediaCaptionFont")}：System</option>
              <option value="serif" ${mediaCaptionFont === "serif" ? "selected" : ""}>${t("mediaCaptionFont")}：Serif</option>
              <option value="mono" ${mediaCaptionFont === "mono" ? "selected" : ""}>${t("mediaCaptionFont")}：Mono</option>
              <option value="custom" ${mediaCaptionFont === "custom" ? "selected" : ""}>${t("mediaCaptionCustomFont")}</option>
            </select>
            <label class="check-pill"><input id="mediaCaptionBoldInput" type="checkbox" ${mediaCaptionBold ? "checked" : ""}>${t("mediaCaptionWeight")}</label>
            <label class="check-pill"><input id="mediaCaptionItalicInput" type="checkbox" ${mediaCaptionItalic ? "checked" : ""}>${t("mediaCaptionItalic")}</label>
            <select id="mediaCaptionDirectionSelect" aria-label="${escapeAttr(t("mediaCaptionDirection"))}">
              <option value="horizontal" ${mediaCaptionDirection === "horizontal" ? "selected" : ""}>${t("mediaCaptionHorizontal")}</option>
              <option value="vertical" ${mediaCaptionDirection === "vertical" ? "selected" : ""}>${t("mediaCaptionVertical")}</option>
            </select>
          </div>
          <div class="range-grid compact nested-field">
            <span>${t("mediaCaptionSize")}</span>
            <input id="mediaCaptionSizeInput" type="range" min="10" max="42" value="${mediaCaptionSize}">
            <strong id="mediaCaptionSizeValue">${mediaCaptionSize}px</strong>
          </div>
          <div id="mediaCustomFontField" class="field nested-field ${mediaCaptionFont === "custom" ? "" : "hidden"}">
            <label>${t("mediaCaptionCustomFont")}</label>
            <input id="mediaCaptionCustomFontInput" value="${escapeAttr(mediaCaptionCustomFont)}" placeholder="${escapeAttr(t("mediaCaptionCustomFontPlaceholder"))}">
            <span class="muted">${t("mediaCaptionCustomFontHelp")}</span>
          </div>
        </div>
        <div class="field">
          <label>${t("mediaCaptionColors")}</label>
          <div class="text-style-grid">
            <label class="color-field"><span>${t("mediaCaptionColor")}</span><input id="mediaCaptionColorInput" type="color" value="${escapeAttr(mediaCaptionColor)}"></label>
            <label class="check-pill"><input id="mediaCaptionBackgroundInput" type="checkbox" ${mediaCaptionBackgroundEnabled ? "checked" : ""}>${t("mediaCaptionBackground")}</label>
            <label class="color-field"><span>${t("mediaCaptionBackground")}</span><input id="mediaCaptionBackgroundColorInput" type="color" value="${escapeAttr(mediaCaptionBackgroundColor)}" ${mediaCaptionBackgroundEnabled ? "" : "disabled"}></label>
          </div>
          <div id="mediaCaptionBackgroundOpacityWrap" class="range-grid compact nested-field ${mediaCaptionBackgroundEnabled ? "" : "hidden"}">
            <span>${t("mediaCaptionBackgroundOpacity")}</span>
            <input id="mediaCaptionBackgroundOpacityInput" type="range" min="0" max="100" value="${mediaCaptionBackgroundOpacity}">
            <strong id="mediaCaptionBackgroundOpacityValue">${mediaCaptionBackgroundOpacity}%</strong>
          </div>
        </div>
        <div class="field">
          <label>${t("mediaCaptionY")}</label>
          <div class="range-grid">
            <span>${t("mediaCaptionX")}</span>
            <input id="mediaCaptionXInput" type="range" min="8" max="92" value="${mediaCaptionX}">
            <strong id="mediaCaptionXValue">${mediaCaptionX}%</strong>
            <span>${t("mediaCaptionY")}</span>
            <input id="mediaCaptionYInput" type="range" min="8" max="92" value="${mediaCaptionY}">
            <strong id="mediaCaptionYValue">${mediaCaptionY}%</strong>
          </div>
        </div>
        <div class="field">
          <label>${t("mediaPreview")}</label>
          <div class="media-preview-wrap">
            <canvas id="mediaPreviewCanvas" width="240" height="320"></canvas>
            <span id="mediaPreviewEmpty">${t("mediaPreviewEmpty")}</span>
          </div>
        </div>
      </div>
      <div class="actions">
        <button id="pickFileBtn" class="primary-btn" type="button">${t("pickAndTransfer")}</button>
        <button id="uploadMediaBtn" class="secondary-btn ${editBeforeUpload ? "" : "hidden"}" type="button" disabled>${t("uploadSelectedMedia")}</button>
        <button id="cancelTransferBtn" class="danger-btn" type="button" disabled>${t("cancelTransfer")}</button>
      </div>
      <div id="mediaDropZone" class="drop-zone">${t("dropMedia")}</div>
      <div class="summary-box" id="mediaSummaryBox">
        <strong>${t("mediaSummary")}</strong>
        <span id="mediaSummaryText">${t("mediaSummaryEmpty")}</span>
      </div>
      <div class="progress"><span id="transferProgress"></span></div>
      <pre id="transferLog" class="log">${t("waitingFile")}</pre>
    </div>
  `;
  let selectedMediaFile = null;
  let previewToken = 0;
  let previewCleanup = null;
  let clipDurationSec = 10;
  const isEditingMedia = () => Boolean(ensureAppSettings().mediaEditBeforeUpload);
  const setMediaControlsBusy = (busy) => {
    $("#pickFileBtn").disabled = busy;
    $("#uploadMediaBtn").disabled = busy || !isEditingMedia() || !selectedMediaFile;
    $("#cancelTransferBtn").disabled = !busy;
    $("#connectBtn").disabled = busy;
    $("#disconnectBtn").disabled = busy;
    $("#languageSelect").disabled = busy;
    dropZone.classList.toggle("disabled", busy);
  };
  const stopPreviewPlayback = () => {
    if (previewCleanup) previewCleanup();
    previewCleanup = null;
  };
  const setMediaSummary = (text) => {
    const el = $("#mediaSummaryText");
    if (el) el.textContent = text || t("mediaSummaryEmpty");
  };
  const mediaDurationMs = async (file) => {
    if (!file) return MOTION_MAX_DURATION_MS;
    const type = String(file.type || "").toLowerCase();
    const name = String(file.name || "").toLowerCase();
    if (type.includes("gif") || name.endsWith(".gif")) return parseGifBytes(await file.arrayBuffer()).totalDurationMs || MOTION_MAX_DURATION_MS;
    if (type.startsWith("video/")) {
      const { video, url } = await loadVideoFromFile(file);
      try {
        return Math.max(100, Math.round((Number(video.duration) || 0) * 1000));
      } finally {
        URL.revokeObjectURL(url);
      }
    }
    return MOTION_MAX_DURATION_MS;
  };
  const updateClipControlBounds = async (file) => {
    const isMotion = isMotionMediaFile(file);
    $("#mediaClipField").classList.toggle("hidden", !isMotion);
    if (!isMotion) return;
    clipDurationSec = Math.max(0.1, Math.round(await mediaDurationMs(file) / 100) / 10);
    $("#mediaClipStartInput").max = Math.max(0, clipDurationSec - 0.1).toFixed(1);
    $("#mediaClipEndInput").max = clipDurationSec.toFixed(1);
    updateClipValues();
  };
  const describeSelectedFile = async (file) => {
    if (!file) return t("mediaSummaryEmpty");
    const type = String(file.type || "").toLowerCase();
    const name = String(file.name || "").toLowerCase();
    try {
      if (type.startsWith("image/")) {
        const image = await loadImageFromFile(file);
        return `${image.naturalWidth || image.width}x${image.naturalHeight || image.height} · ${formatBytes(file.size)}`;
      }
      if (type.includes("gif") || name.endsWith(".gif")) {
        const gif = parseGifBytes(await file.arrayBuffer());
        return `${gif.width}x${gif.height} · ${(gif.totalDurationMs / 1000).toFixed(1)}s · ${gif.frameCount} frames · ${formatBytes(file.size)}`;
      }
      if (type.startsWith("video/")) {
        const { video, url } = await loadVideoFromFile(file);
        try {
          return `${video.videoWidth || "--"}x${video.videoHeight || "--"} · ${Number(video.duration || 0).toFixed(1)}s · ${formatBytes(file.size)}`;
        } finally {
          URL.revokeObjectURL(url);
        }
      }
    } catch {
      return `${file.name || t("resourceFile")} · ${formatBytes(file.size)}`;
    }
    return `${file.name || t("resourceFile")} · ${formatBytes(file.size)}`;
  };
  const updatePreview = async () => {
    const file = selectedMediaFile;
    if (!file || !isEditingMedia()) return;
    const token = ++previewToken;
    stopPreviewPlayback();
    try {
      const type = String(file.type || "").toLowerCase();
      if (type.startsWith("video/")) {
        previewCleanup = await startVideoMediaPreview(file, $("#mediaPreviewCanvas"), () => token === previewToken && isEditingMedia());
      } else {
        await renderMediaPreview(file, $("#mediaPreviewCanvas"));
      }
      if (token !== previewToken) return;
      $("#mediaPreviewEmpty").classList.add("hidden");
    } catch (error) {
      if (token !== previewToken) return;
      $("#mediaPreviewEmpty").textContent = t("mediaPreviewFailed");
      $("#mediaPreviewEmpty").classList.remove("hidden");
    }
  };
  const selectMediaFile = async (file) => {
    if (!file) return;
    selectedMediaFile = file;
    $("#uploadMediaBtn").disabled = !isEditingMedia();
    $("#transferLog").textContent = t("mediaSelected", { name: file.name || t("resourceFile") });
    setMediaSummary(await describeSelectedFile(file));
    await updateClipControlBounds(file);
    $("#transferProgress").style.width = "0%";
    if (isEditingMedia()) {
      $("#mediaPreviewEmpty").textContent = t("mediaPreviewEmpty");
      $("#mediaPreviewEmpty").classList.remove("hidden");
      await updatePreview();
    } else {
      await transferSelectedFile(file);
    }
  };
  $("#mediaEditToggle").addEventListener("change", (event) => {
    ensureAppSettings().mediaEditBeforeUpload = event.target.checked;
    saveState();
    $("#mediaEditor").classList.toggle("hidden", !event.target.checked);
    $("#uploadMediaBtn").classList.toggle("hidden", !event.target.checked);
    $("#uploadMediaBtn").disabled = !event.target.checked || !selectedMediaFile;
    if (event.target.checked) {
      updateClipControlBounds(selectedMediaFile).then(updatePreview);
    } else {
      stopPreviewPlayback();
    }
  });
  $("#mediaQualitySelect").addEventListener("change", (event) => {
    ensureAppSettings().mediaQuality = MEDIA_QUALITY_OPTIONS[event.target.value] ? event.target.value : "high";
    saveState();
    updatePreview();
  });
  const updateClipValues = (event) => {
    const settings = ensureAppSettings();
    const maxSec = Math.max(0.1, clipDurationSec || 10);
    let start = clamp(Number($("#mediaClipStartInput").value) || 0, 0, Math.max(0, maxSec - 0.1));
    let end = clamp(Number($("#mediaClipEndInput").value) || Math.min(10, maxSec), 0.1, maxSec);
    if (end <= start) {
      end = Math.min(maxSec, start + 0.1);
    }
    if (end - start > 10) {
      if (event?.target?.id === "mediaClipEndInput") start = Math.max(0, end - 10);
      else end = Math.min(maxSec, start + 10);
    }
    $("#mediaClipStartInput").value = start.toFixed(1);
    $("#mediaClipEndInput").value = end.toFixed(1);
    settings.mediaClipStartMs = Math.round(start * 1000);
    settings.mediaClipEndMs = Math.round(end * 1000);
    $("#mediaClipStartValue").textContent = `${start.toFixed(1)}s`;
    $("#mediaClipEndValue").textContent = `${end.toFixed(1)}s`;
    saveState();
    updatePreview();
  };
  $("#mediaClipStartInput").addEventListener("input", updateClipValues);
  $("#mediaClipEndInput").addEventListener("input", updateClipValues);
  $("#mediaLayoutSelect").addEventListener("change", (event) => {
    ensureAppSettings().mediaLayout = event.target.value === "contain" ? "contain" : "cover";
    saveState();
    updatePreview();
  });
  const bindRangeSetting = (inputId, valueId, key, suffix = "") => {
    const input = $(`#${inputId}`);
    const value = $(`#${valueId}`);
    input.addEventListener("input", (event) => {
      const next = Number(event.target.value) || 0;
      ensureAppSettings()[key] = next;
      value.textContent = `${next}${suffix}`;
      saveState();
      updatePreview();
    });
  };
  const setMediaRangeSetting = (inputId, valueId, key, next, suffix = "", min = -100, max = 100) => {
    const value = Math.round(clamp(next, min, max));
    ensureAppSettings()[key] = value;
    $(`#${inputId}`).value = value;
    $(`#${valueId}`).textContent = `${value}${suffix}`;
    saveState();
  };
  bindRangeSetting("mediaZoomInput", "mediaZoomValue", "mediaZoom", "%");
  bindRangeSetting("mediaOffsetXInput", "mediaOffsetXValue", "mediaOffsetX");
  bindRangeSetting("mediaOffsetYInput", "mediaOffsetYValue", "mediaOffsetY");
  bindRangeSetting("mediaCaptionSizeInput", "mediaCaptionSizeValue", "mediaCaptionSize", "px");
  bindRangeSetting("mediaCaptionXInput", "mediaCaptionXValue", "mediaCaptionX", "%");
  bindRangeSetting("mediaCaptionYInput", "mediaCaptionYValue", "mediaCaptionY", "%");
  bindRangeSetting("mediaCaptionBackgroundOpacityInput", "mediaCaptionBackgroundOpacityValue", "mediaCaptionBackgroundOpacity", "%");
  $("#mediaCaptionInput").addEventListener("input", (event) => {
    ensureAppSettings().mediaCaption = event.target.value.slice(0, 48);
    saveState();
    updatePreview();
  });
  $("#mediaCaptionFontSelect").addEventListener("change", (event) => {
    ensureAppSettings().mediaCaptionFont = event.target.value;
    $("#mediaCustomFontField").classList.toggle("hidden", event.target.value !== "custom");
    saveState();
    updatePreview();
  });
  $("#mediaCaptionCustomFontInput").addEventListener("input", (event) => {
    ensureAppSettings().mediaCaptionCustomFont = event.target.value.slice(0, 80);
    saveState();
    updatePreview();
  });
  $("#mediaCaptionDirectionSelect").addEventListener("change", (event) => {
    ensureAppSettings().mediaCaptionDirection = event.target.value === "vertical" ? "vertical" : "horizontal";
    saveState();
    updatePreview();
  });
  $("#mediaCaptionBoldInput").addEventListener("change", (event) => {
    ensureAppSettings().mediaCaptionBold = event.target.checked;
    saveState();
    updatePreview();
  });
  $("#mediaCaptionItalicInput").addEventListener("change", (event) => {
    ensureAppSettings().mediaCaptionItalic = event.target.checked;
    saveState();
    updatePreview();
  });
  $("#mediaCaptionColorInput").addEventListener("input", (event) => {
    ensureAppSettings().mediaCaptionColor = normalizeHexColor(event.target.value, "#ffffff");
    saveState();
    updatePreview();
  });
  $("#mediaCaptionBackgroundColorInput").addEventListener("input", (event) => {
    ensureAppSettings().mediaCaptionBackgroundColor = normalizeHexColor(event.target.value, "#000000");
    saveState();
    updatePreview();
  });
  $("#mediaCaptionBackgroundInput").addEventListener("change", (event) => {
    ensureAppSettings().mediaCaptionBackgroundEnabled = event.target.checked;
    $("#mediaCaptionBackgroundColorInput").disabled = !event.target.checked;
    $("#mediaCaptionBackgroundOpacityWrap").classList.toggle("hidden", !event.target.checked);
    saveState();
    updatePreview();
  });
  const previewCanvas = $("#mediaPreviewCanvas");
  let previewDrag = null;
  previewCanvas.addEventListener("pointerdown", (event) => {
    if (!selectedMediaFile || !isEditingMedia()) return;
    const rect = previewCanvas.getBoundingClientRect();
    const settings = ensureAppSettings();
    const px = (event.clientX - rect.left) / Math.max(rect.width, 1) * 100;
    const py = (event.clientY - rect.top) / Math.max(rect.height, 1) * 100;
    const caption = String(settings.mediaCaption || "").trim();
    const captionX = clamp(settings.mediaCaptionX || 50, 8, 92);
    const captionY = clamp(settings.mediaCaptionY || 82, 8, 92);
    const target = caption && Math.abs(px - captionX) <= 22 && Math.abs(py - captionY) <= 16 ? "caption" : "image";
    previewCanvas.setPointerCapture?.(event.pointerId);
    previewDrag = {
      pointerId: event.pointerId,
      target,
      x: event.clientX,
      y: event.clientY,
      offsetX: Number(ensureAppSettings().mediaOffsetX) || 0,
      offsetY: Number(ensureAppSettings().mediaOffsetY) || 0,
      captionX,
      captionY
    };
    previewCanvas.classList.add("dragging");
  });
  previewCanvas.addEventListener("pointermove", (event) => {
    if (!previewDrag || previewDrag.pointerId !== event.pointerId) return;
    const rect = previewCanvas.getBoundingClientRect();
    const dx = event.clientX - previewDrag.x;
    const dy = event.clientY - previewDrag.y;
    if (previewDrag.target === "caption") {
      setMediaRangeSetting("mediaCaptionXInput", "mediaCaptionXValue", "mediaCaptionX", previewDrag.captionX + dx / Math.max(rect.width, 1) * 100, "%", 8, 92);
      setMediaRangeSetting("mediaCaptionYInput", "mediaCaptionYValue", "mediaCaptionY", previewDrag.captionY + dy / Math.max(rect.height, 1) * 100, "%", 8, 92);
    } else {
      setMediaRangeSetting("mediaOffsetXInput", "mediaOffsetXValue", "mediaOffsetX", previewDrag.offsetX - dx / Math.max(rect.width, 1) * 200);
      setMediaRangeSetting("mediaOffsetYInput", "mediaOffsetYValue", "mediaOffsetY", previewDrag.offsetY - dy / Math.max(rect.height, 1) * 200);
    }
    updatePreview();
  });
  const endPreviewDrag = (event) => {
    if (!previewDrag || previewDrag.pointerId !== event.pointerId) return;
    previewCanvas.releasePointerCapture?.(event.pointerId);
    previewDrag = null;
    previewCanvas.classList.remove("dragging");
  };
  previewCanvas.addEventListener("pointerup", endPreviewDrag);
  previewCanvas.addEventListener("pointercancel", endPreviewDrag);
  const transferSelectedFile = async (file) => {
    if (!file) return;
    state = { ...state, mediaBusy: true, currentRoute: "media" };
    saveState();
    renderNav();
    setMediaControlsBusy(true);
    const qualityNote = isMotionMediaFile(file) ? `\n${t("mediaQuality")}：${mediaMotionQuality().label}` : "";
    $("#transferLog").textContent = `${t("processingMedia")}${qualityNote}`;
    $("#transferProgress").style.width = "0%";
    try {
      const prepared = await prepareMediaFile(file);
      const transferSize = fileTransferBytes(prepared.bytes).totalLength;
      setMediaSummary(t("mediaPreparedSummary", {
        source: prepared.source || file.name || t("resourceFile"),
        output: prepared.output || prepared.label,
        fileSize: formatBytes(prepared.bytes.byteLength)
      }));
      $("#transferLog").textContent = `${t("mediaPrepared", { name: prepared.fileName, size: formatBytes(prepared.bytes.byteLength) })}\n${prepared.label}`;
      try {
        const fs = await ble.readFileSystemInfo();
        if (fs && Number.isFinite(fs.freeBytes)) {
          const remainingAfter = fs.freeBytes - transferSize;
          if (remainingAfter < FILE_TRANSFER_FREE_MARGIN_BYTES && !confirm(t("mediaStorageWarning", { size: formatBytes(transferSize), free: formatBytes(fs.freeBytes) }))) return;
        }
      } catch (error) {
        if (!confirm(t("mediaStorageUnknown"))) return;
      }
      await ble.transferBytes(prepared.bytes, prepared.fileName, FILE_TYPE.RESOURCE, (percent) => {
        $("#transferProgress").style.width = `${percent}%`;
        $("#transferLog").textContent = t("fileTransferring", { name: prepared.fileName, percent });
      });
      $("#transferProgress").style.width = "100%";
      $("#transferLog").textContent = t("fileComplete", { name: prepared.fileName });
      await refreshCurrentDevice(true);
      toast(t("transferDone"));
    } catch (error) {
      $("#transferLog").textContent += `\n${formatError(error, t("transferFailed"))}`;
      toast(formatError(error, t("transferFailed")));
    } finally {
      state = { ...state, mediaBusy: false };
      saveState();
      renderNav();
      setMediaControlsBusy(false);
      filePicker.value = "";
    }
  };
  $("#pickFileBtn").addEventListener("click", () => {
    if (state.mediaBusy) return;
    filePicker.accept = "image/*,video/*,.gif";
    filePicker.onchange = () => selectMediaFile(filePicker.files[0]);
    filePicker.click();
  });
  $("#uploadMediaBtn").addEventListener("click", () => {
    if (state.mediaBusy) return;
    transferSelectedFile(selectedMediaFile);
  });
  const dropZone = $("#mediaDropZone");
  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      if (state.mediaBusy) return;
      event.preventDefault();
      dropZone.classList.add("active");
      dropZone.textContent = t("dropMediaActive");
    });
  });
  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.remove("active");
      dropZone.textContent = t("dropMedia");
    });
  });
  dropZone.addEventListener("drop", (event) => {
    if (state.mediaBusy) return;
    selectMediaFile(event.dataTransfer?.files?.[0]);
  });
  $("#cancelTransferBtn").addEventListener("click", () => {
    activeTransferAbort = true;
    toast(t("cancelingTransfer"));
  });
}

function renderTags() {
  const rawCategories = state.tagCategories.length ? state.tagCategories : [{ name: t("category"), tags: [t("tag")] }];
  const categories = localizeTagCategories(rawCategories);
  const device = getCurrentDevice();
  const defaultCat = Math.max(0, categories.findIndex((item) => item.name === device?.tagCategory || item.originalName === device?.tagCategory));
  view.innerHTML = `
    <div class="panel form">
      <h2>${t("tagSettings")}</h2>
      <div class="field">
        <label>${t("searchTags")}</label>
        <input id="tagSearch" type="search" placeholder="${escapeAttr(t("tagSearchPlaceholder"))}">
      </div>
      <div class="field">
        <label>${t("category")}</label>
        <select id="tagCategory">${categories.map((item, index) => `<option value="${index}" ${index === defaultCat ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("")}</select>
      </div>
      <div class="field">
        <label>${t("tag")}</label>
        <select id="tagName"></select>
      </div>
      <div class="actions">
        <button id="addTagBtn" class="secondary-btn" type="button">${t("addToList")}</button>
        <button id="clearTagsBtn" class="danger-btn" type="button">${t("clearAllTags")}</button>
        <button id="readTagsBtn" class="secondary-btn" type="button">${t("readDeviceTags")}</button>
        <button id="writeTagsBtn" class="primary-btn" type="button">${t("writeToDevice")}</button>
      </div>
      <div class="summary-box">
        <strong>${t("currentDeviceTags")}</strong>
        <div class="tag-list" id="currentTags"></div>
      </div>
      <div class="summary-box">
        <strong>${t("pendingDeviceTags")}</strong>
        <div class="tag-list" id="draftTags"></div>
      </div>
      <pre class="log" id="tagStatus">${t("tagHint")}</pre>
    </div>
  `;
  let currentTags = device?.tagName ? [{
    category: Number(device.tagCategoryId) || 0,
    tagId: Number(device.tagId) || 0,
    categoryName: device.tagCategory || t("category"),
    tagName: device.tagName
  }] : [];
  const drafts = [];
  const categorySelect = $("#tagCategory");
  const tagSearch = $("#tagSearch");
  const tagSelect = $("#tagName");
  const renderTagOptions = () => {
    const entries = tagOptionEntries(categories, Number(categorySelect.value), tagSearch.value);
    tagSelect.innerHTML = entries.length
      ? entries.map((entry) => `<option value="${entry.catIndex}:${entry.tagIndex}">${escapeHtml(entry.categoryName)} · ${escapeHtml(entry.tagName)}</option>`).join("")
      : `<option value="" disabled>${t("noTagResults")}</option>`;
  };
  const renderDrafts = () => {
    $("#currentTags").innerHTML = currentTags.map((tag) => `<span class="tag-chip">${escapeHtml(tag.categoryName)} · ${escapeHtml(tag.tagName)}</span>`).join("") || `<span class="muted">${t("tagsReadEmpty")}</span>`;
    $("#draftTags").innerHTML = drafts.map((tag, index) => `<button class="tag-chip" data-remove-tag="${index}" type="button">${escapeHtml(tag.categoryName)} · ${escapeHtml(tag.tagName)}</button>`).join("") || `<span class="muted">${t("noPendingTags")}</span>`;
    $("#draftTags").querySelectorAll("[data-remove-tag]").forEach((button) => {
      button.addEventListener("click", () => {
        drafts.splice(Number(button.dataset.removeTag), 1);
        renderDrafts();
      });
    });
  };
  categorySelect.addEventListener("change", renderTagOptions);
  tagSearch.addEventListener("input", renderTagOptions);
  renderTagOptions();
  renderDrafts();
  $("#addTagBtn").addEventListener("click", () => {
    if (drafts.length >= TAGS_MAX_COUNT) return toast(t("maxTags", { count: TAGS_MAX_COUNT }));
    if (!tagSelect.value) return toast(t("noTagResults"));
    const [catIndex, tagIndex] = tagSelect.value.split(":").map(Number);
    const cat = categories[catIndex];
    const tag = cat.tags[tagIndex];
    const tagName = tagDisplayName(tag);
    const payload = { category: categoryId(cat, catIndex), tagId: tagId(tag, tagIndex), categoryName: cat.name, tagName };
    if (drafts.some((item) => item.category === payload.category && item.tagId === payload.tagId)) return toast(t("tagExists"));
    drafts.push(payload);
    renderDrafts();
  });
  $("#clearTagsBtn").addEventListener("click", () => {
    drafts.splice(0, drafts.length);
    renderDrafts();
    $("#tagStatus").textContent = t("tagsCleared");
    toast(t("tagsCleared"));
  });
  $("#readTagsBtn").addEventListener("click", async () => {
    if (!device) return toast(t("noDevice"));
    const button = $("#readTagsBtn");
    button.disabled = true;
    $("#tagStatus").textContent = t("readingDeviceTags");
    try {
      const result = await ble.readTagsFromAdvertisement(device);
      if (!result.found) throw new Error("未讀取到設備標籤廣播");
      const resolved = (result.tags || []).map((tag) => resolveTagPayload(categories, tag));
      currentTags = resolved.slice();
      drafts.splice(0, drafts.length, ...resolved);
      renderDrafts();
      if (resolved[0]) {
        updateDevice(device.id, {
          tagCategory: resolved[0].categoryName,
          tagName: resolved[0].tagName,
          tagCategoryId: resolved[0].category,
          tagId: resolved[0].tagId,
          bleDeviceId: result.bleDeviceId || device.bleDeviceId
        });
      } else {
        updateDevice(device.id, {
          tagCategory: "",
          tagName: "",
          tagCategoryId: 0,
          tagId: 0,
          bleDeviceId: result.bleDeviceId || device.bleDeviceId
        });
      }
      const message = resolved.length ? t("tagsRead", { count: resolved.length }) : t("tagsReadEmpty");
      $("#tagStatus").textContent = message;
      toast(message);
    } catch (error) {
      const message = error?.message === "BLE_ADVERTISEMENT_UNSUPPORTED" ? t("tagReadUnsupported") : formatError(error, t("tagReadFailed"));
      $("#tagStatus").textContent = message;
      toast(message);
    } finally {
      button.disabled = false;
    }
  });
  $("#writeTagsBtn").addEventListener("click", async () => {
    try {
      if (!confirm(t("confirmOverwriteTags"))) return;
      $("#tagStatus").textContent = t("writeToDevice");
      await ble.writeTags(drafts);
      currentTags = drafts.slice();
      renderDrafts();
      if (device && drafts[0]) {
        updateDevice(device.id, {
          tagCategory: drafts[0].categoryName,
          tagName: drafts[0].tagName,
          tagCategoryId: drafts[0].category,
          tagId: drafts[0].tagId,
          statusLabel: t("settingsSynced")
        });
      } else if (device) {
        updateDevice(device.id, {
          tagCategory: "",
          tagName: "",
          tagCategoryId: 0,
          tagId: 0,
          statusLabel: t("settingsSynced")
        });
      }
      $("#tagStatus").textContent = t("tagsWrittenHint");
      toast(t("tagsWritten"));
    } catch (error) {
      $("#tagStatus").textContent = formatError(error, t("writeFailed"));
      toast(formatError(error, t("writeFailed")));
    }
  });
}

function categoryId(category, index) {
  const value = category && (category.categoryId ?? category.category_id ?? category.id);
  return Number.isInteger(Number(value)) ? Number(value) : index + 1;
}

function tagId(tag, index) {
  const value = tag && typeof tag === "object" ? (tag.tagId ?? tag.tag_id ?? tag.id) : undefined;
  return Number.isInteger(Number(value)) ? Number(value) : index + 1;
}

function renderDeviceSettings() {
  const carouselDuration = Math.max(0, Math.min(Number(getCurrentDevice()?.carouselDuration) || 0, 60));
  const carouselEnabled = carouselDuration > 0;
  const carouselSliderValue = carouselEnabled ? carouselDuration : 3;
  const controls = [
    ["disableBuzzer", t("buzzer"), t("buzzerDesc")],
    ["disableVibration", t("vibration"), t("vibrationDesc")],
    ["disableLight", t("light"), t("lightDesc")],
    ["disableInterestSensing", t("interest"), t("interestDesc")],
    ["disableAmbienceLight", t("ambience"), t("ambienceDesc")],
    ["disableBroadcast", t("broadcast"), t("broadcastDesc")]
  ];
  view.innerHTML = `
    <div class="panel form">
      <h2>${t("deviceSwitches")}</h2>
      <div class="actions">
        <button id="readSettingsBtn" class="secondary-btn" type="button">${t("readSettings")}</button>
      </div>
      <p id="settingsStatus" class="muted">${ble.connection ? t("autoReadingSettings") : t("autoReadSkipped")}</p>
      <div id="switches">${controls.map(([key, title, desc]) => `
        <label class="switch-row">
          <span><strong>${title}</strong><br><span class="muted">${desc}</span></span>
          <input class="switch" data-setting="${key}" type="checkbox" ${state.deviceSettings[key] ? "" : "checked"}>
        </label>
      `).join("")}
        <div class="carousel-setting">
          <label class="switch-row">
            <span><strong>${t("carouselEnabled")}</strong><br><span class="muted">${t("videoCarousel")}</span></span>
            <input id="carouselToggle" class="switch" type="checkbox" ${carouselEnabled ? "checked" : ""}>
          </label>
          <div id="carouselSliderWrap" class="carousel-slider ${carouselEnabled ? "" : "hidden"}">
            <div class="range-grid compact">
              <span>${t("carouselSeconds")}</span>
              <input id="carouselInput" type="range" min="1" max="60" value="${carouselSliderValue}">
              <strong id="carouselValue">${carouselSliderValue}s</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  $("#readSettingsBtn").addEventListener("click", async () => {
    await readSettingsAndCarousel({ notify: true });
  });
  view.querySelectorAll("[data-setting]").forEach((input) => {
    input.addEventListener("change", async () => {
      const previousChecked = !input.checked;
      input.disabled = true;
      const next = { ...state.deviceSettings, [input.dataset.setting]: !input.checked };
      try {
        const saved = await ble.writeControlSettings(next);
        state.deviceSettings = saved;
        saveState();
        applyDeviceSettingsToSwitches(saved);
        toast(t("settingsSynced"));
      } catch (error) {
        input.checked = previousChecked;
        toast(formatError(error, t("syncFailed")));
      } finally {
        input.disabled = false;
      }
    });
  });
  $("#carouselToggle").addEventListener("change", async (event) => {
    const nextSeconds = event.target.checked ? Math.max(1, Math.min(Number($("#carouselInput").value) || 3, 60)) : 0;
    updateCarouselControls(nextSeconds);
    await saveCarouselSeconds(nextSeconds, event.target);
  });
  $("#carouselInput").addEventListener("input", (event) => {
    $("#carouselValue").textContent = `${event.target.value}s`;
  });
  $("#carouselInput").addEventListener("change", async (event) => {
    if (!$("#carouselToggle").checked) return;
    await saveCarouselSeconds(Number(event.target.value) || 1);
  });
  if (ble.connection) setTimeout(() => readSettingsAndCarousel({ notify: false }), 0);
}

async function readSettingsAndCarousel(options = {}) {
  try {
    const status = $("#settingsStatus");
    if (status) status.textContent = t("autoReadingSettings");
    state.deviceSettings = await ble.readControlSettings();
    applyDeviceSettingsToSwitches(state.deviceSettings);
    const seconds = await ble.readCarousel().catch(() => Number(getCurrentDevice()?.carouselDuration) || 0);
    const device = getCurrentDevice();
    if (device) updateDevice(device.id, { carouselDuration: seconds, connected: true, statusLabel: t("online") });
    saveState();
    if (options.notify) toast(t("settingsRead"));
    updateCarouselControls(seconds);
    if (status) status.textContent = t("settingsRead");
  } catch (error) {
    if (options.notify) toast(formatError(error, t("readFailed")));
    const status = $("#settingsStatus");
    if (status) status.textContent = formatError(error, t("readFailed"));
  }
}

function applyDeviceSettingsToSwitches(settings) {
  view.querySelectorAll("[data-setting]").forEach((input) => {
    if (input.disabled) return;
    input.checked = !settings[input.dataset.setting];
  });
}

function updateCarouselControls(seconds) {
  const normalized = Math.max(0, Math.min(Number(seconds) || 0, 60));
  const value = normalized > 0 ? normalized : 3;
  const input = $("#carouselInput");
  const toggle = $("#carouselToggle");
  const label = $("#carouselValue");
  const wrap = $("#carouselSliderWrap");
  if (input) input.value = value;
  if (toggle) toggle.checked = normalized > 0;
  if (label) label.textContent = `${value}s`;
  if (wrap) wrap.classList.toggle("hidden", normalized <= 0);
}

async function saveCarouselSeconds(seconds, toggleElement) {
  try {
    const normalized = Math.max(0, Math.min(Number(seconds) || 0, 60));
    await ble.writeCarousel(normalized);
    const device = getCurrentDevice();
    if (device) updateDevice(device.id, { carouselDuration: normalized });
    updateCarouselControls(normalized);
    toast(normalized > 0 ? t("carouselSaved") : t("carouselOff"));
  } catch (error) {
    if (toggleElement) toggleElement.checked = !toggleElement.checked;
    toast(formatError(error, t("saveFailed")));
  }
}

function receivedCardsPanel() {
  const device = getCurrentDevice();
  const cards = device ? (state.receivedCardsByDevice[device.id] || []) : [];
  return `
    <div class="panel">
      <h2>${t("navReceived")}</h2>
      <div class="actions">
        <button id="syncCardsBtn" class="primary-btn" type="button">${t("syncFromDevice")}</button>
      </div>
      <pre class="log" id="syncLog">${t("waitingSync")}</pre>
    </div>
    <div class="grid">${cards.map((card) => `
      <article class="card">
        <h2>${escapeHtml(card.description || card.title || t("card"))}</h2>
        <p class="muted">${escapeHtml(card.receivedAt || "")} · ${escapeHtml(card.sourceMac || "")}</p>
        <pre class="log">${escapeHtml(card.detail || "")}</pre>
        <div class="actions">
          <button class="danger-btn" data-delete-received-card="${escapeAttr(card.id)}" type="button">${t("deleteReceivedCard")}</button>
        </div>
      </article>
    `).join("") || `<div class="empty">${t("noReceivedCards")}</div>`}</div>
  `;
}

function renderReceivedCards() {
  view.innerHTML = receivedCardsPanel();
  bindReceivedCards();
}

async function syncReceivedCardsFromDevice(device, cachedCards, options = {}) {
  if (!device || receivedCardsSyncing) return;
  const log = $("#syncLog");
  const syncButton = $("#syncCardsBtn");
  receivedCardsSyncing = true;
  if (syncButton) syncButton.disabled = true;
  if (log && options.auto) log.textContent = t("autoSyncReceivedCards");
  try {
    if (!ble.device || !ble.device.gatt.connected) await ble.connectGranted(device);
    const result = await ble.syncReceivedCards((message) => {
      const currentLog = $("#syncLog");
      if (currentLog) currentLog.textContent = message;
    });
    state.receivedCardsByDevice[device.id] = preserveReceivedCardTimes(result.cards, cachedCards);
    saveState();
    const message = state.receivedCardsByDevice[device.id].length ? t("syncedCards", { count: state.receivedCardsByDevice[device.id].length }) : t("noReceivedCards");
    const currentLog = $("#syncLog");
    if (currentLog) currentLog.textContent = message;
    if (!options.auto) toast(message);
    render();
  } catch (error) {
    const message = formatError(error, t("syncFailed"));
    const currentLog = $("#syncLog");
    if (currentLog) currentLog.textContent = message;
    if (!options.quietErrors) toast(message);
  } finally {
    receivedCardsSyncing = false;
    const currentButton = $("#syncCardsBtn");
    if (currentButton) currentButton.disabled = false;
  }
}

function bindReceivedCards(options = {}) {
  const device = getCurrentDevice();
  const cards = device ? (state.receivedCardsByDevice[device.id] || []) : [];
  const syncButton = $("#syncCardsBtn");
  if (!syncButton) return;
  $("#syncCardsBtn").addEventListener("click", async () => {
    if (!device) return toast(t("noDevice"));
    await syncReceivedCardsFromDevice(device, cards);
  });
  if (options.autoSync && device && (ble.connection || device.bleDeviceId)) {
    setTimeout(() => syncReceivedCardsFromDevice(device, cards, { auto: true, quietErrors: true }), 0);
  }
  document.querySelectorAll("[data-delete-received-card]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!device) return toast(t("noDevice"));
      const cardId = button.getAttribute("data-delete-received-card");
      const currentCards = state.receivedCardsByDevice[device.id] || [];
      const card = currentCards.find((item) => item.id === cardId);
      const sourceId = Number(card?.sourceId);
      if (!card || !Number.isFinite(sourceId) || sourceId <= 0) return toast(t("deleteReceivedCardFailed"));
      if (!confirm(t("confirmDeleteReceivedCard"))) return;
      button.disabled = true;
      try {
        await ble.deleteReceivedCard(sourceId);
        state.receivedCardsByDevice[device.id] = currentCards.filter((item) => item.id !== cardId);
        saveState();
        toast(t("receivedCardDeleted"));
        render();
      } catch (error) {
        button.disabled = false;
        toast(formatError(error, t("deleteReceivedCardFailed")));
      }
    });
  });
}

function renderFirmware() {
  const deviceBeforeUpdate = getCurrentDevice();
  const settings = ensureAppSettings();
  const advancedVisible = Boolean(settings.firmwareAdvancedVisible);
  const riskAccepted = Boolean(settings.firmwareRiskAccepted);
  const currentVersion = getCurrentDevice()?.firmwareVersion || "--";
  view.innerHTML = `
    <div class="panel form">
      <h2>${t("firmwareUpgrade")}</h2>
      <p class="muted">${t("firmwareHelp")}</p>
      <p class="muted">${t("firmwareCurrentVersion", { version: currentVersion })}</p>
      <label class="switch-row">
        <span><strong>${t("firmwareAdvanced")}</strong><br><span class="muted">${t("firmwareAdvancedHelp")}</span></span>
        <input id="firmwareAdvancedToggle" class="switch" type="checkbox" ${advancedVisible ? "checked" : ""}>
      </label>
      <div id="firmwareAdvancedPanel" class="${advancedVisible ? "" : "hidden"}">
        <label class="check-pill full"><input id="firmwareRiskAccepted" type="checkbox" ${riskAccepted ? "checked" : ""}>${t("firmwareConfirmOfficial")}</label>
        <div class="actions">
          <button id="pickFirmwareBtn" class="primary-btn" type="button" ${riskAccepted ? "" : "disabled"}>${t("pickFirmware")}</button>
        </div>
      </div>
      <div class="progress"><span id="firmwareProgress"></span></div>
      <pre id="firmwareLog" class="log">${t("waitingFirmware")}</pre>
    </div>
  `;
  $("#firmwareAdvancedToggle").addEventListener("change", (event) => {
    ensureAppSettings().firmwareAdvancedVisible = event.target.checked;
    saveState();
    renderFirmware();
  });
  $("#firmwareRiskAccepted")?.addEventListener("change", (event) => {
    ensureAppSettings().firmwareRiskAccepted = event.target.checked;
    saveState();
    $("#pickFirmwareBtn").disabled = !event.target.checked;
  });
  $("#pickFirmwareBtn").addEventListener("click", () => {
    if (!ensureAppSettings().firmwareRiskAccepted) return toast(t("firmwareRequireConfirm"));
    filePicker.accept = ".bin";
    filePicker.onchange = async () => {
      const file = filePicker.files[0];
      if (!file) return;
      try {
        $("#firmwareProgress").style.width = "0%";
        await validateFirmwareFile(file);
        $("#firmwareLog").textContent = t("firmwareReady", { name: file.name, size: formatBytes(file.size) });
        if (!confirm(t("confirmFirmwareUpdate"))) return;
        state = { ...state, firmwareBusy: true, currentRoute: "firmware" };
        saveState();
        renderNav();
        await ble.transferFirmwarePackage(file, ({ percent, message }) => {
          $("#firmwareProgress").style.width = `${percent}%`;
          $("#firmwareLog").textContent = message;
        });
        $("#firmwareProgress").style.width = "100%";
        $("#firmwareLog").textContent = t("firmwareReconnectHint");
        toast(t("firmwareTransferred"));
        await verifyFirmwareAfterUpdate(deviceBeforeUpdate);
      } catch (error) {
        $("#firmwareLog").textContent = formatError(error, t("firmwareTransferFailed"));
        toast(formatError(error, t("firmwareTransferFailed")));
      } finally {
        state = { ...state, firmwareBusy: false };
        saveState();
        renderNav();
        filePicker.value = "";
      }
    };
    filePicker.click();
  });
}

async function verifyFirmwareAfterUpdate(deviceBeforeUpdate) {
  await sleep(10000);
  const target = deviceBeforeUpdate || getCurrentDevice() || {};
  for (let attempt = 1; attempt <= 60; attempt += 1) {
    const log = $("#firmwareLog");
    if (log) log.textContent = t("firmwareVerifying", { count: attempt });
    try {
      if (!ble.device || !ble.device.gatt.connected) await ble.connectGranted(target);
      const summary = await ble.readSummary(target);
      upsertDevice({ ...target, ...summary, connected: true, statusLabel: t("online") });
      const version = summary.firmwareVersion || "--";
      const nextLog = $("#firmwareLog");
      if (nextLog) nextLog.textContent = t("firmwareVerified", { version });
      toast(t("firmwareVerified", { version }));
      return summary;
    } catch (error) {
      await sleep(3000);
    }
  }
  const log = $("#firmwareLog");
  if (log) log.textContent = t("firmwareVerifyFailed");
  toast(t("firmwareVerifyFailed"));
  return null;
}

function renderAppSettings() {
  const settings = ensureAppSettings();
  view.innerHTML = `
    <div class="split">
      <div class="panel form">
        <h2>${t("webSettings")}</h2>
        <div class="field">
          <label>${t("language")}</label>
          <select id="settingsLanguageSelect">
            <option value="auto" ${(state.localeMode || "auto") === "auto" ? "selected" : ""}>${t("autoLanguage")}</option>
            <option value="zh-Hant" ${state.localeMode === "zh-Hant" ? "selected" : ""}>${localeNames["zh-Hant"]}</option>
            <option value="en" ${state.localeMode === "en" ? "selected" : ""}>${localeNames.en}</option>
            <option value="ja" ${state.localeMode === "ja" ? "selected" : ""}>${localeNames.ja}</option>
          </select>
        </div>
        <div class="field">
          <label>${t("transferDelay")}</label>
          <input id="transferDelay" type="number" min="0" max="100" value="${Number(settings.transferChunkDelay) || 0}">
          <span class="muted">${t("transferDelayHelp")}</span>
        </div>
        <div class="actions">
          <button id="saveAppSettingsBtn" class="primary-btn" type="button">${t("saveSettings")}</button>
          <button id="resetStateBtn" class="danger-btn" type="button">${t("clearData")}</button>
        </div>
      </div>
      <div class="panel">
        <h2>${t("migrationNotes")}</h2>
        <p class="muted">${t("migrationHelp")}</p>
      </div>
    </div>
  `;
  $("#settingsLanguageSelect").addEventListener("change", (event) => setLocaleMode(event.target.value));
  $("#saveAppSettingsBtn").addEventListener("click", () => {
    ensureAppSettings().transferChunkDelay = Number($("#transferDelay").value) || 0;
    saveState();
    toast(t("settingsSaved"));
  });
  $("#resetStateBtn").addEventListener("click", () => {
    if (!confirm(t("confirmClear"))) return;
    state = initialState();
    saveState();
    toast(t("dataCleared"));
    render();
  });
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

async function loadTagCategories() {
  state.tagCategories = DEFAULT_TAG_CATEGORIES;
  saveState();
}

$("#connectBtn").addEventListener("click", connectFlow);
$("#disconnectBtn").addEventListener("click", async () => {
  await ble.disconnect();
  const current = getCurrentDevice();
  if (current) updateDevice(current.id, { connected: false, statusLabel: t("disconnected") });
  toast(t("disconnected"));
  render();
});

loadTagCategories().then(render);
