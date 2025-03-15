import { Container, Graphics, Text, TextStyle, Ticker } from "pixi.js";
import { FancyButton, ScrollBox } from "@pixi/ui";
import { fitToParent } from "../util";
import { Scene, SceneParam } from "./scene";
import { store } from "../store";
import { sound } from "@pixi/sound";
import { Popup, PopupParam } from "./popup";

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
            else sound.play(store.loadRandomVoice(store.VOICE.REDUCE)[0]);
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

class CreditPopup extends Popup {
    private _lastMusicName?: string;
    private _musicList = [
        '/rei_nande_concentration/assets/music/Pixel Peeker Polka - faster.webm',
        '/rei_nande_concentration/assets/music/Batty McFaddin.webm',
        '/rei_nande_concentration/assets/music/Local Forecast - Elevator.webm',
        '/rei_nande_concentration/assets/music/Merry Go.webm',
    ]

    private _scrollBox;
    private _scrollTicker;

    constructor(param: PopupParam) {
        super(param);

        const scrollWidth = this.boxWidth - this.boxRadious;
        const scrollHeight = (this.boxHeight - this.boxRadious) * 0.75;

        const creditShowSkillsSpark = new Container();
        const sssTitle = new Text({text: '기획 / 개발', style: { fontSize: 50}});
        sssTitle.anchor.set(0.5);
        sssTitle.x = scrollWidth * 0.5;
        sssTitle.y = scrollHeight * 0.3;
        const sssName = new Text({text: '실력발휘', style: { fontSize: 100}});
        sssName.anchor.set(0.5);
        sssName.x = scrollWidth * 0.5;
        sssName.y = scrollHeight * 0.5;
        creditShowSkillsSpark.addChild(new Graphics().rect(0, 0, scrollWidth, scrollHeight).fill(0xFFFFFF), sssTitle, sssName);
        
        const creditRei = new Container();
        const reiTitle = new Text({text: '출연', style: { fontSize: 50}});
        reiTitle.anchor.set(0.5);
        reiTitle.x = scrollWidth * 0.5;
        reiTitle.y = scrollHeight * 0.3;
        const reiName = new Text({text: '하야사카 레이', style: { fontSize: 100}});
        reiName.anchor.set(0.5);
        reiName.x = scrollWidth * 0.5;
        reiName.y = scrollHeight * 0.5;
        creditRei.addChild(new Graphics().rect(0, 0, scrollWidth, scrollHeight).fill(0xFFFFFF), reiTitle, reiName);
        
        const creditCopyright = new Container();
        const copyright = new Text({
            text: '게임 제작에 사용된\n캐릭터 및 목소리의 모든 권한은\n(주)브이아이에 있습니다.',
            style: new TextStyle({ fontSize: 50, align: 'center' }),
        });
        copyright.anchor.set(0.5);
        copyright.x = scrollWidth * 0.5;
        copyright.y = scrollHeight * 0.5;
        creditCopyright.addChild(new Graphics().rect(0, 0, scrollWidth, scrollHeight).fill(0xFFFFFF), copyright);
        
        const creditAsset = new Container();
        const assetTitle = new Text({
            text: '출처 표기',
            style: new TextStyle({ fontSize: 50, align: 'center' }),
        });
        assetTitle.anchor.set(0.5);
        assetTitle.x = scrollWidth * 0.5;
        assetTitle.y = scrollHeight * 0.3;
        const musicText = new Text({
            text: `"Batty McFaddin", "Local Forecast - Elevator", "Merry Go", "Pixel Peeker Polka - faster"
Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 3.0
http://creativecommons.org/licenses/by/3.0/`,
            style: new TextStyle({fontSize: 30, align: 'center'}),
        });
        musicText.anchor.set(0.5);
        musicText.x = scrollWidth * 0.5;
        musicText.y = scrollHeight * 0.5;

        const fontText = new Text({
            text: `(주)여기어때컴퍼니가 제공한 여기어때 잘난체,
(주)조선일보사에서 제공한 조선궁서체,
(주)보이저엑스에서 제공한 온글잎 공부잘하자나,
구미시에서 제공한 낭만있구미체가 적용되어 있습니다.`,
            style: new TextStyle({fontSize: 30, align: 'center'}),
        });
        fontText.anchor.set(0.5);
        fontText.x = scrollWidth * 0.5;
        fontText.y = scrollHeight * 0.8;

        const andText = new Text({
            text: '끝으로\n.\n.\n.',
            style: new TextStyle({fontSize: 50, align: 'center'}),
        });
        andText.anchor.set(0.5);
        andText.x = scrollWidth * 0.5;
        andText.y = scrollHeight * 1.5;
        creditAsset.addChild(new Graphics().rect(0, 0, scrollWidth, scrollHeight * 2).fill(0xFFFFFF), assetTitle, musicText, fontText, andText);
        
        const creditThx = new Container();
        const thxTitle = new Text({text: 'Special Thanks', style: { fontFamily: 'Brush Script MT', fontSize: 50}});
        thxTitle.anchor.set(0.5);
        thxTitle.x = scrollWidth * 0.5;
        thxTitle.y = scrollHeight * 0.4;
        const thxText = new Text({
            text: '게임 제작을 흔쾌히 허락해주신\n피디님께 감사드립니다.',
            style: new TextStyle({ fontFamily: 'ChosunGs', fontSize: 80, align: 'center' }),
        });
        thxText.anchor.set(0.5);
        thxText.x = scrollWidth * 0.5;
        thxText.y = scrollHeight * 0.7;
        creditThx.addChild(new Graphics().rect(0, 0, scrollWidth, scrollHeight).fill(0xFFFFFF), thxTitle, thxText);

        const scrollBox = new ScrollBox({
            width: scrollWidth,
            height: scrollHeight,
            radius: this.boxRadious / 2,
            items: [
                new Graphics().rect(0, 0, scrollWidth, scrollHeight * 0.9).fill(0xFFFFFF),
                creditShowSkillsSpark, // 기획/개발 실력발휘
                creditRei, // 출연 하야사카 레이
                creditCopyright, // 사진 및 음성의 모든 권한은 (주)브아이이에 있습니다
                creditAsset, // 에셋 출처 폰트 및 브금
                creditThx, // 스페셜 땡스 게임 제작을 흔쾌히 허락해주신 피디님께 감사드립니다.
                // new Graphics().rect(0, 0, scrollWidth, 10).fill(0xFFFFFF),
            ],
        });
        this._scrollBox = scrollBox;
        scrollBox.x = this.boxRadious / 2;
        scrollBox.y = this.boxRadious / 2;

        this._scrollTicker = new Ticker();
        this._scrollTicker.autoStart = false;
        this._scrollTicker.add(() => {
            if (scrollBox.scrollHeight + scrollBox.scrollY > scrollBox.height + 5) {
                scrollBox.scrollY -= 2;
                scrollBox.resize();
            }
        });

        // 닫기 버튼
        const closeButton = new FancyButton({
            defaultView: new Text({text: '닫기', style: { fontFamily: 'JalnanOTF00', fontSize: 50 }}),
            hoverView: new Text({text: '플레이해 주셔서 감사합니다 ^^', style: { fontFamily: 'JalnanOTF00', fontSize: 50 }}),
        });
        closeButton.anchor.set(0.5);
        closeButton.x = this.boxWidth / 2;
        closeButton.y = this.boxHeight * 0.85;
        closeButton.on('pointerdown', () => this.open = false);

        this.addChild(scrollBox, closeButton);
    }
    playRandomMusic() {
        const makeMusicName = (id: number) => `credit-music-${id}`;
        const musicCount = this._musicList.length
        let musicId = Math.floor(Math.random() * musicCount);
        let musicName = makeMusicName(musicId);
        if (this._lastMusicName == musicName) {
            musicId = (musicId + 1) % musicCount;
            musicName = makeMusicName(musicId);
        }
        console.log(`credit music ${musicName}`);
        if (!sound.exists(musicName)) {
            const music = sound.add(musicName, this._musicList[musicId]);
            music.volume = 0.1;
        }
        sound.play(musicName, () => this.playRandomMusic());
        this._lastMusicName = musicName;
    }
    onOpen = () => {
        this.playRandomMusic();
        this._scrollBox.scrollTop();
        this._scrollTicker.start();
    }
    onClose = () => {
        if (this._lastMusicName) sound.stop(this._lastMusicName);
        this._scrollBox.scrollTop();
        this._scrollTicker.stop();
    }
}

// UI
// title
// startButton
// voiceTypeButton
// sizeButton
// creditButton
export class TitleScene extends Scene {
    constructor(param: SceneParam) {
        super(param);

        const { navigator } = param;

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
        });
        const creditButton = new CreditButton({
            x: (this.scene.width - buttonWidht) / 2,
            y: this.scene.height * 0.35 + (buttonHeight + buttonGap) * 3,
            width: buttonWidht, height: buttonHeight,
            popup: creditPopup,
        });

        this.scene.addChild(title);
        this.scene.addChild(startButton);
        this.scene.addChild(voiceTypeButton);
        this.scene.addChild(sizeButton);
        this.scene.addChild(creditButton);
        this.addChild(creditPopup);
    }

    onNavigated = (): void => {}
}