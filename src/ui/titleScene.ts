import { Graphics, Text } from "pixi.js";
import { FancyButton } from "@pixi/ui";
import { fitToParent } from "../util";
import { Scene, SceneParam } from "./scene";
import { store } from "../store";
import { Navigator } from "./navigator";
import { sound } from "@pixi/sound";

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
                        scale: {x: 1.1, y: 1.1},
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

    constructor(param: TitleButtonParam, startSoundNameList: string[], navGameScene: () => void) {
        super({...param, text: '콘레이'});

        this.on('pointerdown', () => {
            // 여러번 클릭 방지
            if (this._clicked) return;
            this._clicked = true;

            // 무작위 게임 시작 음성 재생
            const startSoundName = startSoundNameList[Math.floor(Math.random() * startSoundNameList.length)];
            sound.play(startSoundName, () => {
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
            store.nextVoiceType();
            this.text = store.voiceTypeString;
        });
    }

}

class SizeButton extends TitleButton {
    constructor(param: TitleButtonParam) {
        super({...param, text: store.cardCountString});

        this.on('pointerdown', () => {
            store.nextCardCount();
            this.text = store.cardCountString;
        });
    }
}

// (주)여기어때컴퍼니가 제공한 여기어때 잘난체가 적용되어 있습니다.
class CreditButton extends TitleButton {
    constructor(param: TitleButtonParam) {
        super({...param, text: '크레딧'});

        this.on('pointerdown', () => {});
    }
}

// UI
// title
// startButton
// voiceTypeButton
// sizeButton
// creditButton
interface TitleSceneParam extends SceneParam { startSoundNameList: string[] };
export class TitleScene extends Scene {
    constructor(param: TitleSceneParam) {
        super(param);

        const { startSoundNameList, navigator } = param;

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
        }, startSoundNameList, () => navigator.navScene(navigator.SCENE.GAME));
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
        const creditButton = new CreditButton({
            x: (this.scene.width - buttonWidht) / 2,
            y: this.scene.height * 0.35 + (buttonHeight + buttonGap) * 3,
            width: buttonWidht, height: buttonHeight,
        });

        this.scene.addChild(title);
        this.scene.addChild(startButton);
        this.scene.addChild(voiceTypeButton);
        this.scene.addChild(sizeButton);
        this.scene.addChild(creditButton);

    }

    onNavigated = (): void => {
        store.resetTimer();
    }
}