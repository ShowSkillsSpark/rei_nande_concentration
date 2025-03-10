import { Assets, Application } from "pixi.js";
import { Card, CardState } from "./card";
import { assets } from "./assets";

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array: number[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#ffe8ee", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // audio 불러오기
  const correctAudioList = [
    new Audio(assets.sound['thx'][0]),
    new Audio(assets.sound['thx'][1]),
    new Audio(assets.sound['thx'][2]),
  ]
  const wrongAudioList = [
    new Audio(assets.sound['haa'][0]),
    new Audio(assets.sound['haa'][1]),
    new Audio(assets.sound['hidoi'][0]),
    new Audio(assets.sound['kora'][0]),
    new Audio(assets.sound['kora'][1]),
    new Audio(assets.sound['sorry'][0]),
    new Audio(assets.sound['sorry'][1]),
    new Audio(assets.sound['zako'][0]),
    new Audio(assets.sound['zako'][1]),
    new Audio(assets.sound['zako'][2]),
    new Audio(assets.sound['zako'][3]),
  ]

  let selectedCard: Card | null = null;

  // texture 불러오기
  const cardTextures = {
    ready: await Assets.load(assets.image.ready),
    selected: await Assets.load(assets.image.selected),
    correct: await Assets.load(assets.image.correct),
    wrong: await Assets.load(assets.image.wrong),
  }

  // voiceType 설정
  const voiceType = 'nande';

  // size 설정
  const size = 4;

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
          if (selectedCard == null) {
            console.log('select 1st', card.voiceId);
            selectedCard = card;
            card.state = CardState.Selected;
            card.playAudio();
          } else if (selectedCard !== card) {
            console.log('select 2nd', card.voiceId);
            const firstCard = selectedCard;
            selectedCard = null;
            if (firstCard.voiceId === card.voiceId) { // 정답이면
              console.log('correct');
              card.state = CardState.Selected;
              card.playAudio(() => {
                firstCard!.state = CardState.Correct;
                card.state = CardState.Correct;
                const audio = correctAudioList[Math.floor(Math.random() * correctAudioList.length)]
                audio.onended = () => {
                  firstCard!.state = CardState.Correct;
                  card.state = CardState.Correct;
                }
                audio.play();
              });
            } else { // 오답이면
              console.log('wrong');
              card.state = CardState.Selected;
              card.playAudio(() => {
                firstCard!.state = CardState.Wrong;
                card.state = CardState.Wrong;
                const audio = wrongAudioList[Math.floor(Math.random() * wrongAudioList.length)]
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
      app.stage.addChild(card);
    }
  }

})();
