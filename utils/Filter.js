const lowPassFilter = (currentValue, previousValue) => {
  const dt = 1.0 / 50.0;
  const RC = 0.15;
  const alpha = dt / (RC + dt);

  return alpha * currentValue + (1.0 - alpha) * previousValue;
};

const weightedSmoothing = (currentValue, previousValue) => {
  const B = 0.7;
  return ((1 - B) * previousValue) + (B * currentValue);
};

export { lowPassFilter };
