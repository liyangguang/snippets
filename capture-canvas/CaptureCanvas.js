import React, { Component } from 'react';

import { captureGif, capturePng } from './helpers.js';

class CaptureCanvas extends Component {
    state = {
        submitMessage: '',
        canvas: null,
        randomClassName: '',
    };

    componentDidMount() {
        this.setState({
            submitMessage: 'Preparing to capture the image...',
            randomClassName: `capturing-${`${Math.random()}`.slice(2)}`,
        });
        this.props.isGif ? this._switchToDisplayAndCaptureGif() : this._captureStillImage();
    }

    _captureStillImage = () => {
        this.setState({canvas: undefined /* Get the canvan component here */});

        // Wait for the elemetn is rendered, and drawing finished
        setTimeout(() => {
            const canvasEl = document.querySelector(`.${this.state.randomClassName} canvas`);
            if (!canvasEl) {
                console.error('No canvan element found');
                this.setState({ submitMessage: 'No canvas element found'});
                return;
            }
    
            this.setState({ submitMessage: `Capturing a png...` });
            capturePng(canvasEl).then((blob) => {
                this.props.onCaptured(blob);
                this.setState({ submitMessage: `Captured a png!` });
            });
        }, 3000);
    }

    _switchToDisplayAndCaptureGif = () => {
        /* These 2 variables are passed down to the p5 component `InteractiveComponent`.
         * We need to define them here, and wrap it in a function. Because we need the props when we create the component in the `setState` below,
         * But the real functionality of them will only available after the component is rendered, and `captureGif` is initialized.
         * So this dependency "loop" of : `props -> component -> gif methods -> props` is handled by:
         * 1. Using `propName={(args) => tempVar && tempVar(args)}` as props
         * 2. Then `tempVar = realGifMethod` later */
        let addGifFrameForP5, stopGifCaptureForP5;
        this.setState({
            canvas: this.setState({canvas: undefined /* Get the canvan component here */});
            // addGifFrame={(frameInMilliseconds) => addGifFrameForP5 && addGifFrameForP5(frameInMilliseconds)}
            // stopCapture={() => stopGifCaptureForP5 && stopGifCaptureForP5()} />
        });

        // `setTimeout`: Wati for the `this.setState({ canvas: <>})` renders on the page
        setTimeout(() => {
            const canvasEl = document.querySelector(`.${this.state.randomClassName} canvas`);
            if (!canvasEl) {
                console.error('No canvas element found');
                this.setState({ submitMessage: 'No canvas element found'});
                return;
            }

            const [addGifFrame, stopCapture] = captureGif(canvasEl, (blob) => {
                this.props.onCaptured(blob);
                this.setState({ submitMessage: `Captured a gif!` });
            });
            this.setState({ submitMessage: `Capturing a ${this.props.durationInSeconds}s gif...` });
            addGifFrameForP5 = addGifFrame;
            stopGifCaptureForP5 = () => {
                this.setState({ submitMessage: 'Processing gif... (please wait)' });
                stopCapture();
            }
        });
    }

    render() {
        return (
            <>
                <div className='this.state.randomClassName'>{this.state.canvas}</div>
                {this.state.submitMessage ? <p>{this.state.submitMessage}</p> : ''}
            </>
        );
    }
}

export default CaptureCanvas;