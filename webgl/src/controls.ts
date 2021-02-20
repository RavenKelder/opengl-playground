import { offset, vector } from "./rendering";

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case ".":
      offset[2] = offset[2] + 0.05;
      break;
    case ",":
      offset[2] = offset[2] - 0.05;
      break;
    case "ArrowUp":
      offset[1] = offset[1] - 0.05;
      break;
    case "ArrowDown":
      offset[1] = offset[1] + 0.05;
      break;
    case "ArrowLeft":
      offset[0] = offset[0] + 0.05;
      break;
    case "ArrowRight":
      offset[0] = offset[0] - 0.05;
      break;
    case "a":
      vector.a = vector.a + 0.05;
      break;
    case "d":
      vector.a = vector.a - 0.05;
      break;
    case "w":
      vector.b = vector.b + 0.05;
      break;
    case "s":
      vector.b = vector.b - 0.05;
      break;
    default:
      console.log(event.key);
  }
});
