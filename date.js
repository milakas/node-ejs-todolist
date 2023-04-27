exports.getDate = () => {
  const now = new Date();
  const dateOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };

  return now.toLocaleDateString('en-US', dateOptions);
};
