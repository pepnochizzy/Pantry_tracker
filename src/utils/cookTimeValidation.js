export default function cookTimeValidation(cook_time) {
  let validated_cook_time;
  if (typeof cook_time === "string" && cook_time.includes(":")) {
    validated_cook_time = cook_time.split(":");
    let hours = Number(validated_cook_time[0]);
    let mins = Number(validated_cook_time[1]);
    if (Number.isNaN(hours) || Number.isNaN(mins)) {
      throw new Error("Invalid cook time format. Expected hh:mm");
    }
    if (mins < 0 || mins >= 60) {
      throw new Error("Minutes need to be 0-59");
    }
    if (hours < 0) {
      throw new Error("Hours cannot be less than 0");
    }
    validated_cook_time = hours * 60 + mins;
  } else if (typeof cook_time === "number" && Number.isInteger(cook_time)) {
    validated_cook_time = cook_time;
  } else {
    throw new Error(
      "Invalid cook time. Expected a number (minutes) or hh:mm format",
    );
  }
  return validated_cook_time;
}
