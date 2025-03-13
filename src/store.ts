import { sound } from "@pixi/sound";
import { assets } from "./assets";
import { shuffle } from "./util";

export const store = new class {
    // voice type
    private _availableVoiceTypeList: string[] = ['nande'];
    private _voiceTypeIndex = 0;

    get voiceType() { return this._availableVoiceTypeList[this._voiceTypeIndex]; }
    get voiceTypeString() {
        switch(this.voiceType) {
            case 'nande': return '난데';
            default: return 'ERROR';
        }
    }
    nextVoiceType() {
        this._voiceTypeIndex = (this._voiceTypeIndex + 1) % this._availableVoiceTypeList.length;
    }

    // card count
    private _availableCardCountList: number[] = [2, 4];
    private _cardCountIndex = 0;

    get cardCount() { return this._availableCardCountList[this._cardCountIndex]; }
    get cardCountString() {
        return `${this.cardCount} x ${this.cardCount}`;
    }
    nextCardCount() { this._cardCountIndex = (this._cardCountIndex + 1) % this._availableCardCountList.length; }

    // game logic
    private _voiceIdList: number[] = [];

    get voiceIdList() { return this._voiceIdList; }
    get newVoiceIdList() {
        // 사용할 음성 선택
        let voiceIdList = Object.keys(assets.sound[store.voiceType]).map(Number);
        for (const voiceId of voiceIdList) {
            if (sound.exists(`${store.voiceType}-${voiceId}`)) continue;
            sound.add(`${store.voiceType}-${voiceId}`, assets.sound[store.voiceType][voiceId]);
        }

        // 카드 배치
        voiceIdList = shuffle(voiceIdList).slice(0, store.cardCount * store.cardCount / 2);
        voiceIdList = voiceIdList.concat(voiceIdList);
        voiceIdList = shuffle(voiceIdList);

        // 초기화
        this._voiceIdList = voiceIdList;
        return this._voiceIdList;
    }
}();