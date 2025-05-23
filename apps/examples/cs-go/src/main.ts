import { Vector3, Matrix3, clean, Matrix4, GL, CompositeDataView } from '@fwge/common'
import { CSGO } from './game'
import './style.css'
import { Registry } from '@fwge/ecs';

console.log({ Registry });
const game = new CSGO();
game.Start();

(window as any).Registry = Registry;
(window as any).game = game;
(window as any).GL = GL;
(window as any).clean = clean;
(window as any).Vector3 = Vector3;
(window as any).Matrix3 = Matrix3;
(window as any).Matrix4 = Matrix4;
(window as any).CompositeDataView = CompositeDataView;
