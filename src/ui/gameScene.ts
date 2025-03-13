import { Container, Texture, Text, Assets } from "pixi.js";
import { assets } from "../assets";
import { Card, CardState } from "./card";
import { fitToParent } from "../util";
import { store } from "../store";
import { Scene, SceneParam } from "./scene";
import { FancyButton } from "@pixi/ui";
import { Navigator } from "./navigator";
import { sound } from "@pixi/sound";
import { Popup, PopupParam } from "./popup";

interface ExitPopupParam extends PopupParam { navigator: Navigator };
class ExitPopup extends Popup {
    constructor(param: ExitPopupParam) {
        super(param);

        const titleText = new Text({
            text: '당신은... 쟈코입니까?',
            style: {
                fontFamily: 'JalnanOTF00',
                fontSize: 100,
                fill: 'white',
                stroke: { color: 'black', width: 10, join: 'round' }
            }
        });
        fitToParent(titleText, this.boxWidth * 0.8, this.boxHeight * 0.2);
        titleText.x = this.left + (this.boxWidth - titleText.width) / 2;
        titleText.y = this.boxHeight * 0.1;

        const yesButton = new FancyButton({
            animations: {
                hover: {
                    props: {
                        scale: {x: 2, y: 2},
                        x: this.boxWidth * 0.1,
                    },
                    duration: 500,
                }
            }
        });
        yesButton.text = new Text({
            text: '인정합니다',
            style: {
                fontFamily: 'ChosunGs',
                fontSize: 100,
                fill: 'white',
                stroke: { color: 'black', width: 10, join: 'round' }
            },
        });
        fitToParent(yesButton, this.boxWidth * 0.4, this.boxHeight * 0.16);
        yesButton.x = this.boxWidth * 0.3;
        yesButton.y = this.vertical_center;
        yesButton.onclick = () => {
            // 소리: 자코인건 인정. 자코라서 미안해, 와라와라 등
            this.open = false;
            param.navigator.navScene(param.navigator.SCENE.TITLE);
        }
        yesButton.onHover.connect(() => {
            yesButton.zIndex = 1;
            noButton.zIndex = 0;
        });

        const noButton = new FancyButton({
            animations: {
                hover: {
                    props: {
                        scale: {x: 2, y: 2},
                        x: -this.boxWidth * 0.1,
                    },
                    duration: 500,
                }
            }
        });
        noButton.text = new Text({
            text: '겠냐에요;',
            style: {
                fontFamily: 'JalnanOTF00',
                fontSize: 100,
                fill: 'white',
                stroke: { color: 'black', width: 10, join: 'round' }
            }
        });
        fitToParent(noButton, this.boxWidth * 0.3, this.boxHeight * 0.15);
        noButton.x = this.boxWidth * 0.7;
        noButton.y = this.vertical_center;
        noButton.onclick = () => {
            // 소리: 겠냐에요, 화이팅, 응원해줘 등
            this.open = false;
        }
        noButton.onHover.connect(() => {
            yesButton.zIndex = 0;
            noButton.zIndex = 1;
        });

        this.addChild(titleText);
        this.addChild(yesButton);
        this.addChild(noButton);
    }
}

// UI
// score navTitle
interface TopBarParam { x: number, y: number, width: number, height: number, onExitClicked: () => void};
class TopBar extends Container {
    constructor({x, y, width, height, onExitClicked}: TopBarParam) {
        super();

        // score
        const navTitleButton = new FancyButton();
        navTitleButton.text = new Text({
            text: '타이틀로',
            style: {
                fontFamily: 'JalnanOTF00',
                fontSize: 100,
                fill: 'white',
                stroke: { color: 'black', width: 10, join: 'round' }
            }});
        fitToParent(navTitleButton, width, height * 0.8);
        navTitleButton.x = x + width - navTitleButton.width;
        navTitleButton.y = y + height / 2;
        navTitleButton.onclick = () => onExitClicked(); // 정말로 포기하시겠습니까? 팝업 띄우기 navigator.navScene(navigator.SCENE.TITLE)

        this.addChild(navTitleButton);
    }
}

// UI
// 카드 배치
// 0 1 2 3
// 4 5 6 7
// 8 9 a b
interface GameSpaceParam {
    x: number, y: number, width: number, height: number,
    correctSoundNameList: string[],
    wrongSoundNameList: string[],
}
class GameSpace extends Container {
    constructor({x, y, width, height, correctSoundNameList, wrongSoundNameList}: GameSpaceParam) {
        super();

        this.x = x;
        this.y = y;

        // voiceId 선택
        const voiceIdList = store.newVoiceIdList;
        console.log(voiceIdList);

        let correctCount = 0;

        const cardMaxWidth = width / store.cardCount;
        const cardMaxHeight = height / store.cardCount;
        // 카드 생성
        let selectedCard: Card | null = null;
        for (let i = 0; i < store.cardCount; i++) {
            for (let j = 0; j < store.cardCount; j++) {
                Assets.load(assets.image.ready).then((readyTexture: Texture) => {
                    const card = new Card({
                        x: i * cardMaxWidth, y: j * cardMaxHeight, width: cardMaxWidth, height: cardMaxHeight,
                        readyTexture, voiceName: `${store.voiceType}-${voiceIdList[j * store.cardCount + i]}`
                    });
                    card.on("pointerdown", () => {
                        if (card.state === CardState.Ready) {
                            if (selectedCard === null) { // 선택된 카드가 없다면
                                console.log('select 1st', card.voiceName);
                                selectedCard = card;
                                card.setState(CardState.Selected);
                            } else if (selectedCard !== card) { // 다른 카드가 선택되면
                                console.log('select 2nd', card.voiceName);
                                const firstCard = selectedCard;
                                selectedCard = null;
                                if (firstCard.voiceName === card.voiceName) { // 정답이면
                                    console.log('correct');
                                    card.setState(CardState.Selected, () => {
                                        firstCard.setState(CardState.Correct);
                                        card.setState(CardState.Correct);
                                        correctCount += 2;
                                        if (correctCount == store.cardCount ** 2) this.gameClear();
                                        else sound.play(correctSoundNameList[Math.floor(Math.random() * correctSoundNameList.length)]);
                                    });
                                } else { // 오답이면
                                    console.log('wrong');
                                    card.setState(CardState.Selected, () => {
                                        firstCard.setState(CardState.Wrong);
                                        card.setState(CardState.Wrong);
                                        sound.play(wrongSoundNameList[Math.floor(Math.random() * wrongSoundNameList.length)], () => {
                                            firstCard.setState(CardState.Ready);
                                            card.setState(CardState.Ready);
                                        });
                                    });
                                }
                            }
                        }
                    });
                    this.addChild(card);
                });
            }
        }
    }

    gameClear () {
        console.log('game clear');
        // 클리어 사운드
        // 애니매이션
    }
}

// UI
// 10% topBar
// 90% game space for cards
interface GameSceneParam extends SceneParam {
    correctSoundNameList: string[],
    wrongSoundNameList: string[],
    giveupSoundNameList: string[],
};
export class GameScene extends Scene {
    private _topBar: TopBar;
    private _gameSpace: GameSpace | null = null;
    private _exitPopup: ExitPopup;

    private _correctSoundNameList;
    private _wrongSoundNameList;

    constructor({ correctSoundNameList, wrongSoundNameList, giveupSoundNameList, navigator, sceneName }: GameSceneParam) {
        super({ navigator, sceneName });

        this._correctSoundNameList = correctSoundNameList;
        this._wrongSoundNameList = wrongSoundNameList;

        this._topBar = new TopBar({
            x: this.sceneX, y: this.sceneY,
            width: this.sceneWidth, height: this.sceneHeight * 0.1,
            onExitClicked: () => {
                sound.play(giveupSoundNameList[Math.floor(Math.random() * giveupSoundNameList.length)]);
                this._exitPopup.open = true;
            }
        });
        const popupWidth = this.sceneWidth * 0.8;
        const popupHeight = this.sceneHeight * 0.8;
        this._exitPopup = new ExitPopup({
            x: this.horizontal_center - popupWidth / 2,
            y: this.vertical_center - popupHeight / 2,
            width: popupWidth,
            height: popupHeight,
            style: 0xFFFFFF,
            scene: this,
            navigator,
        });

        this.scene.addChild(this._topBar);
        this.addChild(this._exitPopup);
    }

    onNavigated() {
        if (this._gameSpace) this.scene.removeChild(this._gameSpace);

        const size = Math.min(this.sceneWidth, this.sceneHeight * 0.9);
        this._gameSpace = new GameSpace({
            x: this.horizontal_center - size / 2, y: this.sceneHeight * 0.1,
            width: size, height: size,
            correctSoundNameList: this._correctSoundNameList,
            wrongSoundNameList: this._wrongSoundNameList,
        });

        this.scene.addChild(this._gameSpace);
    }
}