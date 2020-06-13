import Dynamsoft from "../Dynamsoft";
import React from 'react';
import ScannerUI from './ScannerUI'

class BarcodeScanner extends React.Component {
    constructor(props) {
        super(props);
        this.bDestroyed = false;
        this.scanner = null;
        this.elRef = React.createRef();
        this.uiRef = null;
        this.state = {
            runtimeSettingsString: "",
            bPaused: false,
            bStreaming: false,
            allCameras: [{ label: "Select A Camera" }],
            currentCamera: "",
            resoluations: ["2160 x 3840", "1440 x 2560", "1080 x 1920", "1200 x 1600", "720 x 1280", "600 x 800", "3840 x 2160", "2560 x 1440", "1920 x 1080", "1600 x 1200", "1280 x 720", "800 x 600",],
            currentResolution: ""
        };
    }
    camera = "";
    cameraId = "";
    allCam = [];
    resolution = "";
    videoSize = { w: 0, h: 0 };
    regionRectHeight = 100;
    regionRectWidth = 1000;
    componentDidMount() { }
    componentWillUnmount() {
        this.bDestroyed = true;
        if (this.scanner) {
            this.scanner.destroy();
        }
    }
    async getCurrentStates() {
        this.allCam = await this.scanner.getAllCameras();
        this.setState({
            allCameras: this.allCam
        });
        let curRes = await this.scanner.getResolution();
        this.handleResolutionChange(curRes);
        this.resolution = curRes[0] + " x " + curRes[1];
        this.updateUI(curRes, (curRes) => {
            window.setTimeout(async () => {
                let curCam = await this.scanner.getCurrentCamera();
                this.camera = curCam.label;
                this.setState({
                    currentCamera: this.camera
                });
            }, 1000);
        });
    }
    async updateUI(curRes, callback) {
        let width = document.body.clientWidth;
        //let height = document.body.clientHeight;
        /*let videoComputedStyle = window.getComputedStyle(this.uiRef);
        let videoComputedWidth = Math.round(parseFloat(videoComputedStyle.getPropertyValue('width')));
        let videoComputedHeight = Math.round(parseFloat(videoComputedStyle.getPropertyValue('height')));*/
        //let pageRatio = width / height;
        let videoRatio = curRes[0] / curRes[1];
        //let containerRatio = videoComputedWidth / videoComputedHeight;
        let baseWidth = Math.round(width * 0.9);
        //this.elRef.current.style.height = Math.round(baseWidth / videoRatio * 1.5) + "px";
        //this.props.handleBarcodeText(baseWidth);
        this.elRef.current.style.width = baseWidth + "px";
        this.uiRef.style.height = Math.round(baseWidth / videoRatio) + "px";
        this.uiRef.style.width = baseWidth + "px";
        let runtimeSettings = await this.scanner.getRuntimeSettings();
        runtimeSettings.region = {
            regionBottom: Math.round((curRes[1] - this.regionRectHeight) / 2) + this.regionRectHeight - 400,
            regionLeft: Math.round((curRes[0] - this.regionRectWidth) / 2),
            regionMeasuredByPercentage: 0,
            regionRight: Math.round((curRes[0] - this.regionRectWidth) / 2) + this.regionRectWidth,
            regionTop: Math.round((curRes[1] - this.regionRectHeight) / 2) - 400,
        };
        this.scanner.updateRuntimeSettings(runtimeSettings).then(() => { callback(curRes); });
    }
    handleChange(change) {
        let _res = "";
        if (change.currentCamera) {
            this.cameraID = "";
            for (let i = 0; i < this.allCam.length; i++) {
                let _cam = this.allCam[i];
                if (_cam.label === change.currentCamera) {
                    this.camera = change.currentCamera;
                    this.cameraID = _cam.deviceId;
                    break;
                }
            }
            _res = this.state.currentResolution.split(" x ");
        }
        else if (change.currentResolution) {
            this.resolution = change.currentResolution;
            _res = this.resolution.split(" x ");
            for (let i = 0; i < this.allCam.length; i++) {
                let _cam = this.allCam[i];
                if (_cam.label === this.state.currentCamera) {
                    this.camera = this.state.currentCamera;
                    this.cameraID = _cam.deviceId;
                    break;
                }
            }
        }
        this.scanner.play(this.cameraID, _res[0], _res[1]).then((resolution) => {
            this.getCurrentStates();
        });
    }
    handleResolutionChange(res) {
        let w = res[0];
        let h = res[1];
        for (let i = 0; i < this.state.resoluations.length; i++) {
            let _res = this.state.resoluations[i].split(" x ");
            if (parseInt(_res[0]) === w && parseInt(_res[1]) === h) {
                this.setState({ currentResolution: this.state.resoluations[i] });
                break;
            }
        }
    }
    ringBell() {
        let successSound = this.scanner.soundOnSuccessfullRead;
        successSound.pause();
        successSound.currentTime = 0;
        successSound.play();
    }
    resumeVide() {
        this.setState({ bPaused: false }, () => {
            this.scanner.play(this.cameraId);
            this.props.handleBarcodeText("");
        });
    }
    async exportRef(ref) {
        this.uiRef = ref;
        try {
            this.scanner = this.scanner || await Dynamsoft.BarcodeScanner.createInstance();
            if (this.bDestroyed) {
                this.scanner.destroy();
                return;
            }
            //await this.scanner.updateRuntimeSettings("speed");
            let runtimeSettings = await this.scanner.getRuntimeSettings();
            runtimeSettings.barcodeFormatIds = Dynamsoft.EnumBarcodeFormat.BF_CODE_39; //Dynamsoft.EnumBarcodeFormat.BF_DATAMATRIX | Dynamsoft.EnumBarcodeFormat.BF_EAN_8 | Dynamsoft.EnumBarcodeFormat.BF_EAN_13 | Dynamsoft.EnumBarcodeFormat.BF_QR_CODE | Dynamsoft.EnumBarcodeFormat.BF_MICRO_QR;
            runtimeSettings.expectedBarcodesCount = 1;
            runtimeSettings.furtherModes.colourConversionModes[0] = 1;
            //runtimeSettings.localizationModes[1] = Dynamsoft.EnumLocalizationMode.LM_STATISTICS_MARKS;
            //this.props.handleBarcodeText(runtimeSettings.localizationModes);
            runtimeSettings.furtherModes.grayscaleTransformationModes = [2, 1, 0, 0, 0, 0, 0, 0,];
            runtimeSettings.region = {
                regionBottom: 45,
                regionLeft: 5,
                regionMeasuredByPercentage: 1,
                regionRight: 95,
                regionTop: 35
            };
            await this.scanner.updateRuntimeSettings(runtimeSettings);
            await this.scanner.setModeArgument("ColourConversionModes", 0, "BlueChannelWeight", "0");
            await this.scanner.setModeArgument("ColourConversionModes", 0, "GreenChannelWeight", "0");
            await this.scanner.setModeArgument("ColourConversionModes", 0, "RedChannelWeight", "1000");
            let str = await this.scanner.outputSettingsToString();
            this.setState({ runtimeSettingsString: str });
            //this.scanner.singleFrameMode = true;
            this.scanner.setUIElement(ref);
            this.scanner.onFrameRead = (results) => {
                for (let result of results) {
                    this.ringBell();
                    //this.scanner.pause();
                    //this.setState({ bPaused: true });
                    this.props.handleBarcodeText(result.barcodeText);
                }
            };
            await this.scanner.show();
            this.getCurrentStates();
            if (this.bDestroyed) {
                this.scanner.destroy();
                return;
            }
        } catch (ex) {
            console.error(ex);
        }
    }
    render() {
        return (<div ref={this.elRef} style={{ height: "80vh", margin: "1vh auto" }}>
            {this.state.bPaused ? <button style={{ width: "80%" }} onClick={() => this.resumeVide()}>Add another device..</button> : ""}
            <br />
            <ScannerUI
                style={{ marginTop: "2vh" }}
                exportRef={(ref) => this.exportRef(ref)}
            />
            <select value={this.state.currentCamera} style={{ width: "30vw", minWidth: "100px" }} onChange={(evt) => { this.setState({ currentCamera: evt.target.value }); this.handleChange({ currentCamera: evt.target.value }); }}>
                {this.state.allCameras.map((_value, _key) => {
                    return <option value={_value.label} key={_key}>{_value.label}</option>
                })}
            </select>
            <select value={this.state.currentResolution} style={{ width: "30vw", minWidth: "100px" }} onChange={(evt) => { this.setState({ currentResolution: evt.target.value }); this.handleChange({ currentResolution: evt.target.value }); }}>
                {this.state.resoluations.map((_value, _key) => {
                    return <option value={_value} key={_key}>{_value}</option>
                })}
            </select>
            <div style={{ width: "100%", height: "auto", fontSize: "small", textAlign: "left" }}>
                <pre>{this.state.runtimeSettingsString}</pre>
            </div>
        </div >
        );
    }
}

export default BarcodeScanner;