const image: {[key: string]: string} = {
    ready: "/rei_nande_concentration/assets/card/ready.png",
    selected: "/rei_nande_concentration/assets/card/selected.png",
    correct: "/rei_nande_concentration/assets/card/correct.png",
    wrong: "/rei_nande_concentration/assets/card/wrong.png",
}

const sound: {[key: string]: {[key: number]: string}} = {
    'haa': {
        0: "/rei_nande_concentration/assets/sound/haa_20250310_24540-24550.wav",
        1: "/rei_nande_concentration/assets/sound/haa_20250310_24600-24610.wav",
    },
    'hidoi': {
        0: "/rei_nande_concentration/assets/sound/hidoi_20250310_24610-24620.wav",
    },
    'kora': {
        0: "/rei_nande_concentration/assets/sound/kora_20250310_14830-14840.wav",
        1: "/rei_nande_concentration/assets/sound/kora_20250310_24600-24610.wav",
    },
    'nande': {
        0: "/rei_nande_concentration/assets/sound/nande_20250309_1000-1002.wav",
        1: "/rei_nande_concentration/assets/sound/nande_20250309_1003-1005.wav",
        2: "/rei_nande_concentration/assets/sound/nande_20250309_1045-1050.wav",
        3: "/rei_nande_concentration/assets/sound/nande_20250309_1050-1100.wav",
        4: "/rei_nande_concentration/assets/sound/nande_20250310_2230-2240_1.wav",
        5: "/rei_nande_concentration/assets/sound/nande_20250310_2230-2240_2.wav",
        6: "/rei_nande_concentration/assets/sound/nande_20250310_3050-3100.wav",
        7: "/rei_nande_concentration/assets/sound/nande_20250310_3920-3930.wav",
        8: "/rei_nande_concentration/assets/sound/nande_20250310_3950-4000.wav",
        9: "/rei_nande_concentration/assets/sound/nande_20250310_4020-4030.wav",
        10: "/rei_nande_concentration/assets/sound/nande_20250310_4045-4055.wav",
        11: "/rei_nande_concentration/assets/sound/nande_20250310_15530-15540.wav",
        12: "/rei_nande_concentration/assets/sound/nande_20250310_15720-15730.wav",
        13: "/rei_nande_concentration/assets/sound/nande_20250310_24335-24345.wav",
        14: "/rei_nande_concentration/assets/sound/nande_20250310_24530-24540.wav",
        15: "/rei_nande_concentration/assets/sound/nande_20250310_24625-24635.wav",
        16: "/rei_nande_concentration/assets/sound/nande_20250310_30335-30345.wav",
        17: "/rei_nande_concentration/assets/sound/nande_20250310_30525-30535.wav",
        18: "/rei_nande_concentration/assets/sound/nande_20250310_35110-35120.wav",
    },
    'sorry': {
        0: "/rei_nande_concentration/assets/sound/sorry_20250310_15530-15540.wav",
        1: "/rei_nande_concentration/assets/sound/sorry_20250310_22735-22745.wav",
    },
    'thx': {
        0: "/rei_nande_concentration/assets/sound/thx_20250310_14830-14840.wav",
        1: "/rei_nande_concentration/assets/sound/thx_20250310_34110-34120.wav",
        2: "/rei_nande_concentration/assets/sound/thx_20250310_34955-35005.wav",
    },
    'zako': {
        0: "/rei_nande_concentration/assets/sound/zako_20250310_3915-3925.wav",
        1: "/rei_nande_concentration/assets/sound/zako_20250310_3955-4015.wav",
        2: "/rei_nande_concentration/assets/sound/zako_20250310_24600-24610_1.wav",
        3: "/rei_nande_concentration/assets/sound/zako_20250310_24600-24610_2.wav",
    }
}

export const assets = {
    image,
    sound,
}