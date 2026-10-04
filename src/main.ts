import "./styles.css";
import { ClockworkGame } from "./ui/game";

const host = document.querySelector<HTMLDivElement>("#app");

if (!host) {
  throw new Error("Missing #app host");
}

const game = new ClockworkGame(host);
game.mount();
