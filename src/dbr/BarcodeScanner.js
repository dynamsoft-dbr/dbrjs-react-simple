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
            showSettings: false,
            runtimeSettingsString: "",
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
    render() {
        return (<div ref={this.elRef} style={{ height: "75vh", margin: "1vh auto" }}>
            <ScannerUI
                style={{ marginTop: "2vh" }}
                exportRef={(ref) => this.exportRef(ref)}
            />
            <select value={this.state.currentCamera} style={{ width: "25vw", minWidth: "100px" }} onChange={(evt) => { this.setState({ currentCamera: evt.target.value }); this.handleChange({ currentCamera: evt.target.value }); }}>
                {this.state.allCameras.map((_value, _key) => {
                    return <option value={_value.label} key={_key}>{_value.label}</option>
                })}
            </select>
            <select value={this.state.currentResolution} style={{ width: "25vw", minWidth: "100px" }} onChange={(evt) => { this.setState({ currentResolution: evt.target.value }); this.handleChange({ currentResolution: evt.target.value }); }}>
                {this.state.resoluations.map((_value, _key) => {
                    return <option value={_value} key={_key}>{_value}</option>
                })}
            </select>
            <div style={{ width: "100%", height: "auto", fontSize: "small", textAlign: "left" }}>
                <label><input type="checkbox" onChange={(evt) => { this.setState({ showSettings: evt.target.checked }) }} />Show Setting String</label>
                <pre style={this.state.showSettings ? { display: "block" } : { display: "none" }}>{this.state.runtimeSettingsString}</pre>
            </div>
        </div >
        );
    }
    async exportRef(ref) {
        this.uiRef = ref;
        try {
            this.scanner = this.scanner || await Dynamsoft.BarcodeScanner.createInstance();
            if (this.bDestroyed) {
                this.scanner.destroy();
                return;
            }
            let runtimeSettings = await this.scanner.getRuntimeSettings();
            runtimeSettings.barcodeFormatIds = Dynamsoft.EnumBarcodeFormat.BF_ALL;
            runtimeSettings.region = {
                regionBottom: 90,
                regionLeft: 10,
                regionMeasuredByPercentage: 1,
                regionRight: 90,
                regionTop: 10
            };
            await this.scanner.updateRuntimeSettings(runtimeSettings);
            let str = await this.scanner.outputSettingsToString();
            this.setState({ runtimeSettingsString: str });
            this.scanner.setUIElement(ref);
            this.scanner.onFrameRead = (results) => {
                for (let result of results) {
                    this.ringBell();
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
    async getCurrentStates() {
        /**
         * Show available cameras
         */
        this.allCam = await this.scanner.getAllCameras();
        this.setState({
            allCameras: this.allCam
        });
        /**
         * Show current resolutions
         */
        let curRes = await this.scanner.getResolution();
        this.handleResolutionChange(curRes);
        this.resolution = curRes[0] + " x " + curRes[1];
        this.updateUI(curRes);
    }
    async updateUI(curRes) {
        /**
         * Change the UI based on the current resolution
         */
        let width = document.body.clientWidth;
        let videoRatio = curRes[0] / curRes[1];
        let baseWidth = Math.round(width * 0.9);
        if (baseWidth > curRes[0])
            baseWidth = curRes[0];
        this.elRef.current.style.width = baseWidth + "px";
        this.uiRef.style.height = Math.round(baseWidth / videoRatio) + "px";
        this.uiRef.style.width = baseWidth + "px";
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
    componentDidMount() { }
    componentWillUnmount() {
        this.bDestroyed = true;
        if (this.scanner) {
            this.scanner.destroy();
        }
    }
    handleChange(change) {
        /**
         * Change the camera or the resolution of the camera
         */
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
    ringBell() {
        let successSound = this.scanner.soundOnSuccessfullRead;
        successSound.pause();
        successSound.currentTime = 0;
        successSound.play();
    }
}

export default BarcodeScanner;