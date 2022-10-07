import { Vector3, Matrix3, clean, Matrix4 } from '@fwge/common'
import { CSGO } from './game'

const game = new CSGO();
game.Start();

(window as any).game = game;
(window as any).clean = clean;
(window as any).Vector3 = Vector3;
(window as any).Matrix3 = Matrix3;
(window as any).Matrix4 = Matrix4;

