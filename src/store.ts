import { sound } from "@pixi/sound";
import { shuffle } from "./util";
import { Assets, Ticker } from "pixi.js";

export const store = new class {
    // voice type
    private _availableVoiceTypeList: string[] = ['nande'];
    private _voiceTypeIndex = 0;

    get voiceType() { return this._availableVoiceTypeList[this._voiceTypeIndex]; }
    get nextVoiceType() {
        this._voiceTypeIndex = (this._voiceTypeIndex + 1) % this._availableVoiceTypeList.length;
        return this.voiceType;
    }
    get voiceTypeString() {
        switch(this.voiceType) {
            case 'nande': return '난데';
            default: return 'ERROR';
        }
    }

    // card count
    private _availableCardCountList: number[] = [2, 4];
    private _cardCountIndex = 0;

    get cardCount() { return this._availableCardCountList[this._cardCountIndex]; }
    get cardCountString() {
        return `${this.cardCount} x ${this.cardCount}`;
    }
    nextCardCount() { this._cardCountIndex = (this._cardCountIndex + 1) % this._availableCardCountList.length; }

    // timer
    private _startDate: Date | null = null;
    private _endDate = new Date();
    private _stopTimer = false;
    private _ticker?: Ticker;

    onTimerUpdate?: () => void;
    resetTimer() {
        this._startDate = null;
        this._endDate = new Date();
        this._stopTimer = false;
        if (!this._ticker) {
            this._ticker = new Ticker();
            this._ticker.add(() => {
                this._endDate = new Date();
                this.onTimerUpdate?.();
            });
        }
        this.onTimerUpdate?.();
    }
    startTimer() {
        this._startDate = this._endDate = new Date();
        this._ticker?.start();
    }
    stopTimer() {
        this._stopTimer = true;
        this._ticker?.stop();
    }
    get elapsedTime() {
        const postfix = ' 초';
        if (this._startDate == null) return (0).toFixed(1) + postfix;
        if (!this._stopTimer) this._endDate = new Date();
        return ((this._endDate.getTime() - this._startDate.getTime()) / 1000).toFixed(1) + postfix;
    }

    // voice
    VOICE = {
        START: 'start',
        NANDE: 'nande',
        CORRECT: 'correct',
        WRONG: 'wrong',
        GIVEUP: 'giveup',
        LOSE: 'lose',
        CLEAR: 'clear',
    }
    private _voiceMap: {[key: string]: string[]} = {
        'start': [
            "/rei_nande_concentration/assets/sound/hello/hello_20250310_1025-1035.wav",
            "/rei_nande_concentration/assets/sound/hello/hello_20250310_1115-1125.wav",
            "/rei_nande_concentration/assets/sound/hello/hello_20250310_1130-1140.wav",
            "/rei_nande_concentration/assets/sound/hello/konrei_20250310_1115-1125.wav",
            "/rei_nande_concentration/assets/sound/hello/konrei_20250310_1130-1140.wav",
        ],
        'nande': [
            "/rei_nande_concentration/assets/sound/nande/nande_20250309_1000-1002.wav",
            "/rei_nande_concentration/assets/sound/nande/nande_20250309_1003-1005.wav",
            "/rei_nande_concentration/assets/sound/nande/nande_20250309_1045-1050.wav",
            "/rei_nande_concentration/assets/sound/nande/nande_20250309_1050-1100.wav",
            "/rei_nande_concentration/assets/sound/nande/nande_20250310_2230-2240_1.wav",
            "/rei_nande_concentration/assets/sound/nande/nande_20250310_2230-2240_2.wav",
            "/rei_nande_concentration/assets/sound/nande/nande_20250310_3050-3100.wav",
            "/rei_nande_concentration/assets/sound/nande/nande_20250310_3920-3930.wav",
            "/rei_nande_concentration/assets/sound/nande/nande_20250310_3950-4000.wav",
            "/rei_nande_concentration/assets/sound/nande/nande_20250310_4020-4030.wav",
            "/rei_nande_concentration/assets/sound/nande/nande_20250310_4045-4055.wav",
            "/rei_nande_concentration/assets/sound/nande/nande_20250310_15530-15540.wav",
            "/rei_nande_concentration/assets/sound/nande/nande_20250310_15720-15730.wav",
            "/rei_nande_concentration/assets/sound/nande/nande_20250310_24335-24345.wav",
            "/rei_nande_concentration/assets/sound/nande/nande_20250310_24530-24540.wav",
            "/rei_nande_concentration/assets/sound/nande/nande_20250310_24625-24635.wav",
            "/rei_nande_concentration/assets/sound/nande/nande_20250310_30335-30345.wav",
            "/rei_nande_concentration/assets/sound/nande/nande_20250310_30525-30535.wav",
            "/rei_nande_concentration/assets/sound/nande/nande_20250310_35110-35120.wav",
        ],
        'correct': [
            "/rei_nande_concentration/assets/sound/thx/thx_20250310_1115-1125_1.wav",
            "/rei_nande_concentration/assets/sound/thx/thx_20250310_1115-1125_2.wav",
            "/rei_nande_concentration/assets/sound/thx/thx_20250310_14830-14840.wav",
            "/rei_nande_concentration/assets/sound/thx/thx_20250310_34110-34120.wav",
            "/rei_nande_concentration/assets/sound/thx/thx_20250310_34955-35005.wav",
            "/rei_nande_concentration/assets/sound/yoshi/yoshi_20250310_1025-1035.wav",
        ],
        'wrong': [
            "/rei_nande_concentration/assets/sound/haa/haa_20250310_24540-24550.wav",
            "/rei_nande_concentration/assets/sound/haa/haa_20250310_24600-24610.wav",
            "/rei_nande_concentration/assets/sound/hen/hen_20250310_1015-1025.wav",
            "/rei_nande_concentration/assets/sound/hen/hen_20250310_1025-1035.wav",
            "/rei_nande_concentration/assets/sound/hidoi/hidoi_20250310_24610-24620.wav",
            // "/rei_nande_concentration/assets/sound/sorry/sorry_20250310_15530-15540.wav", // TODO: 에러 발생함.
            // "/rei_nande_concentration/assets/sound/sorry/sorry_20250310_22735-22745.wav", // TODO: 에러 발생함.
        ],
        'giveup': [
            "/rei_nande_concentration/assets/sound/hee/hee_20250310_1130-1140.wav",
        ],
        'lose': [
            "/rei_nande_concentration/assets/sound/zako/zako_20250310_3915-3925.wav",
            "/rei_nande_concentration/assets/sound/zako/zako_20250310_3955-4015.wav",
            "/rei_nande_concentration/assets/sound/zako/zako_20250310_24600-24610_1.wav",
            "/rei_nande_concentration/assets/sound/zako/zako_20250310_24600-24610_2.wav",
        ],
        'clear': [
            "/rei_nande_concentration/assets/sound/bam/bam_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/sound/bam/bam_20250311_4600-5250_2.wav",
            "/rei_nande_concentration/assets/sound/bam/bam_20250311_4600-5250_3.wav",
        ],
    }
    private _toVoiceName(key: string, id: number) { return `${key}-${id}`; }
    loadVoice(key: string, id: number) {
        const voiceName = this._toVoiceName(key, id);
        if (!sound.exists(voiceName)) sound.add(voiceName, this._voiceMap[key][id]);
        return voiceName;
    }
    loadRandomVoice(key: string, count: number = 1) {
        let voiceIdList = [...Array(this._voiceMap[key].length).keys()];
        voiceIdList = shuffle(voiceIdList);
        voiceIdList = voiceIdList.slice(0, count);

        const voiceNameList = voiceIdList.map((id: number) => {
            return this.loadVoice(key, id);
        });

        return voiceNameList;
    }
    newVoiceNameList() {
        let voiceNameList = this.loadRandomVoice(this.voiceType, this.cardCount * this.cardCount / 2);
        voiceNameList = voiceNameList.concat(voiceNameList);
        voiceNameList = shuffle(voiceNameList);
        return voiceNameList;
    }

    // image
    IMAGE = {
        READY: 'ready',
        SELECTED: 'selected',
        CORRECT: 'correct',
        WRONG: 'wrong',
        FINISH: 'finish',
    }
    private _imageMap: {[key: string]: string} = {
        'ready': '/rei_nande_concentration/assets/icon/ready.png',
        'selected': '/rei_nande_concentration/assets/icon/selected.png',
        'correct': '/rei_nande_concentration/assets/icon/correct.png',
        'wrong': '/rei_nande_concentration/assets/icon/wrong.png',
        'finish': '/rei_nande_concentration/assets/icon/finish.png',
    };
    loadImage(key: string) {
        return Assets.load(this._imageMap[key]);
    }
}();