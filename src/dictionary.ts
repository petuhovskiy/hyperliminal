import { readFileSync } from 'fs';
import { join } from 'path';

// Mulberry32 PRNG implementation
function mulberry32(seed: number) {
    return function () {
        seed |= 0;
        seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

// Fixed seed for deterministic behavior
const seed = 1234;

// Check if a number is prime
function isPrime(num: number): boolean {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;

    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

class Dictionary {
    private wordToIndex: Map<string, number>;
    private indexToWord: Map<number, string>;
    readonly size: number;

    constructor() {
        this.wordToIndex = new Map();
        this.indexToWord = new Map();

        // Read and process words
        const filePath = join(import.meta.dir, 'words_alpha.txt');
        const content = readFileSync(filePath, 'utf-8');
        const words = content.split('\n')
            .map(w => w.trim().toLowerCase())
            .filter(w => w && w.length > 0 && /^[a-z]+$/.test(w));

        // Check if number of words is prime
        if (!isPrime(words.length)) {
            throw new Error(`Dictionary must contain a prime number of words. Current count: ${words.length}`);
        }

        this.size = words.length;

        // Initialize PRNG with fixed seed
        const rng = mulberry32(seed);

        // Shuffle words using Fisher-Yates algorithm with deterministic RNG
        for (let i = words.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            // We know these indices exist since j <= i and i < words.length
            [words[i]!, words[j]!] = [words[j]!, words[i]!];
        }

        // Create mappings
        words.forEach((word, index) => {
            this.wordToIndex.set(word, index);
            this.indexToWord.set(index, word);
        });
    }

    hasWord(word: string): boolean {
        return this.wordToIndex.has(word.toLowerCase());
    }

    getIndex(word: string): number {
        const index = this.wordToIndex.get(word.toLowerCase());
        if (index === undefined) {
            throw new Error(`Word "${word}" not found in dictionary`);
        }
        return index;
    }

    getWord(index: number): string {
        const word = this.indexToWord.get(index);
        if (word === undefined) {
            throw new Error(`Index ${index} not found in dictionary`);
        }
        return word;
    }
}

// Export singleton instance
export const dictionary = new Dictionary(); 