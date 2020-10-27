import Dynamsoft from "dynamsoft-javascript-barcode";// "dynamsoft-javascript-barcode";
Dynamsoft.BarcodeReader.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@7.6.0/dist/";
// Please visit https://www.dynamsoft.com/CustomerPortal/Portal/TrialLicense.aspx to get a trial license
Dynamsoft.BarcodeReader.productKeys = "t0075xQAAAJL9KzkHfzBs2q9e1vnZFwOaIZbukiHi6d3Avt/LoU4+rfTh9pmcJy6iGxzW4cKqAI8A5ajjNYFyU2vWkSdVMMNWGSavOys/";
Dynamsoft.BarcodeReader._bUseFullFeature = true; // Control of loading min wasm or full wasm.
export default Dynamsoft;