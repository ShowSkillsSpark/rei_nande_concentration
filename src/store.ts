import { sound } from "@pixi/sound";
import { shuffle } from "./util";
import { Assets, Ticker } from "pixi.js";

export const store = new class {
    // voice type
    private _availableVoiceTypeList: string[] = ['nande', 'kora', 'laugh', 'chaos'];
    private _voiceTypeIndex = 0;

    get voiceType() { return this._availableVoiceTypeList[this._voiceTypeIndex]; }
    get nextVoiceType() {
        this._voiceTypeIndex = (this._voiceTypeIndex + 1) % this._availableVoiceTypeList.length;
        return this.voiceType;
    }
    get voiceTypeString() {
        switch(this.voiceType) {
            case this.VOICE.NANDE: return '난데';
            case this.VOICE.KORA: return '코라';
            case this.VOICE.LAUGH: return 'ㅋㅋㅋ';
            case this.VOICE.CHAOS: return '카오스';
            default: return 'ERROR';
        }
    }

    // card count
    private _availableCardCountList: number[] = [2, 4, 6];
    private _cardCountIndex = 0;

    get cardCount() { return this._availableCardCountList[this._cardCountIndex]; }
    get cardCountString() {
        return `${this.cardCount} x ${this.cardCount}`;
    }
    nextCardCount() {
        this._cardCountIndex = (this._cardCountIndex + 1) % this._availableCardCountList.length;
        return this.cardCount;
    }

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
        CREDIT: 'credit',
        NANDE: 'nande',
        KORA: 'kora',
        LAUGH: 'laugh',
        CHAOS: 'chaos',
        INCREASE: 'increase',
        DECREASE: 'decrease',
        CORRECT: 'correct',
        WRONG: 'wrong',
        GIVEUP: 'giveup',
        LOSE: 'lose',
        CONTINUE: 'continue',
        CLEAR: 'clear',
        FINISH: 'finish',
    }
    private _voiceMap: {[key: string]: string[]} = {
        'start': [
            "/rei_nande_concentration/assets/voice/h/hello_20250310_1025-1035.wav",
            "/rei_nande_concentration/assets/voice/h/hello_20250310_1115-1125.wav",
            "/rei_nande_concentration/assets/voice/h/hello_20250310_1130-1140.wav",
            "/rei_nande_concentration/assets/voice/k/konrei_20250310_1115-1125.wav",
            "/rei_nande_concentration/assets/voice/k/konrei_20250310_1130-1140.wav",
            "/rei_nande_concentration/assets/voice/h/hello_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/h/hello_20250316_0430-3500_1.wav",
            "/rei_nande_concentration/assets/voice/h/hello_20250316_0430-3500_2.wav",
            "/rei_nande_concentration/assets/voice/k/konrei_20250316_0430-3500_1.wav",
            "/rei_nande_concentration/assets/voice/k/konrei_20250316_0430-3500_2.wav",
            "/rei_nande_concentration/assets/voice/k/konrei_20250316_0430-3500_3.wav",
            "/rei_nande_concentration/assets/voice/k/konrei_20250316_0430-3500_8_4.wav",
            "/rei_nande_concentration/assets/voice/k/konrei_20250316_0430-3500_8_6.wav",
            "/rei_nande_concentration/assets/voice/y/yoroshiku_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/a/aa_20250316_0430-3500_1.wav",
        ],
        'credit': [
            "/rei_nande_concentration/assets/voice/n/notice_20250311_4600-5250_1.wav",
        ],
        'nande': [
            "/rei_nande_concentration/assets/voice/n/nande_20250309_1000-1002.wav",
            "/rei_nande_concentration/assets/voice/n/nande_20250309_1003-1005.wav",
            "/rei_nande_concentration/assets/voice/n/nande_20250309_1045-1050.wav",
            "/rei_nande_concentration/assets/voice/n/nande_20250309_1050-1100.wav",
            "/rei_nande_concentration/assets/voice/n/nande_20250310_2230-2240_1.wav",
            "/rei_nande_concentration/assets/voice/n/nande_20250310_2230-2240_2.wav",
            "/rei_nande_concentration/assets/voice/n/nande_20250310_3050-3100.wav",
            "/rei_nande_concentration/assets/voice/n/nande_20250310_3920-3930.wav",
            "/rei_nande_concentration/assets/voice/n/nande_20250310_3950-4000.wav",
            "/rei_nande_concentration/assets/voice/n/nande_20250310_4020-4030.wav",
            "/rei_nande_concentration/assets/voice/n/nande_20250310_4045-4055.wav",
            "/rei_nande_concentration/assets/voice/n/nande_20250310_15530-15540.wav",
            "/rei_nande_concentration/assets/voice/n/nande_20250310_15720-15730.wav",
            "/rei_nande_concentration/assets/voice/n/nande_20250310_24335-24345.wav",
            "/rei_nande_concentration/assets/voice/n/nande_20250310_24530-24540.wav",
            "/rei_nande_concentration/assets/voice/n/nande_20250310_24625-24635.wav",
            "/rei_nande_concentration/assets/voice/n/nande_20250310_30335-30345.wav",
            "/rei_nande_concentration/assets/voice/n/nande_20250310_30525-30535.wav",
            "/rei_nande_concentration/assets/voice/n/nande_20250310_35110-35120.wav",
            "/rei_nande_concentration/assets/voice/n/nande_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/n/nande_20250316_0430-3500_12_4.wav",
            "/rei_nande_concentration/assets/voice/n/nande_20250316_0430-3500_12_5.wav",
        ],
        'kora': [
            "/rei_nande_concentration/assets/voice/k/kora_20250310_14830-14840.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250310_24600-24610.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_1.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_2_1.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_3_2.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_4_2.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_4_3.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_4_4.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_4_5.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_4_6.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_5_1.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_5_2.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_8_5.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_9_4.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_9_8.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_9_11.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_9_14.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_10_3.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_10_5.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_10_6.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_10_9.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_10_10.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_10_11.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_10_12.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_10_13.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_11_2.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_11_8.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_11_9.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_11_12.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_12_3.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_14_5.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_15_14.wav",
            "/rei_nande_concentration/assets/voice/k/kora_20250316_0430-3500_16_1.wav",
            "/rei_nande_concentration/assets/voice/t/thxkora_20250316_0430-3500_16_9.wav",
            "/rei_nande_concentration/assets/voice/t/thxkora_20250316_0430-3500_17_3.wav",
            "/rei_nande_concentration/assets/voice/t/thxkora_20250316_0430-3500_17_4.wav",
            "/rei_nande_concentration/assets/voice/m/moneykora_20250316_0430-3500_11_10.wav",
            "/rei_nande_concentration/assets/voice/o/onlykora_20250316_0430-3500_5_1.wav",
            "/rei_nande_concentration/assets/voice/z/zakora_20250316_0430-3500_9_16.wav",
            "/rei_nande_concentration/assets/voice/z/zakora_20250316_0430-3500_9_17.wav",
            "/rei_nande_concentration/assets/voice/z/zakora_20250316_0430-3500_10_1.wav",
            "/rei_nande_concentration/assets/voice/z/zakora_20250316_0430-3500_10_4.wav",
        ],
        'laugh': [
            "/rei_nande_concentration/assets/voice/h/haha_20250316_0430-3500_1.wav",
            "/rei_nande_concentration/assets/voice/h/haha_20250316_0430-3500_2.wav",
            "/rei_nande_concentration/assets/voice/h/haha_20250316_0430-3500_2_1.wav",
            "/rei_nande_concentration/assets/voice/h/haha_20250316_0430-3500_2_2.wav",
            "/rei_nande_concentration/assets/voice/h/haha_20250316_0430-3500_3_1.wav",
            "/rei_nande_concentration/assets/voice/h/haha_20250316_0430-3500_4_2.wav",
            "/rei_nande_concentration/assets/voice/h/haha_20250316_0430-3500_8_1.wav",
            "/rei_nande_concentration/assets/voice/h/haha_20250316_0430-3500_12_1.wav",
            "/rei_nande_concentration/assets/voice/h/haha_20250316_0430-3500_13_1.wav",
            "/rei_nande_concentration/assets/voice/h/haha_20250316_0430-3500_13_4.wav",
            "/rei_nande_concentration/assets/voice/h/hahakora_20250316_0430-3500_12_2.wav",
            "/rei_nande_concentration/assets/voice/h/hh_20250316_0430-3500_3_1.wav",
            "/rei_nande_concentration/assets/voice/h/hh_20250316_0430-3500_4_1.wav",
            "/rei_nande_concentration/assets/voice/h/hh_20250316_0430-3500_4_2.wav",
            "/rei_nande_concentration/assets/voice/h/hh_20250316_0430-3500_5_1.wav",
            "/rei_nande_concentration/assets/voice/h/hh_20250316_0430-3500_9_1.wav",
            "/rei_nande_concentration/assets/voice/h/hh_20250316_0430-3500_9_5.wav",
            "/rei_nande_concentration/assets/voice/h/hh_20250316_0430-3500_9_6.wav",
            "/rei_nande_concentration/assets/voice/h/hh_20250316_0430-3500_9_12.wav",
            "/rei_nande_concentration/assets/voice/h/hh_20250316_0430-3500_11_5.wav",
            "/rei_nande_concentration/assets/voice/h/hh_20250316_0430-3500_13_10.wav",
            "/rei_nande_concentration/assets/voice/h/hh_20250316_0430-3500_14_6.wav",
            "/rei_nande_concentration/assets/voice/h/hh_20250316_0430-3500_15_8.wav",
            "/rei_nande_concentration/assets/voice/h/hh_20250316_0430-3500_15_10.wav",
            "/rei_nande_concentration/assets/voice/h/hh_20250316_0430-3500_15_13.wav",
            "/rei_nande_concentration/assets/voice/h/hh_20250316_0430-3500_16_10.wav",
            "/rei_nande_concentration/assets/voice/h/hh_20250316_0430-3500_17_5.wav",
            "/rei_nande_concentration/assets/voice/k/kk_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/k/kk_20250316_0430-3500_17_7.wav",
        ],
        'increase': [
            "/rei_nande_concentration/assets/voice/s/suki_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/s/suki_20250311_4600-5250_2.wav",
            "/rei_nande_concentration/assets/voice/d/difficult_20250316_0430-3500_13_8.wav",
            "/rei_nande_concentration/assets/voice/m/more_20250316_0430-3500_4_1.wav",
            "/rei_nande_concentration/assets/voice/y/yes_20250316_0430-3500_2_1.wav",
            "/rei_nande_concentration/assets/voice/y/yes_20250316_0430-3500_2_2.wav",
            "/rei_nande_concentration/assets/voice/y/yes_20250316_0430-3500_3_1.wav",
            "/rei_nande_concentration/assets/voice/y/yes_20250316_0430-3500_5_1.wav",
            "/rei_nande_concentration/assets/voice/y/yes_20250316_0430-3500_6_1.wav",
            "/rei_nande_concentration/assets/voice/y/yes_20250316_0430-3500_11_6.wav",
            "/rei_nande_concentration/assets/voice/y/yes_20250316_0430-3500_17_1.wav",
        ],
        'decrease': [
            "/rei_nande_concentration/assets/voice/r/reduce_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/r/reduce_20250311_4600-5250_2.wav",
            "/rei_nande_concentration/assets/voice/p/phew_20250316_0430-3500_1.wav",
            "/rei_nande_concentration/assets/voice/p/phew_20250316_0430-3500_2.wav",
            "/rei_nande_concentration/assets/voice/y/ya_20250316_0430-3500_13_5.wav",
            "/rei_nande_concentration/assets/voice/y/ya_20250316_0430-3500_13_6.wav",
        ],
        'correct': [
            "/rei_nande_concentration/assets/voice/t/thx_20250310_1115-1125_1.wav",
            "/rei_nande_concentration/assets/voice/t/thx_20250310_1115-1125_2.wav",
            "/rei_nande_concentration/assets/voice/t/thx_20250310_14830-14840.wav",
            "/rei_nande_concentration/assets/voice/t/thx_20250310_34110-34120.wav",
            "/rei_nande_concentration/assets/voice/t/thx_20250310_34955-35005.wav",
            "/rei_nande_concentration/assets/voice/y/yoshi_20250310_1025-1035.wav",
            "/rei_nande_concentration/assets/voice/w/wow_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/w/wow_20250311_4600-5250_2.wav",
            "/rei_nande_concentration/assets/voice/w/wow_20250311_4600-5250_3.wav",
            "/rei_nande_concentration/assets/voice/t/thx_20250311_4600-5250_3.wav",
            "/rei_nande_concentration/assets/voice/t/thx_20250311_4600-5250_4.wav",
            "/rei_nande_concentration/assets/voice/t/thx_20250311_4600-5250_5.wav",
            "/rei_nande_concentration/assets/voice/t/thx_20250311_4600-5250_6.wav",
            "/rei_nande_concentration/assets/voice/t/thx_20250311_4600-5250_7.wav",
            "/rei_nande_concentration/assets/voice/t/thx_20250311_4600-5250_9.wav",
            "/rei_nande_concentration/assets/voice/t/thx_20250311_4600-5250_10.wav",
            "/rei_nande_concentration/assets/voice/t/thx_20250316_0430-3500_1.wav",
            "/rei_nande_concentration/assets/voice/t/thx_20250316_0430-3500_4_1.wav",
            "/rei_nande_concentration/assets/voice/t/thx_20250316_0430-3500_5_1.wav",
            "/rei_nande_concentration/assets/voice/t/thx_20250316_0430-3500_8_7.wav",
            "/rei_nande_concentration/assets/voice/t/thx_20250316_0430-3500_11_11.wav",
            "/rei_nande_concentration/assets/voice/t/thx_20250316_0430-3500_15_12.wav",
            "/rei_nande_concentration/assets/voice/t/thx_20250316_0430-3500_17_6.wav",
            "/rei_nande_concentration/assets/voice/t/thxkora_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/t/thxkora_20250311_4600-5250_2.wav",
            "/rei_nande_concentration/assets/voice/t/thxkora_20250316_0430-3500_3_1.wav",
            "/rei_nande_concentration/assets/voice/h/ho_20250316_0430-3500_8_2.wav",
            "/rei_nande_concentration/assets/voice/h/ho_20250316_0430-3500_8_3.wav",
            "/rei_nande_concentration/assets/voice/h/ho_20250316_0430-3500_8_8.wav",
            "/rei_nande_concentration/assets/voice/g/getya_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/g/getya_20250311_4600-5250_2.wav",
            "/rei_nande_concentration/assets/voice/g/getya_20250311_4600-5250_3.wav",
            "/rei_nande_concentration/assets/voice/g/getya_20250311_4600-5250_4.wav",
            "/rei_nande_concentration/assets/voice/g/getya_20250311_4600-5250_5.wav",
            "/rei_nande_concentration/assets/voice/g/getya_20250311_4600-5250_6.wav",
            "/rei_nande_concentration/assets/voice/m/momo_20250316_0430-3500_4_1.wav",
            "/rei_nande_concentration/assets/voice/m/momo_20250316_0430-3500_10_14.wav",
            "/rei_nande_concentration/assets/voice/w/wow_20250316_0430-3500_1.wav",
            "/rei_nande_concentration/assets/voice/w/wow_20250316_0430-3500_3_1.wav",
        ],
        'wrong': [
            "/rei_nande_concentration/assets/voice/h/haa_20250310_24540-24550.wav",
            "/rei_nande_concentration/assets/voice/h/haa_20250310_24600-24610.wav",
            "/rei_nande_concentration/assets/voice/h/hen_20250310_1015-1025.wav",
            "/rei_nande_concentration/assets/voice/h/hen_20250310_1025-1035.wav",
            "/rei_nande_concentration/assets/voice/h/hidoi_20250310_24610-24620.wav",
            "/rei_nande_concentration/assets/voice/n/no_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/n/no_20250311_4600-5250_2.wav",
            "/rei_nande_concentration/assets/voice/n/no_20250316_0430-3500_3_4.wav",
            "/rei_nande_concentration/assets/voice/n/no_20250316_0430-3500_6_1.wav",
            "/rei_nande_concentration/assets/voice/n/no_20250316_0430-3500_9_7.wav",
            "/rei_nande_concentration/assets/voice/n/no_20250316_0430-3500_9_9.wav",
            "/rei_nande_concentration/assets/voice/n/no_20250316_0430-3500_9_10.wav",
            "/rei_nande_concentration/assets/voice/n/no_20250316_0430-3500_16_4.wav",
            "/rei_nande_concentration/assets/voice/n/no_20250316_0430-3500_16_5.wav",
            "/rei_nande_concentration/assets/voice/h/ha_20250316_0430-3500_5_1.wav",
            "/rei_nande_concentration/assets/voice/h/ha_20250316_0430-3500_6_1.wav",
            "/rei_nande_concentration/assets/voice/h/ha_20250316_0430-3500_15_6.wav",
            "/rei_nande_concentration/assets/voice/h/hidoi_20250316_0430-3500_4_1.wav",
            "/rei_nande_concentration/assets/voice/h/hidoi_20250316_0430-3500_11_7.wav",
            "/rei_nande_concentration/assets/voice/h/hing_20250316_0430-3500_3_1.wav",
            "/rei_nande_concentration/assets/voice/h/hmm_20250316_0430-3500_2_1.wav",
            "/rei_nande_concentration/assets/voice/h/hmm_20250316_0430-3500_6_1.wav",
            "/rei_nande_concentration/assets/voice/h/hmm_20250316_0430-3500_15_15.wav",
            "/rei_nande_concentration/assets/voice/a/a_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/a/a_20250316_0430-3500_5_1.wav",
            "/rei_nande_concentration/assets/voice/a/a_20250316_0430-3500_8_1.wav",
            "/rei_nande_concentration/assets/voice/a/a_20250316_0430-3500_11_3.wav",
            "/rei_nande_concentration/assets/voice/a/a_20250316_0430-3500_13_7.wav",
            "/rei_nande_concentration/assets/voice/a/a_20250316_0430-3500_14_4.wav",
            "/rei_nande_concentration/assets/voice/a/a_20250316_0430-3500_15_4.wav",
            "/rei_nande_concentration/assets/voice/a/ang_20250316_0430-3500_4_1.wav",
            "/rei_nande_concentration/assets/voice/g/gambare_20250316_0430-3500_17_8.wav",
            "/rei_nande_concentration/assets/voice/l/listen_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/m/mo_20250316_0430-3500_2_1.wav",
            "/rei_nande_concentration/assets/voice/m/momo_20250316_0430-3500_2_1.wav",
            "/rei_nande_concentration/assets/voice/m/momo_20250316_0430-3500_4_2.wav",
            "/rei_nande_concentration/assets/voice/u/urusai_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/u/urusai_20250316_0430-3500_16_3.wav",
            "/rei_nande_concentration/assets/voice/u/usai_20250316_0430-3500_5_1.wav",
            "/rei_nande_concentration/assets/voice/w/what_20250311_4600-5250_2.wav",
            "/rei_nande_concentration/assets/voice/w/where_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/w/who_20250316_0430-3500_14_2.wav",
        ],
        'giveup': [
            "/rei_nande_concentration/assets/voice/h/hee_20250310_1130-1140.wav",
            "/rei_nande_concentration/assets/voice/g/giveup_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/r/really_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/h/hee_20250316_0430-3500_8_9.wav",
            "/rei_nande_concentration/assets/voice/h/hanabira-angry_20250316_0430-3500_15_7.wav",
            "/rei_nande_concentration/assets/voice/a/aa_20250316_0430-3500_8_1.wav",
            "/rei_nande_concentration/assets/voice/d/dame_20250316_0430-3500_2_1.wav",
            "/rei_nande_concentration/assets/voice/g/gambare_20250316_0430-3500_17_9.wav",
            "/rei_nande_concentration/assets/voice/g/goout_20250316_0430-3500_3_3.wav",
            "/rei_nande_concentration/assets/voice/k/korakawaii_20250316_0430-3500_5_1.wav",
            "/rei_nande_concentration/assets/voice/l/line_20250316_0430-3500_11_4.wav",
            "/rei_nande_concentration/assets/voice/l/listen_20250316_0430-3500_4_1.wav",
            "/rei_nande_concentration/assets/voice/o/ok_20250316_0430-3500_9_1.wav",
            "/rei_nande_concentration/assets/voice/o/ok_20250316_0430-3500_9_2.wav",
            "/rei_nande_concentration/assets/voice/o/ok_20250316_0430-3500_11_1.wav",
            "/rei_nande_concentration/assets/voice/o/ok_20250316_0430-3500_16_6.wav",
            "/rei_nande_concentration/assets/voice/w/wait_20250316_0430-3500_17_2.wav",
            "/rei_nande_concentration/assets/voice/w/what_20250316_0430-3500_13_2.wav",
            "/rei_nande_concentration/assets/voice/w/why_20250316_0430-3500_9_3.wav",
            "/rei_nande_concentration/assets/voice/y/youT_20250316_0430-3500_4_1.wav",
        ],
        'lose': [
            "/rei_nande_concentration/assets/voice/z/zako_20250310_3915-3925.wav",
            "/rei_nande_concentration/assets/voice/z/zako_20250310_3955-4015.wav",
            "/rei_nande_concentration/assets/voice/z/zako_20250310_24600-24610_1.wav",
            "/rei_nande_concentration/assets/voice/z/zako_20250310_24600-24610_2.wav",
            "/rei_nande_concentration/assets/voice/h/haha_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/i/iknow_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/j/joogle_20250316_0430-3500_15_1.wav",
            "/rei_nande_concentration/assets/voice/j/joogle_20250316_0430-3500_15_2.wav",
            "/rei_nande_concentration/assets/voice/j/joogle_20250316_0430-3500_15_3.wav",
        ],
        'continue': [
            "/rei_nande_concentration/assets/voice/m/momo_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/m/momo_20250311_4600-5250_2.wav",
            "/rei_nande_concentration/assets/voice/y/yes_20250316_0430-3500_4_1.wav",
        ],
        'clear': [
            "/rei_nande_concentration/assets/voice/b/bam_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/b/bam_20250311_4600-5250_2.wav",
            "/rei_nande_concentration/assets/voice/b/bam_20250311_4600-5250_3.wav",
            "/rei_nande_concentration/assets/voice/c/clap_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/h/huhu_20250316_0430-3500_3_1.wav",
        ],
        'finish': [
            "/rei_nande_concentration/assets/voice/j/jaja_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/j/jaja_20250311_4600-5250_2.wav",
            "/rei_nande_concentration/assets/voice/j/jaja_20250311_4600-5250_3.wav",
            "/rei_nande_concentration/assets/voice/m/more_20250311_4600-5250_1.wav",
            "/rei_nande_concentration/assets/voice/y/yes_20250316_0430-3500_4_2.wav",
        ],
    }
    loadVoice(key: string, id: number) {
        const voiceName = `voice-${key}-${id}`;
        if (!sound.exists(voiceName)) sound.add(voiceName, { url: this._voiceMap[key][id], preload: true });
        return voiceName;
    }
    loadRandomVoice(key: string, count: number = 1) {
        const keys = (key === this.VOICE.CHAOS) ? Object.values(this.VOICE) : [key];
        let voiceNameList: string[] = [];
        for (const key of keys) {
            if (!(key in this._voiceMap)) continue;
            if (count < 0) count = this._voiceMap[key].length;
            const voiceIdList = [...Array(this._voiceMap[key].length).keys()];
    
            voiceNameList = voiceNameList.concat(voiceIdList.map((id: number) => {
                return this.loadVoice(key, id);
            }));
        }
        voiceNameList = shuffle(voiceNameList);
        voiceNameList = voiceNameList.slice(0, count);

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