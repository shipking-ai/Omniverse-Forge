// QA controllers use the same public movement/command interfaces as a player.
// They read state but never teleport, alter HP, or bypass win conditions.
import { distance } from "../src/core.js";
import { canShoot, reachable, manhattan } from "../src/modes/tactics.js";
export function actionPilot(hybrid) {
  const path = hybrid
    ? [
        { x: 900, y: 730 },
        { x: 1060, y: 600 },
        { x: 900, y: 470 },
        { x: 750, y: 600 },
      ]
    : [
        { x: 900, y: 600 },
        { x: 180, y: 600 },
        { x: 900, y: 600 },
        { x: 1580, y: 600 },
        { x: 900, y: 600 },
        { x: 920, y: 160 },
        { x: 900, y: 600 },
      ];
  let index = 0;
  return (s) => {
    if (distance(s.player, path[index % path.length]) < 24) index++;
    const t = path[index % path.length];
    return {
      fire: true,
      left: s.player.x > t.x + 8,
      right: s.player.x < t.x - 8,
      up: s.player.y > t.y + 8,
      down: s.player.y < t.y - 8,
      build: hybrid && s.ore >= 3,
    };
  };
}
export function tacticalPilot(s) {
  if (s.ap === 0) return ["end-turn"];
  const targets = s.enemies
    .filter((e) => canShoot(s, s.player, e))
    .sort((a, b) => a.hp - b.hp);
  if (targets.length) return ["select", { x: targets[0].x, y: targets[0].y }];
  const moves = [];
  for (let y = 0; y < 7; y++)
    for (let x = 0; x < 9; x++) {
      const p = { x, y };
      if (reachable(s, s.player, p, 2) && manhattan(s.player, p) > 0) {
        let score = Math.min(...s.enemies.map((e) => manhattan(p, e)));
        if (s.enemies.some((e) => canShoot(s, p, e))) score -= 2;
        moves.push({ p, score });
      }
    }
  moves.sort((a, b) => a.score - b.score);
  return moves.length ? ["select", moves[0].p] : ["end-turn"];
}
