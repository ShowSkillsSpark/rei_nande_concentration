import { Application, Assets } from "pixi.js";
import { assets } from "./assets";
import { TitleScene } from "./ui/titleScene";
import { GameScene } from "./ui/gameScene";
import { Navigator } from "./ui/navigator";
import { sound } from "@pixi/sound";

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
        assets.sound['hee'][0],
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

    // font 불러오기
    await Assets.load('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.2/JalnanOTF00.woff');

    // 화면 연결
    const navigator = new Navigator(app);
    new TitleScene({startSoundNameList: startSoundNameList, navigator, sceneName: navigator.SCENE.TITLE});
    new GameScene({
        correctSoundNameList: correctSoundNameList,
        wrongSoundNameList: wrongSoundNameList,
        navigator,
        sceneName: navigator.SCENE.GAME,
    });

    // 화면 보이기
    navigator.navScene(navigator.SCENE.TITLE);
})();