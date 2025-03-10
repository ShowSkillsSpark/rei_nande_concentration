import { Assets, Sprite } from "pixi.js";
import { assets } from "./assets";

const readyTexture = await Assets.load(assets.image.ready);
const selectedTexture = await Assets.load(assets.image.selected);
const correctTexture = await Assets.load(assets.image.correct);
const wrongTexture = await Assets.load(assets.image.wrong);


export enum CardState {
    Ready = 'ready',
    Selected = 'selected',
    Correct = 'correct',
    Wrong = 'wrong',
}

export class Card extends Sprite {
    _state: CardState;
    _voiceId: number;
    _audio: HTMLAudioElement;

    constructor(voiceType: string, voiceId: number, x: number, y: number) {
        super(readyTexture);

        this._state = CardState.Ready;
        this._voiceId = voiceId;
        this._audio = new Audio(assets.sound[voiceType][voiceId]);

        this.x = x;
        this.y = y;
        this.setSize(200, 200);

        this.eventMode = 'static';
        this.cursor = 'pointer';
    }

    set state (state: CardState) {
        this._state = state;
        switch (state) {
            case CardState.Ready:
                this.texture = readyTexture;
                break;
            case CardState.Selected:
                this.texture = selectedTexture;
                break;
            case CardState.Correct:
                this.texture = correctTexture;
                break;
            case CardState.Wrong:
                this.texture = wrongTexture;
                break;
        }
    }

    get state () {
        return this._state;
    }

    get voiceId() {
        return this._voiceId;
    }

    playAudio(callback?: () => void) {
        this._audio.onended = callback || null;
        this._audio.play();
    }
}