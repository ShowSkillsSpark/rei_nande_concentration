import { Container, Renderer, Texture } from "pixi.js";
import { assets } from "./assets";
import { Card, CardState } from "./card";
import { fitToParent, shuffle } from "./util";

export class Game extends Container {
    _voiceType: string;
    _size: number;

    _selectedCard: Card | null = null;

    constructor(
        voiceType: string, size: number,
        cardTextures: { ready: Texture, selected: Texture, correct: Texture, wrong: Texture },
        correctAudioList: HTMLAudioElement[], wrongAudioList: HTMLAudioElement[]
    ) {
        super();

        this._voiceType = voiceType;
        this._size = size;
        
        // voiceId 선택
        let voiceIdList = Object.keys(assets.sound[voiceType]).map(Number);
        voiceIdList = shuffle(voiceIdList).slice(0, size * size / 2);
        voiceIdList = voiceIdList.concat(voiceIdList);
        voiceIdList = shuffle(voiceIdList);

        console.log(voiceIdList);

        // voiceIdList를 size x size로 배치
        const voiceIdGrid: number[][] = [];
        for (let i = 0; i < size; i++) {
            voiceIdGrid[i] = voiceIdList.slice(i * size, i * size + size);
        }

        console.log(voiceIdGrid);

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
            const card = new Card(voiceType, voiceIdGrid[i][j], i * 220, j * 220, cardTextures);
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
                        firstCard!.state = CardState.Correct;
                        card.state = CardState.Correct;
                        correctAudioList[Math.floor(Math.random() * correctAudioList.length)].play();
                    });
                    } else { // 오답이면
                    console.log('wrong');
                    card.state = CardState.Selected;
                    card.playAudio(() => {
                        firstCard!.state = CardState.Wrong;
                        card.state = CardState.Wrong;
                        const audio = wrongAudioList[Math.floor(Math.random() * wrongAudioList.length)];
                        audio.onended = () => {
                        firstCard!.state = CardState.Ready;
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

    _onRender = (renderer: Renderer) => {
        const canvasWidth = renderer.canvas.width;
        const canvasHeight = renderer.canvas.height;
        const gameSize = Math.min(canvasWidth, canvasHeight) * 0.9;
        fitToParent(this, gameSize, gameSize);
        this.x = (canvasWidth - this.width) / 2;
        this.y = (canvasHeight - this.height) / 2;
    }
}