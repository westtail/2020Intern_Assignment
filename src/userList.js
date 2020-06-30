import image_1 from './images/0.jpg';
import image_2 from './images/1.jpg';
import image_3 from './images/2.jpeg';

const users = {
    0: {
        id: 0,
        name: "伸近エリ",
        applausePoint: 100,
        applaudedPoint: 100,
        image: image_1
    },
  
    1: {
        id: 1,
        name: "仲間由紀恵",
        applausePoint: 200,
        applaudedPoint: 200,
        image: image_2
    },
  
    2: {
        id: 2,
        name: "阿部寛",
        applausePoint: 300,
        applaudedPoint: 300,
        image: image_3
    }
}

// 他の場所で読み込めるようにする
export default users;