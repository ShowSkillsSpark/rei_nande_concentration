import { Application, Assets } from "pixi.js";
import { assets } from "./assets";
import { TitleScene } from "./ui/titleScene";
import { GameScene } from "./ui/gameScene";
import { Navigator } from "./ui/navigator";
import { sound } from "@pixi/sound";
import { ClearScene } from "./ui/clearScene";

(async () => {
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ background: "#ffe8ee", resizeTo: window });

    // Append the application canvas to the document body
    document.getElementById("pixi-container")!.appendChild(app.canvas);


    // sound 불러오기
    const startSoundNameList = [
        assets.sound['konrei'][0],
        assets.sound['konrei'][1],
        assets.sound['hello'][0],
        assets.sound['hello'][1],
        assets.sound['hello'][2],
    ].map((path, index) => {
        const name = `start-${index}`;
        sound.add(name, path);
        return name;
    });
    const correctSoundNameList = [
        assets.sound['thx'][0],
        assets.sound['thx'][1],
        assets.sound['thx'][2],
        assets.sound['thx'][3],
        assets.sound['thx'][4],
        assets.sound['yoshi'][0],
    ].map((path, index) => {
        const name = `correct-${index}`;
        sound.add(name, path);
        return name;
    });
    const wrongSoundNameList = [
        assets.sound['haa'][0],
        assets.sound['haa'][1],
        assets.sound['hen'][0],
        assets.sound['hen'][1],
        assets.sound['hidoi'][0],
        assets.sound['kora'][0],
        assets.sound['kora'][1],
        assets.sound['sorry'][0],
        assets.sound['sorry'][1],
        assets.sound['zako'][0],
        assets.sound['zako'][1],
        assets.sound['zako'][2],
        assets.sound['zako'][3],
    ].map((path, index) => {
        const name = `wrong-${index}`;
        sound.add(name, path);
        return name;
    });
    const giveupSoundNameList = [
        assets.sound['hee'][0],
    ].map((path, index) => {
        const name = `giveup-${index}`;
        sound.add(name, path);
        return name;
    });
    // const looseSoundNameList = [].map((path, index) => {
    //     const name = `giveup-${index}`;
    //     sound.add(name, path);
    //     return name;
    // });

    // font 불러오기
    await Assets.load('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.2/JalnanOTF00.woff');
    await Assets.load('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunGs.woff');
    await Assets.load('https://fastly.jsdelivr.net/gh/projectnoonnu/2411-3@1.0/Ownglyph_StudyHard-Rg.woff2');
    await Assets.load('https://fastly.jsdelivr.net/gh/projectnoonnu/2410-1@1.0/GumiRomanceTTF.woff2');

    // 화면 연결
    const navigator = new Navigator(app);
    new TitleScene({startSoundNameList: startSoundNameList, navigator, sceneName: navigator.SCENE.TITLE});
    new GameScene({
        correctSoundNameList,
        wrongSoundNameList,
        giveupSoundNameList,
        navigator,
        sceneName: navigator.SCENE.GAME,
    });
    new ClearScene({
        navigator,
        sceneName: navigator.SCENE.CLEAR,
    })

    // 시작 화면
    navigator.navScene(navigator.SCENE.TITLE);
    // navigator.navScene(navigator.SCENE.GAME);
    // navigator.navScene(navigator.SCENE.CLEAR);
})();