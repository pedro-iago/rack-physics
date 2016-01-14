export const BOX = 'box';
export const SPHERE = 'sphere';
export const CYLINDER = 'cylinder';

export const JOINT_DISTANCE = 'jointDistance';
export const JOINT_BALL_AND_SOCKET = "jointBall";
export const JOINT_HINGE = 'jointHinge';
export const JOINT_WHEEL = 'jointWheel';
export const JOINT_SLIDER = 'jointSlider';
export const JOINT_PRISMATIC = 'jointPrismatic';

export const BRUTE = 1;
export const SWEEP = 2;
export const TREE = 3;
export const BROADPHASES = [BRUTE, SWEEP, TREE];

export const SPAWN = 'SPAWN';
export const SETUP = 'SETUP';
export const LOOP = 'LOOP';
export const TERMINATE = 'TERMINATE';

export const BODIES = [BOX, SPHERE, CYLINDER];
export const JOINTS = [JOINT_DISTANCE, JOINT_BALL_AND_SOCKET, JOINT_HINGE, JOINT_WHEEL, JOINT_SLIDER, JOINT_PRISMATIC];
export const OBJECTS = [...BODIES, ...JOINTS];
export const ACTIONS = [SPAWN, SETUP, LOOP, TERMINATE];
