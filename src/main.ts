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
        ...Object.values(assets.sound['konrei']),
        ...Object.values(assets.sound['hello']),
    ].map((path, index) => {
        const name = `start-${index}`;
        sound.add(name, path);
        return name;
    });
    const correctSoundNameList = [
        ...Object.values(assets.sound['thx']),
        ...Object.values(assets.sound['yoshi']),
    ].map((path, index) => {
        const name = `correct-${index}`;
        sound.add(name, path);
        return name;
    });
    const wrongSoundNameList = [
        ...Object.values(assets.sound['haa']),
        ...Object.values(assets.sound['hen']),
        ...Object.values(assets.sound['hidoi']),
        ...Object.values(assets.sound['kora']),
        ...Object.values(assets.sound['sorry']),
    ].map((path, index) => {
        const name = `wrong-${index}`;
        sound.add(name, path);
        return name;
    });
    const giveupSoundNameList = [
        ...Object.values(assets.sound['hee']),
    ].map((path, index) => {
        const name = `giveup-${index}`;
        sound.add(name, path);
        return name;
    });
    const looseSoundNameList = [
        ...Object.values(assets.sound['zako']),
    ].map((path, index) => {
        const name = `loose-${index}`;
        sound.add(name, path);
        return name;
    });

    // font 불러오기
    await Assets.load('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.2/JalnanOTF00.woff');
    await Assets.load('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunGs.woff');
    await Assets.load('https://fastly.jsdelivr.net/gh/projectnoonnu/2411-3@1.0/Ownglyph_StudyHard-Rg.woff2');
    await Assets.load('https://fastly.jsdelivr.net/gh/projectnoonnu/2410-1@1.0/GumiRomanceTTF.woff2');
    await Assets.load('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2402_keris@1.0/TTHakgyoansimNamuL.woff2');

    // 화면 연결
    const navigator = new Navigator(app);
    new TitleScene({startSoundNameList: startSoundNameList, navigator, sceneName: navigator.SCENE.TITLE});
    new GameScene({
        correctSoundNameList,
        wrongSoundNameList,
        giveupSoundNameList,
        looseSoundNameList,
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