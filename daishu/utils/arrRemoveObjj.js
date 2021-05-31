const arrRemoveObj = (arr, obj) => {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    if (arr[i] === obj) {
      if (i === 0) {
        arr.shift();
        return arr;
      } else if (i === len - 1) {
        arr.pop();
        return arr;
      } else {
        arr.splice(i, 1);
        return arr;
      }
    }
  }
};
 
module.exports = {
  arrRemoveObj: arrRemoveObj,
};
