import { Container, Texture, Text, Assets } from "pixi.js";
import { assets } from "../assets";
import { Card, CardState } from "./card";
import { fitToParent, shuffle } from "../util";
import { store } from "../store";
import { Scene, SceneParam } from "./scene";
import { FancyButton } from "@pixi/ui";
import { Navigator } from "./navigator";

// UI
// score navTitle
interface TopBarParam { x: number, y: number, width: number, height: number, navigator: Navigator};
class TopBar extends Container {
    constructor({x, y, width, height, navigator}: TopBarParam) {
        super();

        // score
        const navTitleButton = new FancyButton();
        navTitleButton.text = new Text({
            text: '타이틀로',
            style: {
                fontFamily: 'yg-jalnan',
                fontSize: 100,
                fill: 'white',
                stroke: { color: 'black', width: 10, join: 'round' }
            }});
        fitToParent(navTitleButton, width, height * 0.8);
        navTitleButton.x = x + width - navTitleButton.width;
        navTitleButton.y = y + height / 2;
        navTitleButton.onclick = () => navigator.navScene(navigator.SCENE.TITLE);

        this.addChild(navTitleButton);
    }
}

// UI
// 카드 배치
// 0 1 2 3
// 4 5 6 7
// 8 9 a b
class GameSpace extends Container {
    _selectedCard: Card | null = null;

    constructor(
        x: number, y: number, width: number, height: number,
        correctAudioList: HTMLAudioElement[], wrongAudioList: HTMLAudioElement[],
    ) {
        super();

        // TODO: UI와 로직 분리 필요
        this.x = x;
        this.y = y;

        // voiceId 선택
        let voiceIdList = Object.keys(assets.sound[store.voiceType]).map(Number);
        voiceIdList = shuffle(voiceIdList).slice(0, store.cardCount * store.cardCount / 2);
        voiceIdList = voiceIdList.concat(voiceIdList);
        voiceIdList = shuffle(voiceIdList);

        console.log(voiceIdList);

        // voiceIdList를 n x n으로 배치
        const voiceIdGrid: number[][] = [];
        for (let i = 0; i < store.cardCount; i++) {
            voiceIdGrid[i] = voiceIdList.slice(i * store.cardCount, i * store.cardCount + store.cardCount);
        }

        console.log(voiceIdGrid);

        let correctCount = 0;

        const cardMaxWidth = width / store.cardCount;
        const cardMaxHeight = height / store.cardCount;
        // 카드 생성
        let cardIndex = 0;
        for (let i = 0; i < store.cardCount; i++) {
            for (let j = 0; j < store.cardCount; j++) {
                Assets.load(assets.image.ready).then((readyTexture: Texture) => {
                    console.log('loaded');
                    const card = new Card({
                        x: i * cardMaxWidth, y: j * cardMaxHeight, width: cardMaxWidth, height: cardMaxHeight,
                        cardIndex, readyTexture
                    }, voiceIdGrid[i][j]);
                    cardIndex++;
                    card.on("pointerdown", () => {
                        if (card.state === CardState.Ready) {
                            if (this._selectedCard == null) {
                                console.log('select 1st', card.voiceId);
                                this._selectedCard = card;
                                card.setState(CardState.Selected);
                                card.playAudio();
                            } else if (this._selectedCard !== card) {
                                console.log('select 2nd', card.voiceId);
                                const firstCard = this._selectedCard;
                                this._selectedCard = null;
                                if (firstCard.voiceId === card.voiceId) { // 정답이면
                                    console.log('correct');
                                    card.setState(CardState.Selected);
                                    card.playAudio(() => {
                                        firstCard.setState(CardState.Correct);
                                        card.setState(CardState.Correct);
                                        correctCount += 2;
                                        if (correctCount == store.cardCount ** 2) this.gameClear();
                                        else correctAudioList[Math.floor(Math.random() * correctAudioList.length)].play();
                                    });
                                } else { // 오답이면
                                    console.log('wrong');
                                    card.setState(CardState.Selected);
                                    card.playAudio(() => {
                                        firstCard.setState(CardState.Wrong);
                                        card.setState(CardState.Wrong);
                                        const audio = wrongAudioList[Math.floor(Math.random() * wrongAudioList.length)];
                                        audio.onended = () => {
                                            firstCard.setState(CardState.Ready);
                                            card.setState(CardState.Ready);
                                        }
                                        audio.play();
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

    newGame() {}
    clearGame() {}
    
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
    correctAudioList: HTMLAudioElement[],
    wrongAudioList: HTMLAudioElement[],
};
export class GameScene extends Scene {
    constructor({correctAudioList, wrongAudioList, navigator, sceneName }: GameSceneParam) {
        super({navigator, sceneName});

        const topBar = new TopBar({ x: this.x, y: this.y, width: this.width, height: this.height * 0.1, navigator });
        const gameSpace = new GameSpace(0, this.height * 0.1, this.width, this.height * 0.9, correctAudioList, wrongAudioList);
        this.addChild(topBar);
        this.addChild(gameSpace);
    }
}