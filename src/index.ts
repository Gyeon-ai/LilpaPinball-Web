import './localization';
import options from './options';
import { setupLilpaBrand } from './lilpaBrand';
import { Roulette } from './roulette';


const roulette = new Roulette();

(window as any).roulette = roulette;
(window as any).options = options;

setupLilpaBrand();
