let totalRequests = 0;
let totalErrors = 0;

const incrementRequests = () => {
  totalRequests++;
};

const incrementErrors = () => {
  totalErrors++;
};

const getMetrics = () => {
  return {
    totalRequests,
    totalErrors,
  };
};

export {
  incrementRequests,
  incrementErrors,
  getMetrics,
};