import image_1 from './images/0.jpg';
import image_2 from './images/1.jpg';
import image_3 from './images/2.jpeg';
import image_4 from './images/3.jpeg';

const users = {
    0: {
        id: 0,
        name: "伸近エリ",
        applausePoint: 100,
        applaudedPoint: 0,
        image: image_1
    },
  
    1: {
        id: 1,
        name: "仲間由紀恵",
        applausePoint: 100,
        applaudedPoint: 0,
        image: image_2
    },
  
    2: {
        id: 2,
        name: "阿部寛",
        applausePoint: 100,
        applaudedPoint: 0,
        image: image_3
    },
    3: {
        id: 3,
        name: "渡辺謙",
        applausePoint: 100,
        applaudedPoint: 0,
        image: image_4
    },
}

// 他の場所で読み込めるようにする
export default users;