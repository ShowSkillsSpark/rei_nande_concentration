import { Sprite, Texture } from "pixi.js";
import { assets } from "./assets";


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
    _textures: { ready: Texture, selected: Texture, correct: Texture, wrong: Texture };

    constructor(
        voiceType: string, voiceId: number,
        x: number, y: number,
        textures: { ready: Texture, selected: Texture, correct: Texture, wrong: Texture }) {
        super(textures.ready);

        this._state = CardState.Ready;
        this._voiceId = voiceId;
        this._audio = new Audio(assets.sound[voiceType][voiceId]);
        this._textures = textures;

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
                this.texture = this._textures.ready;
                break;
            case CardState.Selected:
                this.texture = this._textures.selected;
                break;
            case CardState.Correct:
                this.texture = this._textures.correct;
                break;
            case CardState.Wrong:
                this.texture = this._textures.wrong;
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