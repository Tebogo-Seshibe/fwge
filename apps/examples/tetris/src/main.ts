import { ShaderAsset, StaticMesh } from '@fwge/core';
import { tetrominoI, tetrominoJ, tetrominoL, tetrominoO, tetrominoS, tetrominoT, tetrominoZ } from './assets/TetrominoMesh';
import { tetrominoShaderFrag, tetrominoShaderVert } from './assets/TetrominoShader';
import { ActionInput } from './components/ActionInput';
import { Tetris } from './game';
import { Level, MainMenu } from './scenes';

const game = new Tetris();
game.ConfigureAsset(class TetrominoI extends StaticMesh{}, tetrominoI)
    .ConfigureAsset(class TetrominoJ extends StaticMesh{}, tetrominoJ)
    .ConfigureAsset(class TetrominoL extends StaticMesh{}, tetrominoL)
    .ConfigureAsset(class TetrominoO extends StaticMesh{}, tetrominoO)
    .ConfigureAsset(class TetrominoS extends StaticMesh{}, tetrominoS)
    .ConfigureAsset(class TetrominoT extends StaticMesh{}, tetrominoT)
    .ConfigureAsset(class TetrominoZ extends StaticMesh{}, tetrominoZ)
    .ConfigureAsset(class TetrominoShader extends ShaderAsset{}, tetrominoShaderVert, tetrominoShaderFrag);

game.ConfigureComponent(ActionInput)
    // .ConfigureComponent(Player)

game.ConfigureScene(Level)
    .ConfigureScene(MainMenu);

game.Start();

(window as any).game = game;
