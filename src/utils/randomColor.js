export const randomColor = () => {
    let color = "#";
    let str = "0123456789ABCDEF";
    for (let i = 0; i < 6; i++) {
        let random = parseInt(Math.random() * str.length);
        color += str.charAt(random);
    }
    return color;

}