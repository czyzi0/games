const GRASS = [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0}];

const FRUITS = {
    'apple': {x: 0, y: 0},
    'banana': {x: 1, y: 0},
    'grape': {x: 2, y: 0},
    'lemon': {x: 3, y: 0},
    'pear': {x: 4, y: 0},
    'plum': {x: 5, y: 0}
};

const SNAKE_SEGMENTS = {
    'head_up': {x: 3, y: 0},
    'head_right': {x: 4, y: 0},
    'head_down': {x: 4, y: 1},
    'head_left': {x: 3, y: 1},
    'tail_up': {x: 3, y: 2},
    'tail_right': {x: 4, y: 2},
    'tail_down': {x: 4, y: 3},
    'tail_left': {x: 3, y: 3},
    'body_right_left': {x: 1, y: 0},
    'body_up_down': {x: 2, y: 1},
    'body_up_right': {x: 0, y: 1},
    'body_down_right': {x: 0, y: 0},
    'body_down_left': {x: 2, y: 0},
    'body_up_left': {x: 2, y: 2}
};
