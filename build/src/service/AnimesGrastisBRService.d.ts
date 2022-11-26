import { Anime } from '../types/types';
export declare class AnimesGrastisBRService {
    hash(string: any): string;
    getPage(page: string): Promise<Anime[]>;
    getAllPages(numPages: number): Promise<Anime[]>;
}
