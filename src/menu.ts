import { Container, Graphics, Renderer, Text } from "pixi.js";
import { FancyButton } from "@pixi/ui";
import { fitToParent } from "./util";

class CommonButton extends FancyButton {
    _order: number;
    constructor(
        text: string,
        order: number,
    ) {
        super({
            defaultView: new Graphics()
                .rect(0, 0, 400, 60)
                .fill(0x575876),
            hoverView: new Graphics()
                .rect(0, 0, 400, 60)
                .fill(0x032740),
        });
        this.text = new Text({text, style: { fontFamily: 'yg-jalnan', fontSize: 100, fill: 'white' }})
        this._order = order;
    }
    
    _onRender = (renderer: Renderer) => {
        const canvasWidth = renderer.canvas.width;
        const canvasHeight = renderer.canvas.height;
        fitToParent(this, canvasWidth, canvasHeight * 0.1);
        this.x = (canvasWidth - this.width) / 2;
        this.y = canvasHeight * (0.30 + 0.15 * this._order);
    }
}

class StartButton extends CommonButton {
    constructor(startAudioList: HTMLAudioElement[], gameStart: () => void) {
        super('콘레이', 0);
        this.onPress.connect(() => {
            const startAudio = startAudioList[Math.floor(Math.random() * startAudioList.length)];
            startAudio.onended = () => {
                gameStart();
            };
            startAudio.play();
        });
    }
}

const availableVoiceTypeList: string[] = ['nande'];
const stringifyVoiceType: { [voiceType: string]: string } = {
    'nande': '난데',
}
const defaultVoiceTypeIndex = availableVoiceTypeList.length - 1;

class VoiceTypeButton extends CommonButton {
    _typeIndex: number = defaultVoiceTypeIndex;
    _onChange: (voiceType: string) => void;

    constructor(onChange: (voiceType: string) => void) {
        super(stringifyVoiceType[availableVoiceTypeList[defaultVoiceTypeIndex]], 1);
        this._onChange = onChange;
        this.onPress.connect(() => this.next());
        this.next();
    }

    next() {
        this._typeIndex = (this._typeIndex + 1) % availableVoiceTypeList.length;
        const voiceType = availableVoiceTypeList[this._typeIndex];
        this.text = stringifyVoiceType[voiceType];
        this._onChange(voiceType);
    }
}

const availableSizeList = [2, 4];
const defaultSizeIndex = availableSizeList.length - 1;
const stringifySize = (size: number) => `${size} x ${size}`;

class SizeButton extends CommonButton {
    _sizeIndex: number = defaultSizeIndex;
    _onChange: (size: number) => void;

    constructor(onChange: (size: number) => void) {
        super(stringifySize(availableSizeList[defaultSizeIndex]), 2);
        this._onChange = onChange;
        this.onPress.connect(() => this.next());
        this.next();
    }

    next() {
        this._sizeIndex = (this._sizeIndex + 1) % availableSizeList.length;
        const size = availableSizeList[this._sizeIndex]
        this.text = stringifySize(size);
        this._onChange(size);
    }
}

// (주)여기어때컴퍼니가 제공한 여기어때 잘난체가 적용되어 있습니다.
class CreditButton extends CommonButton {
    constructor() {
        super('크레딧', 3);
        this.onPress.connect(() => console.log('onPress'));
    }
}

// UI
// 10%
// 20% title
// 5%
// 10% startButton
// 5%
// 10% voiceTypeButton
// 5%
// 10% sizeButton
// 5%
// 10% creditButton
// 10%
export class Menu extends Container {
    _voiceType?: string;
    _size?: number;

    onstart: ((voiceType: string, size: number) => void) | undefined;

    constructor(startAudioList: HTMLAudioElement[]) {
        super();

        const title = new Text({
            text: '하나비라는 신경쇠약',
            style: {
                fontFamily: 'yg-jalnan',
                fontSize: 200,
                fill: 'white',
                stroke: { color: 'black', width: 4, join: 'round' },
                dropShadow: {
                    color: 'black',
                    blur: 5,
                    angle: Math.PI,
                    distance: 6,
                },
                align: 'center',
                padding: 20,
            }
        })
        const startButton = new StartButton(startAudioList, () => this.gameStart());
        const voiceTypeButton = new VoiceTypeButton((voiceType) => this._voiceType = voiceType);
        const sizeButton = new SizeButton((size) => this._size = size);
        const creditButton = new CreditButton();
        this.addChild(title);
        this.addChild(startButton);
        this.addChild(voiceTypeButton);
        this.addChild(sizeButton);
        this.addChild(creditButton);
        title._onRender = (renderer: Renderer) => {
            const canvasWidth = renderer.canvas.width;
            const canvasHeight = renderer.canvas.height;
            fitToParent(title, canvasWidth * 0.9, canvasHeight * 0.2);
            title.x = (canvasWidth - title.width) / 2;
            title.y = canvasHeight * 0.1;
        }
    }

    gameStart() {
        console.log('gameStart', this._voiceType, this._size);
        this.onstart?.(this._voiceType!, this._size!);
    }
}