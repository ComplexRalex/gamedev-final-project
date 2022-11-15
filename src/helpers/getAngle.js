import { rad2Deg } from "./rad2Deg.js";

export const getAngle = ({ x, y }) => {
    if (x == 0) {
        return y >= 0 ? 90 : 270;
    }

    let angle = Math.atan(y / x);
    angle = x > 0
        ? y >= 0
            ? angle
            : Math.PI * 2 + angle
        : y >= 0
            ? Math.PI + angle
            : Math.PI + angle;

    return rad2Deg(angle);
}