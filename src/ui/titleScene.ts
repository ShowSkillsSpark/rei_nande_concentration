import { Assets, Container, Graphics, Sprite, Text } from "pixi.js";
import { FancyButton } from "@pixi/ui";
import { fitToParent } from "../util";
import { Scene, SceneParam } from "./scene";
import { store } from "../store";
import { sound } from "@pixi/sound";
import { CreditPopup } from "./creditPopup";

interface TitleButtonParam { text?: string, x: number, y: number, width: number, height: number };
class TitleButton extends FancyButton {
    constructor({ text, x, y, width, height}: TitleButtonParam) {
        super({
            defaultView: new Graphics()
                .roundRect(0, 0, width, height, height * 0.3)
                .fill(0x575876),
            hoverView: new Graphics()
                .roundRect(0, 0, width, height, height * 0.3)
                .fill(0x032740),
            animations: {
                hover: {
                    props: {
                        scale: {x: 1.2, y: 1.2},
                    },
                    duration: 50,
                }
            }
        });

        this.x = x + width / 2;
        this.y = y + height / 2;
        this.anchor.set(0.5);

        const buttonText = new Text({text: text || ' ', style: { fontFamily: 'JalnanOTF00', fontSize: 100, fill: 'white' }});
        fitToParent(buttonText, this.width * 0.9, this.height * 0.9);
        this.text = buttonText;
    }
}

class StartButton extends TitleButton {
    private _clicked = false;

    constructor(param: TitleButtonParam, navGameScene: () => void) {
        super({...param, text: '콘레이'});

        this.on('pointerdown', () => {
            // 여러번 클릭 방지
            if (this._clicked) return;
            this._clicked = true;

            // 무작위 게임 시작 음성 재생
            const startVoiceName = store.loadRandomVoice(store.VOICE.START)[0];
            sound.play(startVoiceName, () => {
                navGameScene();
                this._clicked = false;
            });
        });
    }
}

class VoiceTypeButton extends TitleButton {
    constructor(param: TitleButtonParam) {
        super({...param, text: store.voiceTypeString});

        this.on('pointerdown', () => {
            const voiceType = store.nextVoiceType;
            this.text = store.voiceTypeString;
            const voiceName = store.loadRandomVoice(voiceType)[0];
            sound.play(voiceName);
        });
    }

}

class SizeButton extends TitleButton {
    constructor(param: TitleButtonParam) {
        super({...param, text: store.cardCountString});

        this.on('pointerdown', () => {
            const lastCount = store.cardCount;
            const currCount = store.nextCardCount();
            this.text = store.cardCountString;
            if (lastCount < currCount) sound.play(store.loadRandomVoice(store.VOICE.INCREASE)[0]);
            else sound.play(store.loadRandomVoice(store.VOICE.DECREASE)[0]);
        });
    }
}

interface CreditButtonParam extends TitleButtonParam { popup: CreditPopup };
class CreditButton extends TitleButton {
    constructor(param: CreditButtonParam) {
        super({...param, text: '크레딧'});

        this.on('pointerdown', () => {
            param.popup.open = true;
        });
    }
}

// UI
// title
// startButton
// voiceTypeButton
// sizeButton
// creditButton
export class TitleScene extends Scene {
    private _creditPopup;
    constructor(param: SceneParam) {
        super(param);

        const { navigator } = param;

        const bg = new Sprite();

        store.loadImage(store.IMAGE.BG1).then((a) => {
            bg.texture = a;
            fitToParent(bg, this.sceneWidth, this.sceneHeight);
            bg.anchor.set(0.5);
            bg.x = this.sceneWidth / 2;
            bg.y = this.sceneHeight / 2;
            this.scene.alpha = 0.8;
        });

        const title = new Text({
            text: '하나비라는 신경쇠약',
            style: {
                fontFamily: 'JalnanOTF00',
                fontSize: 150,
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
        });
        title.anchor.set(0.5);
        const titleMaxWidth = this.scene.width * 0.95;
        const titleMaxHeight = this.scene.height * 0.2;
        fitToParent(title, titleMaxWidth, titleMaxHeight);
        title.x = this.horizontal_center;
        title.y = this.scene.height * 0.2;

        const buttonWidht = this.scene.width * 0.4;
        const buttonHeight = this.scene.height * 0.1;
        const buttonGap = this.scene.height * 0.05;
        const startButton = new StartButton({
            x: (this.scene.width - buttonWidht) / 2,
            y: this.scene.height * 0.35 + (buttonHeight + buttonGap) * 0,
            width: buttonWidht, height: buttonHeight,
        }, () => navigator.navScene(navigator.SCENE.GAME));
        const voiceTypeButton = new VoiceTypeButton({
            x: (this.scene.width - buttonWidht) / 2,
            y: this.scene.height * 0.35 + (buttonHeight + buttonGap) * 1,
            width: buttonWidht, height: buttonHeight,
        });
        const sizeButton = new SizeButton({
            x: (this.scene.width - buttonWidht) / 2,
            y: this.scene.height * 0.35 + (buttonHeight + buttonGap) * 2,
            width: buttonWidht, height: buttonHeight,
        });
        const popupWidth = this.sceneWidth * 0.8;
        const popupHeight = this.sceneHeight * 0.8;
        const creditPopup = new CreditPopup({
            x: this.horizontal_center - popupWidth / 2,
            y: this.vertical_center - popupHeight / 2,
            width: popupWidth,
            height: popupHeight,
            style: 0xFFFFFF,
            scene: this,
            navigator,
        });
        const creditButton = new CreditButton({
            x: (this.scene.width - buttonWidht) / 2,
            y: this.scene.height * 0.35 + (buttonHeight + buttonGap) * 3,
            width: buttonWidht, height: buttonHeight,
            popup: creditPopup,
        });

        this.scene.addChild(bg);
        this.scene.addChild(title);
        this.scene.addChild(startButton);
        this.scene.addChild(voiceTypeButton);
        this.scene.addChild(sizeButton);
        this.scene.addChild(creditButton);
        this.addChild(creditPopup);

        this._creditPopup = creditPopup;
    }

    onNavigated = (): void => {}
    onUnnavigated = () => {
        this._creditPopup.open = false;
    }
}