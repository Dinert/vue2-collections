
export const getAir = (type, value) => {

    const MonitorGrade = {
        AQI: [0, 50, 100, 150, 200, 300, 500],
        SO2: {
          24: [0, 50, 150, 475, 800, 1600, 2100],
          1: [0, 150, 500, 650, 800, 1600, 2100],
        },
        NO2: {
          24: [0, 40, 80, 180, 280, 565, 750],
          1: [0, 100, 200, 700, 1200, 2340, 3090],
        },
        PM10: [0, 50, 150, 250, 350, 420, 500],
        CO: {
          24: [0, 2, 4, 14, 24, 36, 48],
          1: [0, 5, 10, 35, 60, 90, 120],
        },
        O3: {
          1: [0, 160, 200, 300, 400, 800, 1000],
          8: [0, 100, 160, 215, 265, 800, 1000],
        },
        O3_8h: [0, 100, 160, 215, 265, 800, 1000],
        "PM2.5": [0, 35, 75, 115, 150, 250, 350],
    }

    type = type && type.toLocaleUpperCase()
    let tempGrade = type ? MonitorGrade[type] : MonitorGrade['AQI']
    if (value >= 0 && value <= tempGrade[1]) {
        return {
          color: "#62D13F",
          poll: "优",
          className: "great",
          bgClassName: "bg-great",
          level: "一级",
        };
      } else if (value > tempGrade[1] && value <= tempGrade[2]) {
        return {
          color: "#FBD02B",
          poll: "良",
          className: "good",
          bgClassName: "bg-good",
          level: "二级",
        };
      } else if (value > tempGrade[2] && value <= tempGrade[3]) {
        return {
          color: "#FF7E00",
          poll: "轻度污染",
          className: "light",
          bgClassName: "bg-light",
          level: "三级",
        };
      } else if (value > tempGrade[3] && value <= tempGrade[4]) {
        return {
          color: "#FF401A",
          poll: "中度污染",
          className: "moderate",
          bgClassName: "bg-moderate",
          level: "四级",
        };
      } else if (value > tempGrade[4] && value <= tempGrade[5]) {
        return {
          color: "#D20040",
          poll: "重度污染",
          className: "weight",
          bgClassName: "bg-weight",
          level: "五级",
        };
      } else if (value > tempGrade[5]) {
        return {
          color: "#9C0A4E",
          poll: "严重污染",
          className: "serious",
          bgClassName: "bg-serious",
          level: "六级",
        };
      } else {
        return {
          color: "#999",
          poll: "无效",
          className: "invalid",
          bgClassName: "bg-invalid",
        };
      }
}