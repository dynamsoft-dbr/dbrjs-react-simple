import React from 'react';
import Dynamsoft from './Dynamsoft'
import BarcodeScanner from './dbr/BarcodeScanner'

class DBRJS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bShowScanner: false,
            buttonText: "Start",
            barcodeText: ""
        }
        this.elRef = React.createRef();
    }
    ;
    componentDidMount() {
        Dynamsoft.BarcodeScanner.loadWasm();
    }
    toggleShowScanner() {
        this.setState((state) => {
            let buttonText;
            state.bShowScanner ? buttonText = "Start" : buttonText = "Cancel";
            return {
                bShowScanner: !state.bShowScanner,
                buttonText: buttonText
            }
        });
    }
    handleBarcodeText(txt) {
        this.setState({ barcodeText: txt });
    }
    render() {
        return (
            <>
                <p style={{ height: "5vh", margin: "1vh auto" }}>
                    <button className="" style={{ width: "15vw", minWidth: "100px" }} onClick={() => { this.toggleShowScanner(); }} >{this.state.buttonText}</button>
                    <input type="text" placeholder="Serial Number" style={{ width: "40vw" }} value={this.state.barcodeText} readOnly />
                </p>
                {this.state.bShowScanner ? (
                    <BarcodeScanner
                        camera={this.state.currentCamera}
                        resolution={this.state.currentResolution}
                        handleBarcodeText={(txt) => this.handleBarcodeText(txt)}
                    />) : ""}
            </>
        );
    }
}

export { DBRJS }