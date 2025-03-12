import { Container, Sprite, Texture } from "pixi.js";
import { assets } from "../assets";
import { Card, CardState } from "./card";
import { shuffle } from "../util";
import { setting } from "../store";
import { Scene } from "./scene";

class Navigator extends Container {
    constructor(width: number, height: number) {
        super();

        this.addChild(new Sprite({x: 0, y: 0, width, height, texture: Texture.WHITE}));
        // score view
        // give up button
    }
}

class GameSpace extends Container {
    _selectedCard: Card | null = null;

    constructor(
        x: number, y: number, width: number, height: number,
        cardTextures: { ready: Texture, selected: Texture, correct: Texture, wrong: Texture },
        correctAudioList: HTMLAudioElement[], wrongAudioList: HTMLAudioElement[],
        onFinish: () => void,
    ) {
        super();

        // TODO: UI와 로직 분리 필요
        this.x = x;
        this.y = y;
        
        // voiceId 선택
        let voiceIdList = Object.keys(assets.sound[setting.voiceType]).map(Number);
        voiceIdList = shuffle(voiceIdList).slice(0, setting.cardCount * setting.cardCount / 2);
        voiceIdList = voiceIdList.concat(voiceIdList);
        voiceIdList = shuffle(voiceIdList);

        console.log(voiceIdList);

        // voiceIdList를 n x n으로 배치
        const voiceIdGrid: number[][] = [];
        for (let i = 0; i < setting.cardCount; i++) {
            voiceIdGrid[i] = voiceIdList.slice(i * setting.cardCount, i * setting.cardCount + setting.cardCount);
        }

        console.log(voiceIdGrid);

        let correctCount = 0;

        const cardMaxWidth = width / setting.cardCount;
        const cardMaxHeight = height / setting.cardCount;
        // 카드 생성
        for (let i = 0; i < setting.cardCount; i++) {
            for (let j = 0; j < setting.cardCount; j++) {
            const card = new Card(setting.voiceType, voiceIdGrid[i][j], i * cardMaxWidth, j * cardMaxHeight, cardTextures, cardMaxWidth, cardMaxHeight);
            card.on("pointerdown", () => {
                if (card.state === CardState.Ready) {
                if (this._selectedCard == null) {
                    console.log('select 1st', card.voiceId);
                    this._selectedCard = card;
                    card.state = CardState.Selected;
                    card.playAudio();
                } else if (this._selectedCard !== card) {
                    console.log('select 2nd', card.voiceId);
                    const firstCard = this._selectedCard;
                    this._selectedCard = null;
                    if (firstCard.voiceId === card.voiceId) { // 정답이면
                        console.log('correct');
                        card.state = CardState.Selected;
                        card.playAudio(() => {
                            firstCard.state = CardState.Correct;
                            card.state = CardState.Correct;
                            correctCount += 2;
                            if (correctCount == setting.cardCount ** 2) this.gameClear();
                            else correctAudioList[Math.floor(Math.random() * correctAudioList.length)].play();
                        });
                    } else { // 오답이면
                        console.log('wrong');
                        card.state = CardState.Selected;
                        card.playAudio(() => {
                            firstCard.state = CardState.Wrong;
                            card.state = CardState.Wrong;
                            const audio = wrongAudioList[Math.floor(Math.random() * wrongAudioList.length)];
                            audio.onended = () => {
                            firstCard.state = CardState.Ready;
                            card.state = CardState.Ready;
                            }
                            audio.play();
                        });
                    }
                }
                }
            });
            this.addChild(card);
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
// 10% navigator for score and give up
// 90% game space for cards
export class GameScene extends Scene {
    constructor(
        cardTextures: { ready: Texture, selected: Texture, correct: Texture, wrong: Texture },
        correctAudioList: HTMLAudioElement[], wrongAudioList: HTMLAudioElement[],
        onFinish: () => void,
    ) {
        super();

        const navigator = new Navigator(this.width, this.height * 0.1);
        const gameSpace = new GameSpace(0, this.height * 0.1, this.width, this.height * 0.9, cardTextures, correctAudioList, wrongAudioList, onFinish);
        this.addChild(navigator);
        this.addChild(gameSpace);
    }
}