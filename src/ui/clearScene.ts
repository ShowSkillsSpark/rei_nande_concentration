import { Text, Ticker } from "pixi.js";
import { FancyButton } from "@pixi/ui";
import { Scene, SceneParam } from "./scene";
import { fitToParent } from "../util";
import { store } from "../store";
import { Navigator } from "./navigator";
import { HanabiraOverlay } from "./hanabiraOverlay";
import { sound } from "@pixi/sound";

// UI
// 게임 클리어!
// 설정1 설정2
// 점수
// 타이틀로 돌아가기
export class ClearScene extends Scene {
    private _timerText;
    private _levelText;

    constructor(param: SceneParam) {
        super(param);

        const { navigator } = param;

        const clearText = new Text({
            text: '게임 클리어!',
            style: {
                fontFamily: 'JalnanOTF00',
                fontSize: 200,
            }
        });
        clearText.anchor.set(0.5);
        fitToParent(clearText, this.sceneWidth * 0.6, this.sceneHeight * 0.2);
        clearText.x = this.horizontal_center;
        clearText.y = this.sceneY + this.sceneHeight * 0.2;

        const levelText = new Text({
            text: this.getLevelText(),
            style: {
                fontFamily: 'TTHakgyoansimNamuL',
                fontSize: 100,
            }
        });
        levelText.anchor.set(0.5);
        fitToParent(levelText, this.sceneWidth * 0.9, this.sceneHeight * 0.1);
        levelText.x = this.horizontal_center;
        levelText.y = this.sceneHeight * 0.45;

        this._timerText = new Text({
            text: store.elapsedTime,
            style: {
                fontFamily: 'TTHakgyoansimNamuL',
                fontSize: 150,
            }
        });
        this._timerText.anchor.set(0.5);
        fitToParent(this._timerText, this.sceneWidth * 0.9, this.sceneHeight * 0.15);
        this._timerText.x = this.horizontal_center;
        this._timerText.y = this.sceneHeight * 0.55;

        const backButtonDefaultView = new Text({
            text: '타이틀로 돌아가기',
            style: {
                fontFamily: 'Ownglyph StudyHard Rg',
                fontSize: 100,
            }
        });
        const backButtonHoverView = new Text({
            text: '타이틀로 돌아가기',
            style: {
                fontFamily: 'Ownglyph StudyHard Rg',
                fontSize: 100,
                fill: 'red',
            }
        });
        const backButton = new FancyButton({
            defaultView: backButtonDefaultView,
            hoverView: backButtonHoverView,
            animations: {
                hover: {
                    props: {
                        scale: { x: 1.1, y: 1.1 },
                    },
                    duration: 100,
                },
            }
        });
        backButton.anchor.set(0.5);
        fitToParent(backButton, this.sceneWidth, this.sceneHeight * 0.1);
        backButton.x = this.horizontal_center;
        backButton.y = this.sceneHeight * 0.8;
        backButton.on('pointerdown', () => {
            sound.play(store.loadRandomVoice(store.VOICE.FINISH)[0]);
            navigator.navScene(navigator.SCENE.TITLE);
        });

        this.scene.addChild(clearText, levelText, this._timerText, backButton);

        let t = 0;
        const defaultLevelTextWidth = levelText.width;
        const defaultTimerTextWidth = this._timerText.width;
        const scoreTicker = new Ticker();
        scoreTicker.add(() => {
            t += 0.1;
            levelText.width = (1 + Math.sin(t) * 0.05) * defaultLevelTextWidth;
            this._timerText.width = (1 + Math.sin(t) * 0.05) * defaultTimerTextWidth;
        });
        scoreTicker.start();

        this._levelText = levelText;
    }

    private getLevelText() { return `${store.voiceTypeString} ${store.cardCountString}`; }

    onNavigated = (navigator: Navigator) => {
        this._levelText.text = this.getLevelText();
        this._timerText.text = store.elapsedTime;
        // 소리: 빰빠카빰, 하나비라 다이스키, 결혼해줄래? 등
        const clearVoiceName = store.loadRandomVoice(store.VOICE.CLEAR)[0];
        sound.play(clearVoiceName);
        (navigator.getOverlay(navigator.OVERLAY.HANABIRA) as HanabiraOverlay).start();
    }

    onUnnavigated = () => {}
}