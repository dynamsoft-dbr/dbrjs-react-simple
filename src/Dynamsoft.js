import Dynamsoft from "keillion-dynamsoft-javascript-barcode";// "dynamsoft-javascript-barcode";
Dynamsoft.BarcodeReader.engineResourcePath = "https://cdn.jsdelivr.net/npm/keillion-dynamsoft-javascript-barcode@0.20200506.0/dist/"
// "https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@7.3.0-v4/dist/";
// Please visit https://www.dynamsoft.com/CustomerPortal/Portal/TrialLicense.aspx to get a trial license
Dynamsoft.BarcodeReader.productKeys = "t0068NQAAAJu4eeTMSBTQzfA5qlY8LtSBZJPA1iFcMRtQi7F6mVs0eqLnkbaLD+RiaVJjJAr8s8HD47y4fYUoXDOl2fjppEI=";
Dynamsoft.BarcodeReader._bUseFullFeature = true; // Control of loading min wasm or full wasm.
export default Dynamsoft;