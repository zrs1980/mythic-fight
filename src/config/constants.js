// Game-wide numeric and configuration constants

export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;
export const WORLD_WIDTH = 5760;

// Floor bounds for Y movement (the ground plane)
export const FLOOR_MIN_Y = 320;
export const FLOOR_MAX_Y = 470;

// Player constants
export const PLAYER_SPRITE_W = 48;
export const PLAYER_SPRITE_H = 64;
export const BOSS_SPRITE_W = 64;
export const BOSS_SPRITE_H = 80;

// Player 1 (Lily - gold griffin, faster)
export const P1_SPEED = 175;
export const P1_PUNCH_DAMAGE = 10;
export const P1_COLOR_PRIMARY = 0xf5c842;  // gold
export const P1_COLOR_SECONDARY = 0x8b4513; // brown
export const P1_HUD_COLOR = 0xff69b4;       // pink

// Player 2 (Rose - silver griffin, stronger)
export const P2_SPEED = 145;
export const P2_PUNCH_DAMAGE = 13;
export const P2_COLOR_PRIMARY = 0xc0c0c0;  // silver
export const P2_COLOR_SECONDARY = 0x6699cc; // blue
export const P2_HUD_COLOR = 0x9966ff;       // purple

// Shared player stats
export const PLAYER_MAX_HP = 100;
export const PLAYER_LIVES = 5;
export const DAGGER_DAMAGE = 15;
export const DAGGER_SPEED = 420;
export const PUNCH_RANGE_X = 70;
export const PUNCH_RANGE_Y = 40;
export const ENEMY_HIT_RANGE_X = 55;
export const ENEMY_HIT_RANGE_Y = 25;

// Jump parameters
export const JUMP_HEIGHT = 80;
export const JUMP_DURATION = 500;

// Attack cooldowns (ms)
export const PUNCH_COOLDOWN = 500;
export const SHOOT_COOLDOWN = 700;
export const HURT_INVINCIBILITY = 500;
export const ENEMY_WINDUP_MS = 500;
export const ENEMY_ATTACK_COOLDOWN = 1200;

// Max enemies on screen
export const MAX_ENEMIES = 4;

// Camera
export const CAMERA_LERP = 0.05;

// HUD layout
export const HUD_HEIGHT = 50;
export const HUD_BAR_W = 180;
export const HUD_BAR_H = 14;
