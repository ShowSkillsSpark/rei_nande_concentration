import { Graphics, Text } from "pixi.js";
import { FancyButton } from "@pixi/ui";
import { fitToParent } from "../util";
import { Scene } from "./scene";
import { store } from "../store";

interface CommonButtonParam { text?: string, x: number, y: number, width: number, height: number };
class CommonButton extends FancyButton {
    constructor({ text, x, y, width, height}: CommonButtonParam) {
        super({
            defaultView: new Graphics()
                .roundRect(0, 0, width, height, height * 0.3)
                .fill(0x575876),
            hoverView: new Graphics()
                .roundRect(0, 0, width, height, height * 0.3)
                .fill(0x032740),
        });
        this.x = x;
        this.y = y;

        const buttonText = new Text({text: text || ' ', style: { fontFamily: 'yg-jalnan', fontSize: 100, fill: 'white' }});
        fitToParent(buttonText, this.width * 0.9, this.height * 0.9);
        buttonText.x = this.x + (this.width - buttonText.width) / 2;
        buttonText.y = this.y + (this.height - buttonText.height) / 2;
        this.text = buttonText;
    }
}

class StartButton extends CommonButton {
    _clicked = false;

    constructor(param: CommonButtonParam, startAudioList: HTMLAudioElement[], navGameScene: () => void) {
        super({...param, text: '콘레이'});

        this.onclick = () => {
            // 여러번 클릭 방지
            if (this._clicked) return;
            this._clicked = true;

            // 무작위 게임 시작 음성 재생
            const startAudio = startAudioList[Math.floor(Math.random() * startAudioList.length)];
            startAudio.onended = () => {
                navGameScene();
            };
            startAudio.play();
        };
    }
}

class VoiceTypeButton extends CommonButton {
    constructor(param: CommonButtonParam) {
        super({...param, text: store.voiceTypeString});

        this.onclick = () => {
            store.nextVoiceType();
            this.text = store.voiceTypeString;
        };
    }

}

class SizeButton extends CommonButton {
    constructor(param: CommonButtonParam) {
        super({...param, text: store.cardCountString});

        this.onclick = () => {
            store.nextCardCount();
            this.text = store.cardCountString;
        };
    }
}

// (주)여기어때컴퍼니가 제공한 여기어때 잘난체가 적용되어 있습니다.
class CreditButton extends CommonButton {
    constructor(param: CommonButtonParam) {
        super({...param, text: '크레딧'});

        this.onclick = () => {};
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
export class TitleScene extends Scene {
    constructor({ startAudioList }: { startAudioList: HTMLAudioElement[] }, navGameScene: () => void) {
        super();

        const title = new Text({
            text: '하나비라는 신경쇠약',
            style: {
                fontFamily: 'yg-jalnan',
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
        const titleMaxWidth = this.width * 0.95;
        const titleMaxHeight = this.height * 0.2;
        fitToParent(title, titleMaxWidth, titleMaxHeight);
        title.x = (this.width - title.width) / 2;
        title.y = this.height * 0.1;

        const buttonWidht = this.width * 0.4;
        const buttonHeight = this.height * 0.1;
        const buttonGap = this.height * 0.05;
        const startButton = new StartButton({
            x: (this.width - buttonWidht) / 2,
            y: this.height * 0.35 + (buttonHeight + buttonGap) * 0,
            width: buttonWidht, height: buttonHeight,
        }, startAudioList, () => navGameScene());
        const voiceTypeButton = new VoiceTypeButton({
            x: (this.width - buttonWidht) / 2,
            y: this.height * 0.35 + (buttonHeight + buttonGap) * 1,
            width: buttonWidht, height: buttonHeight,
        });
        const sizeButton = new SizeButton({
            x: (this.width - buttonWidht) / 2,
            y: this.height * 0.35 + (buttonHeight + buttonGap) * 2,
            width: buttonWidht, height: buttonHeight,
        });
        const creditButton = new CreditButton({
            x: (this.width - buttonWidht) / 2,
            y: this.height * 0.35 + (buttonHeight + buttonGap) * 3,
            width: buttonWidht, height: buttonHeight,
        });

        this.addChild(title);
        this.addChild(startButton);
        this.addChild(voiceTypeButton);
        this.addChild(sizeButton);
        this.addChild(creditButton);
    }
}